import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';

const TypingIndicator = ({ visible = false, message = null }) => {
  const { theme, personality } = usePersonality();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in the typing indicator
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start the breathing animation
      const createPulse = (animValue, delay = 0) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 600,
              easing: Easing.bezier(0.4, 0.0, 0.2, 1),
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation1 = createPulse(dot1, 0);
      const animation2 = createPulse(dot2, 200);
      const animation3 = createPulse(dot3, 400);

      animation1.start();
      animation2.start();
      animation3.start();

      return () => {
        animation1.stop();
        animation2.stop();
        animation3.stop();
      };
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getTypingMessage = () => {
    const messages = {
      bonnie: [
        `${personality.name} is typing...`,
        `${personality.name} is thinking of you...`,
        `${personality.name} is choosing her words carefully...`,
      ],
      nova: [
        `${personality.name} is commanding a response...`,
        `${personality.name} is preparing your orders...`,
        `${personality.name} is deciding your fate...`,
      ],
      galatea: [
        `${personality.name} is crafting divine words...`,
        `${personality.name} is blessing you with wisdom...`,
        `${personality.name} is speaking from the heavens...`,
      ]
    };

    const personalityMessages = messages[personality.id] || messages.bonnie;
    return message || personalityMessages[Math.floor(Math.random() * personalityMessages.length)];
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ 
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }
      ]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
        <Text style={styles.avatarText}>{personality.avatar}</Text>
      </View>

      {/* Typing bubble */}
      <View style={[styles.typingBubble, { backgroundColor: theme.bubble }]}>
        <View style={styles.dotsContainer}>
          <Animated.View 
            style={[
              styles.dot, 
              { 
                backgroundColor: theme.primary,
                transform: [{ 
                  scale: dot1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.2]
                  })
                }],
                opacity: dot1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1]
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                backgroundColor: theme.primary,
                transform: [{ 
                  scale: dot2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.2]
                  })
                }],
                opacity: dot2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1]
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                backgroundColor: theme.primary,
                transform: [{ 
                  scale: dot3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.2]
                  })
                }],
                opacity: dot3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1]
                })
              }
            ]} 
          />
        </View>
        
        {/* Typing status text */}
        <Text style={[styles.typingText, { color: theme.text }]}>
          {getTypingMessage()}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: '75%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default TypingIndicator;