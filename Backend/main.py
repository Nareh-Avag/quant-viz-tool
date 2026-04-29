"""
QuantViz Pro - Backend Math Engine
Portfolio optimization via Max Sharpe + Efficient Frontier visualization.
"""

import asyncio
from functools import lru_cache
from typing import Optional

import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="QuantViz Pro API",
    description="Portfolio optimization engine using Modern Portfolio Theory",
    version="1.0.0",
)

# Lock CORS to the Vite dev server. Add prod origin via env var when deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


# Pydantic response models 

class OptimalPortfolio(BaseModel):
    weights: dict[str, float] = Field(..., description="Asset -> weight (sums to 1)")
    risk: float = Field(..., description="Annualized volatility (%)")
    expected_return: float = Field(..., description="Annualized return (%)")
    sharpe: float = Field(..., description="Sharpe ratio")


class Point(BaseModel):
    x: float  # risk (%)
    y: float  # return (%)


class OptimizeResponse(BaseModel):
    tickers: list[str]
    optimal: OptimalPortfolio
    scatter: list[Point]
    frontier: list[Point]


# Core math

TRADING_DAYS = 252


def portfolio_performance(
    weights: np.ndarray,
    mean_returns: np.ndarray,
    cov_matrix: np.ndarray,
) -> tuple[float, float]:
    """Annualized return and volatility for a given weight vector."""
    ret = float(np.sum(mean_returns * weights) * TRADING_DAYS)
    vol = float(np.sqrt(weights.T @ (cov_matrix * TRADING_DAYS) @ weights))
    return ret, vol


def negative_sharpe(
    weights: np.ndarray,
    mean_returns: np.ndarray,
    cov_matrix: np.ndarray,
    risk_free_rate: float,
) -> float:
    ret, vol = portfolio_performance(weights, mean_returns, cov_matrix)
    if vol == 0:
        return 1e9  # avoid div-by-zero blowing up the optimizer
    return -(ret - risk_free_rate) / vol


def min_variance_at_target(
    target_return: float,
    mean_returns: np.ndarray,
    cov_matrix: np.ndarray,
    num_assets: int,
) -> Optional[float]:
    """Minimum portfolio volatility achievable for a given target return."""
    constraints = (
        {"type": "eq", "fun": lambda w: np.sum(w) - 1},
        {"type": "eq", "fun": lambda w: np.sum(mean_returns * w) * TRADING_DAYS - target_return},
    )
    bounds = tuple((0, 1) for _ in range(num_assets))
    result = minimize(
        lambda w: np.sqrt(w.T @ (cov_matrix * TRADING_DAYS) @ w),
        num_assets * [1.0 / num_assets],
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )
    return float(result.fun) if result.success else None


# Data fetching (cached)

@lru_cache(maxsize=32)
def _fetch_prices_cached(tickers_key: str, period: str) -> pd.DataFrame:
    """
    Cache wrapper. lru_cache needs hashable args, so we pass a comma-joined key.
    Cache resets on server restart, which is fine for a dev tool.
    """
    ticker_list = tickers_key.split(",")
    data = yf.download(
        ticker_list,
        period=period,
        progress=False,
        auto_adjust=False,
    )

    if data is None or data.empty:
        raise HTTPException(status_code=502, detail="No data returned from yfinance")

    # Handle both single-ticker (flat columns) and multi-ticker (MultiIndex) frames
    if isinstance(data.columns, pd.MultiIndex):
        if "Adj Close" in data.columns.get_level_values(0):
            prices = data["Adj Close"]
        else:
            prices = data["Close"]
    else:
        # single-ticker case: yfinance returns a flat frame
        col = "Adj Close" if "Adj Close" in data.columns else "Close"
        prices = data[[col]].rename(columns={col: ticker_list[0]})

    # Drop tickers that returned all-NaN (invalid symbols)
    prices = prices.dropna(axis=1, how="all")
    if prices.empty:
        raise HTTPException(status_code=400, detail="No valid tickers found")

    return prices


