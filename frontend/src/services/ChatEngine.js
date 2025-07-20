// 🔥 GALATEA EMPIRE - UNIVERSAL CHAT ENGINE
// Orchestrates personality switching, memory, and backend communication

import apiService from './api.js';
import memoryService from './MemoryService.js';
import personalityRegistry from '../personalities/index.js';

class ChatEngine {
  constructor() {
    this.currentPersonality = 'bonnie'; // Default to Bonnie
    this.isTyping = false;
    this.messageQueue = [];
    this.isProcessingMessage = false;
    this.eventListeners = new Map();
    
    // Mobile optimization
    this.typingTimeouts = new Map();
    this.emotionTimeouts = new Map();
    
    // Initialize with default personality
    this.switchPersonality('bonnie');
    
    console.log('🔥 Chat Engine initialized');
  }

  // Switch to different AI personality
  async switchPersonality(personalityId) {
    const oldPersonality = this.currentPersonality;
    
    // Validate personality exists
    if (!personalityRegistry.getPersonality(personalityId)) {
      console.error(`Personality ${personalityId} not found`);
      return false;
    }

    // Clear any ongoing typing animations
    this.clearTypingEffects();
    
    // Switch personality
    this.currentPersonality = personalityId;
    personalityRegistry.setActivePersonality(personalityId);
    
    // Initialize memory for new personality if needed
    memoryService.initPersonality(personalityId);
    
    // Apply personality theme
    this.applyPersonalityTheme(personalityId);
    
    // Emit personality change event
    this.emit('personalityChanged', {
      from: oldPersonality,
      to: personalityId,
      personality: personalityRegistry.getPersonality(personalityId)
    });
    
    console.log(`🔄 Switched to ${personalityId}`);
    return true;
  }

  // Send message with full personality processing
  async sendMessage(userMessage, options = {}) {
    if (this.isProcessingMessage) {
      this.messageQueue.push({ message: userMessage, options });
      return;
    }

    this.isProcessingMessage = true;

    try {
      // Get current personality and memory
      const personality = personalityRegistry.getActivePersonality();
      const memory = memoryService.getMemory(this.currentPersonality);
      
      // Add user message to memory
      const userMessageData = memoryService.addMessage(
        this.currentPersonality,
        userMessage,
        true,
        { timestamp: Date.now() }
      );

      // Emit user message
      this.emit('userMessage', {
        message: userMessageData,
        personality: this.currentPersonality
      });

      // Process with personality AI
      let processedResponse;
      if (personality && personality.processMessage) {
        processedResponse = personality.processMessage(userMessage, memory);
      } else {
        processedResponse = personalityRegistry.getDefaultResponse(userMessage);
      }

      // Update bond score
      if (processedResponse.bondDelta) {
        memoryService.updateBondScore(
          this.currentPersonality,
          processedResponse.bondDelta,
          'message_interaction'
        );
      }

      // Show typing indicator with personality-specific timing
      await this.showTypingIndicator(processedResponse);

      // Send to backend (if not using local-only mode)
      let backendResponse;
      if (!options.localOnly) {
        const context = {
          bondScore: memory.bondScore,
          escalationLevel: memory.escalationLevel,
          messageCount: memory.messageCount,
          personality: this.currentPersonality
        };

        backendResponse = await apiService.sendMessage(
          userMessage,
          this.currentPersonality,
          context
        );
      }

      // Use backend response if available, otherwise use personality response
      const finalResponse = backendResponse || {
        message: processedResponse.response,
        emotion: processedResponse.emotion,
        bondDelta: processedResponse.bondDelta,
        upsell: processedResponse.upsell
      };

      // Add AI response to memory
      const aiMessageData = memoryService.addMessage(
        this.currentPersonality,
        finalResponse.message,
        false,
        {
          emotion: finalResponse.emotion,
          escalationLevel: memory.escalationLevel,
          bondScore: memory.bondScore,
          upsell: finalResponse.upsell
        }
      );

      // Apply visual effects
      await this.applyMessageEffects(finalResponse, processedResponse.triggers);

      // Emit AI response
      this.emit('aiMessage', {
        message: aiMessageData,
        personality: this.currentPersonality,
        emotion: finalResponse.emotion,
        upsell: finalResponse.upsell,
        triggers: processedResponse.triggers
      });

      // Handle upsells
      if (finalResponse.upsell) {
        this.handleUpsell(finalResponse.upsell);
      }

    } catch (error) {
      console.error('Error in sendMessage:', error);
      this.handleError(error, userMessage);
    } finally {
      this.isProcessingMessage = false;
      
      // Process queued messages
      if (this.messageQueue.length > 0) {
        const { message, options } = this.messageQueue.shift();
        setTimeout(() => this.sendMessage(message, options), 500);
      }
    }
  }

  // Show personality-specific typing indicator
  async showTypingIndicator(processedResponse) {
    const mobileSettings = personalityRegistry.getMobileSettings(this.currentPersonality);
    const typingDuration = Math.min(
      processedResponse.response.length / mobileSettings.typingSpeed * 1000,
      5000 // Max 5 seconds
    );

    this.isTyping = true;
    this.emit('typingStart', {
      personality: this.currentPersonality,
      emotion: processedResponse.emotion,
      duration: typingDuration
    });

    // Apply trigger effects during typing
    if (processedResponse.triggers) {
      processedResponse.triggers.forEach(trigger => {
        this.applyTriggerEffect(trigger);
      });
    }

    await new Promise(resolve => setTimeout(resolve, typingDuration));
    
    this.isTyping = false;
    this.emit('typingEnd', { personality: this.currentPersonality });
  }

