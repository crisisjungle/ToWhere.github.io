import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/一路向哪？/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      cesium: 'cesium',
    },
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/'),
  },
  optimizeDeps: {
    include: ['cesium', 'resium'],
  },
}); 