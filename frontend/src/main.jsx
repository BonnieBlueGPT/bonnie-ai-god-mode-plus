import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

// 🔱 GALATEA EMPIRE - MAIN ENTRY POINT
// React 18 + Router + Global Providers + Hot Toast

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 15, 35, 0.95)',
              color: '#fff',
              border: '1px solid rgba(255, 20, 147, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#FF1493',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);