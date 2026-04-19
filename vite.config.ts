/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: '/football-predictor/',
  plugins: [
    react(),
    vanillaExtractPlugin(),
  ],
  optimizeDeps: {
    entries: [
      'index.html',
      'all-time-rank/index.html',
    ],
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      // @kapowaz/design-tokens depends on @vanilla-extract/css; without
      // deduplication, cssVariablesByColorMode calls globalStyle() on a
      // separate instance whose fileScope doesn't match the Vite plugin's.
      '@vanilla-extract/css',
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        allTimeRank: path.resolve(__dirname, 'all-time-rank/index.html'),
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          recharts: ['recharts'],
          'framer-motion': ['motion'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
