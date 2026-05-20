import { useState, useEffect, useRef } from 'react';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    fetch(url, { ...options, signal: abortController.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok (${res.status})`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      });

    // Cleanup
    return () => {
      abortController.abort();
    };
  }, [url, JSON.stringify(options)]); // stringify options to detect deep changes

  return { data, loading, error };
};