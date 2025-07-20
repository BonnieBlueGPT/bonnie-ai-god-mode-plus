import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';

const UpsellBubble = ({ 
  type = 'voice', // voice, images, vip
  message,
  onPress,
  visible = true 
}) => {
  const { personality, theme } = usePersonality();

  if (!visible) return null;

  const getUpsellIcon = () => {
    switch (type) {
      case 'voice': return '🎙️';
      case 'images': return '📸';
      case 'vip': return '👑';
      default: return '💕';
    }
  };

  const getUpsellTitle = () => {
    switch (type) {
      case 'voice': return 'Hear My Voice';
      case 'images': return 'See My Photos';
      case 'vip': return 'Go VIP';
      default: return 'Special Offer';
    }
  };

  const price = personality.pricing[type];

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: theme.secondary }]}>
        <Text style={styles.avatarText}>{personality.avatar}</Text>
      </View>

      {/* Upsell bubble */}
      <TouchableOpacity
        style={[
          styles.upsellBubble,
          { 
            backgroundColor: theme.bubble,
            borderColor: theme.accent,
            borderWidth: 2
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{getUpsellIcon()}</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {getUpsellTitle()}
          </Text>
        </View>

        <Text style={[styles.message, { color: theme.text }]}>
          {message || `Want to unlock something special? ${personality.name} has a surprise for you...`}
        </Text>

        <View style={[styles.priceContainer, { backgroundColor: theme.accent }]}>
          <Text style={styles.priceText}>
            ${price} • Unlock Now
          </Text>
        </View>
      </TouchableOpacity>
    </View>
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
  upsellBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default UpsellBubble;