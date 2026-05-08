const API_BASE = 'http://localhost:8000';

export async function fetchOptimization(tickers) {
  const response = await fetch(`${API_BASE}/optimize?tickers=${encodeURIComponent(tickers)}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}
