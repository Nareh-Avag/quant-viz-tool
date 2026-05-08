import React from 'react';

const TOTAL = 18;

export function SegBar({ value, height = 7 }) {
  const filled = Math.round(Math.min(Math.max(value, 0), 1) * TOTAL);
  return (
    <div className="seg-bar" style={{ height }}>
      {Array.from({ length: TOTAL }, (_, i) => (
        <div
          key={i}
          className={i < filled ? 'seg-cell-on' : 'seg-cell-off'}
          style={{ flex: 1, height: '100%' }}
        />
      ))}
    </div>
  );
}
