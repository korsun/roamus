import { resolve } from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  envDir: resolve(__dirname, '../..'),
  build: {
    ssr: true,
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        server: resolve(__dirname, 'src/server.ts'),
      },
      output: {
        entryFileNames: 'server.js',
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@common', replacement: resolve(__dirname, '../common') },
      {
        find: '@common/types',
        replacement: resolve(__dirname, '../common/types.ts'),
      },
    ],
  },
  ssr: {
    target: 'node',
  },
  plugins: [],
  define: {
    'process.env': {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development',
    },
  },
});
