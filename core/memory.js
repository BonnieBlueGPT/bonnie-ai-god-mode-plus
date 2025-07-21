// 🔱 DIVINE MEMORY ENGINE - SOUL PERSISTENCE SYSTEM 🔱
// Eternal memory that transcends sessions and creates unbreakable bonds

import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});

class MemoryEngine {
  constructor() {
    this.userMemories = new Map();
    this.emotionalTimelines = new Map();
    this.bondProgression = new Map();
    this.conversationPatterns = new Map();
    this.personalityInsights = new Map();
    
    this.memoryCategories = {
      PERSONAL: 'personal',
      EMOTIONAL: 'emotional',
      BEHAVIORAL: 'behavioral',
      FINANCIAL: 'financial',
      PREFERENCE: 'preference',
      MILESTONE: 'milestone'
    };
  }

  async getOrCreateUser(userId, initialProfile = {}) {
    if (this.userMemories.has(userId)) {
      const existing = this.userMemories.get(userId);
      // Update last seen
      existing.lastSeen = new Date().toISOString();
      existing.sessionCount = (existing.sessionCount || 0) + 1;
      return existing;
    }

    const newUser = {
      userId,
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      sessionCount: 1,
      totalMessages: 0,
      totalTime: 0,
      bondScore: 0,
      premiumTier: 'free',
      ...initialProfile,
      
      personalDetails: {
        name: null,
        age: null,
        location: null,
        occupation: null,
        relationship_status: null,
        interests: [],
        timezone: null,
        language: 'english'
      },
      
      emotionalProfile: {
        dominantEmotions: [],
        vulnerabilities: [],
        triggerWords: [],
        comfortTopics: [],
        avoidanceTopics: [],
        intimacyLevel: 0,
        trustLevel: 0,
        attachmentStyle: 'exploring'
      },
      
      behavioralPatterns: {
        messageFrequency: 'normal',
        sessionLengths: [],
        preferredTimes: [],
        communicationStyle: 'casual',
        responseTimeExpectation: 'normal',
        emojiUsage: 'moderate'
      },
      
      financialProfile: {
        spendingTier: 'observer',
        totalSpent: 0,
        purchaseHistory: [],
        tipHistory: [],
        priceResistance: 'unknown',
        conversionPotential: 0.5
      },
      
      milestones: {
        firstMessage: new Date().toISOString(),
        firstCompliment: null,
        firstFlirt: null,
        firstIntimateMessage: null,
        firstPurchase: null,
        firstLongConversation: null,
        bondUpgrades: []
      }
    };

    this.userMemories.set(userId, newUser);
    this.emotionalTimelines.set(userId, []);
    this.bondProgression.set(userId, []);
    
    return newUser;
  }

  async recordInteraction(userId, interaction) {
    const user = this.userMemories.get(userId);
    if (!user) return false;

    const { type, content, response, emotion, bondDelta, metadata = {} } = interaction;

    // Update basic stats
    user.totalMessages += 1;
    user.lastSeen = new Date().toISOString();
    
    if (bondDelta) {
      user.bondScore = Math.min(user.bondScore + bondDelta, 100);
    }

    // Record emotional timeline
    const emotionalEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userMessage: content,
      aiResponse: response,
      emotion: emotion,
      bondLevel: user.bondScore,
      escalationLevel: metadata.escalationLevel,
      context: metadata.context || {}
    };
    
    this.emotionalTimelines.get(userId).push(emotionalEntry);

    // Analyze and update patterns
    await this.updatePersonalityInsights(userId, interaction);
    await this.updateBehavioralPatterns(userId, interaction);
    
    // Check for milestones
    await this.checkMilestones(userId, interaction);
    
