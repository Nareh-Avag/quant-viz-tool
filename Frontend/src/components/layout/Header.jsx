import React from 'react';

export function Header({ tickers, onTickersChange, onOptimize, loading }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <header style={{ paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid rgba(95,104,77,0.3)' }}>

      {/* Top identity row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{
            fontFamily: 'VT323, monospace',
            fontSize: '2rem',
            color: '#2E3323',
            letterSpacing: '0.06em',
            lineHeight: 1,
          }}>
            QV-PRO
          </span>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: 10,
            borderLeft: '1px solid rgba(95,104,77,0.35)',
          }}>
            <span className="lcd-label" style={{ fontSize: 8, lineHeight: 1.4 }}>PORTFOLIO-OS</span>
            <span className="lcd-label" style={{ fontSize: 7, color: 'rgba(142,151,117,0.6)', lineHeight: 1.4 }}>
              MEAN-VARIANCE OPTIMIZER
            </span>
          </div>
        </div>

        {/* Status cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <span className="lcd-label" style={{ fontSize: 7, color: 'rgba(142,151,117,0.55)' }}>
              {today}
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span className="lcd-label" style={{ fontSize: 7, color: 'rgba(142,151,117,0.45)' }}>SYS</span>
              <span className="status-dot status-dot-on" />
              <span className="status-dot status-dot-on" />
              <span className="status-dot" />
            </div>
          </div>

          {/* Battery indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            border: '1px solid rgba(95,104,77,0.4)',
            padding: '2px 5px',
            position: 'relative',
          }}>
            <span className="lcd-label" style={{ fontSize: 7 }}>BAT</span>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,1,1,0].map((on, i) => (
                <div key={i} style={{
                  width: 4, height: 7,
                  background: on ? '#5F684D' : 'transparent',
                  border: on ? 'none' : '1px solid rgba(95,104,77,0.3)',
                }} />
              ))}
            </div>
            <div style={{
              width: 2, height: 4,
              background: 'rgba(95,104,77,0.5)',
              marginLeft: 1,
            }} />
          </div>
        </div>
      </div>

      {/* Thin rule */}
      <div className="lcd-divider" style={{ marginBottom: 12 }} />

      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ flex: 1, maxWidth: 460 }}>
          <span className="lcd-label" style={{ display: 'block', marginBottom: 4 }}>
            › ENTER ASSETS
          </span>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 11,
              color: '#8E9775',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              _
            </span>
            <input
              className="lcd-input"
              value={tickers}
              onChange={(e) => onTickersChange(e.target.value)}
              placeholder="AAPL, MSFT, TSLA, BTC-USD"
            />
          </div>
        </div>

        <button
          className="lcd-btn"
          onClick={onOptimize}
          disabled={loading}
          style={{ height: 29, marginBottom: 0 }}
        >
          {loading
            ? <><span className="animate-cursor-blink" style={{ marginRight: 2 }}>█</span>PROCESSING</>
            : '▶ RUN ENGINE'
          }
        </button>
      </div>

    </header>
  );
}
