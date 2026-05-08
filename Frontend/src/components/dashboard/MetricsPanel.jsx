import React, { memo } from 'react';

const MetricRow = ({ label, value, unit, accent }) => (
  <div className="py-5 border-b border-charcoal/6 last:border-0 last:pb-0 first:pt-0">
    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium mb-1.5">
      {label}
    </p>
    <p className={`text-4xl font-extralight tabular-nums ${accent ? 'text-wine' : 'text-charcoal/80'}`}>
      {value}
      {unit && <span className="text-2xl ml-1 text-charcoal/25">{unit}</span>}
    </p>
  </div>
);

const SkeletonRow = ({ label }) => (
  <div className="py-5 border-b border-charcoal/6 last:border-0 last:pb-0 first:pt-0">
    <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium mb-1.5">{label}</p>
    <p className="text-4xl font-extralight text-charcoal/12">—</p>
  </div>
);

const MetricsPanel = memo(function MetricsPanel({ data }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium pb-4 border-b border-charcoal/6 mb-1">
        Performance
      </p>
      <p className="text-[10px] text-charcoal/25 tracking-wide mt-3 mb-2">
        Annualized · 1Y historical window
      </p>

      {data ? (
        <>
          <MetricRow label="Sharpe Ratio"    value={data.optimal.sharpe.toFixed(2)}           accent />
          <MetricRow label="Volatility"      value={data.optimal.risk.toFixed(1)}            unit="%" />
          <MetricRow label="Expected Return" value={data.optimal.expected_return.toFixed(1)} unit="%" accent />
        </>
      ) : (
        <>
          <SkeletonRow label="Sharpe Ratio" />
          <SkeletonRow label="Volatility" />
          <SkeletonRow label="Expected Return" />
        </>
      )}
    </div>
  );
});

export default MetricsPanel;
