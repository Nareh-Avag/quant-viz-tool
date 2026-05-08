import React, { useMemo, memo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { colors, alpha } from '../../constants/theme';

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background:   '#FFFFFF',
      border:       `1px solid ${alpha.charcoal(0.08)}`,
      borderRadius: 8,
      padding:      '10px 14px',
      fontSize:     12,
      fontFamily:   'Jost, sans-serif',
      fontWeight:   300,
      lineHeight:   1.7,
    }}>
      <p style={{ color: alpha.charcoal(0.35), letterSpacing: '0.14em', fontSize: 10, marginBottom: 4 }}>
        PORTFOLIO
      </p>
      <p style={{ color: colors.charcoal }}>
        Risk&nbsp;&nbsp;&nbsp;<span style={{ color: colors.wine, fontWeight: 400 }}>{d?.x?.toFixed(2)}%</span>
      </p>
      <p style={{ color: colors.charcoal }}>
        Return&nbsp;<span style={{ color: colors.wine, fontWeight: 400 }}>{d?.y?.toFixed(2)}%</span>
      </p>
    </div>
  );
};

const OptimalDot = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={14} fill="none" stroke={alpha.wine(0.12)} strokeWidth={1} />
    <circle cx={cx} cy={cy} r={7}  fill={colors.wine} fillOpacity={0.9} />
  </g>
);

const FrontierChart = memo(function FrontierChart({ data }) {
  const optimalPoint = useMemo(
    () => [{ x: data.optimal.risk, y: data.optimal.expected_return }],
    [data.optimal.risk, data.optimal.expected_return]
  );

  const tickStyle = {
    fill:        alpha.charcoal(0.35),
    fontSize:    11,
    fontFamily:  'Jost, sans-serif',
    fontWeight:  300,
    letterSpacing: '0.04em',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 16, right: 16, bottom: 16, left: 4 }}>
        <XAxis
          type="number" dataKey="x" name="Volatility" unit="%"
          tick={tickStyle} tickLine={false}
          axisLine={{ stroke: alpha.charcoal(0.08) }}
        />
        <YAxis
          type="number" dataKey="y" name="Return" unit="%"
          tick={tickStyle} tickLine={false}
          axisLine={{ stroke: alpha.charcoal(0.08) }}
        />
        <Tooltip
          content={<TooltipContent />}
          cursor={{ stroke: alpha.charcoal(0.1), strokeDasharray: '4 4' }}
        />
        <Scatter data={data.scatter} fill={colors.aqua} opacity={0.5} isAnimationActive={false} />
        <Scatter data={optimalPoint} isAnimationActive={false} shape={<OptimalDot />} />
      </ScatterChart>
    </ResponsiveContainer>
  );
});

export default FrontierChart;
