import { useState, useEffect } from 'react';

export function useExampleHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // example hook logic
  }, []);

  return [state, setState];
}