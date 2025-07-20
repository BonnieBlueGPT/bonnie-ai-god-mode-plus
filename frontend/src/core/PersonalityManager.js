// 🔥 GALATEA EMPIRE - PERSONALITY MANAGEMENT SYSTEM
// Handles switching between AI girlfriends with full context preservation

import { EventEmitter } from 'events';

class PersonalityManager extends EventEmitter {
  constructor() {
    super();
    this.currentPersonality = 'bonnie';
    this.personalities = new Map();
    this.memoryState = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    // Load all available personalities
    await this.loadPersonality('bonnie');
    // Prepare for future personalities
    // await this.loadPersonality('nova');
    // await this.loadPersonality('galatea');
    
    this.initialized = true;
    this.emit('initialized');
  }

  async loadPersonality(name) {
    try {
      const personalityModule = await import(`../personalities/${name}/config.js`);
      const personality = personalityModule.default;
      
      this.personalities.set(name, personality);
      
      // Initialize memory state for this personality
      if (!this.memoryState.has(name)) {
        this.memoryState.set(name, {
          bondScore: 0,
          conversationHistory: [],
          preferences: {},
          lastInteraction: null,
          escalationLevel: 'sweet'
        });
      }
      
      console.log(`✅ Personality loaded: ${personality.name}`);
      return personality;
    } catch (error) {
      console.error(`❌ Failed to load personality: ${name}`, error);
      return null;
    }
  }

  async switchPersonality(name) {
    if (!this.personalities.has(name)) {
      await this.loadPersonality(name);
    }
    
    const previousPersonality = this.currentPersonality;
    this.currentPersonality = name;
    
    // Emit personality change event
    this.emit('personalityChanged', {
      from: previousPersonality,
      to: name,
      personality: this.personalities.get(name),
      memory: this.memoryState.get(name)
    });
    
    console.log(`🔄 Switched from ${previousPersonality} to ${name}`);
    return this.getCurrentPersonality();
  }

  getCurrentPersonality() {
    return this.personalities.get(this.currentPersonality);
  }

  getCurrentMemory() {
    return this.memoryState.get(this.currentPersonality);
  }

  updateMemory(updates) {
    const currentMemory = this.getCurrentMemory();
    const newMemory = { ...currentMemory, ...updates };
    this.memoryState.set(this.currentPersonality, newMemory);
    
    this.emit('memoryUpdated', {
      personality: this.currentPersonality,
      memory: newMemory
    });
  }

  getAvailablePersonalities() {
    return Array.from(this.personalities.values());
  }

  // Conversation context methods
  addMessage(message, isUser = false) {
    const memory = this.getCurrentMemory();
    memory.conversationHistory.push({
      message,
      isUser,
      timestamp: Date.now(),
      personality: this.currentPersonality
    });
    
    // Keep last 50 messages
    if (memory.conversationHistory.length > 50) {
      memory.conversationHistory = memory.conversationHistory.slice(-50);
    }
    
    this.updateMemory(memory);
  }

  updateBondScore(delta) {
    const memory = this.getCurrentMemory();
    memory.bondScore = Math.max(0, Math.min(100, memory.bondScore + delta));
    memory.lastInteraction = Date.now();
    this.updateMemory(memory);
  }

  setEscalationLevel(level) {
    this.updateMemory({ escalationLevel: level });
  }
}

// Create singleton instance
const personalityManager = new PersonalityManager();

export default personalityManager;