async def fetch_prices(ticker_list: list[str], period: str = "2y") -> pd.DataFrame:
    """Async wrapper around the blocking yfinance call."""
    key = ",".join(sorted(ticker_list))
    return await asyncio.to_thread(_fetch_prices_cached, key, period)


# Endpoint 

@app.get("/optimize", response_model=OptimizeResponse)
async def optimize(
    tickers: str = Query(
        "AAPL,MSFT,TSLA,BTC-USD",
        description="Comma-separated tickers",
    ),
    risk_free_rate: float = Query(0.02, ge=0, le=0.2, description="Annualized risk-free rate"),
    n_simulations: int = Query(2000, ge=100, le=20000),
    n_frontier_points: int = Query(50, ge=10, le=200),
):
    # parse + validate input
    ticker_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
    if len(ticker_list) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 tickers")

    #  fetch prices 
    prices = await fetch_prices(ticker_list, period="2y")
    valid_tickers = list(prices.columns)
    if len(valid_tickers) < 2:
        raise HTTPException(
            status_code=400,
            detail=f"Need at least 2 valid tickers, got: {valid_tickers}",
        )

    # returns + covariance (use SIMPLE returns for portfolio math)
    returns = prices.pct_change().dropna()
    if len(returns) < 30:
        raise HTTPException(status_code=400, detail="Insufficient price history")

    mean_returns = returns.mean().values
    cov_matrix = returns.cov().values
    num_assets = len(valid_tickers)

    #  1. Max Sharpe optimization 
    constraints = ({"type": "eq", "fun": lambda w: np.sum(w) - 1},)
    bounds = tuple((0, 1) for _ in range(num_assets))
    initial_guess = np.array(num_assets * [1.0 / num_assets])

    optimized = minimize(
        negative_sharpe,
        initial_guess,
        args=(mean_returns, cov_matrix, risk_free_rate),
        method="SLSQP",
        bounds=bounds,
        constraints=constraints,
    )
    if not optimized.success:
        raise HTTPException(
            status_code=500,
            detail=f"Optimization failed: {optimized.message}",
        )

    opt_weights = optimized.x
    opt_ret, opt_vol = portfolio_performance(opt_weights, mean_returns, cov_matrix)
    opt_sharpe = (opt_ret - risk_free_rate) / opt_vol

    # 2. Monte Carlo cloud (vectorized + Dirichlet for uniform simplex) 
    weights_mc = np.random.dirichlet(np.ones(num_assets), size=n_simulations)
    mc_returns = weights_mc @ mean_returns * TRADING_DAYS
    mc_vols = np.sqrt(
        np.einsum("ij,jk,ik->i", weights_mc, cov_matrix * TRADING_DAYS, weights_mc)
    )
    scatter = [
        Point(x=float(v * 100), y=float(r * 100))
        for v, r in zip(mc_vols, mc_returns)
    ]

    #  3. True efficient frontier (constrained min-variance sweep) 
    annual_min = float(mean_returns.min() * TRADING_DAYS)
    annual_max = float(mean_returns.max() * TRADING_DAYS)
    target_returns = np.linspace(annual_min, annual_max, n_frontier_points)
    frontier: list[Point] = []
    for tr in target_returns:
        vol = min_variance_at_target(tr, mean_returns, cov_matrix, num_assets)
        if vol is not None:
            frontier.append(Point(x=float(vol * 100), y=float(tr * 100)))

    # response 
    return OptimizeResponse(
        tickers=valid_tickers,
        optimal=OptimalPortfolio(
            weights={t: float(w) for t, w in zip(valid_tickers, opt_weights)},
            risk=float(opt_vol * 100),
            expected_return=float(opt_ret * 100),
            sharpe=float(opt_sharpe),
        ),
        scatter=scatter,
        frontier=frontier,
    )


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)