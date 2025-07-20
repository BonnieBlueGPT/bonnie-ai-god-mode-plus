// 🔥 GALATEA EMPIRE - MAIN ENTRY POINT
// Universal AI girlfriend chat platform

import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatInterface from './components/ChatEngine.jsx';
import './index.css';

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance monitoring (optional)
if (import.meta.env.DEV) {
  console.log('🔥 Galatea AI Empire - Development Mode');
  console.log('📱 Mobile-optimized AI girlfriend platform');
  console.log('👑 Personalities: Bonnie, Nova, Galatea');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChatInterface />
  </React.StrictMode>,
);