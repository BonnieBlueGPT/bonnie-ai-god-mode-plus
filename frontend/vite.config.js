import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable fast refresh for AI personality hot-swapping
      fastRefresh: true,
      babel: {
        plugins: [
          // Optimize for mobile performance
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ]
      }
    })
  ],
  
  // Mobile-first optimization
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow mobile device testing
    cors: true,
    hmr: {
      overlay: false // Don't block mobile testing
    }
  },

  // Path aliases for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@personalities': path.resolve(__dirname, 'src/personalities'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },

  // Build optimization for mobile
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in prod for mobile speed
    minify: 'terser',
    target: 'es2020',
    
    // Code splitting for AI personalities
    rollupOptions: {
      output: {
        manualChunks: {
          // Core engine
          'chat-engine': ['./src/services/ChatEngine.js', './src/services/MemoryService.js'],
          // AI personalities (lazy loaded)
          'personalities': ['./src/personalities/index.js'],
          // UI components
          'ui-components': ['./src/components/ChatInterface.jsx', './src/components/PersonalitySelector.jsx']
        }
      }
    },

    // Mobile performance optimization
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log'] // Pure function elimination
      }
    }
  },

  // Mobile-specific optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@personalities/nova', '@personalities/galatea'] // Lazy load these
  },

  // PWA and mobile features
  define: {
    __AI_EMPIRE_VERSION__: JSON.stringify('v2.0.0'),
    __MOBILE_OPTIMIZED__: true
  }
});