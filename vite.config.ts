import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    // Simulated browser DOM so render() has a document to mount into
    environment: 'jsdom',
    // Runs before every test file: adds toBeInTheDocument and cleans up
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
