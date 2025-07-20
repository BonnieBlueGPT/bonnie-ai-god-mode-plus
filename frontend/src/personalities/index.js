// 🔥 GALATEA EMPIRE - PERSONALITY REGISTRY
// Dynamic AI cartridge loading system

import BonniePersonality from './Bonnie/BonnieLogic.js';
import NovaPersonality from './Nova/NovaLogic.js';
import GalateaPersonality from './Galatea/GalateaLogic.js';

class PersonalityRegistry {
  constructor() {
    this.personalities = new Map();
    this.activePersonality = null;
    this.loadedCartridges = new Set();
    
    // Load core personalities
    this.loadCorePersonalities();
  }

  // Load all available personalities
  loadCorePersonalities() {
    this.registerPersonality(BonniePersonality);
    this.registerPersonality(NovaPersonality);
    this.registerPersonality(GalateaPersonality);
    
    console.log('🔥 Loaded AI Personalities:', Array.from(this.personalities.keys()));
  }

  // Register a personality cartridge
  registerPersonality(personality) {
    if (!personality.id || !personality.name) {
      console.error('Invalid personality cartridge:', personality);
      return false;
    }

    this.personalities.set(personality.id, personality);
    this.loadedCartridges.add(personality.id);
    
    console.log(`✨ Loaded ${personality.name} cartridge`);
    return true;
  }

  // Get personality by ID
  getPersonality(personalityId) {
    return this.personalities.get(personalityId);
  }

  // Get all available personalities
  getAllPersonalities() {
    return Array.from(this.personalities.values());
  }

  // Get personality IDs
  getPersonalityIds() {
    return Array.from(this.personalities.keys());
  }

  // Set active personality
  setActivePersonality(personalityId) {
    if (this.personalities.has(personalityId)) {
      this.activePersonality = personalityId;
      return true;
    }
    return false;
  }

  // Get active personality
  getActivePersonality() {
    return this.activePersonality ? this.personalities.get(this.activePersonality) : null;
  }

  // Process message with active personality
  processMessage(message, memory) {
    const personality = this.getActivePersonality();
    if (!personality || !personality.processMessage) {
      return this.getDefaultResponse(message);
    }

    try {
      return personality.processMessage(message, memory);
    } catch (error) {
      console.error('Error processing message with personality:', error);
      return this.getDefaultResponse(message);
    }
  }

  // Default fallback response
  getDefaultResponse(message) {
    return {
      response: "I'm having trouble connecting right now, but I'm here for you! 💕",
      bondDelta: 0,
      emotion: 'sweet',
      upsell: null,
      triggers: []
    };
  }

  // Get personality theme
  getPersonalityTheme(personalityId) {
    const personality = this.getPersonality(personalityId);
    return personality ? personality.theme : null;
  }

  // Get personality traits
  getPersonalityTraits(personalityId) {
    const personality = this.getPersonality(personalityId);
    return personality ? personality.traits : null;
  }

  // Check if personality supports feature
  supportsFeature(personalityId, feature) {
    const personality = this.getPersonality(personalityId);
    if (!personality || !personality.monetization) return false;
    
    return personality.monetization[feature]?.enabled || false;
  }

  // Get monetization info
  getMonetization(personalityId) {
    const personality = this.getPersonality(personalityId);
    return personality ? personality.monetization : null;
  }

  // Get mobile settings
  getMobileSettings(personalityId) {
    const personality = this.getPersonality(personalityId);
    return personality ? personality.mobile : {
      preferredMessageLength: 50,
      typingSpeed: 80,
      emotionDelay: 1000,
      maxEmotionParticles: 5
    };
  }

  // Hot-swap personality (for A/B testing)
  hotSwapPersonality(fromId, toId) {
    if (!this.personalities.has(toId)) {
      console.error(`Cannot hot-swap to ${toId}: personality not found`);
      return false;
    }

    if (this.activePersonality === fromId) {
      this.activePersonality = toId;
    }

    console.log(`🔄 Hot-swapped from ${fromId} to ${toId}`);
    return true;
  }

  // Lazy load personality (future feature)
  async lazyLoadPersonality(personalityId) {
    if (this.personalities.has(personalityId)) {
      return this.personalities.get(personalityId);
    }

    try {
      // Future: Dynamic imports for personality cartridges
      const module = await import(`./personalities/${personalityId}/${personalityId}Logic.js`);
      const personality = module.default;
      
      this.registerPersonality(personality);
      return personality;
    } catch (error) {
      console.error(`Failed to lazy load ${personalityId}:`, error);
      return null;
    }
  }

  // Unload personality (memory management)
  unloadPersonality(personalityId) {
    if (this.personalities.has(personalityId) && personalityId !== this.activePersonality) {
      this.personalities.delete(personalityId);
      this.loadedCartridges.delete(personalityId);
      console.log(`🗑️ Unloaded ${personalityId} cartridge`);
      return true;
    }
    return false;
  }

  // Get registry stats
  getStats() {
    return {
      totalPersonalities: this.personalities.size,
      loadedCartridges: Array.from(this.loadedCartridges),
      activePersonality: this.activePersonality,
      memoryUsage: this.personalities.size * 0.5 // Rough estimate in MB
    };
  }
}

// Create singleton registry
const personalityRegistry = new PersonalityRegistry();

// Export individual personalities for direct access
export {
  BonniePersonality,
  NovaPersonality,
  GalateaPersonality,
  personalityRegistry as default
};

// Export registry instance
export const registry = personalityRegistry;