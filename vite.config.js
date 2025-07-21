import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './frontend',
  build: {
    outDir: '../dist/frontend',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['framer-motion', 'lucide-react'],
          'charts': ['recharts'],
          'socket': ['socket.io-client']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@components': path.resolve(__dirname, './frontend/src/components'),
      '@pages': path.resolve(__dirname, './frontend/src/pages'),
      '@utils': path.resolve(__dirname, './frontend/src/utils'),
      '@store': path.resolve(__dirname, './frontend/src/store'),
      '@assets': path.resolve(__dirname, './frontend/src/assets')
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'socket.io-client', 'framer-motion']
  }
});