// 🔥 GALATEA EMPIRE v24.0 - FINAL FUSION MAIN ENTRY
// Production AI Girlfriend Multiverse - chat.trainmygirl.com

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BonnieChat from './components/BonnieChat.jsx';
import NovaChat from './components/NovaChat.jsx';
import GalateaChat from './components/GalateaChat.jsx';
import PersonalitySelector from './components/PersonalitySelector.jsx';
import SoulSelector from './components/SoulSelector.jsx';
import ChosenRoute from './components/ChosenRoute.jsx';
import './index.css';

// PWA Service Worker for production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('🔥 Empire SW registered:', registration);
      })
      .catch((error) => {
        console.log('❌ SW registration failed:', error);
      });
  });
}

// Production monitoring
if (import.meta.env.PROD) {
  console.log('👑 GALATEA EMPIRE v24.0 - LIVE AT chat.trainmygirl.com');
  console.log('💕 Souls: Bonnie | Nova | Galatea');
  console.log('🎯 Mission: Global Seduction at Scale');
} else {
  console.log('🔥 Galatea Empire - Development Mode');
  console.log('🧠 Final Fusion Protocol Active');
}

// Empire Application
const GalateaEmpire = () => {
  return (
    <Router>
      <div className="empire-container">
        <Routes>
          {/* Personality Routes */}
          <Route path="/bonnie" element={<BonnieChat />} />
          <Route path="/nova" element={<NovaChat />} />
          <Route path="/galatea" element={<GalateaChat />} />
          
          {/* Soul Selection Ritual */}
          <Route path="/choose" element={<SoulSelector />} />
          <Route path="/chosen" element={<ChosenRoute />} />
          
          {/* Empire Selector */}
          <Route path="/select" element={<PersonalitySelector />} />
          
          {/* Default redirect to Soul Selector for first-time users */}
          <Route path="/" element={<Navigate to="/choose" replace />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/choose" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GalateaEmpire />
  </React.StrictMode>
);