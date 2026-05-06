import React, { useState, useMemo, memo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Shield, TrendingUp, BarChart3 } from 'lucide-react';
 
//  Memoized chart 
// Only re-renders when its props (data) actually change.
// Typing in the ticker input no longer touches this component.
const FrontierChart = memo(function FrontierChart({ data }) {
  // Memoize the optimal point so we don't create a new array reference each render
  const optimalPoint = useMemo(
    () => [{ x: data.optimal.risk, y: data.optimal.expected_return }],
    [data.optimal.risk, data.optimal.expected_return]
  );
 
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis
          type="number"
          dataKey="x"
          name="Volatility"
          unit="%"
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Return"
          unit="%"
          stroke="#475569"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #1e293b',
          }}
          cursor={{ strokeDasharray: '3 3' }}
        />
        <Scatter
          data={data.scatter}
          fill="#334155"
          opacity={0.4}
          shape="circle"
          isAnimationActive={false}
        />
        <Scatter data={optimalPoint} fill="#ffffff" isAnimationActive={false}>
          <Cell fill="#ffffff" stroke="#ffffff" strokeWidth={2} r={8} />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
});
 
//  Memoized weights panel 
const WeightsPanel = memo(function WeightsPanel({ weights }) {
  const entries = useMemo(() => Object.entries(weights), [weights]);
  return (
    <div className="space-y-5">
      {entries.map(([ticker, weight]) => (
        <div key={ticker}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400 font-mono font-bold">{ticker}</span>
            <span className="font-mono text-emerald-400">{(weight * 100).toFixed(2)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${weight * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
});
 
// Main App 
function App() {
  const [tickers, setTickers] = useState("AAPL, MSFT, TSLA, BTC-USD");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const handleOptimize = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/optimize?tickers=${tickers}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Backend offline:", error);
      alert("Math engine is offline. Start your Python backend (main.py)!");
    }
    setLoading(false);
  };
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            QUANTVIZ PRO
          </h1>
          <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-bold">
            Portfolio Optimization Engine
          </p>
        </div>
 
        <div className="flex gap-3 w-full md:w-auto">
          <input
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 font-mono"
            value={tickers}
            onChange={(e) => setTickers(e.target.value)}
            placeholder="Enter tickers (e.g. AAPL,MSFT)"
          />
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20 active:scale-95"
          >
            {loading ? "Calculating..." : "Run Engine"}
          </button>
        </div>
      </header>
 
      {/* DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <Activity className="text-blue-400" size={24} /> Efficient Frontier
            </h3>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span> Random Portfolios
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Max Sharpe
              </span>
            </div>
          </div>
 
          <div className="h-[450px] w-full">
            {data ? (
              <FrontierChart data={data} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p className="font-medium uppercase tracking-tighter">
                  Enter assets and run engine to visualize risk/return
                </p>
              </div>
            )}
          </div>
        </div>
 
        {/* SIDE PANEL */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-slate-800/60 p-8 rounded-3xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Shield className="text-emerald-400" size={24} /> Optimal Weights
            </h3>
            {data ? (
              <WeightsPanel weights={data.optimal.weights} />
            ) : (
              <div className="py-20 text-center text-slate-600">No data loaded</div>
            )}
          </div>
 
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-900/20">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <TrendingUp size={20} /> Performance Metrics
            </h3>
            <p className="text-blue-100 text-xs mb-6">
              Annualized projections based on historical 1Y window
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                <p className="text-blue-200 text-[10px] uppercase font-bold">Sharpe Ratio</p>
                <p className="text-2xl font-black text-white">
                  {data ? data.optimal.sharpe.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
                <p className="text-blue-200 text-[10px] uppercase font-bold">Volatility</p>
                <p className="text-2xl font-black text-white">
                  {data ? data.optimal.risk.toFixed(1) : "0.0"}%
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md col-span-2">
                <p className="text-blue-200 text-[10px] uppercase font-bold">Expected Return</p>
                <p className="text-2xl font-black text-white">
                  {data ? data.optimal.expected_return.toFixed(1) : "0.0"}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default App;