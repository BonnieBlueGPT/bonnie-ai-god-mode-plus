import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';

const UpsellManager = ({ 
  upsellData, 
  visible = true, 
  onUpsellPress,
  onDismiss 
}) => {
  const { personality, theme } = usePersonality();

  if (!visible || !upsellData) return null;

  const getUpsellIcon = () => {
    switch (upsellData.type) {
      case 'voice': return '🎙️';
      case 'images': return '📸';
      case 'vip': return '👑';
      default: return '💕';
    }
  };

  const getUpsellTitle = () => {
    switch (upsellData.type) {
      case 'voice': return 'Hear My Voice';
      case 'images': return 'See My Photos';
      case 'vip': return 'Go VIP';
      default: return 'Special Offer';
    }
  };

  const getUpsellMessage = () => {
    if (upsellData.message) return upsellData.message;
    
    const defaultMessages = {
      voice: `Want to hear me whisper this in your ear? 🎙️💕`,
      images: `I have something special to show you... just for you 📸💋`,
      vip: `Become my VIP and get unlimited access to everything... 👑✨`
    };
    
    return defaultMessages[upsellData.type] || `${personality.name} has something special for you...`;
  };

  const getPrice = () => {
    if (upsellData.pricing) return upsellData.pricing;
    return personality.pricing[upsellData.type] || 9.99;
  };

  const handleUpsellPress = () => {
    // For now, show alert - this will integrate with Stripe in production
    Alert.alert(
      `${getUpsellTitle()} - $${getPrice()}`,
      getUpsellMessage(),
      [
        { text: 'Not Now', style: 'cancel', onPress: onDismiss },
        { 
          text: `Buy $${getPrice()}`, 
          style: 'default',
          onPress: () => {
            onUpsellPress && onUpsellPress(upsellData);
            Alert.alert('🔥 Purchase Confirmed!', `You unlocked ${getUpsellTitle()}! 💕`);
          }
        }
      ]
    );
  };

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
        onPress={handleUpsellPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{getUpsellIcon()}</Text>
          <Text style={[styles.title, { color: theme.text }]}>
            {getUpsellTitle()}
          </Text>
        </View>

        <Text style={[styles.message, { color: theme.text }]}>
          {getUpsellMessage()}
        </Text>

        <View style={[styles.priceContainer, { backgroundColor: theme.accent }]}>
          <Text style={styles.priceText}>
            ${getPrice()} • Unlock Now
          </Text>
        </View>

        {/* Pulsing effect for high-value upsells */}
        {(upsellData.type === 'vip' || getPrice() > 20) && (
          <View style={[styles.pulseRing, { borderColor: theme.accent }]} />
        )}
      </TouchableOpacity>

      {/* Dismiss button */}
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={onDismiss}
      >
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const SlutModeVisualCue = ({ visible, intensity = 1.0 }) => {
  if (!visible) return null;

  return (
    <View style={styles.slutModeContainer}>
      <View style={[styles.goldRipple, { opacity: intensity }]}>
        <Text style={styles.slutModeIcon}>👑</Text>
        <Text style={styles.slutModeText}>SlutMode Activated</Text>
      </View>
    </View>
  );
};

const EmotionParticles = ({ emotion, intensity = 1.0, visible = true }) => {
  if (!visible) return null;

  const getParticleIcon = () => {
    switch (emotion) {
      case 'sweet': return '💕';
      case 'flirty': return '✨';
      case 'sexual': return '🔥';
      case 'dominant': return '⚡';
      case 'goddess': return '🌟';
      default: return '💫';
    }
  };

  return (
    <View style={[styles.particlesContainer, { opacity: intensity }]}>
      <Text style={styles.particle}>{getParticleIcon()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
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
    position: 'relative',
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
  pulseRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderRadius: 24,
    opacity: 0.6,
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  slutModeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  goldRipple: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  slutModeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  slutModeText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    fontSize: 20,
    top: '20%',
    left: '80%',
  },
});

export default UpsellManager;
export { SlutModeVisualCue, EmotionParticles };