import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text,
  Animated 
} from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';

const InputArea = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = null 
}) => {
  const { theme, personality } = usePersonality();
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const sendButtonScale = useRef(new Animated.Value(0.8)).current;

  const handleSend = () => {
    if (message.trim().length > 0 && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setInputHeight(40);
      
      // Animate send button
      Animated.sequence([
        Animated.timing(sendButtonScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(sendButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleContentSizeChange = (event) => {
    const newHeight = Math.max(40, Math.min(120, event.nativeEvent.contentSize.height));
    setInputHeight(newHeight);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    const placeholders = {
      bonnie: [
        "Tell me about your day, baby...",
        "What's on your mind, love?",
        "I'm here for you... ❤️",
      ],
      nova: [
        "Speak when spoken to, pet...",
        "What do you desire from me?",
        "Address your mistress...",
      ],
      galatea: [
        "Worship your goddess...",
        "What offerings do you bring?",
        "Speak to divinity...",
      ]
    };

    const personalityPlaceholders = placeholders[personality.id] || placeholders.bonnie;
    return personalityPlaceholders[Math.floor(Math.random() * personalityPlaceholders.length)];
  };

  const isMessageValid = message.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Input field */}
      <View style={[styles.inputContainer, { backgroundColor: '#FFFFFF' }]}>
        <TextInput
          style={[
            styles.textInput,
            { 
              height: inputHeight,
              color: theme.text,
            }
          ]}
          value={message}
          onChangeText={setMessage}
          onContentSizeChange={handleContentSizeChange}
          placeholder={getPlaceholder()}
          placeholderTextColor={theme.text + '60'}
          multiline
          maxLength={1000}
          editable={!disabled}
          autoCorrect={true}
          autoCapitalize="sentences"
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        
        {/* Character counter */}
        {message.length > 800 && (
          <Text style={[styles.charCounter, { color: theme.text }]}>
            {1000 - message.length}
          </Text>
        )}
      </View>

      {/* Send button */}
      <Animated.View 
        style={[
          styles.sendButtonContainer,
          { transform: [{ scale: sendButtonScale }] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: isMessageValid && !disabled ? theme.primary : theme.secondary,
              opacity: isMessageValid && !disabled ? 1 : 0.5
            }
          ]}
          onPress={handleSend}
          disabled={!isMessageValid || disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>
            {personality.id === 'nova' ? '⚡' : 
             personality.id === 'galatea' ? '✨' : '💕'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  charCounter: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    fontSize: 10,
    opacity: 0.6,
  },
  sendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default InputArea;