import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';

const MessageBubble = ({ 
  message, 
  isUser = false, 
  showTimestamp = false,
  isRead = false,
  isDelivered = false,
  onLongPress = null,
  emotion = 'sweet'
}) => {
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
    const emotionStyles = {
      sweet: { 
        shadowColor: theme.primary,
        shadowOpacity: 0.3
      },
      flirty: { 
        shadowColor: theme.accent,
        shadowOpacity: 0.4
      },
      sexual: { 
        shadowColor: '#FF4500',
        shadowOpacity: 0.5
      },
      dominant: { 
        shadowColor: theme.secondary,
        shadowOpacity: 0.6
      }
    };
    return emotionStyles[emotion] || emotionStyles.sweet;
  };

  const bubbleStyle = [
    styles.bubble,
    isUser ? [styles.userBubble, { backgroundColor: theme.primary }] : [styles.aiBubble, { backgroundColor: theme.bubble }],
    !isUser && getEmotionStyle(emotion),
    {
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3
    }
  ];

  const textStyle = [
    styles.messageText,
    { 
      color: isUser ? '#FFFFFF' : theme.text,
      fontSize: 16,
      lineHeight: 22
    }
  ];

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}
    >
      {/* Avatar for AI messages */}
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
          <Text style={styles.avatarText}>{personality.avatar}</Text>
        </View>
      )}
      
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message.text || message}</Text>
        
        {/* Timestamp and status indicators */}
        <View style={styles.messageFooter}>
          {showTimestamp && (
            <Text style={[styles.timestamp, { color: isUser ? '#FFFFFF80' : theme.text + '80' }]}>
              {formatTime(message.timestamp || new Date())}
            </Text>
          )}
          
          {/* Read/Delivered status for user messages */}
          {isUser && (
            <View style={styles.statusContainer}>
              <Text style={[styles.status, { color: '#FFFFFF80' }]}>
                {isRead ? '✓✓' : isDelivered ? '✓' : '⏱'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  statusContainer: {
    marginLeft: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MessageBubble;