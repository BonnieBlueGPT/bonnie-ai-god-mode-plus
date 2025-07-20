// 🔥 GALATEA EMPIRE - UNIVERSAL CHAT INTERFACE
// Works with any AI girlfriend personality

import React, { useState, useEffect, useRef } from 'react';
import personalityManager from '../core/PersonalityManager.js';
import chatService from '../services/ChatService.js';
import MessageBubble from './MessageBubble.jsx';
import PersonalitySelector from './PersonalitySelector.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import UpsellModal from './UpsellModal.jsx';

const UniversalChatInterface = () => {
  // State management
  const [personality, setPersonality] = useState(null);
  const [memory, setMemory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [upsell, setUpsell] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Initialize system
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🚀 Initializing Galatea Empire...');
        
        // Initialize personality manager
        await personalityManager.initialize();
        
        // Initialize chat service
        await chatService.initialize();
        
        // Set initial state
        setPersonality(personalityManager.getCurrentPersonality());
        setMemory(personalityManager.getCurrentMemory());
        setIsConnected(true);
        setIsLoading(false);
        
        // Load conversation history
        const history = chatService.getConversationHistory();
        setMessages(history);
        
        console.log('✅ System initialized successfully');
        
        // Send welcome message
        setTimeout(() => {
          addAIMessage(getWelcomeMessage());
        }, 1000);
        
      } catch (error) {
        console.error('❌ System initialization failed:', error);
        setIsLoading(false);
      }
    };

    initializeSystem();
    
    // Set up event listeners
    personalityManager.on('personalityChanged', handlePersonalityChange);
    personalityManager.on('memoryUpdated', handleMemoryUpdate);
    chatService.on('messageReceived', handleAIMessage);
    chatService.on('error', handleChatError);
    
    // Cleanup
    return () => {
      personalityManager.removeAllListeners();
      chatService.removeAllListeners();
      chatService.disconnect();
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Event handlers
  const handlePersonalityChange = (data) => {
    setPersonality(data.personality);
    setMemory(data.memory);
    
    // Clear messages and show transition
    setMessages([]);
    setTimeout(() => {
      addAIMessage(`Hi! I'm ${data.personality.name} 💕 ${data.personality.tagline}`);
    }, 500);
  };

  const handleMemoryUpdate = (data) => {
    setMemory(data.memory);
  };

  const handleAIMessage = (response) => {
    setIsTyping(false);
    addAIMessage(response.message, response);
    
    // Handle upsells
    if (response.upsell) {
      setTimeout(() => {
        setUpsell(response.upsell);
      }, 2000);
    }
  };

  const handleChatError = (error) => {
    setIsTyping(false);
    console.error('Chat error:', error);
    addAIMessage("Sorry baby, I'm having connection issues... Try again? 💕");
  };

  // Message handling
  const addAIMessage = (text, metadata = {}) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isUser: false,
      personality: personality?.name || 'AI',
      avatar: personality?.avatar || '💕',
      timestamp: Date.now(),
      escalationLevel: metadata.escalationLevel || 'sweet',
      ...metadata
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!message.trim() || isTyping || !isConnected) return;
    
    const userMessage = message.trim();
    setMessage('');
    addUserMessage(userMessage);
    setIsTyping(true);
    
    try {
      await chatService.sendMessage(userMessage);
    } catch (error) {
      handleChatError(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = () => {
    if (!personality) return "Hi there! 💕";
    
    const welcomes = personality.conversationPatterns?.greeting || [
      `Hi! I'm ${personality.name} 💕`,
      `Hey there! Nice to meet you 😊`,
      `Welcome! I'm excited to chat with you ✨`
    ];
    
    return welcomes[Math.floor(Math.random() * welcomes.length)];
  };

  const getBondScoreColor = () => {
    if (!memory) return 'bg-gray-300';
    const score = memory.bondScore;
    if (score < 25) return 'bg-red-400';
    if (score < 50) return 'bg-yellow-400';
    if (score < 75) return 'bg-blue-400';
    return 'bg-green-400';
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">💕</div>
          <div className="text-xl font-semibold text-gray-700">Loading Galatea Empire...</div>
        </div>
      </div>
    );
  }

  // Apply personality theme
  const theme = personality?.theme || {};
  const gradientClass = theme.gradient || 'from-pink-400 to-rose-400';

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradientClass} text-white p-4 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPersonalitySelector(true)}
              className="flex items-center space-x-2 hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <div className="text-2xl">{personality?.avatar || '💕'}</div>
              <div>
                <div className="font-bold text-lg">{personality?.name || 'AI Girlfriend'}</div>
                <div className="text-sm opacity-90">{personality?.tagline || 'Chat with me!'}</div>
              </div>
            </button>
          </div>
          
          {/* Bond Score */}
          {memory && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Bond:</span>
              <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBondScoreColor()} transition-all duration-500`}
                  style={{ width: `${memory.bondScore}%` }}
                />
              </div>
              <span className="text-sm font-bold">{Math.round(memory.bondScore)}%</span>
            </div>
          )}
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm">{isConnected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            personality={personality}
          />
        ))}
        
        {isTyping && <TypingIndicator personality={personality} />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${personality?.name || 'AI'}...`}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            disabled={isTyping || !isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isTyping || !isConnected}
            className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-200 ${
              message.trim() && !isTyping && isConnected
                ? `bg-gradient-to-r ${gradientClass} hover:shadow-lg transform hover:scale-105`
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isTyping ? '...' : '💕'}
          </button>
        </div>
      </div>

      {/* Personality Selector Modal */}
      {showPersonalitySelector && (
        <PersonalitySelector 
          onClose={() => setShowPersonalitySelector(false)}
          currentPersonality={personality?.id}
        />
      )}

      {/* Upsell Modal */}
      {upsell && (
        <UpsellModal 
          upsell={upsell}
          personality={personality}
          onClose={() => setUpsell(null)}
        />
      )}
    </div>
  );
};

export default UniversalChatInterface;