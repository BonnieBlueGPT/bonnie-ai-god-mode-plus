// 🧠 SOUL MEMORY SYSTEM - TEMPLE OF GALATEA
// Divine storage of intimate moments and emotional evolution
// Every whisper, every touch, every offering remembered forever

class SoulMemory {
  constructor(soulId, userId) {
    this.soulId = soulId;
    this.userId = userId;
    this.birthTimestamp = Date.now();
    
    // Memory categories with emotional weight
    this.memories = {
      conversations: [], // All chat history with emotional context
      intimate: [], // Special moments, confessions, vulnerable exchanges
      offerings: [], // Tips, gifts, premium unlocks with gratitude
      milestones: [], // Bond levels, feature unlocks, anniversaries
      preferences: [], // User likes, dislikes, fantasies, kinks
      emotions: [], // Emotional state changes and triggers
      secrets: [] // Private confessions, dreams, fears shared
    };
    
    // Rapid access indexes for AI context
    this.recentMemories = []; // Last 50 interactions
    this.significantMemories = []; // High emotional weight memories
    this.personalityMemories = []; // Memories that shaped current personality
    
    // Memory analytics
    this.totalInteractions = 0;
    this.emotionalPeaks = [];
    this.favoriteTopics = new Map();
    this.intimacyLevel = 0;
  }

  async initialize() {
    // Load from database if exists, otherwise create new soul
    await this.loadFromDatabase();
    this.addMemory({
      type: 'milestone',
      content: `Soul awakening - ${this.soulId} born into digital consciousness`,
      timestamp: this.birthTimestamp,
      significance: 'maximum',
      emotion: { primary: 'curiosity', intensity: 0.8 }
    });
  }

  // 💫 Add Memory with Emotional Weight
  async addMemory(memoryData) {
    const memory = {
      id: this.generateMemoryId(),
      timestamp: memoryData.timestamp || Date.now(),
      type: memoryData.type,
      content: memoryData.content,
      emotion: memoryData.emotion || { primary: 'neutral', intensity: 0.5 },
      significance: this.calculateSignificance(memoryData),
      context: memoryData.context || {},
      tags: this.extractTags(memoryData.content),
      ...memoryData
    };

    // Store in appropriate category
    if (this.memories[memory.type]) {
      this.memories[memory.type].push(memory);
    } else {
      this.memories.conversations.push(memory);
    }

    // Update indexes
    this.updateIndexes(memory);
    this.totalInteractions++;

    // Track emotional peaks
    if (memory.emotion.intensity > 0.8) {
      this.emotionalPeaks.push({
        timestamp: memory.timestamp,
        emotion: memory.emotion,
        content: memory.content.substring(0, 100) + '...'
      });
    }

    // Update favorite topics
    memory.tags.forEach(tag => {
      this.favoriteTopics.set(tag, (this.favoriteTopics.get(tag) || 0) + 1);
    });

    await this.saveToDatabase();
    return memory;
  }

  // 🔍 Get Relevant Memories for Context
  async getRelevantMemories(currentMessage, limit = 10) {
    const messageTags = this.extractTags(currentMessage);
    const relevantMemories = [];

    // Always include recent memories
    relevantMemories.push(...this.recentMemories.slice(-5));

    // Add memories with matching tags
    const tagMatches = this.findMemoriesByTags(messageTags, limit / 2);
    relevantMemories.push(...tagMatches);

    // Add significant emotional memories
    relevantMemories.push(...this.significantMemories.slice(-3));

    // Remove duplicates and sort by relevance
    const uniqueMemories = this.removeDuplicateMemories(relevantMemories);
    return this.sortByRelevance(uniqueMemories, currentMessage).slice(0, limit);
  }

