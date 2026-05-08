import React from 'react';

export function LCDPanel({ children, label, rightLabel, style = {}, bodyStyle = {} }) {
  return (
    <div className="lcd-panel" style={style}>
      {(label || rightLabel) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          borderBottom: '1px solid rgba(95,104,77,0.25)',
        }}>
          {label    && <span className="lcd-label">{label}</span>}
          {rightLabel && <span className="lcd-label" style={{ fontSize: 7 }}>{rightLabel}</span>}
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 3, ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
}
