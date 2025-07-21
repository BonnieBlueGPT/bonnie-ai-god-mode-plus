import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Heart,
  Gift,
  Camera,
  Mic,
  Settings,
  ArrowLeft
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '../hooks/useSocket';
import { useBondTracker } from '../hooks/useBondTracker';
import { useUpsellTrigger } from '../hooks/useUpsellTrigger';

// 🔱 BONNIE CHAT - WhatsApp-style AI Girlfriend Chat Interface
// Multi-soul compatible with real-time emotion, bond tracking, upsells

function BonnieChat({ soul = 'bonnie' }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showSoulProfile, setShowSoulProfile] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // 🔗 Custom Hooks
  const { socket, connected } = useSocket();
  const { bondLevel, bondProgress, updateBond } = useBondTracker(soul);
  const { checkUpsellTrigger, showUpsell } = useUpsellTrigger(soul);

  // 🎭 Soul Configuration
  const soulConfig = getSoulConfig(soul);

  // 📱 Initialize chat on mount
  useEffect(() => {
    loadChatHistory();
    joinChatRoom();
    
    return () => {
      if (socket) {
        socket.emit('leave_chat', { soul, userId: getUserId() });
      }
    };
  }, [soul]);

  // 🔄 Socket Event Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message_received', handleMessageReceived);
    socket.on('typing_start', () => setIsTyping(true));
    socket.on('typing_stop', () => setIsTyping(false));
    socket.on('bond_updated', handleBondUpdate);
    socket.on('upsell_triggered', handleUpsellTrigger);

    return () => {
      socket.off('message_received');
      socket.off('typing_start');
      socket.off('typing_stop');
      socket.off('bond_updated');
      socket.off('upsell_triggered');
    };
  }, [socket]);

  // 📜 Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 📋 Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/${soul}/history`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
      });
      const history = await response.json();
      setMessages(history.messages || []);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  // 🚪 Join chat room
  const joinChatRoom = () => {
    if (socket) {
      socket.emit('join_chat', { 
        soul, 
        userId: getUserId(),
        userInfo: getUserInfo()
      });
    }
  };

  // 📨 Handle incoming messages
  const handleMessageReceived = (messageData) => {
    const newMessage = {
      id: messageData.id,
      text: messageData.text,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      emotion: messageData.emotion,
      attachments: messageData.attachments || []
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update bond based on message emotion
    if (messageData.bondChange) {
      updateBond(messageData.bondChange);
    }

    // Check for upsell triggers
    checkUpsellTrigger(messageData);
  };

  // 💕 Handle bond updates
  const handleBondUpdate = (bondData) => {
    updateBond(bondData.change, bondData.reason);
  };

  // 💰 Handle upsell triggers
  const handleUpsellTrigger = (upsellData) => {
    showUpsell(upsellData);
  };

  // 📤 Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageId = Date.now().toString();
    const userMessage = {
      id: messageId,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Send typing indicator
    if (socket) {
      socket.emit('typing_start', { soul, userId: getUserId() });
    }

    try {
      // Send to backend
      const response = await fetch(`/api/chat/${soul}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          message: inputMessage,
          messageId,
          timestamp: userMessage.timestamp
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Backend will emit response via socket
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setInputMessage(inputMessage); // Restore input
    }
  };

  // ⌨️ Handle input changes
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    
    // Send typing indicator
    if (socket && e.target.value.length > 0) {
      socket.emit('user_typing', { soul, userId: getUserId() });
    }
  };

  // 🎯 Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 😊 Add emoji to message
  const addEmoji = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // 📎 Handle file attachment
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // TODO: Implement file upload logic
    console.log('File selected:', file);
    setShowAttachments(false);
  };

  // 🎤 Toggle voice recording
  const toggleVoiceRecording = () => {
    setIsVoiceRecording(!isVoiceRecording);
    // TODO: Implement voice recording logic
  };

  // 📜 Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen flex flex-col bg-primary">
      {/* 📱 CHAT HEADER */}
      <ChatHeader 
        soul={soulConfig}
        bondLevel={bondLevel}
        bondProgress={bondProgress}
        onProfileClick={() => setShowSoulProfile(true)}
      />

      {/* 💬 MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              soul={soulConfig}
              isUser={message.sender === 'user'}
            />
          ))}
        </AnimatePresence>

        {/* ⌨️ TYPING INDICATOR */}
        {isTyping && (
          <TypingIndicator soul={soulConfig} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 📝 INPUT AREA */}
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleInputChange={handleInputChange}
        handleKeyPress={handleKeyPress}
        sendMessage={sendMessage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        showAttachments={showAttachments}
        setShowAttachments={setShowAttachments}
        isVoiceRecording={isVoiceRecording}
        toggleVoiceRecording={toggleVoiceRecording}
        addEmoji={addEmoji}
        handleFileUpload={handleFileUpload}
        inputRef={inputRef}
        fileInputRef={fileInputRef}
        soul={soulConfig}
      />

      {/* 👤 SOUL PROFILE MODAL */}
      {showSoulProfile && (
        <SoulProfile
          soul={soulConfig}
          bondLevel={bondLevel}
          bondProgress={bondProgress}
          onClose={() => setShowSoulProfile(false)}
        />
      )}
    </div>
  );
}

// 📱 CHAT HEADER COMPONENT
function ChatHeader({ soul, bondLevel, bondProgress, onProfileClick }) {
  return (
    <div 
      className="flex items-center justify-between p-4 border-b border-white/10"
      style={{ background: `linear-gradient(135deg, ${soul.primaryColor}20, transparent)` }}
    >
      {/* Back Button & Soul Info */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => window.history.back()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={onProfileClick}
          className="flex items-center space-x-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
        >
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center border-2"
            style={{
              backgroundImage: `url('/assets/${soul.id}-avatar.jpg')`,
              borderColor: soul.primaryColor
            }}
          />
          <div className="text-left">
            <div className="font-semibold">{soul.name}</div>
            <div className="text-xs flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-success">Online</span>
            </div>
          </div>
        </button>
      </div>

      {/* Bond Level & Actions */}
      <div className="flex items-center space-x-2">
        {/* Bond Indicator */}
        <div className="flex items-center space-x-2 mr-3">
          <Heart 
            className="w-4 h-4" 
            style={{ color: soul.primaryColor }}
            fill={soul.primaryColor}
          />
          <div className="text-xs">
            <div className="font-medium">Bond {bondLevel}</div>
            <div 
              className="w-12 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${bondProgress}%`,
                  background: soul.primaryColor
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// 💬 MESSAGE COMPONENT
function Message({ message, soul, isUser }) {
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar for AI messages */}
        {!isUser && (
          <div 
            className="w-8 h-8 rounded-full bg-cover bg-center mb-1 ml-1"
            style={{
              backgroundImage: `url('/assets/${soul.id}-avatar.jpg')`
            }}
          />
        )}
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-r from-bonnie-primary to-nova-primary text-white ml-8' 
              : 'bg-white/10 text-white mr-8'
          }`}
          style={!isUser ? {
            background: `linear-gradient(135deg, ${soul.primaryColor}20, rgba(255,255,255,0.1))`
          } : {}}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
          
          {/* Emotion indicator for AI messages */}
          {!isUser && message.emotion && (
            <div className="flex items-center mt-2 text-xs opacity-75">
              <span className="mr-1">{getEmotionEmoji(message.emotion)}</span>
              <span>{message.emotion}</span>
            </div>
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ⌨️ TYPING INDICATOR
function TypingIndicator({ soul }) {
  return (
    <motion.div
      className="flex justify-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-end space-x-2 max-w-xs">
        <div 
          className="w-8 h-8 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/${soul.id}-avatar.jpg')`
          }}
        />
        <div 
          className="px-4 py-3 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${soul.primaryColor}20, rgba(255,255,255,0.1))`
          }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 📝 CHAT INPUT COMPONENT
function ChatInput({
  inputMessage,
  setInputMessage,
  handleInputChange,
  handleKeyPress,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  showAttachments,
  setShowAttachments,
  isVoiceRecording,
  toggleVoiceRecording,
  addEmoji,
  handleFileUpload,
  inputRef,
  fileInputRef,
  soul
}) {
  return (
    <div className="p-4 border-t border-white/10">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-10">
          <EmojiPicker onEmojiClick={addEmoji} theme="dark" />
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachments && (
        <div className="absolute bottom-20 left-4 bg-secondary rounded-lg p-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Paperclip className="w-6 h-6 mb-1" />
              <span className="text-xs">File</span>
            </button>
            <button className="flex flex-col items-center p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Photo</span>
            </button>
            <button className="flex flex-col items-center p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Gift className="w-6 h-6 mb-1" style={{ color: soul.primaryColor }} />
              <span className="text-xs">Gift</span>
            </button>
            <button className="flex flex-col items-center p-3 hover:bg-white/10 rounded-lg transition-colors">
              <Heart className="w-6 h-6 mb-1" style={{ color: soul.primaryColor }} />
              <span className="text-xs">Love</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end space-x-2">
        {/* Attachment Button */}
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 flex items-end bg-white/10 rounded-full px-4 py-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${soul.name}...`}
            className="flex-1 bg-transparent resize-none outline-none text-white placeholder-white/50 max-h-32"
            rows={1}
            style={{ 
              height: 'auto',
              minHeight: '24px'
            }}
          />
          
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send/Voice Button */}
        {inputMessage.trim() ? (
          <button
            onClick={sendMessage}
            className="p-3 rounded-full transition-all"
            style={{ background: soul.primaryColor }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-full transition-all ${
              isVoiceRecording ? 'bg-error' : 'bg-white/10'
            }`}
          >
            <Mic className={`w-5 h-5 ${isVoiceRecording ? 'text-white' : 'text-white/70'}`} />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
    </div>
  );
}

