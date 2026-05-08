import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import FrontierChart from '../components/charts/FrontierChart';
import WeightsPanel from '../components/dashboard/WeightsPanel';
import MetricsPanel from '../components/dashboard/MetricsPanel';
import { useOptimize } from '../hooks/useOptimize';

/* ── Decorative corner marks ─────────────────────────────────── */
function Corner({ pos }) {
  const style = {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: 'rgba(95,104,77,0.4)',
    borderStyle: 'solid',
    ...(pos === 'tl' && { top: 6, left: 6,   borderWidth: '1px 0 0 1px' }),
    ...(pos === 'tr' && { top: 6, right: 6,  borderWidth: '1px 1px 0 0' }),
    ...(pos === 'bl' && { bottom: 6, left: 6,   borderWidth: '0 0 1px 1px' }),
    ...(pos === 'br' && { bottom: 6, right: 6,  borderWidth: '0 1px 1px 0' }),
  };
  return <div style={style} />;
}

/* ── Empty state inside phosphor display ─────────────────────── */
function PhosphorEmpty() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      position: 'relative',
      zIndex: 5,
    }}>
      {/* Decorative grid marks */}
      <div style={{ position: 'relative', width: 60, height: 40, marginBottom: 8 }}>
        {[[0,'#'],[1,'+'],[2,'#']].map(([k, sym]) => (
          <div key={k} style={{
            position: 'absolute',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 9,
            color: 'rgba(142,151,117,0.15)',
            left: k * 22,
            top: k % 2 === 0 ? 0 : 14,
          }}>{sym}</div>
        ))}
      </div>
      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: '1.1rem',
        color: 'rgba(142,151,117,0.3)',
        letterSpacing: '0.2em',
      }}>
        [ AWAITING INPUT ]
      </div>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 8,
        color: 'rgba(142,151,117,0.22)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        <span className="animate-cursor-blink" style={{ opacity: 1 }}>▌</span>
        ENTER ASSETS AND RUN ENGINE
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tickers, setTickers] = useState('AAPL, MSFT, TSLA, BTC-USD');
  const { data, loading, error, optimize } = useOptimize();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0D07',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px 16px',
    }}>

      {/* ── Device frame ──────────────────────────────────────── */}
      <div className="device-bezel" style={{ width: '100%', maxWidth: 1080, borderRadius: 3 }}>

        {/* Top device trim */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '7px 12px 8px',
        }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 7,
            color: 'rgba(95,104,77,0.35)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            ◈ QV-UNIT-01 ◈
          </span>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 7,
            color: 'rgba(95,104,77,0.22)',
            letterSpacing: '0.16em',
          }}>
            MONTE-CARLO · MVO · LCD-REV2
          </span>
        </div>

        {/* ── LCD Screen ──────────────────────────────────────── */}
        <div
          className="lcd-screen animate-lcd-flicker"
          style={{ margin: '0 8px', position: 'relative' }}
        >
          {/* Corner registration marks */}
          <Corner pos="tl" /><Corner pos="tr" />
          <Corner pos="bl" /><Corner pos="br" />

          {/* All content sits above texture pseudo-elements (z-index ≥ 5) */}
          <div style={{ position: 'relative', zIndex: 5, padding: '16px 18px 14px' }}>

            <Header
              tickers={tickers}
              onTickersChange={setTickers}
              onOptimize={() => optimize(tickers)}
              loading={loading}
            />

            {/* Error bar */}
            {error && (
              <div style={{
                marginBottom: 10,
                padding: '4px 10px',
                background: 'rgba(46,51,35,0.08)',
                border: '1px solid rgba(95,104,77,0.3)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 9,
                color: '#8E9775',
                letterSpacing: '0.12em',
              }}>
                ERR: BACKEND OFFLINE — START main.py AND RETRY
              </div>
            )}

            {/* ── Main content grid ──────────────────────────── */}
            <div className="dashboard-grid" style={{ marginTop: 12 }}>

              {/* ── Frontier chart panel ─────────────────────── */}
              <div className="lcd-panel" style={{ overflow: 'hidden' }}>

                {/* Panel header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderBottom: '1px solid rgba(95,104,77,0.22)',
                }}>
                  <span className="lcd-label">EFFICIENT FRONTIER</span>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: 8,
                      color: 'rgba(142,151,117,0.65)', letterSpacing: '0.1em',
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'rgba(142,151,117,0.55)', display: 'inline-block',
                      }} />
                      PORTFOLIOS
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: 8,
                      color: 'rgba(142,151,117,0.65)', letterSpacing: '0.1em',
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: 'rgba(216,222,195,0.85)', display: 'inline-block',
                        boxShadow: '0 0 4px rgba(200,230,160,0.7)',
                      }} />
                      OPTIMAL
                    </span>
                  </div>
                </div>

                {/* Phosphor display area */}
                <div className="phosphor-display" style={{ height: 340, margin: '10px 10px 0' }}>
                  {data ? (
                    <div style={{ height: '100%', padding: '6px', position: 'relative', zIndex: 5 }}
                         className="animate-fade-in">
                      <FrontierChart data={data} />
                    </div>
                  ) : (
                    <PhosphorEmpty />
                  )}
                </div>

                {/* Axis labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 12px 8px',
                  borderTop: '1px solid rgba(95,104,77,0.15)',
                  marginTop: 2,
                }}>
                  <span className="lcd-label" style={{ fontSize: 7 }}>X · VOLATILITY (RISK) %</span>
                  <span className="lcd-label" style={{ fontSize: 7 }}>Y · EXPECTED RETURN %</span>
                </div>
              </div>

              {/* ── Right-side panels ─────────────────────────── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Allocation panel */}
                <div className="lcd-panel" style={{ padding: '10px 12px 12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 7,
                    marginBottom: 10,
                    borderBottom: '1px solid rgba(95,104,77,0.22)',
                  }}>
                    <span className="lcd-label">ALLOCATION</span>
                    <span className="lcd-label" style={{ fontSize: 7 }}>OPTIMAL WEIGHTS</span>
                  </div>

                  {data ? (
                    <WeightsPanel weights={data.optimal.weights} />
                  ) : (
                    <div style={{
                      padding: '18px 0',
                      textAlign: 'center',
                      fontFamily: 'VT323, monospace',
                      fontSize: '1rem',
                      color: 'rgba(95,104,77,0.3)',
                      letterSpacing: '0.15em',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <span>[ EMPTY ]</span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 8 }, (_, i) => (
                          <div key={i} style={{
                            width: 12, height: 4,
                            background: 'transparent',
                            border: '1px solid rgba(95,104,77,0.2)',
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance panel */}
                <div className="lcd-panel" style={{ padding: '10px 12px 12px' }}>
                  <MetricsPanel data={data} />
                </div>

                {/* System info panel */}
                <div className="lcd-panel" style={{ padding: '8px 12px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px 12px',
                  }}>
                    {[
                      ['ENGINE', 'MVO'],
                      ['SAMPLING', 'MONTE-CARLO'],
                      ['WINDOW', '1Y'],
                      ['STATUS', data ? 'READY' : 'IDLE'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="lcd-label" style={{ fontSize: 7, display: 'block' }}>{k}</span>
                        <span style={{
                          fontFamily: 'VT323, monospace',
                          fontSize: '0.9rem',
                          color: data && k === 'STATUS' ? '#5F684D' : 'rgba(95,104,77,0.55)',
                          letterSpacing: '0.06em',
                        }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Screen footer ──────────────────────────────── */}
            <div style={{
              marginTop: 14,
              paddingTop: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(95,104,77,0.2)',
            }}>
              <span style={{
                fontFamily: 'VT323, monospace',
                fontSize: '0.9rem',
                color: 'rgba(95,104,77,0.45)',
                letterSpacing: '0.15em',
              }}>
                QUANTVIZ-PRO · PORTFOLIO-OS
              </span>
              <div style={{ display: 'flex', gap: 3 }}>
                {['MVO', 'MC', 'CAPM'].map((tag) => (
                  <span key={tag} style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: 7,
                    color: 'rgba(95,104,77,0.38)',
                    letterSpacing: '0.12em',
                    border: '1px solid rgba(95,104,77,0.2)',
                    padding: '1px 4px',
                  }}>{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Device bottom strip ───────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px 9px',
        }}>
          {/* D-pad cluster */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div className="nav-btn">▲</div>
            <div style={{ display: 'flex', gap: 2 }}>
              <div className="nav-btn">◄</div>
              <div className="nav-btn" style={{ background: '#252B1C' }}>·</div>
              <div className="nav-btn">►</div>
            </div>
            <div className="nav-btn">▼</div>
          </div>

          {/* Center label */}
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 7,
            color: 'rgba(95,104,77,0.2)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            QV-UNIT-01
          </span>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['A', 'B'].map((l, i) => (
              <div key={l} style={{
                width: i === 0 ? 20 : 16,
                height: i === 0 ? 20 : 16,
                borderRadius: '50%',
                background: '#1E2218',
                border: '1px solid #2A3020',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 7,
                color: 'rgba(95,104,77,0.3)',
              }}>{l}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Below device label */}
      <p style={{
        marginTop: 18,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 8,
        color: 'rgba(95,104,77,0.25)',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
      }}>
        QUANTVIZ PRO · PORTFOLIO OPTIMIZATION ENGINE · REV.2
      </p>

    </div>
  );
}
