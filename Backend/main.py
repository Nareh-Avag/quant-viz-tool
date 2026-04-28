import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def get_portfolio_performance(weights, mean_returns, cov_matrix):
    returns = np.sum(mean_returns * weights) * 252
    std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix * 252, weights)))
    return returns, std

def negative_sharpe(weights, mean_returns, cov_matrix, risk_free_rate=0.02):
    p_ret, p_std = get_portfolio_performance(weights, mean_returns, cov_matrix)
    return -(p_ret - risk_free_rate) / p_std

@app.get("/optimize")
def optimize(tickers: str = "AAPL,MSFT,TSLA,BTC-USD"):
    ticker_list = [t.strip() for t in tickers.split(',')]
    
    # Updated download logic to handle the new yfinance format
    data = yf.download(ticker_list, period="2y")
    
    # Try to get Adj Close, fall back to Close if needed
    if 'Adj Close' in data.columns:
        price_data = data['Adj Close']
    else:
        price_data = data['Close']
    
    # Calculate daily log returns
    returns = np.log(price_data / price_data.shift(1)).dropna()
    mean_returns = returns.mean()
    cov_matrix = returns.cov()
    num_assets = len(ticker_list)
    
    # 1. OPTIMIZATION: Find the Max Sharpe Ratio Portfolio
    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
    bounds = tuple((0, 1) for _ in range(num_assets))
    initial_guess = num_assets * [1. / num_assets]
    
    optimized = minimize(negative_sharpe, initial_guess, 
                         args=(mean_returns, cov_matrix), 
                         method='SLSQP', bounds=bounds, constraints=constraints)
    
    opt_weights = optimized.x
    opt_ret, opt_std = get_portfolio_performance(opt_weights, mean_returns, cov_matrix)
    opt_sharpe = (opt_ret - 0.02) / opt_std

    # 2. VISUALIZATION DATA: Monte Carlo Simulation
    # This generates the "Cloud of Points" for frontend scatter plot
    portfolios = []
    for _ in range(2000):
        w = np.random.random(num_assets)
        w /= np.sum(w)
        r, s = get_portfolio_performance(w, mean_returns, cov_matrix)
        portfolios.append({"x": float(s * 100), "y": float(r * 100)})

    return {
        "optimal": {
            "weights": dict(zip(ticker_list, [float(w) for w in opt_weights])),
            "risk": float(opt_std * 100),
            "return": float(opt_ret * 100),
            "sharpe": float(opt_sharpe),
        },
        "scatter": portfolios
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)