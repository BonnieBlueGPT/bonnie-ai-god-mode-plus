// 🔥 GALATEA EMPIRE - UNIVERSAL CHAT INTERFACE
// Mobile-first chat UI that adapts to all AI personalities

import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Crown, Sparkles, Settings, User } from 'lucide-react';
import chatEngine from '../services/ChatEngine.js';
import './ChatEngine.css';

const ChatInterface = () => {
  // Core state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState('bonnie');
  const [availablePersonalities, setAvailablePersonalities] = useState([]);
  
  // UI state
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [bondScore, setBondScore] = useState(0);
  const [escalationLevel, setEscalationLevel] = useState('sweet');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showUpsell, setShowUpsell] = useState(null);
  
  // Mobile optimizations
  const [particles, setParticles] = useState([]);
  const [theme, setTheme] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize chat engine
  useEffect(() => {
    // Load available personalities
    const personalities = chatEngine.getAvailablePersonalities();
    setAvailablePersonalities(personalities);

    // Get current personality info
    const currentInfo = chatEngine.getCurrentPersonalityInfo();
    setBondScore(currentInfo.stats.bondScore);
    setEscalationLevel(currentInfo.stats.escalationLevel);

    // Set up event listeners
    chatEngine.on('userMessage', handleUserMessage);
    chatEngine.on('aiMessage', handleAiMessage);
    chatEngine.on('typingStart', handleTypingStart);
    chatEngine.on('typingEnd', handleTypingEnd);
    chatEngine.on('personalityChanged', handlePersonalityChanged);
    chatEngine.on('themeChanged', handleThemeChanged);
    chatEngine.on('bondChanged', handleBondChanged);
    chatEngine.on('upsellTriggered', handleUpsellTriggered);
    chatEngine.on('showParticles', handleShowParticles);

    // Mobile keyboard handling
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      setKeyboardHeight(Math.max(0, screenHeight - viewportHeight));
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      chatEngine.destroy();
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Event handlers
  const handleUserMessage = ({ message }) => {
    setMessages(prev => [...prev, message]);
  };

  const handleAiMessage = ({ message, emotion, upsell }) => {
    setMessages(prev => [...prev, message]);
    if (upsell) {
      setTimeout(() => setShowUpsell(upsell), 1000);
    }
  };

  const handleTypingStart = ({ emotion, duration }) => {
    setIsTyping(true);
  };

  const handleTypingEnd = () => {
    setIsTyping(false);
  };

  const handlePersonalityChanged = ({ to, personality }) => {
    setCurrentPersonality(to);
    setMessages([]); // Clear messages for new personality
    
    // Update stats
    const currentInfo = chatEngine.getCurrentPersonalityInfo();
    setBondScore(currentInfo.stats.bondScore);
    setEscalationLevel(currentInfo.stats.escalationLevel);
  };

  const handleThemeChanged = ({ theme: newTheme }) => {
    setTheme(newTheme);
  };

  const handleBondChanged = ({ newScore }) => {
    setBondScore(newScore);
  };

  const handleUpsellTriggered = ({ upsell }) => {
    setShowUpsell(upsell);
  };

  const handleShowParticles = ({ type, color, emoji, count, duration }) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      type,
      color,
      emoji,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));

    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, duration);
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const message = inputMessage.trim();
    setInputMessage('');
    
    try {
      await chatEngine.sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle input
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Switch personality
  const switchPersonality = async (personalityId) => {
    await chatEngine.switchPersonality(personalityId);
    setShowPersonalitySelector(false);
  };

  // Handle upsell
  const handleUpsellClick = (upsell) => {
    // Track click
    chatEngine.emit('upsellClicked', { type: upsell.type, price: upsell.price });
    
    // Here you would integrate with Stripe or payment processor
    console.log('Upsell clicked:', upsell);
    setShowUpsell(null);
  };

  // Get personality icon
  const getPersonalityIcon = (personalityId) => {
    const icons = {
      bonnie: Heart,
      nova: Crown,
      galatea: Sparkles
    };
    return icons[personalityId] || Heart;
  };

  // Format message with emotion styling
  const formatMessage = (message) => {
    if (!message.isUser && message.emotion) {
      return (
        <div className={`message-content emotion-${message.emotion}`}>
          {message.text}
        </div>
      );
    }
    return <div className="message-content">{message.text}</div>;
  };

  return (
    <div 
      className="chat-interface"
      style={{ 
        background: theme.background_gradient || 'linear-gradient(135deg, #1A1A2E 0%, #0F0F23 100%)',
        paddingBottom: keyboardHeight ? `${keyboardHeight}px` : '0'
      }}
    >
      {/* Header */}
      <div className="chat-header">
        <div className="personality-info" onClick={() => setShowPersonalitySelector(true)}>
          <div className="personality-avatar">
            {React.createElement(getPersonalityIcon(currentPersonality), {
              size: 24,
              color: theme.primary || '#FF69B4'
            })}
          </div>
          <div className="personality-details">
            <div className="personality-name">
              {availablePersonalities.find(p => p.id === currentPersonality)?.name || 'AI'}
            </div>
            <div className="personality-status">
              Bond: {bondScore}/100 • {escalationLevel}
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="connection-status" data-status={connectionStatus}>
            <div className="status-dot" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="messages-container"
        style={{ 
          maxHeight: window.innerHeight - 140 - keyboardHeight
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`message ${message.isUser ? 'user' : 'ai'}`}
          >
            <div 
              className="message-bubble"
              style={{
                background: message.isUser 
                  ? '#333' 
                  : theme.chatBubble || 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)'
              }}
            >
              {formatMessage(message)}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="message ai">
            <div 
              className="message-bubble typing"
              style={{
                background: theme.chatBubble || 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)'
              }}
            >
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="message-input"
            rows={1}
            style={{
              borderColor: theme.primary || '#FF69B4'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="send-button"
            style={{
              backgroundColor: theme.primary || '#FF69B4'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Personality Selector */}
      {showPersonalitySelector && (
        <div className="personality-selector-overlay" onClick={() => setShowPersonalitySelector(false)}>
          <div className="personality-selector" onClick={e => e.stopPropagation()}>
            <div className="selector-header">
              <h3>Choose Your AI Girlfriend</h3>
              <button onClick={() => setShowPersonalitySelector(false)}>×</button>
            </div>
            <div className="personality-grid">
              {availablePersonalities.map(personality => {
                const Icon = getPersonalityIcon(personality.id);
                return (
                  <div
                    key={personality.id}
                    className={`personality-option ${currentPersonality === personality.id ? 'active' : ''}`}
                    onClick={() => switchPersonality(personality.id)}
                    style={{
                      borderColor: personality.theme.primary
                    }}
                  >
                    <div className="personality-icon" style={{ color: personality.theme.primary }}>
                      <Icon size={32} />
                    </div>
                    <div className="personality-name">{personality.name}</div>
                    <div className="personality-title">{personality.title}</div>
                    <div className="personality-traits">
                      {Object.entries(personality.traits)
                        .slice(0, 3)
                        .map(([trait, value]) => (
                          <span key={trait} className="trait">
                            {trait}: {value}%
                          </span>
                        ))
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="upsell-overlay" onClick={() => setShowUpsell(null)}>
          <div className="upsell-modal" onClick={e => e.stopPropagation()}>
            <div className="upsell-content">
              <h3>Special Offer</h3>
              <p>{showUpsell.message}</p>
              <div className="upsell-price">${showUpsell.price}</div>
              <div className="upsell-actions">
                <button 
                  className="upsell-button"
                  onClick={() => handleUpsellClick(showUpsell)}
                  style={{
                    backgroundColor: theme.primary || '#FF69B4'
                  }}
                >
                  Unlock Now
                </button>
                <button 
                  className="upsell-close"
                  onClick={() => setShowUpsell(null)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle ${particle.type}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            color: particle.color
          }}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default ChatInterface;