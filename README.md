# QuantViz: Portfolio Optimization Tool
 
An interactive quantitative finance dashboard that uses **Markowitz Mean-Variance Optimization** to visualize the Efficient Frontier of a stock portfolio.
 
> Built as a learning tool to understand Modern Portfolio Theory — not as a trading strategy. See [Limitations](#-limitations) below.
 
## Features
* **Real-time Data:** Fetches historical stock prices via `yfinance`.
* **Monte Carlo Simulation:** Simulates 2,000+ random portfolios via Dirichlet sampling to visualize risk-return profiles.
* **Optimal Allocation:** Uses `SciPy` (SLSQP) to calculate the **Maximum Sharpe Ratio** portfolio.
* **Efficient Frontier Curve:** Sweeps target returns and solves a constrained min-variance problem at each level to draw the true frontier.
* **Modern UI:** Built with React, Tailwind CSS, and Recharts 
## Tech Stack
* **Backend:** Python (FastAPI, NumPy, SciPy, Pandas)
* **Frontend:** React (Vite, Tailwind CSS, Recharts)
* **Data Source:** Yahoo Finance API (via `yfinance`)
## The Math
This tool solves the optimization problem:
$$\text{Maximize} \ S_p = \frac{R_p - R_f}{\sigma_p}$$
Where $R_p$ is expected portfolio return, $R_f$ is the risk-free rate, and $\sigma_p$ is the portfolio standard deviation.
 
For the efficient frontier curve, it minimizes $\sigma_p^2$ subject to a target return constraint, swept across the feasible return range.
 
## Why I Built It
I wanted to actually *understand* portfolio theory instead of just reading about it. Watching a scatter cloud bend into the characteristic frontier curve as you add uncorrelated assets makes the math click in a way textbooks don't.
 
The project also let me practice numerical optimization with `scipy`, vectorized Monte Carlo with `numpy.einsum`, async FastAPI patterns, and React performance tuning (memoization, disabling Recharts animations on 2k-point datasets).
 
## 📁 Project Structure
```
quantviz/
├── backend/
│   ├── main.py              # FastAPI app + math engine
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx          # Main dashboard
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```
 
## ⚡ Quick Start
 
**Backend** (Terminal 1):
```bash
cd backend
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```
 
**Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```
 
Then open `http://localhost:5173` and try the default tickers (`AAPL, MSFT, TSLA, BTC-USD`) or plug in your own.
 
## ⚠️ Limitations
Modern Portfolio Theory has well-documented problems this tool inherits:
 
1. **It optimizes on the past.** Historical returns aren't future returns.
2. **Mean return estimates are noisy.** Sample means have huge standard errors, so "optimal" weights are sensitive to the input window.
3. **The optimizer overfits.** Markowitz optimization is famous for producing extreme allocations that look great on training data and underperform out-of-sample.
4. **Equal-weight often beats it.** DeMiguel, Garlappi & Uppal (2009) showed that naive 1/N portfolios frequently outperform Markowitz-optimized ones after costs.
5. **Costs and taxes are ignored.** No transaction cost or tax modeling.
**TL;DR:** Use this to understand the math. Don't use it to pick your 401(k).