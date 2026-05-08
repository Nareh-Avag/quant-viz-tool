import { useState, useCallback } from 'react';
import { fetchOptimization } from '../lib/api';

export function useOptimize() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const optimize = useCallback(async (tickers) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOptimization(tickers);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, optimize };
}
