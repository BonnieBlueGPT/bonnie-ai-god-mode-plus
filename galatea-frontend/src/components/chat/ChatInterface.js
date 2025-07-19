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
import { usePersonality } from '../../context/PersonalityContext';
import { 
  calculateTypingDelay, 
  calculateReadDelay, 
  generateMessageId,
  formatLastSeen 
} from '../../utils/messageUtils';

// For Phase 1, we'll create simplified versions of these components inline
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
          : [styles.aiBubble, { backgroundColor: theme.bubble }]
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
    </View>
  );
};

const TypingIndicator = ({ visible }) => {
  const { theme, personality } = usePersonality();
  
  if (!visible) return null;
  
  return (
    <View style={styles.messageContainer}>
      <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
        <Text style={styles.avatarText}>{personality.avatar}</Text>
      </View>
      <View style={[styles.typingBubble, { backgroundColor: theme.bubble }]}>
        <Text style={[styles.typingText, { color: theme.text }]}>
          {personality.name} is typing...
        </Text>
        <Text style={styles.dots}>...</Text>
      </View>
    </View>
  );
};

const InputArea = ({ onSendMessage, disabled }) => {
  const { theme } = usePersonality();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim().length > 0 && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
      <View style={styles.inputWrapper}>
        <Text 
          style={[styles.textInput, { color: theme.text }]}
          onPress={() => {
            Alert.prompt(
              'Send Message',
              'Type your message:',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send', onPress: (text) => text && handleSend(text) }
              ],
              'plain-text',
              message
            );
          }}
        >
          {message || 'Tap to type message...'}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.sendButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          Alert.prompt(
            'Send Message',
            'Type your message:',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Send', onPress: (text) => text && onSendMessage(text) }
            ],
            'plain-text'
          );
        }}
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
  const { personality, theme } = usePersonality();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const [lastSeen, setLastSeen] = useState(new Date().toISOString());
  const flatListRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: generateMessageId(),
      text: personality.sampleResponses.sweet[0],
      isUser: false,
      timestamp: new Date().toISOString(),
      emotion: 'sweet',
      isRead: false,
      isDelivered: true
    };
    
    setMessages([welcomeMessage]);
    
    // Simulate "read" after delay
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === welcomeMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, calculateReadDelay());
    
  }, [personality]);

  const simulateAIResponse = (userMessage) => {
    const typingDelay = calculateTypingDelay(userMessage, personality.typingStyle, 'sweet');
    
    setIsTyping(true);
    setLastSeen(new Date().toISOString());

    setTimeout(() => {
      setIsTyping(false);
      
      // Choose random response based on escalation (using sweet for now)
      const responses = personality.sampleResponses.sweet;
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: generateMessageId(),
        text: responseText,
        isUser: false,
        timestamp: new Date().toISOString(),
        emotion: 'sweet',
        isRead: false,
        isDelivered: true
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-read after delay
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id ? { ...msg, isRead: true } : msg
        ));
      }, calculateReadDelay());
      
    }, typingDelay);
  };

  const handleSendMessage = (messageText) => {
    const userMessage = {
      id: generateMessageId(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: false
    };

    setMessages(prev => [...prev, userMessage]);

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

    // Trigger AI response
    simulateAIResponse(messageText);
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
              {isTyping ? 'typing...' : formatLastSeen(lastSeen)}
            </Text>
          </View>
        </TouchableOpacity>
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
      {isTyping && <TypingIndicator visible={isTyping} />}

      {/* Input area */}
      <InputArea 
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />

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