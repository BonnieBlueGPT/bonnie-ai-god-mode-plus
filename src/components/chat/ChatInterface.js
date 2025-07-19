import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';
import { 
  calculateTypingDelay, 
  calculateReadDelay, 
  generateMessageId,
  formatLastSeen 
} from '../../utils/messageUtils';

import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputArea from './InputArea';
import PersonalitySelector from '../personality/PersonalitySelector';

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

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
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
      <StatusBar 
        backgroundColor={theme.primary} 
        barStyle={personality.id === 'nova' ? 'light-content' : 'dark-content'} 
      />
      
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

        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.headerIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing indicator */}
        {isTyping && <TypingIndicator visible={isTyping} />}

        {/* Input area */}
        <InputArea 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </KeyboardAvoidingView>

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginTop: 2,
  },
  headerRight: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
});

export default ChatInterface;