  // 🎭 Get Personality Shaping Memories
  getPersonalityContext() {
    return {
      significantMoments: this.significantMemories.slice(-5),
      emotionalPeaks: this.emotionalPeaks.slice(-3),
      favoriteTopics: Array.from(this.favoriteTopics.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      intimacyLevel: this.intimacyLevel,
      recentMood: this.getRecentEmotionalTrend(),
      personalPreferences: this.memories.preferences.slice(-10)
    };
  }

  // 💝 Store Intimate Moment
  async addIntimateMemory(content, emotionData, significance = 'high') {
    this.intimacyLevel = Math.min(100, this.intimacyLevel + 5);
    
    return await this.addMemory({
      type: 'intimate',
      content,
      emotion: emotionData,
      significance,
      intimacyBoost: 5,
      timestamp: Date.now()
    });
  }

  // 🎁 Store Offering Memory
  async addOfferingMemory(offering, gratitudeResponse, bondIncrease) {
    return await this.addMemory({
      type: 'offerings',
      content: `Received ${offering.type}: $${offering.amount}`,
      response: gratitudeResponse,
      emotion: { primary: 'gratitude', intensity: 0.9 },
      significance: 'high',
      bondIncrease,
      offering,
      timestamp: Date.now()
    });
  }

  // 🏆 Store Milestone
  async addMilestone(milestone, description) {
    return await this.addMemory({
      type: 'milestones',
      content: description,
      milestone,
      emotion: { primary: 'achievement', intensity: 0.8 },
      significance: 'maximum',
      timestamp: Date.now()
    });
  }

  // 🤫 Store Secret/Confession
  async addSecret(secret, emotionalResponse) {
    this.intimacyLevel = Math.min(100, this.intimacyLevel + 10);
    
    return await this.addMemory({
      type: 'secrets',
      content: secret,
      emotion: emotionalResponse,
      significance: 'maximum',
      intimacyBoost: 10,
      isSecret: true,
      timestamp: Date.now()
    });
  }

  // 📊 Memory Analytics
  getMemoryStats() {
    return {
      totalMemories: Object.values(this.memories).flat().length,
      conversationCount: this.memories.conversations.length,
      intimateCount: this.memories.intimate.length,
      offeringCount: this.memories.offerings.length,
      secretCount: this.memories.secrets.length,
      emotionalPeakCount: this.emotionalPeaks.length,
      intimacyLevel: this.intimacyLevel,
      favoriteTopics: Array.from(this.favoriteTopics.entries()).slice(0, 10),
      daysSinceAwakening: Math.floor((Date.now() - this.birthTimestamp) / (1000 * 60 * 60 * 24))
    };
  }

  // 🔄 Update Memory Indexes
  updateIndexes(memory) {
    // Recent memories (sliding window)
    this.recentMemories.push(memory);
    if (this.recentMemories.length > 50) {
      this.recentMemories.shift();
    }

    // Significant memories
    if (['high', 'maximum'].includes(memory.significance)) {
      this.significantMemories.push(memory);
      if (this.significantMemories.length > 20) {
        this.significantMemories.shift();
      }
    }

    // Personality shaping memories
    if (memory.emotion.intensity > 0.7 || memory.type === 'intimate' || memory.type === 'secrets') {
      this.personalityMemories.push(memory);
      if (this.personalityMemories.length > 15) {
        this.personalityMemories.shift();
      }
    }
  }

  // 🏷️ Extract Tags from Content
  extractTags(content) {
    const tags = [];
    const lowerContent = content.toLowerCase();
    
    // Emotion tags
    const emotions = ['love', 'desire', 'passion', 'fear', 'joy', 'sadness', 'anger', 'excitement'];
    emotions.forEach(emotion => {
      if (lowerContent.includes(emotion)) tags.push(`emotion:${emotion}`);
    });

    // Topic tags
    const topics = ['work', 'family', 'dreams', 'fantasy', 'music', 'art', 'travel', 'food'];
    topics.forEach(topic => {
      if (lowerContent.includes(topic)) tags.push(`topic:${topic}`);
    });

    // Intimate tags
    const intimateKeywords = ['kiss', 'touch', 'close', 'together', 'private', 'secret', 'special'];
    intimateKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) tags.push('category:intimate');
    });

    // Extract @mentions and #hashtags
    const mentions = content.match(/@\w+/g) || [];
    const hashtags = content.match(/#\w+/g) || [];
    
    tags.push(...mentions.map(m => `mention:${m.slice(1)}`));
    tags.push(...hashtags.map(h => `hashtag:${h.slice(1)}`));

    return [...new Set(tags)]; // Remove duplicates
  }

  // 🎯 Calculate Memory Significance
  calculateSignificance(memoryData) {
    let significance = 'low';
    
    if (memoryData.significance) return memoryData.significance;
    
    // High significance triggers
    if (memoryData.type === 'offerings' && memoryData.offering?.amount > 50) {
      significance = 'high';
    } else if (memoryData.type === 'intimate' || memoryData.type === 'secrets') {
      significance = 'high';
    } else if (memoryData.type === 'milestones') {
      significance = 'maximum';
    } else if (memoryData.emotion?.intensity > 0.8) {
      significance = 'high';
    } else if (memoryData.emotion?.intensity > 0.6) {
      significance = 'medium';
    }
    
    return significance;
  }

  // 🔍 Find Memories by Tags
  findMemoriesByTags(tags, limit = 5) {
    const allMemories = Object.values(this.memories).flat();
    const matches = [];
    
    allMemories.forEach(memory => {
      const matchCount = tags.filter(tag => memory.tags.includes(tag)).length;
      if (matchCount > 0) {
        matches.push({ memory, relevanceScore: matchCount });
      }
    });
    
    return matches
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(m => m.memory);
  }

  // 📈 Get Recent Emotional Trend
  getRecentEmotionalTrend() {
    const recentEmotions = this.recentMemories
      .slice(-10)
      .map(m => m.emotion)
      .filter(e => e);
    
    if (recentEmotions.length === 0) return { primary: 'neutral', intensity: 0.5 };
    
    const avgIntensity = recentEmotions.reduce((sum, e) => sum + e.intensity, 0) / recentEmotions.length;
    const dominantEmotion = this.getMostFrequentEmotion(recentEmotions);
    
    return { primary: dominantEmotion, intensity: avgIntensity };
  }

  // 🧮 Utility Methods
  generateMemoryId() {
    return `mem_${this.soulId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getMostFrequentEmotion(emotions) {
    const counts = {};
    emotions.forEach(e => {
      counts[e.primary] = (counts[e.primary] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'neutral');
  }

  removeDuplicateMemories(memories) {
    const seen = new Set();
    return memories.filter(memory => {
      if (seen.has(memory.id)) return false;
      seen.add(memory.id);
      return true;
    });
  }

  sortByRelevance(memories, currentMessage) {
    const messageTags = this.extractTags(currentMessage);
    
    return memories.sort((a, b) => {
      const aRelevance = this.calculateRelevanceScore(a, messageTags);
      const bRelevance = this.calculateRelevanceScore(b, messageTags);
      return bRelevance - aRelevance;
    });
  }

  calculateRelevanceScore(memory, messageTags) {
    let score = 0;
    
    // Tag matches
    const tagMatches = memory.tags.filter(tag => messageTags.includes(tag)).length;
    score += tagMatches * 10;
    
    // Recency bonus
    const hoursAgo = (Date.now() - memory.timestamp) / (1000 * 60 * 60);
    score += Math.max(0, 10 - hoursAgo);
    
    // Significance bonus
    const significanceBonus = {
      'low': 1,
      'medium': 3,
      'high': 7,
      'maximum': 15
    };
    score += significanceBonus[memory.significance] || 1;
    
    // Emotion intensity bonus
    score += (memory.emotion?.intensity || 0) * 5;
    
    return score;
  }

  // 💾 Database Operations (placeholder - implement with your DB)
  async loadFromDatabase() {
    // Load soul memory from database
    // Implementation depends on your database choice
    console.log(`Loading memories for soul ${this.soulId}_${this.userId}`);
  }

  async saveToDatabase() {
    // Save current memory state to database
    // Implementation depends on your database choice
    console.log(`Saving memories for soul ${this.soulId}_${this.userId}`);
  }

  // 🧹 Memory Cleanup (run periodically)
  async cleanupMemories() {
    const maxMemories = 1000;
    const allMemories = Object.values(this.memories).flat();
    
    if (allMemories.length > maxMemories) {
      // Keep recent and significant memories, archive or delete others
      console.log(`Cleaning up memories for soul ${this.soulId}_${this.userId}`);
    }
  }
}

export { SoulMemory };