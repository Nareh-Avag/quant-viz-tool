import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function Header({ tickers, onTickersChange, onOptimize, loading }) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 pb-10 border-b border-charcoal/8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/30 font-medium mb-3">
          Portfolio Optimization Engine
        </p>
        <h1 className="text-[28px] font-extralight tracking-[0.12em] text-charcoal/85">
          QUANTVIZ
          <span className="text-wine/60 ml-2">PRO</span>
        </h1>
      </div>

      <div className="flex items-end gap-3 w-full sm:w-auto">
        <Input
          label="Assets"
          value={tickers}
          onChange={(e) => onTickersChange(e.target.value)}
          placeholder="AAPL, MSFT, TSLA..."
          className="w-full sm:w-72"
        />
        <Button onClick={onOptimize} loading={loading} disabled={loading}>
          Run Engine
        </Button>
      </div>
    </header>
  );
}
