import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: __dirname,
  publicDir: 'public',
  envDir: resolve(__dirname, '../..'),
  appType: 'spa',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [react(), tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
