import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Header } from '../components/layout/Header';
import FrontierChart from '../components/charts/FrontierChart';
import WeightsPanel from '../components/dashboard/WeightsPanel';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import { useOptimize } from '../hooks/useOptimize';

export default function Dashboard() {
  const [tickers, setTickers] = useState('AAPL, MSFT, TSLA, BTC-USD');
  const { data, loading, error, optimize } = useOptimize();

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12">

        <Header
          tickers={tickers}
          onTickersChange={setTickers}
          onOptimize={() => optimize(tickers)}
          loading={loading}
        />

        {error && (
          <p className="mt-6 text-sm text-wine/60 tracking-wide">
            Backend offline — start main.py and try again.
          </p>
        )}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Chart */}
          <Card className="lg:col-span-2 p-8 sm:p-10" variant="default">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium mb-1">
                  Efficient Frontier
                </p>
                <p className="text-xs text-charcoal/30 tracking-wide">
                  Risk / return across sampled portfolios
                </p>
              </div>
              <div className="flex gap-5 text-[10px] tracking-[0.1em] font-mono">
                <span className="flex items-center gap-2 text-charcoal/30">
                  <span className="w-2 h-2 rounded-full bg-aqua/60" />
                  portfolios
                </span>
                <span className="flex items-center gap-2 text-charcoal/30">
                  <span className="w-2 h-2 rounded-full bg-wine/70" />
                  optimal
                </span>
              </div>
            </div>

            <div className="h-[400px] w-full">
              {data ? (
                <div className="h-full animate-fade-in">
                  <FrontierChart data={data} />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center h-full rounded-lg"
                  style={{ border: '1px dashed rgba(26,26,34,0.1)' }}
                >
                  <BarChart3 size={28} className="text-charcoal/12 mb-3" />
                  <p className="text-[11px] text-charcoal/20 uppercase tracking-[0.18em]">
                    Enter assets and run engine
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Side panels */}
          <div className="space-y-5">
            <Card className="p-7 sm:p-8" variant="default">
              <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium mb-7">
                Optimal Weights
              </p>
              {data ? (
                <WeightsPanel weights={data.optimal.weights} />
              ) : (
                <p className="py-10 text-center text-[11px] text-charcoal/18 uppercase tracking-[0.15em]">
                  No allocation loaded
                </p>
              )}
            </Card>

            <Card className="p-7 sm:p-8" variant="default">
              <MetricsPanel data={data} />
            </Card>
          </div>

        </div>

        <div className="mt-16 border-t border-charcoal/6 pt-6 flex justify-between items-center">
          <p className="text-[9px] uppercase tracking-[0.22em] text-charcoal/20">QuantViz Pro</p>
          <p className="text-[9px] text-charcoal/18 tracking-wide">
            Monte Carlo · Mean-Variance Optimization
          </p>
        </div>

      </div>
    </div>
  );
}
