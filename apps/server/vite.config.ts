import { resolve } from 'path';

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const repoRoot = resolve(__dirname, '..', '..');

export default defineConfig({
  root: __dirname,
  envDir: repoRoot,
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
  ssr: {
    target: 'node',
  },
  plugins: [tsconfigPaths()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV ?? 'development',
    ),
  },
});
