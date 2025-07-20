// 🖤 NOVA CHAT - DOMINANT TEMPTRESS INTERFACE
// Production-grade seduction engine for real users and real payments

import React, { useState, useEffect, useRef } from 'react';
import { Send, Crown, Settings, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './NovaChat.css';

const BACKEND_URL = import.meta.env.PROD 
  ? 'https://bonnie-production.onrender.com'
  : 'http://localhost:10000';

const NovaChat = () => {
  // Core state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Nova-specific state
  const [bondScore, setBondScore] = useState(0);
  const [escalationLevel, setEscalationLevel] = useState('sweet');
  const [currentMood, setCurrentMood] = useState('commanding');
  const [lastSubmission, setLastSubmission] = useState(null);
  
  // UI state
  const [showUpsell, setShowUpsell] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize Nova session
  useEffect(() => {
    initializeNovaSession();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const initializeNovaSession = async () => {
    try {
      const storedSession = localStorage.getItem('nova_session_id');
      const currentSessionId = storedSession || generateSessionId();
      
      if (!storedSession) {
        localStorage.setItem('nova_session_id', currentSessionId);
      }
      
      setSessionId(currentSessionId);

      // Get Nova's entry greeting
      const response = await fetch(`${BACKEND_URL}/nova-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: currentSessionId })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add Nova's greeting
        setMessages([{
          id: Date.now(),
          text: data.reply,
          sender: 'nova',
          timestamp: new Date(),
          emotion: 'commanding',
          escalation: data.escalation_level
        }]);
        
        setBondScore(data.bond_score || 0);
        setEscalationLevel(data.escalation_level || 'sweet');
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Nova initialization failed:', error);
      setIsConnected(false);
      
      // Fallback greeting
      setMessages([{
        id: Date.now(),
        text: "Well, well... technical difficulties won't stop me from commanding you, pet. 😏",
        sender: 'nova',
        timestamp: new Date(),
        emotion: 'commanding',
        escalation: 'sweet'
      }]);
    }
  };

  const generateSessionId = () => {
    return `nova_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      const response = await fetch(`${BACKEND_URL}/nova-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simulate Nova's commanding typing rhythm
        const typingDelay = calculateTypingDelay(data.reply, 'nova');
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        const novaMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'nova',
          timestamp: new Date(),
          emotion: data.emotion || 'commanding',
          escalation: data.escalation_level,
          bondScore: data.bond_score,
          upsell: data.upsell
        };

        setMessages(prev => [...prev, novaMessage]);
        setBondScore(data.bond_score || bondScore);
        setEscalationLevel(data.escalation_level || escalationLevel);
        setCurrentMood(mapEmotionToMood(data.emotion));
        
        // Track submission patterns
        if (userMessage.text.toLowerCase().includes('yes nova') || 
            userMessage.text.toLowerCase().includes('obey')) {
          setLastSubmission(Date.now());
        }

        // Handle Nova's upsell triggers
        if (data.upsell) {
          setTimeout(() => setShowUpsell(data.upsell), 1500);
        }

        setIsConnected(true);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Nova message failed:', error);
      setIsConnected(false);
      
      // Nova's dominant error response
      const errorMessage = {
        id: Date.now() + 1,
        text: "Technical problems won't stop me from owning you. Try again, pet. 😈",
        sender: 'nova',
        timestamp: new Date(),
        emotion: 'annoyed',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const calculateTypingDelay = (message, personality) => {
    const baseDelay = message.length * 50; // 50ms per character
    const personalityMultiplier = personality === 'nova' ? 0.8 : 1; // Nova types confidently fast
    return Math.min(Math.max(baseDelay * personalityMultiplier, 800), 3500);
  };

  const mapEmotionToMood = (emotion) => {
    const moodMap = {
      pleased: 'satisfied',
      empowered: 'dominant',
      commanding: 'controlling',
      annoyed: 'displeased',
      amused: 'playful'
    };
    return moodMap[emotion] || 'commanding';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleUpsellClick = (upsell) => {
    // Track Nova upsell click
    console.log('Nova upsell clicked:', upsell);
    
    // In production, this would trigger Stripe
    // For now, show success message
    const purchaseMessage = {
      id: Date.now(),
      text: `Perfect, pet. Your devotion has been noted. ${upsell.type === 'voice' ? 'Listen to my commands...' : 'Prepare for true power...'} 👑`,
      sender: 'nova',
      timestamp: new Date(),
      emotion: 'pleased',
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
      sweet: '#9370DB',    // Soft purple
      flirty: '#8A2BE2',   // Blue violet  
      romantic: '#4B0082', // Indigo
      intimate: '#800080'  // Dark purple
    };
    return colors[escalationLevel] || colors.sweet;
  };

  const getEscalationIcon = () => {
    switch(escalationLevel) {
      case 'sweet': return '😏';
      case 'flirty': return '👑';
      case 'romantic': return '🖤';
      case 'intimate': return '⚡';
      default: return '😈';
    }
  };

  return (
    <div className="nova-chat-container">
      {/* Nova Header */}
      <div className="nova-header">
        <div className="header-left">
          <button 
            className="back-button"
            onClick={() => navigate('/select')}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="nova-avatar">
            <Crown size={24} color="#8A2BE2" />
          </div>
          <div className="nova-info">
            <div className="nova-name">Nova</div>
            <div className="nova-status">
              <span className="mood-indicator" style={{ color: getEscalationColor() }}>
                {getEscalationIcon()} {currentMood}
              </span>
              {!isConnected && <span className="connection-error">⚠️ Reconnecting...</span>}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="bond-display">
            <span className="bond-label">Power:</span>
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
          <div className="debug-item">Last Submission: {lastSubmission ? 'Recent' : 'None'}</div>
        </div>
      )}

      {/* Messages Container */}
      <div className="nova-messages">
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
                  Power: {message.bondScore}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="message nova typing">
            <div className="message-bubble nova">
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
            <Zap size={20} />
            <span>Gallery Coming Soon</span>
          </div>
          <div className="feature-card disabled">
            <Crown size={20} />
            <span>Nova's Commands</span>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="nova-input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Speak to your goddess..."
            className="nova-input"
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
          <div className="upsell-modal nova" onClick={e => e.stopPropagation()}>
            <div className="upsell-header">
              <Crown size={24} color="#8A2BE2" />
              <h3>Command Unlocked</h3>
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
                Obey & Purchase
              </button>
              <button 
                className="upsell-cancel"
                onClick={() => setShowUpsell(null)}
              >
                Resist (for now)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovaChat;