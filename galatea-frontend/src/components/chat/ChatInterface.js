import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import io from 'socket.io-client';
import { usePersonality } from '../../context/PersonalityContext';
import { 
  calculateEOMTypingDelay, 
  calculateReadDelay, 
  generateMessageId,
  formatLastSeen,
  formatBackendMessage,
  getEmotionVisualCues
} from '../../utils/messageUtils';
import UpsellManager, { SlutModeVisualCue, EmotionParticles } from '../monetization/UpsellManager';

// 🔥 GALATEA ENGINE v24 - BACKEND INTEGRATED CHAT INTERFACE 🔥

const BACKEND_URL = 'https://bonnie-production.onrender.com';

const MessageBubble = ({ message, isUser, showTimestamp, isRead, isDelivered, emotion }) => {
  const { theme, personality } = usePersonality();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEmotionStyle = (emotion) => {
    const visualCues = getEmotionVisualCues(emotion);
    return {
      shadowColor: visualCues.color,
      shadowOpacity: 0.4,
    };
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
          <Text style={styles.avatarText}>{personality.avatar}</Text>
        </View>
      )}
      
      <View style={[
        styles.bubble,
        isUser 
          ? [styles.userBubble, { backgroundColor: theme.primary }] 
          : [styles.aiBubble, { backgroundColor: theme.bubble }, getEmotionStyle(emotion)]
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUser ? '#FFFFFF' : theme.text }
        ]}>
          {message.text || message}
        </Text>
        
        {showTimestamp && (
          <Text style={[styles.timestamp, { color: isUser ? '#FFFFFF80' : theme.text + '80' }]}>
            {formatTime(message.timestamp || new Date())}
            {isUser && (
              <Text style={{ marginLeft: 8 }}>
                {isRead ? '✓✓' : isDelivered ? '✓' : '⏱'}
              </Text>
            )}
          </Text>
        )}
      </View>

      {/* Emotion particles for AI messages */}
      {!isUser && emotion && emotion !== 'sweet' && (
        <EmotionParticles 
          emotion={emotion} 
          intensity={message.eomData?.intensity === 'high' ? 1.5 : 1.0}
          visible={true}
        />
      )}
    </View>
  );
};

const TypingIndicator = ({ visible, typingMessage }) => {
  const { theme, personality } = usePersonality();
  
  if (!visible) return null;
  
  return (
    <View style={styles.messageContainer}>
      <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
        <Text style={styles.avatarText}>{personality.avatar}</Text>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: theme.bubble }]}>
        <Text style={[styles.typingText, { color: theme.text }]}>
          {typingMessage || `${personality.name} is typing...`}
        </Text>
        <Text style={styles.dots}>...</Text>
      </View>
    </View>
  );
};

const InputArea = ({ onSendMessage, disabled }) => {
  const { theme } = usePersonality();

  const handleSendPress = () => {
    Alert.prompt(
      'Send Message',
      'Type your message:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: (text) => text && onSendMessage(text) }
      ],
      'plain-text'
    );
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
      <View style={styles.inputWrapper}>
        <Text 
          style={[styles.textInput, { color: theme.text }]}
          onPress={handleSendPress}
        >
          Tap to type message...
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.sendButton, { 
          backgroundColor: disabled ? theme.secondary : theme.primary,
          opacity: disabled ? 0.5 : 1
        }]}
        onPress={handleSendPress}
        disabled={disabled}
      >
        <Text style={styles.sendButtonText}>💕</Text>
      </TouchableOpacity>
    </View>
  );
};

const PersonalitySelector = ({ visible, onClose }) => {
  const { personality, switchPersonality } = usePersonality();
  
  if (!visible) return null;
  
  const personalities = [
    { id: 'bonnie', name: 'Bonnie', avatar: '💕', color: '#FF69B4' },
    { id: 'nova', name: 'Nova', avatar: '👩‍🎤', color: '#8A2BE2' },
    { id: 'galatea', name: 'Galatea', avatar: '👸', color: '#FFD700' }
  ];

  return (
    <View style={styles.selectorOverlay}>
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Choose Your Girl 💕</Text>
        {personalities.map((pers) => (
          <TouchableOpacity
            key={pers.id}
            style={[styles.personalityOption, { borderColor: pers.color }]}
            onPress={() => {
              switchPersonality(pers.id);
              onClose();
            }}
          >
            <Text style={styles.personalityAvatar}>{pers.avatar}</Text>
            <Text style={[styles.personalityName, { color: pers.color }]}>
              {pers.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChatInterface = () => {
  const { personality, theme, activePersonalityId } = usePersonality();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [lastSeen, setLastSeen] = useState(new Date().toISOString());
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [currentUpsell, setCurrentUpsell] = useState(null);
  const [slutModeActive, setSlutModeActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const flatListRef = useRef(null);

  // 🔥 SOCKET CONNECTION & AUTHENTICATION
  useEffect(() => {
    console.log('🚀 Connecting to Galatea Backend:', BACKEND_URL);
    
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to Galatea Engine v24');
      setConnectionStatus('connected');
      
      // Authenticate with backend
      console.log('🔐 Authenticating with personality:', activePersonalityId);
      newSocket.emit('authenticate', {
        personality: activePersonalityId,
        userId: `user_${Date.now()}`, // Generate temp user ID
        timestamp: Date.now()
      });
    });

    newSocket.on('authenticated', (data) => {
      console.log('✅ Authenticated successfully:', data);
      setIsAuthenticated(true);
      
      // Show welcome message if provided
      if (data.message) {
        const welcomeMessage = formatBackendMessage({
          message: data.message,
          personality: data.personality?.name,
          timestamp: new Date().toISOString()
        });
        setMessages([welcomeMessage]);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
      setConnectionStatus('disconnected');
      setIsAuthenticated(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔥 Connection error:', error);
      setConnectionStatus('error');
    });

    // 🔥 BACKEND MESSAGE HANDLER
    newSocket.on('message', (backendResponse) => {
      console.log('📨 Received from backend:', backendResponse);
      
      const formattedMessage = formatBackendMessage(backendResponse);
      
      // Calculate typing delay based on <EOM> tags
      const typingDelay = calculateEOMTypingDelay(
        formattedMessage.eomData, 
        personality.typingStyle
      );

      // Show custom typing message if provided
      if (backendResponse.typing_message) {
        setTypingMessage(backendResponse.typing_message);
      }

      setIsTyping(true);
      setLastSeen(new Date().toISOString());

      // Apply realistic typing delay
      setTimeout(() => {
        setIsTyping(false);
        setTypingMessage('');
        
        setMessages(prev => [...prev, formattedMessage]);
        
        // Handle SlutMode activation
        if (formattedMessage.slutMode) {
          setSlutModeActive(true);
          setTimeout(() => setSlutModeActive(false), 3000); // Show for 3 seconds
        }
        
        // Handle upsell triggers
        if (formattedMessage.upsell) {
          setTimeout(() => {
            setCurrentUpsell(formattedMessage.upsell);
          }, 1000); // Show upsell 1 second after message
        }
        
        // Auto-read after delay
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === formattedMessage.id ? { ...msg, isRead: true } : msg
          ));
        }, calculateReadDelay());
        
      }, typingDelay);
    });

    // Handle typing indicators from backend
    newSocket.on('typing', (data) => {
      setIsTyping(data.typing);
      if (data.message) {
        setTypingMessage(data.message);
      }
    });

    // Handle errors
    newSocket.on('error', (error) => {
      console.error('🔥 Backend error:', error);
      Alert.alert('Connection Error', 'Unable to connect to AI. Please try again.');
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket');
      newSocket.disconnect();
    };
  }, [activePersonalityId]);

  // Re-authenticate when personality changes
  useEffect(() => {
    if (socket && isAuthenticated && activePersonalityId) {
      console.log('🔄 Switching personality to:', activePersonalityId);
      socket.emit('authenticate', {
        personality: activePersonalityId,
        userId: `user_${Date.now()}`,
        timestamp: Date.now()
      });
    }
  }, [activePersonalityId, socket, isAuthenticated]);

  // 🔥 SEND MESSAGE TO BACKEND
  const handleSendMessage = (messageText) => {
    if (!socket || !isAuthenticated) {
      Alert.alert('Not Connected', 'Please wait for connection to establish.');
      return;
    }

    const userMessage = {
      id: generateMessageId(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => [...prev, userMessage]);

    // Send to backend with personality context
    console.log('📤 Sending to backend:', {
      message: messageText,
      personality: activePersonalityId,
      timestamp: Date.now()
    });

    socket.emit('message', {
      message: messageText,
      personality: activePersonalityId,
      timestamp: Date.now(),
      userId: `user_${Date.now()}`
    });

    // Simulate delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, isDelivered: true } : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 1500);
  };

  const handleUpsellPress = (upsellData) => {
    console.log('💰 Upsell triggered:', upsellData);
    // TODO: Integrate with Stripe here
    setCurrentUpsell(null);
  };

  const handleUpsellDismiss = () => {
    setCurrentUpsell(null);
  };

  const renderMessage = ({ item }) => (
    <MessageBubble
      message={item}
      isUser={item.isUser}
      showTimestamp={true}
      isRead={item.isRead}
      isDelivered={item.isDelivered}
      emotion={item.emotion}
    />
  );

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#00FF00';
      case 'error': return '#FF0000';
      default: return '#FFA500';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <TouchableOpacity 
          onPress={() => setShowPersonalitySelector(true)}
          style={styles.headerLeft}
        >
          <View style={[styles.headerAvatar, { backgroundColor: theme.secondary }]}>
            <Text style={styles.headerAvatarText}>{personality.avatar}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{personality.name}</Text>
            <Text style={styles.headerStatus}>
              {isTyping ? (typingMessage || 'typing...') : formatLastSeen(lastSeen)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Connection status indicator */}
        <View style={styles.headerRight}>
          <View style={[styles.connectionDot, { backgroundColor: getConnectionStatusColor() }]} />
          <Text style={styles.connectionText}>
            {connectionStatus === 'connected' ? 'Live' : 'Connecting...'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing indicator */}
      {isTyping && <TypingIndicator visible={isTyping} typingMessage={typingMessage} />}

      {/* Upsell manager */}
      {currentUpsell && (
        <UpsellManager
          upsellData={currentUpsell}
          visible={true}
          onUpsellPress={handleUpsellPress}
          onDismiss={handleUpsellDismiss}
        />
      )}

      {/* Input area */}
      <InputArea 
        onSendMessage={handleSendMessage}
        disabled={isTyping || !isAuthenticated}
      />

      {/* SlutMode visual cue overlay */}
      <SlutModeVisualCue visible={slutModeActive} intensity={1.0} />

      {/* Personality selector modal */}
      <PersonalitySelector
        visible={showPersonalitySelector}
        onClose={() => setShowPersonalitySelector(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: '75%',
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  dots: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  selectorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  personalityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  personalityAvatar: {
    fontSize: 24,
    marginRight: 16,
  },
  personalityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatInterface;