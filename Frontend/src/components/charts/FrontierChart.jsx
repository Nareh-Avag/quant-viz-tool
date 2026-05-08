import React, { useMemo, memo } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { lcd, lcdAlpha } from '../../theme/lcd';

const TooltipContent = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: '#0A0E07',
      border: `1px solid ${lcdAlpha(lcd.dark, 0.5)}`,
      padding: '7px 12px',
      fontFamily: 'IBM Plex Mono, monospace',
      lineHeight: 1.9,
    }}>
      <p style={{ color: lcdAlpha(lcd.dark, 0.7), fontSize: 8, letterSpacing: '0.2em', marginBottom: 3 }}>
        PORTFOLIO
      </p>
      <p style={{ color: lcdAlpha(lcd.mid, 0.9), fontSize: 10 }}>
        RISK&nbsp;&nbsp;&nbsp;
        <span style={{ color: '#9EAA85', fontWeight: 500 }}>{d?.x?.toFixed(2)}%</span>
      </p>
      <p style={{ color: lcdAlpha(lcd.mid, 0.9), fontSize: 10 }}>
        RETURN&nbsp;
        <span style={{ color: '#9EAA85', fontWeight: 500 }}>{d?.y?.toFixed(2)}%</span>
      </p>
    </div>
  );
};

const ScatterDot = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={2.2} fill={lcdAlpha(lcd.dark, 0.6)} />
);

const OptimalDot = ({ cx, cy }) => (
  <g className="animate-phosphor-pulse">
    <circle cx={cx} cy={cy} r={22} fill="none" stroke={lcdAlpha(lcd.mid, 0.07)} strokeWidth={1} />
    <circle cx={cx} cy={cy} r={13} fill="none" stroke={lcdAlpha(lcd.mid, 0.14)} strokeWidth={1} />
    <circle cx={cx} cy={cy} r={6}  fill="none" stroke={lcdAlpha(lcd.bg,  0.35)} strokeWidth={1} />
    <circle cx={cx} cy={cy} r={3.5}
      fill={lcd.bg}
      style={{ filter: 'drop-shadow(0 0 5px rgba(200,230,160,0.9)) drop-shadow(0 0 12px rgba(200,230,160,0.4))' }}
    />
    <circle cx={cx} cy={cy} r={1.2} fill="white" opacity={0.9} />
  </g>
);

const tickStyle = {
  fill: lcdAlpha(lcd.dark, 0.75),
  fontSize: 9,
  fontFamily: 'IBM Plex Mono, monospace',
  fontWeight: 400,
  letterSpacing: '0.05em',
};

const FrontierChart = memo(function FrontierChart({ data }) {
  const optimalPoint = useMemo(
    () => [{ x: data.optimal.risk, y: data.optimal.expected_return }],
    [data.optimal.risk, data.optimal.expected_return]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 14, right: 14, bottom: 10, left: 0 }}>
        <CartesianGrid
          strokeDasharray="1 4"
          stroke={lcdAlpha(lcd.deep, 0.3)}
          strokeWidth={0.5}
        />
        <XAxis
          type="number" dataKey="x" name="Volatility" unit="%"
          tick={tickStyle} tickLine={false}
          axisLine={{ stroke: lcdAlpha(lcd.dark, 0.3), strokeWidth: 0.5 }}
        />
        <YAxis
          type="number" dataKey="y" name="Return" unit="%"
          tick={tickStyle} tickLine={false}
          axisLine={{ stroke: lcdAlpha(lcd.dark, 0.3), strokeWidth: 0.5 }}
          width={38}
        />
        <Tooltip
          content={<TooltipContent />}
          cursor={{ stroke: lcdAlpha(lcd.dark, 0.25), strokeDasharray: '3 3', strokeWidth: 0.5 }}
        />
        <Scatter
          data={data.scatter}
          shape={<ScatterDot />}
          isAnimationActive={false}
        />
        <Scatter
          data={optimalPoint}
          shape={<OptimalDot />}
          isAnimationActive={false}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
});

export default FrontierChart;