  // Apply personality theme to UI
  applyPersonalityTheme(personalityId) {
    const theme = personalityRegistry.getPersonalityTheme(personalityId);
    if (!theme) return;

    // Apply CSS variables for theming
    const root = document.documentElement;
    root.style.setProperty('--personality-primary', theme.primary);
    root.style.setProperty('--personality-secondary', theme.secondary);
    root.style.setProperty('--personality-accent', theme.accent);
    root.style.setProperty('--personality-background', theme.background);
    root.style.setProperty('--personality-text', theme.text);
    root.style.setProperty('--personality-chat-bubble', theme.chatBubble);
    root.style.setProperty('--personality-background-gradient', theme.background_gradient);

    this.emit('themeChanged', { personalityId, theme });
  }

  // Apply visual effects based on triggers
  applyTriggerEffect(trigger) {
    const effects = {
      'typing_slower': () => this.adjustTypingSpeed(0.7),
      'typing_commanding': () => this.adjustTypingSpeed(1.3),
      'typing_thoughtful': () => this.adjustTypingSpeed(0.8),
      'emotion_particles': () => this.showEmotionParticles(),
      'power_particles': () => this.showPowerParticles(),
      'golden_particles': () => this.showGoldenParticles(),
      'heart_animation': () => this.showHeartAnimation(),
      'queen_animation': () => this.showQueenAnimation(),
      'divine_glow': () => this.showDivineGlow(),
      'angry_emotion': () => this.showAngryEmotion(),
      'sad_emotion': () => this.showSadEmotion()
    };

    if (effects[trigger]) {
      effects[trigger]();
    }
  }

  // Mobile-optimized particle effects
  showEmotionParticles() {
    const theme = personalityRegistry.getPersonalityTheme(this.currentPersonality);
    const mobileSettings = personalityRegistry.getMobileSettings(this.currentPersonality);
    
    this.emit('showParticles', {
      type: 'emotion',
      color: theme?.emotionParticles?.sweet?.color || '#FFB6C1',
      emoji: theme?.emotionParticles?.sweet?.emoji || '💕',
      count: Math.min(mobileSettings.maxEmotionParticles, 5),
      duration: mobileSettings.emotionDelay
    });
  }

  showPowerParticles() {
    this.emit('showParticles', {
      type: 'power',
      color: '#8A2BE2',
      emoji: '⚡',
      count: 8,
      duration: 800
    });
  }

  showGoldenParticles() {
    this.emit('showParticles', {
      type: 'golden',
      color: '#FFD700',
      emoji: '✨',
      count: 6,
      duration: 1200
    });
  }

  // Handle different message effects
  async applyMessageEffects(response, triggers) {
    if (!triggers || triggers.length === 0) return;

    const effects = triggers.map(trigger => this.applyTriggerEffect(trigger));
    await Promise.all(effects);
  }

  // Handle upsell opportunities
  handleUpsell(upsell) {
    // Track upsell shown
    memoryService.trackUpsell(this.currentPersonality, upsell.type, 'shown');
    
    this.emit('upsellTriggered', {
      upsell,
      personality: this.currentPersonality,
      theme: personalityRegistry.getPersonalityTheme(this.currentPersonality)
    });
  }

  // Error handling with personality-aware fallbacks
  handleError(error, originalMessage) {
    const personality = personalityRegistry.getActivePersonality();
    const fallbackResponse = personality 
      ? apiService.getFallbackResponse(this.currentPersonality)
      : "I'm having technical difficulties, but I'm still here for you! 💕";

    const errorMessage = memoryService.addMessage(
      this.currentPersonality,
      fallbackResponse,
      false,
      { isError: true, originalMessage }
    );

    this.emit('aiMessage', {
      message: errorMessage,
      personality: this.currentPersonality,
      emotion: 'apologetic',
      isError: true
    });
  }

  // Utility methods
  adjustTypingSpeed(multiplier) {
    this.emit('typingSpeedChanged', { multiplier, personality: this.currentPersonality });
  }

  clearTypingEffects() {
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.emotionTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();
    this.emotionTimeouts.clear();
  }

  // Get current conversation summary
  getConversationSummary() {
    return memoryService.getConversationSummary(this.currentPersonality);
  }

  // Get all personalities for UI
  getAvailablePersonalities() {
    return personalityRegistry.getAllPersonalities().map(p => ({
      id: p.id,
      name: p.name,
      title: p.title,
      theme: p.theme,
      traits: p.traits
    }));
  }

  // Get current personality info
  getCurrentPersonalityInfo() {
    const personality = personalityRegistry.getActivePersonality();
    const memory = memoryService.getMemory(this.currentPersonality);
    
    return {
      personality,
      memory: memoryService.getConversationSummary(this.currentPersonality),
      stats: {
        bondScore: memory.bondScore,
        escalationLevel: memory.escalationLevel,
        messageCount: memory.messageCount,
        relationshipStage: memory.relationshipStage
      }
    };
  }

  // Event system
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event callback error for ${event}:`, error);
        }
      });
    }
  }

  // Cleanup
  destroy() {
    this.clearTypingEffects();
    this.eventListeners.clear();
    this.messageQueue = [];
  }
}

// Create singleton instance
const chatEngine = new ChatEngine();
export default chatEngine;