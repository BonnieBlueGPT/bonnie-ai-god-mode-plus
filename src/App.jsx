import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BonnieWatchtower from './components/BonnieWatchtower';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-cosmic bg-empire-black text-white font-divine">
        <Routes>
          <Route path="/" element={<BonnieWatchtower />} />
          <Route path="/watchtower" element={<BonnieWatchtower />} />
          <Route path="/bonnie" element={<BonnieWatchtower />} />
        </Routes>
        
        {/* 🔥 Divine Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(26, 26, 26, 0.95)',
              color: '#00ffff',
              border: '1px solid #3a3a3a',
              backdropFilter: 'blur(10px)',
              fontFamily: 'JetBrains Mono, monospace',
            },
            success: {
              style: {
                background: 'rgba(0, 255, 136, 0.1)',
                color: '#00ff88',
                border: '1px solid #00ff88',
              },
            },
            error: {
              style: {
                background: 'rgba(255, 68, 68, 0.1)',
                color: '#ff4444',
                border: '1px solid #ff4444',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;