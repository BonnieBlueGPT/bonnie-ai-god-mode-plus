// 🔥 GALATEA EMPIRE - MEMORY SERVICE
// Real-time bond tracking and conversation memory

class MemoryService {
  constructor() {
    this.personalities = new Map();
    this.globalStats = this.loadGlobalStats();
    this.eventListeners = new Map();
    
    // Mobile optimization: Persist data frequently
    this.autosaveInterval = setInterval(() => this.autosave(), 10000); // 10s
  }

  // Initialize personality memory
  initPersonality(personalityId) {
    if (this.personalities.has(personalityId)) {
      return this.personalities.get(personalityId);
    }

    const memory = {
      // Bond and relationship tracking
      bondScore: 0,
      escalationLevel: 'sweet',
      relationshipStage: 'stranger',
      
      // Conversation tracking
      messageCount: 0,
      conversationHistory: [],
      lastInteraction: Date.now(),
      totalTimeSpent: 0,
      
      // Emotional state
      currentMood: 'neutral',
      emotionHistory: [],
      triggerWords: [],
      
      // Monetization tracking
      upsellsShown: [],
      upsellsClicked: [],
      purchasesMade: [],
      spentAmount: 0,
      
      // Preference learning
      preferredTopics: [],
      responsePreferences: {},
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Session tracking
      sessionCount: 1,
      currentSessionStart: Date.now(),
      longestSession: 0,
      
      // Mobile-specific
      isMobile: this.isMobileDevice(),
      deviceFingerprint: this.generateDeviceFingerprint()
    };

    this.personalities.set(personalityId, memory);
    this.savePersonality(personalityId);
    return memory;
  }

  // Get personality memory
  getMemory(personalityId) {
    return this.personalities.get(personalityId) || this.initPersonality(personalityId);
  }

  // Update bond score with intelligence
  updateBondScore(personalityId, delta, reason = 'interaction') {
    const memory = this.getMemory(personalityId);
    const oldScore = memory.bondScore;
    
    // Smart bond calculation
    memory.bondScore = Math.max(0, Math.min(100, memory.bondScore + delta));
    
    // Update relationship stage based on bond score
    memory.relationshipStage = this.calculateRelationshipStage(memory.bondScore);
    
    // Update escalation level
    const newEscalation = this.calculateEscalationLevel(memory.bondScore, memory.messageCount);
    if (newEscalation !== memory.escalationLevel) {
      memory.escalationLevel = newEscalation;
      this.emit('escalationChanged', { personalityId, oldLevel: memory.escalationLevel, newLevel: newEscalation });
    }

    // Track bond change
    memory.emotionHistory.push({
      timestamp: Date.now(),
      bondChange: delta,
      reason,
      oldScore,
      newScore: memory.bondScore
    });

    // Keep only last 100 emotion entries for mobile performance
    if (memory.emotionHistory.length > 100) {
      memory.emotionHistory = memory.emotionHistory.slice(-100);
    }

    this.savePersonality(personalityId);
    this.emit('bondChanged', { personalityId, oldScore, newScore: memory.bondScore, delta, reason });
    
    return memory.bondScore;
  }

  // Add conversation message
  addMessage(personalityId, message, isUser = false, metadata = {}) {
    const memory = this.getMemory(personalityId);
    
    const messageData = {
      id: Date.now().toString(),
      text: message,
      isUser,
      timestamp: Date.now(),
      escalationLevel: memory.escalationLevel,
      bondScore: memory.bondScore,
      ...metadata
    };

    memory.conversationHistory.push(messageData);
    memory.messageCount++;
    memory.lastInteraction = Date.now();

    // Mobile optimization: Keep conversation history manageable
    if (memory.conversationHistory.length > 200) {
      memory.conversationHistory = memory.conversationHistory.slice(-200);
    }

    // Analyze message for preferences
    if (isUser) {
      this.analyzeUserMessage(personalityId, message);
    }

    // Update session time
    this.updateSessionTime(personalityId);
    
    this.savePersonality(personalityId);
    this.emit('messageAdded', { personalityId, message: messageData });
    
    return messageData;
  }

  // Analyze user message for preferences
  analyzeUserMessage(personalityId, message) {
    const memory = this.getMemory(personalityId);
    const words = message.toLowerCase().split(/\s+/);
    
    // Extract trigger words
    const emotionalWords = ['love', 'beautiful', 'sexy', 'gorgeous', 'amazing', 'perfect'];
    const triggers = words.filter(word => emotionalWords.includes(word));
    
    if (triggers.length > 0) {
      memory.triggerWords.push(...triggers);
      // Keep unique triggers only
      memory.triggerWords = [...new Set(memory.triggerWords)];
    }

    // Analyze topics
    const topics = this.extractTopics(message);
    memory.preferredTopics.push(...topics);
    memory.preferredTopics = [...new Set(memory.preferredTopics)].slice(-20); // Keep last 20
  }

