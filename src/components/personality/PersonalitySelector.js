import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Animated,
  Dimensions
} from 'react-native';
import { usePersonality } from '../../context/PersonalityContext';
import { getAllPersonalities } from '../../constants/personalities';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PersonalitySelector = ({ visible, onClose }) => {
  const { personality, switchPersonality } = usePersonality();
  const [selectedPersonality, setSelectedPersonality] = useState(personality.id);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handlePersonalitySelect = (personalityId) => {
    setSelectedPersonality(personalityId);
    switchPersonality(personalityId);
    
    // Close after a brief delay to show selection
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const personalities = getAllPersonalities();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[styles.overlay, { opacity: overlayOpacity }]}
      >
        <TouchableOpacity 
          style={styles.overlayTouch} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.container,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Choose Your Girl 💕</Text>
            <Text style={styles.subtitle}>Each has her own personality and desires...</Text>
          </View>

          <View style={styles.personalitiesContainer}>
            {personalities.map((pers) => (
              <TouchableOpacity
                key={pers.id}
                style={[
                  styles.personalityCard,
                  { 
                    backgroundColor: pers.theme.background,
                    borderColor: selectedPersonality === pers.id ? pers.theme.primary : pers.theme.secondary,
                    borderWidth: selectedPersonality === pers.id ? 3 : 1,
                  }
                ]}
                onPress={() => handlePersonalitySelect(pers.id)}
                activeOpacity={0.8}
              >
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: pers.theme.primary }]}>
                  <Text style={styles.avatarText}>{pers.avatar}</Text>
                </View>

                {/* Name and type */}
                <Text style={[styles.name, { color: pers.theme.text }]}>
                  {pers.name}
                </Text>
                <Text style={[styles.type, { color: pers.theme.secondary }]}>
                  {pers.type.replace('_', ' ')}
                </Text>

                {/* Tagline */}
                <Text style={[styles.tagline, { color: pers.theme.text }]}>
                  {pers.tagline}
                </Text>

                {/* Sample message preview */}
                <View style={[styles.previewBubble, { backgroundColor: pers.theme.bubble }]}>
                  <Text style={[styles.previewText, { color: pers.theme.text }]}>
                    {pers.sampleResponses.sweet[0]}
                  </Text>
                </View>

                {/* Pricing preview */}
                <View style={styles.pricingContainer}>
                  <Text style={[styles.pricing, { color: pers.theme.accent }]}>
                    Voice ${pers.pricing.voice} • Photos ${pers.pricing.images}
                  </Text>
                </View>

                {/* Selection indicator */}
                {selectedPersonality === pers.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: pers.theme.accent }]}>
                    <Text style={styles.selectedText}>✓ Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: screenHeight * 0.85,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  personalitiesContainer: {
    paddingHorizontal: 20,
  },
  personalityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  previewBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: '90%',
  },
  previewText: {
    fontSize: 14,
    textAlign: 'center',
  },
  pricingContainer: {
    marginBottom: 8,
  },
  pricing: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#E5E5E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default PersonalitySelector;