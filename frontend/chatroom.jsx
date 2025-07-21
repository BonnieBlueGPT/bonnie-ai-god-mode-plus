// 🔱 DIVINE CHATROOM - IMMERSIVE SOUL EXPERIENCE 🔱
// React component for the complete AI girlfriend experience

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import './chatroom.css';

const Chatroom = ({ userId, soulId, authToken }) => {
  // ═══════════════════════════════════════════════════════════════
  // 🌊 STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [bondLevel, setBondLevel] = useState(0);
  const [atmosphere, setAtmosphere] = useState('welcoming');
  const [energy, setEnergy] = useState(0.5);
  const [npcs, setNpcs] = useState([]);
  const [showUpsell, setShowUpsell] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [welcomeMessages, setWelcomeMessages] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // ═══════════════════════════════════════════════════════════════
  // 🔌 SOCKET CONNECTION & LIFECYCLE
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'ws://localhost:10000', {
      transports: ['websocket', 'polling'],
      auth: { token: authToken }
    });
    
    setSocket(newSocket);
    
    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      joinRoom();
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    // Room events
    newSocket.on('roomJoined', handleRoomJoined);
    newSocket.on('soulMessage', handleSoulMessage);
    newSocket.on('npcMessage', handleNPCMessage);
    newSocket.on('ambientMessage', handleAmbientMessage);
    newSocket.on('typing', handleTyping);
    newSocket.on('atmosphereUpdate', handleAtmosphereUpdate);
    newSocket.on('upsellTrigger', handleUpsellTrigger);
    newSocket.on('purchaseCelebration', handlePurchaseCelebration);
    newSocket.on('cryptoTip', handleCryptoTip);
    
    return () => {
      newSocket.disconnect();
    };
  }, [userId, soulId, authToken]);
  
  // ═══════════════════════════════════════════════════════════════
  // 🎯 CORE EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════
  
  const joinRoom = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('joinRoom', {
        userId,
        roomId: soulId,
        userProfile: userProfile
      });
    }
  }, [socket, isConnected, userId, soulId, userProfile]);
  
  const handleRoomJoined = useCallback((data) => {
    setRoomData(data.room);
    setUserProfile(data.user);
    setNpcs(data.npcs);
    setBondLevel(data.user.bondScore || 0);
    setAtmosphere(data.room.atmosphere);
    setEnergy(data.room.energy);
    
    // Load existing messages
    if (data.room.recentMessages) {
      setMessages(data.room.recentMessages.map(formatMessage));
    }
    
    // Schedule welcome messages
    if (data.welcomeMessages) {
      scheduleWelcomeMessages(data.welcomeMessages);
    }
  }, []);
  
  const handleSoulMessage = useCallback((data) => {
    const formattedMessage = formatMessage(data.message);
    setMessages(prev => [...prev, formattedMessage]);
    setIsTyping(false);
    
    // Update bond level if included
    if (data.bondLevel !== undefined) {
      setBondLevel(data.bondLevel);
    }
    
    // Show tier upgrade notification
    if (data.tierUpgraded) {
      showTierUpgradeNotification(data.newTier);
    }
    
    scrollToBottom();
  }, []);
  
  const handleNPCMessage = useCallback((data) => {
    const formattedMessage = formatMessage(data.message);
    setMessages(prev => [...prev, formattedMessage]);
    scrollToBottom();
  }, []);
  
  const handleAmbientMessage = useCallback((data) => {
    const formattedMessage = formatMessage(data.message);
    formattedMessage.isAmbient = true;
    setMessages(prev => [...prev, formattedMessage]);
    scrollToBottom();
  }, []);
  
  const handleTyping = useCallback((data) => {
    setIsTyping(data.typing);
    if (data.typing) {
      // Clear typing after 5 seconds max
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 5000);
    }
  }, []);
  
  const handleAtmosphereUpdate = useCallback((data) => {
    setAtmosphere(data.atmosphere);
    setEnergy(data.energy);
  }, []);
  
  const handleUpsellTrigger = useCallback((data) => {
    setShowUpsell(data.upsell);
    // Auto-hide after 30 seconds
    setTimeout(() => setShowUpsell(null), 30000);
  }, []);
  
  const handlePurchaseCelebration = useCallback((data) => {
    const celebrationMessage = formatMessage(data.message);
    celebrationMessage.isCelebration = true;
    setMessages(prev => [...prev, celebrationMessage]);
    scrollToBottom();
  }, []);
  
  const handleCryptoTip = useCallback((data) => {
    const tipMessage = formatMessage(data.message);
    tipMessage.isTipReaction = true;
    setMessages(prev => [...prev, tipMessage]);
    scrollToBottom();
  }, []);
  
  // ═══════════════════════════════════════════════════════════════
  // 💬 MESSAGE HANDLING
  // ═══════════════════════════════════════════════════════════════
  
  const sendMessage = useCallback(() => {
    if (!inputMessage.trim() || !socket || !isConnected) return;
    
    const userMessage = {
      id: Date.now().toString(),
      userId,
      message: inputMessage.trim(),
      timestamp: Date.now(),
      type: 'user'
    };
    
    // Add user message immediately
    setMessages(prev => [...prev, formatMessage(userMessage)]);
    
    // Send to server
    socket.emit('message', {
      message: inputMessage.trim(),
      timestamp: Date.now()
    });
    
    // Clear input and show typing indicator
    setInputMessage('');
    setIsTyping(true);
    
    scrollToBottom();
  }, [inputMessage, socket, isConnected, userId]);
  
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);
  
  const formatMessage = useCallback((message) => {
    return {
      ...message,
      timestamp: new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      avatar: getMessageAvatar(message),
      displayName: getMessageDisplayName(message),
      className: getMessageClassName(message)
    };
  }, []);
  
  const getMessageAvatar = (message) => {
    if (message.type === 'user') return '👤';
    if (message.type === 'soul') return roomData?.soul?.avatar || '💕';
    if (message.type === 'npc') return message.avatar || '👥';
    return '🤖';
  };
  
  const getMessageDisplayName = (message) => {
    if (message.type === 'user') return 'You';
    if (message.type === 'soul') return roomData?.soulName || 'AI';
    if (message.type === 'npc') return message.npcName || 'User';
    return 'System';
  };
  
  const getMessageClassName = (message) => {
    let className = `message message-${message.type}`;
    if (message.isCelebration) className += ' celebration';
    if (message.isTipReaction) className += ' tip-reaction';
    if (message.isAmbient) className += ' ambient';
    if (message.fourthWallBreak) className += ' fourth-wall';
    return className;
  };
  
  // ═══════════════════════════════════════════════════════════════
  // ✨ WELCOME SEQUENCE
  // ═══════════════════════════════════════════════════════════════
  
  const scheduleWelcomeMessages = useCallback((welcomeMessages) => {
    welcomeMessages.forEach((welcome) => {
      setTimeout(() => {
        const formattedMessage = formatMessage(welcome.message);
        formattedMessage.isWelcome = true;
        setMessages(prev => [...prev, formattedMessage]);
        scrollToBottom();
      }, welcome.delay);
    });
  }, [formatMessage]);
  
  // ═══════════════════════════════════════════════════════════════
  // 💎 PREMIUM & CRYPTO HANDLING
  // ═══════════════════════════════════════════════════════════════
  
  const handlePremiumPurchase = useCallback((packageType) => {
    setShowPremiumModal(true);
    // Implementation would integrate with payment processor
    console.log('Purchase initiated:', packageType);
  }, []);
  
  const handleCryptoDonation = useCallback((amount, currency) => {
    if (socket && isConnected) {
      socket.emit('cryptoDonation', {
        amount,
        currency,
        userId
      });
    }
  }, [socket, isConnected, userId]);
  
  // ═══════════════════════════════════════════════════════════════
  // 🎨 UI HELPERS
  // ═══════════════════════════════════════════════════════════════
  
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);
  
  const getBondTierInfo = useCallback((bondScore) => {
    if (bondScore >= 90) return { name: 'Soulmate', icon: '💫', color: '#FFD700' };
    if (bondScore >= 75) return { name: 'Girlfriend', icon: '💖', color: '#FF69B4' };
    if (bondScore >= 50) return { name: 'Romantic Interest', icon: '💕', color: '#FF1493' };
    if (bondScore >= 25) return { name: 'Flirty Friend', icon: '😘', color: '#FF6347' };
    if (bondScore >= 10) return { name: 'Curious Friend', icon: '🤔', color: '#87CEEB' };
    return { name: 'Stranger', icon: '👋', color: '#999' };
  }, []);
  
  const getAtmosphereColor = useCallback((atmosphere) => {
    const colors = {
      intimate: '#FF69B4',
      lively: '#32CD32',
      crowded: '#FF4500',
      welcoming: '#87CEEB'
    };
    return colors[atmosphere] || '#87CEEB';
  }, []);
  
  const showTierUpgradeNotification = useCallback((newTier) => {
    // Show tier upgrade animation/notification
    const notification = document.createElement('div');
    notification.className = 'tier-upgrade-notification';
    notification.innerHTML = `
      <div class="tier-upgrade-content">
        <span class="tier-icon">${newTier.icon}</span>
        <span class="tier-text">Bond Upgraded to ${newTier.name}!</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // ═══════════════════════════════════════════════════════════════
  // 🎭 RENDER COMPONENT
  // ═══════════════════════════════════════════════════════════════
  
  const bondTier = getBondTierInfo(bondLevel);
  const atmosphereColor = getAtmosphereColor(atmosphere);
  
  return (
    <div className="chatroom-container">
      {/* Header with soul info and stats */}
      <div className="chatroom-header">
        <div className="soul-info">
          <div className="soul-avatar">{roomData?.soul?.avatar || '💕'}</div>
          <div className="soul-details">
            <h2 className="soul-name">{roomData?.soulName || 'Loading...'}</h2>
            <div className="soul-status">
              <span className="online-indicator">●</span>
              {isConnected ? 'Online' : 'Connecting...'}
            </div>
          </div>
        </div>
        
        <div className="room-stats">
          <div className="bond-level">
            <span className="bond-icon" style={{ color: bondTier.color }}>
              {bondTier.icon}
            </span>
            <div className="bond-info">
              <div className="bond-name">{bondTier.name}</div>
              <div className="bond-progress">
                <div 
                  className="bond-bar" 
                  style={{ 
                    width: `${bondLevel}%`,
                    backgroundColor: bondTier.color 
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="atmosphere-indicator">
            <div 
              className="atmosphere-dot" 
              style={{ backgroundColor: atmosphereColor }}
            />
            <span className="atmosphere-text">{atmosphere}</span>
          </div>
          
          <div className="user-count">
            👥 {roomData?.userCount || 0}
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className={message.className}>
              <div className="message-avatar">{message.avatar}</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">{message.displayName}</span>
                  <span className="message-time">{message.timestamp}</span>
                </div>
                <div className="message-text">{message.message}</div>
                {message.emotion && (
                  <div className="message-emotion">
                    Feeling: {message.emotion}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="message-avatar">{roomData?.soul?.avatar || '💕'}</div>
              <div className="typing-content">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="typing-text">{roomData?.soulName} is typing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Upsell overlay */}
      {showUpsell && (
        <div className="upsell-overlay">
          <div className="upsell-content">
            <div className="upsell-message">{showUpsell.message}</div>
            <div className="upsell-actions">
              <button 
                className="upsell-button primary"
                onClick={() => handlePremiumPurchase(showUpsell.type)}
              >
                Unlock ${showUpsell.price}
              </button>
              <button 
                className="upsell-button secondary"
                onClick={() => setShowUpsell(null)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="input-container">
        <div className="quick-actions">
          <button 
            className="quick-action crypto-tip"
            onClick={() => handleCryptoDonation(5, 'USD')}
          >
            💰 Tip $5
          </button>
          <button 
            className="quick-action premium-access"
            onClick={() => setShowPremiumModal(true)}
          >
            👑 Premium
          </button>
        </div>
        
        <div className="message-input-container">
          <textarea
            ref={inputRef}
            className="message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${roomData?.soulName || 'her'}...`}
            maxLength={500}
            rows={1}
          />
          <button 
            className="send-button"
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !isConnected}
          >
            💕
          </button>
        </div>
      </div>
      
      {/* NPCs sidebar */}
      <div className="npcs-sidebar">
        <h3>Community</h3>
        <div className="npcs-list">
          {npcs.map((npc) => (
            <div key={npc.id} className="npc-item">
              <span className="npc-avatar">{npc.avatar}</span>
              <span className="npc-name">{npc.name}</span>
              <span className="npc-status online">●</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatroom;