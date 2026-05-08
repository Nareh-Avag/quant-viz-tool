import React, { memo, useMemo } from 'react';
import { SegBar } from '../lcd/SegBar';

const WeightsPanel = memo(function WeightsPanel({ weights }) {
  const entries = useMemo(() => Object.entries(weights), [weights]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map(([ticker, weight], i) => (
        <div
          key={ticker}
          className="animate-fade-up"
          style={{ animationDelay: `${i * 55}ms`, opacity: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: '#5F684D',
              textTransform: 'uppercase',
            }}>
              {ticker}
            </span>
            <span style={{
              fontFamily: 'VT323, monospace',
              fontSize: '1.05rem',
              color: '#2E3323',
              letterSpacing: '0.04em',
            }}>
              {(weight * 100).toFixed(1)}%
            </span>
          </div>
          <SegBar value={weight} height={6} />
        </div>
      ))}
    </div>
  );
});

export default WeightsPanel;
