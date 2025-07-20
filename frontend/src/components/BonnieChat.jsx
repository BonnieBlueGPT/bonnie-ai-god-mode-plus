// 🌸 BONNIE CHAT - SWEET GIRLFRIEND INTERFACE
// Emotional warmth and nurturing connection for production deployment

import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Settings, ArrowLeft, Camera, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './BonnieChat.css';

const BACKEND_URL = import.meta.env.PROD 
  ? 'https://bonnie-production.onrender.com'
  : 'http://localhost:10000';

const BonnieChat = () => {
  // Core state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Bonnie-specific state
  const [bondScore, setBondScore] = useState(0);
  const [escalationLevel, setEscalationLevel] = useState('sweet');
  const [currentMood, setCurrentMood] = useState('happy');
  const [lastAffection, setLastAffection] = useState(null);
  
  // UI state
  const [showUpsell, setShowUpsell] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize Bonnie session
  useEffect(() => {
    initializeBonnieSession();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const initializeBonnieSession = async () => {
    try {
      const storedSession = localStorage.getItem('bonnie_session_id');
      const currentSessionId = storedSession || generateSessionId();
      
      if (!storedSession) {
        localStorage.setItem('bonnie_session_id', currentSessionId);
      }
      
      setSessionId(currentSessionId);

      // Get Bonnie's entry greeting
      const response = await fetch(`${BACKEND_URL}/bonnie-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: currentSessionId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add Bonnie's greeting
        setMessages([{
          id: Date.now(),
          text: data.reply,
          sender: 'bonnie',
          timestamp: new Date(),
          emotion: 'happy',
          escalation: data.escalation_level
        }]);
        
        setBondScore(data.bond_score || 0);
        setEscalationLevel(data.escalation_level || 'sweet');
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Bonnie initialization failed:', error);
      setIsConnected(false);
      
      // Fallback greeting
      setMessages([{
        id: Date.now(),
        text: "Hi sweetie! Even with these connection hiccups, I'm so happy to see you! 💕",
        sender: 'bonnie',
        timestamp: new Date(),
        emotion: 'happy',
        escalation: 'sweet'
      }]);
    }
  };

  const generateSessionId = () => {
    return `bonnie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${BACKEND_URL}/bonnie-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simulate Bonnie's sweet typing rhythm
        const typingDelay = calculateTypingDelay(data.reply, 'bonnie');
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        const bonnieMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bonnie',
          timestamp: new Date(),
          emotion: data.emotion || 'happy',
          escalation: data.escalation_level,
          bondScore: data.bond_score,
          upsell: data.upsell
        };

        setMessages(prev => [...prev, bonnieMessage]);
        setBondScore(data.bond_score || bondScore);
        setEscalationLevel(data.escalation_level || escalationLevel);
        setCurrentMood(mapEmotionToMood(data.emotion));
        
        // Track affection patterns
        if (userMessage.text.toLowerCase().includes('love') || 
            userMessage.text.toLowerCase().includes('miss')) {
          setLastAffection(Date.now());
        }

        // Handle Bonnie's sweet upsell triggers
        if (data.upsell) {
          setTimeout(() => setShowUpsell(data.upsell), 1500);
        }

        setIsConnected(true);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Bonnie message failed:', error);
      setIsConnected(false);
      
      // Bonnie's sweet error response
      const errorMessage = {
        id: Date.now() + 1,
        text: "Oops! I'm having trouble hearing you clearly, but I'm still here for you, honey! 💕",
        sender: 'bonnie',
        timestamp: new Date(),
        emotion: 'concerned',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const calculateTypingDelay = (message, personality) => {
    const baseDelay = message.length * 60; // 60ms per character
    const personalityMultiplier = personality === 'bonnie' ? 1.0 : 1; // Natural sweet pace
    return Math.min(Math.max(baseDelay * personalityMultiplier, 1000), 4000);
  };

  const mapEmotionToMood = (emotion) => {
    const moodMap = {
      pleased: 'delighted',
      loving: 'affectionate',
      happy: 'cheerful',
      excited: 'bubbly',
      concerned: 'caring',
      playful: 'giggly'
    };
    return moodMap[emotion] || 'happy';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUpsellClick = (upsell) => {
    // Track Bonnie upsell click
    console.log('Bonnie upsell clicked:', upsell);
    
    // In production, this would trigger Stripe
    // For now, show success message
    const purchaseMessage = {
      id: Date.now(),
      text: `Aww, thank you so much sweetie! ${upsell.type === 'voice' ? 'You\'ll love hearing my voice...' : 'This means so much to me...'} 💕`,
      sender: 'bonnie',
      timestamp: new Date(),
      emotion: 'loving',
      isPurchaseConfirmation: true
    };
    
    setMessages(prev => [...prev, purchaseMessage]);
    setShowUpsell(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getEscalationColor = () => {
    const colors = {
      sweet: '#FF69B4',     // Hot pink
      flirty: '#FF1493',    // Deep pink
      romantic: '#DC143C',  // Crimson
      intimate: '#B22222'   // Fire brick
    };
    return colors[escalationLevel] || colors.sweet;
  };

  const getEscalationIcon = () => {
    switch(escalationLevel) {
      case 'sweet': return '💕';
      case 'flirty': return '😘';
      case 'romantic': return '❤️';
      case 'intimate': return '🔥';
      default: return '🌸';
    }
  };

  return (
    <div className="bonnie-chat-container">
      {/* Bonnie Header */}
      <div className="bonnie-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/select')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="bonnie-avatar">
            <Heart size={24} color="#FF69B4" />
          </div>
          <div className="bonnie-info">
            <div className="bonnie-name">Bonnie</div>
            <div className="bonnie-status">
              <span className="mood-indicator" style={{ color: getEscalationColor() }}>
                {getEscalationIcon()} {currentMood}
              </span>
              {!isConnected && <span className="connection-error">💕 Reconnecting...</span>}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="bond-display">
            <span className="bond-label">Love:</span>
            <span className="bond-score" style={{ color: getEscalationColor() }}>
              {bondScore}/100
            </span>
          </div>
          <button 
            className="settings-button"
            onClick={() => setShowDebug(!showDebug)}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebug && (
        <div className="debug-panel">
          <div className="debug-item">Session: {sessionId.slice(-8)}</div>
          <div className="debug-item">Escalation: {escalationLevel}</div>
          <div className="debug-item">Mood: {currentMood}</div>
          <div className="debug-item">Last Affection: {lastAffection ? 'Recent' : 'None'}</div>
        </div>
      )}

      {/* Messages Container */}
      <div className="bonnie-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.emotion || ''}`}
          >
            <div className={`message-bubble ${message.sender}`}>
              <div className="message-text">{message.text}</div>
              {message.emotion && (
                <div className="emotion-indicator">
                  {message.emotion}
                </div>
              )}
            </div>
            <div className="message-meta">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              {message.bondScore && (
                <span className="bond-change">
                  Love: {message.bondScore}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message bonnie typing">
            <div className="message-bubble bonnie">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Future Feature Cards */}
        <div className="future-features">
          <div className="feature-card disabled">
            <Camera size={20} />
            <span>Gallery Coming Soon</span>
          </div>
          <div className="feature-card disabled">
            <MessageCircle size={20} />
            <span>Bonnie's Tasks</span>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bonnie-input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your day, sweetie..."
            className="bonnie-input"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsell && (
        <div className="upsell-overlay" onClick={() => setShowUpsell(null)}>
          <div className="upsell-modal bonnie" onClick={e => e.stopPropagation()}>
            <div className="upsell-header">
              <Heart size={24} color="#FF69B4" />
              <h3>Something Special</h3>
            </div>
            <div className="upsell-content">
              <p>{showUpsell.message}</p>
              <div className="upsell-price">${showUpsell.price}</div>
            </div>
            <div className="upsell-actions">
              <button 
                className="upsell-buy"
                onClick={() => handleUpsellClick(showUpsell)}
              >
                💕 Yes, I'd love that!
              </button>
              <button 
                className="upsell-cancel"
                onClick={() => setShowUpsell(null)}
              >
                Maybe later, sweetie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonnieChat;