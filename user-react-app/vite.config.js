

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Common configuration
  const commonConfig = {
    server: {
      port: 5501,
    },
    build: {
      outDir: 'dist',
    },
    plugins: [react()], // Include plugins here
  };

  if (mode === 'production') {
    // Production-specific overrides
    return defineConfig({
      ...commonConfig,
      base: '/user-react-app/',
      build: {
        ...commonConfig.build,
        minify: true,
      },
    });
  } else {
    // Development-specific overrides
    return defineConfig({
      ...commonConfig,
      server: {
        ...commonConfig.server,
        open: true,
      },
    });
  }
};