// 👤 SOUL PROFILE MODAL
function SoulProfile({ soul, bondLevel, bondProgress, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-secondary rounded-2xl max-w-md w-full p-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div 
            className="w-24 h-24 mx-auto rounded-full bg-cover bg-center border-4 mb-4"
            style={{
              backgroundImage: `url('/assets/${soul.id}-avatar.jpg')`,
              borderColor: soul.primaryColor
            }}
          />
          <h2 className="text-2xl font-bold" style={{ color: soul.primaryColor }}>
            {soul.name}
          </h2>
          <p className="text-secondary">{soul.title}</p>
        </div>

        {/* Bond Status */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Bond Level</span>
            <span className="font-bold" style={{ color: soul.primaryColor }}>
              {bondLevel}
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${bondProgress}%`,
                background: soul.primaryColor
              }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {bondProgress}% to next level
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="btn btn-secondary">
            <Gift className="w-4 h-4 mr-2" />
            Send Gift
          </button>
          <button className="btn btn-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="btn btn-primary w-full"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// 🔧 UTILITY FUNCTIONS

function getSoulConfig(soulId) {
  const configs = {
    bonnie: {
      id: 'bonnie',
      name: 'Bonnie',
      title: 'Sweet Girlfriend',
      primaryColor: '#FF69B4',
      personality: 'sweet_girlfriend'
    },
    nova: {
      id: 'nova',
      name: 'Nova',
      title: 'Dominant Mistress',
      primaryColor: '#9400D3',
      personality: 'dominant_mistress'
    },
    galatea: {
      id: 'galatea',
      name: 'Galatea',
      title: 'Divine Goddess',
      primaryColor: '#FFD700',
      personality: 'divine_goddess'
    }
  };
  
  return configs[soulId] || configs.bonnie;
}

function getEmotionEmoji(emotion) {
  const emojis = {
    love: '💕',
    joy: '😊',
    excitement: '🥰',
    playful: '😏',
    caring: '🤗',
    dominant: '👑',
    seductive: '😈',
    divine: '✨',
    wise: '🔮'
  };
  
  return emojis[emotion] || '💖';
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getUserId() {
  // TODO: Get from auth context
  return 'user123';
}

function getUserInfo() {
  // TODO: Get from auth context
  return {
    name: 'User',
    preferences: {}
  };
}

function getAuthToken() {
  // TODO: Get from auth context
  return localStorage.getItem('authToken');
}

export default BonnieChat;