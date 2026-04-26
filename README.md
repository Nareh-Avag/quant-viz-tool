# QuantViz: Portfolio Optimization Tool

An interactive quantitative finance dashboard that uses **Markowitz Mean-Variance Optimization** to find the Efficient Frontier of a stock portfolio.

## 🚀 Features
* **Real-time Data:** Fetches live stock prices via `yfinance`.
* **Monte Carlo Simulation:** Simulates 2,000+ random portfolios to visualize risk-return profiles.
* **Optimal Allocation:** Uses `SciPy` to calculate the **Maximum Sharpe Ratio** portfolio.
* **Modern UI:** Built with React, Tailwind CSS, and Recharts for a sleek, dark-mode financial aesthetic.

## 🛠️ Tech Stack
* **Backend:** Python (FastAPI, NumPy, SciPy, Pandas)
* **Frontend:** React (Vite, Tailwind CSS, Recharts)
* **Data Source:** Yahoo Finance API

## 📊 The Math
This tool solves the optimization problem:
$$Maximize \ S_p = \frac{R_p - R_f}{\sigma_p}$$
Where $R_p$ is expected portfolio return, $R_f$ is the risk-free rate, and $\sigma_p$ is the portfolio standard deviation.

## 🛠️ Setup
1. **Backend:**
   - `cd backend`
   - `pip install -r requirements.txt`
   - `python main.py`
2. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`