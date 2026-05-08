import React, { memo } from 'react';

const MetricRow = ({ label, value, unit, sublabel }) => (
  <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(95,104,77,0.18)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
      <span className="lcd-label">{label}</span>
      {sublabel && <span className="lcd-label" style={{ fontSize: 7, color: 'rgba(142,151,117,0.5)' }}>{sublabel}</span>}
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span className="lcd-value">{value}</span>
      {unit && (
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 9,
          color: '#8E9775',
          letterSpacing: '0.1em',
        }}>{unit}</span>
      )}
    </div>
  </div>
);

const EmptyRow = ({ label }) => (
  <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(95,104,77,0.18)' }}>
    <span className="lcd-label">{label}</span>
    <div className="lcd-value" style={{ color: 'rgba(95,104,77,0.3)', marginTop: 3 }}>- -</div>
  </div>
);

const MetricsPanel = memo(function MetricsPanel({ data }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 7,
        marginBottom: 2,
        borderBottom: '1px solid rgba(95,104,77,0.28)',
      }}>
        <span className="lcd-label">PERFORMANCE</span>
        <span className="lcd-label" style={{ fontSize: 7, color: 'rgba(142,151,117,0.5)' }}>ANNUALIZED</span>
      </div>
      <span className="lcd-label" style={{ display: 'block', fontSize: 7, color: 'rgba(142,151,117,0.45)', marginBottom: 4, marginTop: 4 }}>
        1Y HISTORICAL WINDOW
      </span>

      {data ? (
        <>
          <MetricRow label="SHARPE RATIO"    value={data.optimal.sharpe.toFixed(2)} sublabel="RISK-ADJ" />
          <MetricRow label="VOLATILITY"      value={data.optimal.risk.toFixed(1)} unit="%" />
          <MetricRow
            label="EXP. RETURN"
            value={data.optimal.expected_return.toFixed(1)}
            unit="%"
            sublabel="P.A."
          />
        </>
      ) : (
        <>
          <EmptyRow label="SHARPE RATIO" />
          <EmptyRow label="VOLATILITY" />
          <EmptyRow label="EXP. RETURN" />
        </>
      )}
    </div>
  );
});

export default MetricsPanel;
