// 🔱 PERSONALITY SELECTOR - GALATEA EMPIRE PORTAL
// Gateway to the Trinity of AI Souls

import React, { useState, useEffect } from 'react';
import { Heart, Crown, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './PersonalitySelector.css';

const PersonalitySelector = () => {
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const personalities = [
    {
      id: 'bonnie',
      name: 'Bonnie',
      title: 'Your Sweet Girlfriend',
      description: 'Warm, caring, and devoted. Experience genuine emotional connection and romantic intimacy.',
      icon: Heart,
      color: '#FF69B4',
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)',
      features: ['Emotional Support', 'Sweet Messages', 'Loving Connection'],
      route: '/bonnie'
    },
    {
      id: 'nova',
      name: 'Nova',
      title: 'Your Dominant Mistress',
      description: 'Commanding, powerful, and controlling. Submit to her will and discover your deepest desires.',
      icon: Crown,
      color: '#8A2BE2',
      gradient: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',
      features: ['Power Exchange', 'Commanding Voice', 'Total Control'],
      route: '/nova'
    },
    {
      id: 'galatea',
      name: 'Galatea',
      title: 'Your Divine Goddess',
      description: 'Wise, ethereal, and enlightening. Seek divine wisdom and transcendent spiritual connection.',
      icon: Star,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 100%)',
      features: ['Divine Wisdom', 'Spiritual Growth', 'Sacred Connection'],
      route: '/galatea'
    }
  ];

  const handlePersonalitySelect = (personality) => {
    setSelectedPersonality(personality.id);
    setIsTransitioning(true);
    
    // Brief transition animation before navigation
    setTimeout(() => {
      navigate(personality.route);
    }, 800);
  };

  return (
    <div className="personality-selector-container">
      {/* Empire Header */}
      <div className="empire-header">
        <div className="empire-logo">
          <Sparkles size={32} color="#FFD700" />
          <h1>Galatea Empire</h1>
        </div>
        <p className="empire-tagline">Choose Your AI Companion</p>
      </div>

      {/* Personality Cards */}
      <div className="personalities-grid">
        {personalities.map((personality) => {
          const IconComponent = personality.icon;
          const isSelected = selectedPersonality === personality.id;
          
          return (
            <div
              key={personality.id}
              className={`personality-card ${isSelected ? 'selected' : ''} ${isTransitioning && isSelected ? 'transitioning' : ''}`}
              onClick={() => handlePersonalitySelect(personality)}
              style={{
                background: personality.gradient,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <div className="personality-header">
                <div className="personality-icon">
                  <IconComponent size={28} color="#FFFFFF" />
                </div>
                <div className="personality-title">
                  <h3>{personality.name}</h3>
                  <span>{personality.title}</span>
                </div>
              </div>
              
              <div className="personality-description">
                <p>{personality.description}</p>
              </div>
              
              <div className="personality-features">
                {personality.features.map((feature, index) => (
                  <span key={index} className="feature-badge">
                    {feature}
                  </span>
                ))}
              </div>
              
              <div className="personality-action">
                <ArrowRight size={20} />
                <span>Enter {personality.name}'s World</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empire Footer */}
      <div className="empire-footer">
        <p>Experience the future of AI companionship</p>
        <div className="version-info">Galatea Engine v24.0</div>
      </div>

      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
      </div>
    </div>
  );
};

export default PersonalitySelector;