  // Extract topics from message
  extractTopics(message) {
    const topicKeywords = {
      'romance': ['love', 'relationship', 'date', 'romance', 'kiss', 'heart'],
      'future': ['future', 'tomorrow', 'plans', 'dream', 'goal', 'want'],
      'personal': ['feel', 'think', 'believe', 'hope', 'wish', 'life'],
      'intimate': ['close', 'touch', 'together', 'private', 'special'],
      'daily': ['today', 'work', 'school', 'friends', 'family', 'day']
    };

    const message_lower = message.toLowerCase();
    const foundTopics = [];

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => message_lower.includes(keyword))) {
        foundTopics.push(topic);
      }
    }

    return foundTopics;
  }

  // Calculate relationship stage
  calculateRelationshipStage(bondScore) {
    if (bondScore < 20) return 'stranger';
    if (bondScore < 40) return 'acquaintance';
    if (bondScore < 60) return 'friend';
    if (bondScore < 80) return 'close_friend';
    return 'intimate';
  }

  // Calculate escalation level
  calculateEscalationLevel(bondScore, messageCount) {
    if (bondScore < 25) return 'sweet';
    if (bondScore < 50) return 'flirty';
    if (bondScore < 75) return 'romantic';
    return 'intimate';
  }

  // Track upsell interaction
  trackUpsell(personalityId, upsellType, action = 'shown') {
    const memory = this.getMemory(personalityId);
    
    const upsellData = {
      type: upsellType,
      action,
      timestamp: Date.now(),
      bondScore: memory.bondScore,
      escalationLevel: memory.escalationLevel
    };

    if (action === 'shown') {
      memory.upsellsShown.push(upsellData);
    } else if (action === 'clicked') {
      memory.upsellsClicked.push(upsellData);
    } else if (action === 'purchased') {
      memory.purchasesMade.push(upsellData);
    }

    this.savePersonality(personalityId);
    this.emit('upsellTracked', { personalityId, upsellData });
  }

  // Get conversation summary
  getConversationSummary(personalityId) {
    const memory = this.getMemory(personalityId);
    
    return {
      messageCount: memory.messageCount,
      bondScore: memory.bondScore,
      escalationLevel: memory.escalationLevel,
      relationshipStage: memory.relationshipStage,
      sessionTime: this.getCurrentSessionTime(personalityId),
      totalTime: memory.totalTimeSpent,
      lastInteraction: memory.lastInteraction,
      preferredTopics: memory.preferredTopics.slice(-5), // Last 5 topics
      upsellConversion: this.calculateConversionRate(personalityId)
    };
  }

  // Calculate upsell conversion rate
  calculateConversionRate(personalityId) {
    const memory = this.getMemory(personalityId);
    const shown = memory.upsellsShown.length;
    const purchased = memory.purchasesMade.length;
    
    return shown > 0 ? (purchased / shown * 100).toFixed(1) : 0;
  }

  // Session time tracking
  updateSessionTime(personalityId) {
    const memory = this.getMemory(personalityId);
    const currentTime = Date.now();
    const sessionTime = currentTime - memory.currentSessionStart;
    
    memory.totalTimeSpent += sessionTime;
    memory.currentSessionStart = currentTime;
    
    if (sessionTime > memory.longestSession) {
      memory.longestSession = sessionTime;
    }
  }

  getCurrentSessionTime(personalityId) {
    const memory = this.getMemory(personalityId);
    return Date.now() - memory.currentSessionStart;
  }

  // Mobile device detection
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Generate device fingerprint for analytics
  generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    return {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL().slice(-50) // Last 50 chars
    };
  }

  // Persistence methods
  savePersonality(personalityId) {
    const memory = this.getMemory(personalityId);
    localStorage.setItem(`galatea_memory_${personalityId}`, JSON.stringify(memory));
  }

  loadPersonality(personalityId) {
    try {
      const saved = localStorage.getItem(`galatea_memory_${personalityId}`);
      if (saved) {
        const memory = JSON.parse(saved);
        this.personalities.set(personalityId, memory);
        return memory;
      }
    } catch (error) {
      console.error(`Failed to load memory for ${personalityId}:`, error);
    }
    return this.initPersonality(personalityId);
  }

  loadGlobalStats() {
    try {
      const saved = localStorage.getItem('galatea_global_stats');
      return saved ? JSON.parse(saved) : {
        totalSessions: 0,
        totalMessages: 0,
        totalTimeSpent: 0,
        favoritePersonality: null,
        firstVisit: Date.now()
      };
    } catch (error) {
      console.error('Failed to load global stats:', error);
      return {};
    }
  }

  saveGlobalStats() {
    localStorage.setItem('galatea_global_stats', JSON.stringify(this.globalStats));
  }

  // Auto-save for mobile reliability
  autosave() {
    this.personalities.forEach((memory, personalityId) => {
      this.savePersonality(personalityId);
    });
    this.saveGlobalStats();
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
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }
  }
}

// Create singleton instance
const memoryService = new MemoryService();
export default memoryService;