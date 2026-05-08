import React, { memo, useMemo } from 'react';

const WeightsPanel = memo(function WeightsPanel({ weights }) {
  const entries = useMemo(() => Object.entries(weights), [weights]);

  return (
    <div className="space-y-6">
      {entries.map(([ticker, weight], i) => (
        <div
          key={ticker}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
        >
          <div className="flex justify-between items-baseline mb-2.5">
            <span className="text-sm font-mono tracking-widest text-charcoal/60 uppercase">
              {ticker}
            </span>
            <span className="text-sm font-mono text-wine/80 tabular-nums">
              {(weight * 100).toFixed(2)}%
            </span>
          </div>
          <div
            className="w-full h-px rounded-full overflow-hidden"
            style={{ background: 'rgba(26,26,34,0.08)' }}
          >
            <div
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: `${weight * 100}%`,
                background: colors.aqua,
                opacity: 0.7,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

/* inline — avoids a second import for a single value */
const colors = { aqua: '#A9D7D8' };

export default WeightsPanel;