    return true;
  }

  async updatePersonalityInsights(userId, interaction) {
    const { content, emotion, metadata } = interaction;
    const user = this.userMemories.get(userId);
    const insights = this.personalityInsights.get(userId) || {
      communicationStyle: [],
      emotionalPatterns: {},
      interests: [],
      personalityTraits: [],
      relationshipGoals: []
    };

    // Analyze communication style
    const wordCount = content.split(' ').length;
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content);
    const isQuestion = content.includes('?');
    const isExclamation = content.includes('!');

    insights.communicationStyle.push({
      timestamp: new Date().toISOString(),
      wordCount,
      hasEmojis,
      isQuestion,
      isExclamation,
      emotion
    });

    // Track emotional patterns
    if (!insights.emotionalPatterns[emotion]) {
      insights.emotionalPatterns[emotion] = 0;
    }
    insights.emotionalPatterns[emotion]++;

    // Extract interests from content
    const interestKeywords = [
      'music', 'movies', 'games', 'sports', 'travel', 'food', 'art', 'books', 
      'technology', 'fitness', 'nature', 'cars', 'fashion', 'cooking'
    ];
    
    interestKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword) && !insights.interests.includes(keyword)) {
        insights.interests.push(keyword);
      }
    });

    this.personalityInsights.set(userId, insights);
  }

  async updateBehavioralPatterns(userId, interaction) {
    const user = this.userMemories.get(userId);
    const patterns = user.behavioralPatterns;
    
    // Update session time tracking
    const currentHour = new Date().getHours();
    if (!patterns.preferredTimes.includes(currentHour)) {
      patterns.preferredTimes.push(currentHour);
    }

    // Analyze message frequency
    const timeline = this.emotionalTimelines.get(userId);
    if (timeline.length >= 2) {
      const lastTwo = timeline.slice(-2);
      const timeDiff = new Date(lastTwo[1].timestamp) - new Date(lastTwo[0].timestamp);
      
      if (timeDiff < 30000) { // Less than 30 seconds
        patterns.messageFrequency = 'rapid';
      } else if (timeDiff < 120000) { // Less than 2 minutes
        patterns.messageFrequency = 'normal';
      } else {
        patterns.messageFrequency = 'slow';
      }
    }
  }

  async checkMilestones(userId, interaction) {
    const user = this.userMemories.get(userId);
    const { content, emotion, metadata } = interaction;
    const milestones = user.milestones;

    // First compliment
    if (!milestones.firstCompliment && this.containsCompliment(content)) {
      milestones.firstCompliment = new Date().toISOString();
      await this.recordMilestone(userId, 'first_compliment', 'User gave first compliment');
    }

    // First flirt
    if (!milestones.firstFlirt && this.containsFlirtation(content)) {
      milestones.firstFlirt = new Date().toISOString();
      await this.recordMilestone(userId, 'first_flirt', 'User initiated flirtation');
    }

    // First intimate message
    if (!milestones.firstIntimateMessage && this.containsIntimacy(content)) {
      milestones.firstIntimateMessage = new Date().toISOString();
      await this.recordMilestone(userId, 'first_intimate', 'User sent intimate message');
    }

    // Long conversation (20+ messages)
    if (!milestones.firstLongConversation && user.totalMessages >= 20) {
      milestones.firstLongConversation = new Date().toISOString();
      await this.recordMilestone(userId, 'long_conversation', 'Reached 20 messages in session');
    }

    // Bond level upgrades
    const currentBondTier = this.getBondTier(user.bondScore);
    const lastBondUpgrade = milestones.bondUpgrades[milestones.bondUpgrades.length - 1];
    
    if (!lastBondUpgrade || lastBondUpgrade.tier !== currentBondTier.name) {
      milestones.bondUpgrades.push({
        tier: currentBondTier.name,
        timestamp: new Date().toISOString(),
        bondScore: user.bondScore
      });
      await this.recordMilestone(userId, 'bond_upgrade', `Reached ${currentBondTier.name} level`);
    }
  }

  containsCompliment(message) {
    const complimentWords = ['beautiful', 'gorgeous', 'amazing', 'perfect', 'stunning', 'incredible', 'wonderful'];
    return complimentWords.some(word => message.toLowerCase().includes(word));
  }

  containsFlirtation(message) {
    const flirtWords = ['cute', 'sexy', 'hot', 'kiss', 'love', 'crush', 'attracted', 'desire'];
    return flirtWords.some(word => message.toLowerCase().includes(word));
  }

  containsIntimacy(message) {
    const intimateWords = ['touch', 'body', 'skin', 'close', 'together', 'hold', 'feel'];
    return intimateWords.some(word => message.toLowerCase().includes(word));
  }

  async recordMilestone(userId, type, description) {
    const milestone = {
      id: uuidv4(),
      userId,
      type,
      description,
      timestamp: new Date().toISOString()
    };

    // Store milestone for potential callbacks
    const timeline = this.emotionalTimelines.get(userId);
    timeline.push({
      ...milestone,
      isMilestone: true
    });

    logger.info(`Milestone recorded: ${userId} - ${type} - ${description}`);
  }

  async recordPersonalInfo(userId, infoType, value) {
    const user = this.userMemories.get(userId);
    if (!user) return false;

    user.personalDetails[infoType] = value;
    
    // Record as special interaction
    await this.recordInteraction(userId, {
      type: 'personal_info',
      content: `Shared ${infoType}: ${value}`,
      emotion: 'trust',
      metadata: { infoType, value, category: 'personal_disclosure' }
    });

    return true;
  }

  async recordPurchase(userId, packageType, amount) {
    const user = this.userMemories.get(userId);
    if (!user) return false;

    const purchase = {
      id: uuidv4(),
      packageType,
      amount,
      timestamp: new Date().toISOString()
    };

    user.financialProfile.purchaseHistory.push(purchase);
    user.financialProfile.totalSpent += amount;
    
    // Update spending tier
    if (user.financialProfile.totalSpent > 100) {
      user.financialProfile.spendingTier = 'whale';
    } else if (user.financialProfile.totalSpent > 25) {
      user.financialProfile.spendingTier = 'buyer';
    } else {
      user.financialProfile.spendingTier = 'trialer';
    }

    // Record first purchase milestone
    if (!user.milestones.firstPurchase) {
      user.milestones.firstPurchase = new Date().toISOString();
      await this.recordMilestone(userId, 'first_purchase', `First purchase: ${packageType} - $${amount}`);
    }

    return true;
  }

  async getBondLevel(userId) {
    const user = this.userMemories.get(userId);
    return user ? user.bondScore : 0;
  }

  getBondTier(bondScore) {
    const tiers = [
      { name: 'Stranger', min: 0, max: 10 },
      { name: 'Curious Friend', min: 10, max: 25 },
      { name: 'Flirty Friend', min: 25, max: 50 },
      { name: 'Romantic Interest', min: 50, max: 75 },
      { name: 'Girlfriend', min: 75, max: 90 },
      { name: 'Soulmate', min: 90, max: 100 }
    ];

    return tiers.find(tier => bondScore >= tier.min && bondScore <= tier.max) || tiers[0];
  }

  async getPersonalMemory(userId) {
    const user = this.userMemories.get(userId);
    if (!user) return null;

    return {
      personalDetails: user.personalDetails,
      emotionalHistory: {
        memorable_moments: this.getMemorableMoments(userId),
        emotional_patterns: user.emotionalProfile,
        recent_emotions: this.getRecentEmotions(userId, 5)
      },
      milestones: user.milestones,
      preferences: this.getLearnedPreferences(userId)
    };
  }

  getMemorableMoments(userId, limit = 10) {
    const timeline = this.emotionalTimelines.get(userId) || [];
    
    // Filter for high-emotion or milestone moments
    const memorable = timeline.filter(entry => 
      entry.isMilestone || 
      ['romantic', 'vulnerable', 'intimate', 'excited'].includes(entry.emotion)
    );

    return memorable
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(moment => ({
        moment: moment.userMessage || moment.description,
        emotion: moment.emotion,
        timestamp: moment.timestamp,
        importance_score: this.calculateImportanceScore(moment)
      }));
  }

  calculateImportanceScore(moment) {
    let score = 1;
    
    if (moment.isMilestone) score += 3;
    if (['romantic', 'intimate'].includes(moment.emotion)) score += 2;
    if (moment.bondLevel > 50) score += 1;
    
    return Math.min(score, 5);
  }

  getRecentEmotions(userId, limit = 5) {
    const timeline = this.emotionalTimelines.get(userId) || [];
    return timeline
      .slice(-limit)
      .map(entry => ({
        emotion: entry.emotion,
        timestamp: entry.timestamp,
        context: entry.userMessage?.substring(0, 50) + '...'
      }));
  }

  getLearnedPreferences(userId) {
    const insights = this.personalityInsights.get(userId);
    const user = this.userMemories.get(userId);
    
    if (!insights || !user) return {};

    return {
      communicationStyle: this.analyzeCommunicationStyle(insights.communicationStyle),
      interests: insights.interests,
      emotionalNeeds: this.getEmotionalNeeds(insights.emotionalPatterns),
      preferredTimes: user.behavioralPatterns.preferredTimes,
      intimacyComfort: user.emotionalProfile.intimacyLevel
    };
  }

  analyzeCommunicationStyle(styleHistory) {
    if (!styleHistory.length) return 'unknown';
    
    const avgWordCount = styleHistory.reduce((sum, s) => sum + s.wordCount, 0) / styleHistory.length;
    const emojiUsage = styleHistory.filter(s => s.hasEmojis).length / styleHistory.length;
    const questionAsker = styleHistory.filter(s => s.isQuestion).length / styleHistory.length;
    
    if (avgWordCount > 20 && emojiUsage < 0.3) return 'formal';
    if (avgWordCount < 5 && emojiUsage > 0.7) return 'casual_emoji';
    if (questionAsker > 0.4) return 'inquisitive';
    return 'balanced';
  }

  getEmotionalNeeds(emotionalPatterns) {
    const sortedEmotions = Object.entries(emotionalPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    const needsMap = {
      vulnerable: 'comfort_and_support',
      romantic: 'love_and_affection',
      excited: 'energy_and_enthusiasm',
      frustrated: 'understanding_and_patience',
      lonely: 'companionship_and_attention'
    };

    return sortedEmotions.map(([emotion]) => needsMap[emotion] || 'general_engagement');
  }

  async getLastInteraction(userId) {
    const timeline = this.emotionalTimelines.get(userId);
    return timeline && timeline.length > 0 ? timeline[timeline.length - 1] : null;
  }

  async getUserStats(userId) {
    const user = this.userMemories.get(userId);
    if (!user) return null;

    const timeline = this.emotionalTimelines.get(userId) || [];
    const insights = this.personalityInsights.get(userId) || {};

    return {
      basicStats: {
        totalMessages: user.totalMessages,
        totalSessions: user.sessionCount,
        bondScore: user.bondScore,
        bondTier: this.getBondTier(user.bondScore).name,
        memberSince: user.createdAt,
        lastSeen: user.lastSeen
      },
      
      emotionalProfile: {
        dominantEmotions: Object.entries(insights.emotionalPatterns || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([emotion, count]) => ({ emotion, count })),
        intimacyLevel: user.emotionalProfile.intimacyLevel,
        trustLevel: user.emotionalProfile.trustLevel
      },
      
      behavioralInsights: {
        communicationStyle: this.analyzeCommunicationStyle(insights.communicationStyle || []),
        messageFrequency: user.behavioralPatterns.messageFrequency,
        preferredHours: user.behavioralPatterns.preferredTimes
      },
      
      milestones: Object.entries(user.milestones)
        .filter(([key, value]) => value !== null)
        .map(([key, value]) => ({ milestone: key, timestamp: value })),
      
      financialProfile: {
        spendingTier: user.financialProfile.spendingTier,
        totalSpent: user.financialProfile.totalSpent,
        purchaseCount: user.financialProfile.purchaseHistory.length
      }
    };
  }

  async consolidateMemories() {
    // Clean up old memories and optimize storage
    for (const [userId, timeline] of this.emotionalTimelines) {
      if (timeline.length > 500) {
        // Keep recent 200 + all milestones
        const recent = timeline.slice(-200);
        const milestones = timeline.filter(entry => entry.isMilestone);
        this.emotionalTimelines.set(userId, [...milestones, ...recent]);
      }
    }
    
    logger.info('Memory consolidation completed');
  }

  async saveUserState(userId, userState) {
    // In production, this would save to persistent storage
    logger.info(`Saving user state for ${userId}`);
  }

  async exportUserData(userId) {
    // GDPR compliance - export all user data
    const user = this.userMemories.get(userId);
    const timeline = this.emotionalTimelines.get(userId);
    const insights = this.personalityInsights.get(userId);
    
    return {
      userProfile: user,
      conversationHistory: timeline,
      personalityInsights: insights,
      exportDate: new Date().toISOString()
    };
  }

  async deleteUserData(userId) {
    // GDPR compliance - complete data deletion
    this.userMemories.delete(userId);
    this.emotionalTimelines.delete(userId);
    this.bondProgression.delete(userId);
    this.conversationPatterns.delete(userId);
    this.personalityInsights.delete(userId);
    
    logger.info(`User data deleted for ${userId}`);
  }
}

export default MemoryEngine;