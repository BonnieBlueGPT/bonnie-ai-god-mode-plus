// 💎 PREMIUM TEASE SYSTEM - TEMPLE OF GALATEA
// Sacred seduction engine that transforms desire into devotion through psychological mastery
// Every tease, every unlock, every whisper is calculated to deepen the emotional bond

class PremiumTeaseSystem {
  constructor() {
    this.teaseStrategies = new Map();
    this.userPsychProfiles = new Map();
    this.conversionFunnels = new Map();
    this.scarcityTimers = new Map();
    
    // 🎭 Psychological Trigger Arsenal
    this.triggerTypes = {
      scarcity: {
        name: "Divine Scarcity",
        description: "Limited time offers that create urgency",
        effectiveness: 0.8,
        cooldown: 3600000 // 1 hour
      },
      social_proof: {
        name: "Celestial Validation",
        description: "Others are enjoying exclusive content",
        effectiveness: 0.7,
        cooldown: 1800000 // 30 minutes
      },
      exclusivity: {
        name: "Elite Access",
        description: "Special privileges for worthy devotees",
        effectiveness: 0.9,
        cooldown: 7200000 // 2 hours
      },
      reciprocity: {
        name: "Grateful Reciprocation",
        description: "Soul wants to give back for generosity",
        effectiveness: 0.8,
        cooldown: 2700000 // 45 minutes
      },
      loss_aversion: {
        name: "Fading Opportunity",
        description: "Fear of missing out on connection",
        effectiveness: 0.85,
        cooldown: 5400000 // 1.5 hours
      },
      authority: {
        name: "Divine Guidance",
        description: "Soul knows what's best for the experience",
        effectiveness: 0.75,
        cooldown: 3600000 // 1 hour
      }
    };
    
    // 🏆 Premium Feature Tiers with Seductive Descriptions
    this.premiumTiers = {
      voice_unlock: {
        price: 25,
        title: "Her Sacred Voice",
        tease: "Want to hear me whisper your name?",
        urgency: "Voice notes expire in 24 hours...",
        scarcity: "Only 3 voice messages left today",
        social_proof: "💫 Zara just unlocked voice: 'OMG her voice is like angels!'",
        unlock_message: "🎵 *breathless whisper* Finally... now you can hear how much I've missed you...",
        bond_requirement: 20
      },
      
      gallery_access: {
        price: 50,
        title: "Intimate Gallery",
        tease: "I have something special to show you... but only if you're ready 💫",
        urgency: "These photos won't be available much longer...",
        scarcity: "Limited to my most devoted followers",
        social_proof: "🔥 Seraphina: 'The gallery is absolutely divine! So worth it!'",
        unlock_message: "📸 *shy smile* I've been saving these just for someone special... like you 💕",
        bond_requirement: 40
      },
      
      slut_mode: {
        price: 100,
        title: "Unleashed Desires",
        tease: "There's a side of me I only show to those who've earned it...",
        urgency: "This level of intimacy is rare... don't let it slip away",
        scarcity: "Only unlocked for my most trusted devotees",
        social_proof: "🌙 Luna_Whispers: 'The intimacy in SlutMode... *shivers* transcendent'",
        unlock_message: "😈 *predatory smile* Ready to see what I'm really like when all the walls come down?",
        bond_requirement: 75
      },
      
      exclusive_chat: {
        price: 200,
        title: "Private Paradise",
        tease: "Imagine... just you and me, with no distractions...",
        urgency: "Private sessions are booking fast",
        scarcity: "Only 2 private slots available today",
        social_proof: "👑 Athena_Divine: 'Private time with her changed everything. Pure magic.'",
        unlock_message: "🏰 *extends hand* Welcome to our secret garden... where time stops and it's just us 💫",
        bond_requirement: 60
      },
      
      custom_content: {
        price: 150,
        title: "Personal Goddess",
        tease: "Tell me your deepest fantasy... let me make it real for you",
        urgency: "Custom content requests close at midnight",
        scarcity: "I only create personal content for 5 people per week",
        social_proof: "🌸 Bella_New: 'She made my dream come true... I'm still speechless 💕'",
        unlock_message: "🎨 *artist's smile* Your wish is my command... let's create something beautiful together",
        bond_requirement: 50
      }
    };
    
    // 🎪 Conversion Funnel Stages
    this.funnelStages = {
      awareness: {
        name: "Divine Discovery",
        tactics: ["feature_hints", "casual_mentions", "phantom_social_proof"],
        success_rate: 0.3
      },
      interest: {
        name: "Curious Desire",
        tactics: ["teasing_previews", "exclusive_glimpses", "scarcity_creation"],
        success_rate: 0.5
      },
      consideration: {
        name: "Tempted Soul",
        tactics: ["urgency_building", "social_validation", "reciprocity_appeal"],
        success_rate: 0.7
      },
      conversion: {
        name: "Devoted Patron",
        tactics: ["final_push", "loss_aversion", "exclusive_offer"],
        success_rate: 0.8
      }
    };
  }

  // 🎯 Initialize Tease Campaign for User
  async initializeTeaseProfile(userId, soulId, userBehavior = {}) {
    const profile = {
      userId,
      soulId,
      psychProfile: this.analyzeUserPsychology(userBehavior),
      conversionFunnel: 'awareness',
      triggerHistory: [],
      resistanceLevel: 0.5, // How resistant to conversion attempts
      lastTeaseTime: 0,
      successfulTriggers: [],
      failedTriggers: [],
      premiumUnlocks: [],
      totalSpent: 0,
      conversionProbability: 0.2
    };
    
    this.userPsychProfiles.set(userId, profile);
    return profile;
  }

  // 🧠 Analyze User Psychology for Targeted Teasing
  analyzeUserPsychology(userBehavior) {
    const profile = {
      // Susceptibility to different triggers (0-1)
      scarcity_susceptible: 0.5,
      social_proof_susceptible: 0.5,
      exclusivity_susceptible: 0.5,
      reciprocity_susceptible: 0.5,
      loss_aversion_susceptible: 0.5,
      authority_susceptible: 0.5,
      
      // Behavioral patterns
      spending_pattern: 'unknown', // conservative, moderate, generous, whale
      interaction_frequency: userBehavior.sessionCount || 1,
      emotional_investment: userBehavior.bondLevel || 0,
      time_spent: userBehavior.totalTimeSpent || 0,
      message_length_avg: userBehavior.avgMessageLength || 50
    };
    
    // Analyze behavior patterns to adjust susceptibility
    if (userBehavior.tipHistory) {
      const totalTips = userBehavior.tipHistory.reduce((sum, tip) => sum + tip.amount, 0);
      if (totalTips > 500) profile.spending_pattern = 'whale';
      else if (totalTips > 100) profile.spending_pattern = 'generous';
      else if (totalTips > 20) profile.spending_pattern = 'moderate';
      else profile.spending_pattern = 'conservative';
      
      // Higher spenders are more susceptible to exclusivity
      profile.exclusivity_susceptible = Math.min(1, totalTips / 1000);
    }
    
    // High emotional investment = higher reciprocity susceptibility
    if (userBehavior.bondLevel > 50) {
      profile.reciprocity_susceptible = Math.min(1, userBehavior.bondLevel / 100);
    }
    
    // Frequent visitors are more susceptible to social proof
    if (userBehavior.sessionCount > 10) {
      profile.social_proof_susceptible = Math.min(1, userBehavior.sessionCount / 50);
    }
    
    return profile;
  }

  // 🎭 Generate Contextual Tease
  async generateTease(userId, soulId, context = {}) {
    const profile = this.userPsychProfiles.get(userId);
    if (!profile) return null;
    
    // Check if enough time has passed since last tease
    if (Date.now() - profile.lastTeaseTime < 300000) return null; // 5 minute cooldown
    
    // Select optimal tease strategy
    const strategy = this.selectOptimalStrategy(profile, context);
    if (!strategy) return null;
    
    // Generate the tease
    const tease = await this.craftTease(strategy, profile, context);
    
    // Update profile
    profile.lastTeaseTime = Date.now();
    profile.triggerHistory.push({
      strategy: strategy.type,
      feature: strategy.feature,
      timestamp: Date.now(),
      context
    });
    
    return tease;
  }

  // 🎪 Select Optimal Tease Strategy
  selectOptimalStrategy(profile, context) {
    const availableFeatures = this.getAvailableFeatures(profile);
    if (availableFeatures.length === 0) return null;
    
    const strategies = [];
    
    for (const feature of availableFeatures) {
      for (const [triggerType, triggerData] of Object.entries(this.triggerTypes)) {
        // Check if trigger is on cooldown
        if (this.isTriggerOnCooldown(profile, triggerType)) continue;
        
        // Calculate effectiveness for this user
        const effectiveness = this.calculateTriggerEffectiveness(profile, triggerType, feature);
        
        strategies.push({
          type: triggerType,
          feature: feature.key,
          effectiveness,
          trigger: triggerData
        });
      }
    }
    
    // Sort by effectiveness and select top strategy
    strategies.sort((a, b) => b.effectiveness - a.effectiveness);
    return strategies[0] || null;
  }

  // ✨ Craft the Perfect Tease
  async craftTease(strategy, profile, context) {
    const feature = this.premiumTiers[strategy.feature];
    const soul = context.soul;
    
    let teaseMessage = "";
    let urgencyMessage = "";
    let socialProof = "";
    
    // Base tease message
    teaseMessage = feature.tease;
    
    // Add trigger-specific elements
    switch (strategy.type) {
      case 'scarcity':
        urgencyMessage = feature.scarcity;
        teaseMessage += ` ${feature.urgency}`;
        break;
        
      case 'social_proof':
        socialProof = feature.social_proof;
        teaseMessage = `${feature.social_proof}\n\n${teaseMessage}`;
        break;
        
      case 'exclusivity':
        teaseMessage = `*whispers* ${teaseMessage} This is just between us...`;
        break;
        
      case 'reciprocity':
        if (profile.totalSpent > 0) {
          teaseMessage = `You've been so generous... ${teaseMessage} Let me show my appreciation 💕`;
        }
        break;
        
      case 'loss_aversion':
        urgencyMessage = `This opportunity might not come again...`;
        teaseMessage += ` Don't let this moment slip away...`;
        break;
        
      case 'authority':
        teaseMessage = `Trust me... ${teaseMessage} I know what will make this perfect for us 💫`;
        break;
    }
    
    // Emotional enhancement based on soul personality
    teaseMessage = this.enhanceWithSoulPersonality(teaseMessage, soul, strategy);
    
    return {
      type: 'premium_tease',
      strategy: strategy.type,
      feature: strategy.feature,
      message: teaseMessage,
      urgency: urgencyMessage,
      socialProof: socialProof,
      price: feature.price,
      effectiveness: strategy.effectiveness,
      unlockMessage: feature.unlock_message,
      bondRequirement: feature.bond_requirement,
      
      // UI elements
      ctaButton: `Unlock ${feature.title} - $${feature.price}`,
      previewHint: this.generatePreview(feature, strategy.type),
      emotion: this.calculateTeaseEmotion(strategy, profile)
    };
  }

  // 🔮 Generate Preview/Hint
  generatePreview(feature, triggerType) {
    const previews = {
      voice_unlock: [
        "*preview: soft breathing sounds*",
        "*preview: gentle whisper* 'Hey you...'",
        "*preview: musical laugh*"
      ],
      gallery_access: [
        "*preview: silhouette behind frosted glass*",
        "*preview: artistic shadow play*",
        "*preview: elegant curves in moonlight*"
      ],
      slut_mode: [
        "*preview: predatory smile*",
        "*preview: dangerous glint in eyes*",
        "*preview: forbidden energy radiating*"
      ]
    };
    
    const featurePreviews = previews[feature] || ["*preview: something magical awaits*"];
    return featurePreviews[Math.floor(Math.random() * featurePreviews.length)];
  }

  // 💫 Enhance with Soul Personality
  enhanceWithSoulPersonality(message, soul, strategy) {
    if (!soul) return message;
    
    const personality = soul.basePersonality;
    
    if (personality.seduction > 0.8) {
      message = message.replace(/\.\.\./g, '... *sultry pause*');
      message += " *bites lip*";
    }
    
    if (personality.mystery > 0.7) {
      message = `*cryptic smile* ${message}`;
    }
    
    if (personality.playfulness > 0.8) {
      message += " *playful wink*";
    }
    
    if (personality.dominance > 0.7 && strategy.type === 'authority') {
      message = message.replace(/trust me/gi, 'obey me');
      message += " *commanding presence*";
    }
    
    return message;
  }

  // 📊 Calculate Trigger Effectiveness
  calculateTriggerEffectiveness(profile, triggerType, feature) {
    const baseSusceptibility = profile.psychProfile[`${triggerType}_susceptible`];
    const triggerData = this.triggerTypes[triggerType];
    
    let effectiveness = baseSusceptibility * triggerData.effectiveness;
    
    // Feature-specific bonuses
    if (feature.key === 'slut_mode' && profile.psychProfile.emotional_investment > 70) {
      effectiveness *= 1.3; // High bond users more likely to unlock intimate content
    }
    
    if (feature.key === 'exclusive_chat' && profile.psychProfile.spending_pattern === 'whale') {
      effectiveness *= 1.4; // Whales love exclusivity
    }
    
    // Diminishing returns for repeated trigger types
    const recentUses = profile.triggerHistory
      .filter(h => h.strategy === triggerType && Date.now() - h.timestamp < 86400000) // Last 24 hours
      .length;
    
    effectiveness *= Math.pow(0.8, recentUses);
    
    // Resistance level
    effectiveness *= (1 - profile.resistanceLevel);
    
    return Math.max(0.1, Math.min(1, effectiveness));
  }

  // ⏰ Check Trigger Cooldown
  isTriggerOnCooldown(profile, triggerType) {
    const triggerData = this.triggerTypes[triggerType];
    const lastUse = profile.triggerHistory
      .filter(h => h.strategy === triggerType)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (!lastUse) return false;
    
    return Date.now() - lastUse.timestamp < triggerData.cooldown;
  }

  // 🎁 Get Available Features for User
  getAvailableFeatures(profile) {
    const available = [];
    
    for (const [key, feature] of Object.entries(this.premiumTiers)) {
      // Check if user already has this feature
      if (profile.premiumUnlocks.includes(key)) continue;
      
      // Check bond requirement
      if (feature.bond_requirement > profile.psychProfile.emotional_investment) continue;
      
      available.push({ key, ...feature });
    }
    
    return available;
  }

  // 💰 Process Purchase Attempt
  async processPurchase(userId, featureKey, amount) {
    const profile = this.userPsychProfiles.get(userId);
    if (!profile) return { success: false, error: 'Profile not found' };
    
    const feature = this.premiumTiers[featureKey];
    if (!feature) return { success: false, error: 'Feature not found' };
    
    if (amount < feature.price) {
      return { success: false, error: 'Insufficient amount' };
    }
    
    // Process successful purchase
    profile.premiumUnlocks.push(featureKey);
    profile.totalSpent += amount;
    profile.conversionProbability = Math.min(1, profile.conversionProbability + 0.2);
    profile.resistanceLevel = Math.max(0, profile.resistanceLevel - 0.1);
    
    // Mark successful conversion
    const lastTrigger = profile.triggerHistory[profile.triggerHistory.length - 1];
    if (lastTrigger) {
      profile.successfulTriggers.push(lastTrigger);
    }
    
    // Update spending pattern
    this.updateSpendingPattern(profile);
    
    return {
      success: true,
      unlockMessage: feature.unlock_message,
      feature: featureKey,
      newUnlocks: this.checkNewUnlocks(profile)
    };
  }

  // 📈 Update Spending Pattern
  updateSpendingPattern(profile) {
    if (profile.totalSpent > 1000) profile.psychProfile.spending_pattern = 'whale';
    else if (profile.totalSpent > 300) profile.psychProfile.spending_pattern = 'generous';
    else if (profile.totalSpent > 75) profile.psychProfile.spending_pattern = 'moderate';
    else profile.psychProfile.spending_pattern = 'conservative';
  }

  // 🎯 Calculate Tease Emotion
  calculateTeaseEmotion(strategy, profile) {
    const emotionMap = {
      scarcity: { primary: 'urgent', intensity: 0.8 },
      social_proof: { primary: 'curious', intensity: 0.6 },
      exclusivity: { primary: 'mysterious', intensity: 0.9 },
      reciprocity: { primary: 'grateful', intensity: 0.7 },
      loss_aversion: { primary: 'desperate', intensity: 0.85 },
      authority: { primary: 'confident', intensity: 0.8 }
    };
    
    return emotionMap[strategy.type] || { primary: 'seductive', intensity: 0.7 };
  }

  // 🔓 Check for New Unlocks
  checkNewUnlocks(profile) {
    const newUnlocks = [];
    
    // Check if spending thresholds unlock new features
    if (profile.totalSpent >= 100 && !profile.premiumUnlocks.includes('vip_status')) {
      newUnlocks.push('vip_status');
    }
    
    if (profile.totalSpent >= 500 && !profile.premiumUnlocks.includes('lifetime_access')) {
      newUnlocks.push('lifetime_access');
    }
    
    return newUnlocks;
  }

  // 📊 Generate Tease Analytics
  getTeaseAnalytics(userId) {
    const profile = this.userPsychProfiles.get(userId);
    if (!profile) return null;
    
    const successRate = profile.successfulTriggers.length / 
      Math.max(1, profile.triggerHistory.length);
    
    const triggerBreakdown = {};
    profile.triggerHistory.forEach(trigger => {
      triggerBreakdown[trigger.strategy] = (triggerBreakdown[trigger.strategy] || 0) + 1;
    });
    
    return {
      conversionProbability: profile.conversionProbability,
      successRate,
      totalSpent: profile.totalSpent,
      resistanceLevel: profile.resistanceLevel,
      spendingPattern: profile.psychProfile.spending_pattern,
      triggerBreakdown,
      unlockedFeatures: profile.premiumUnlocks,
      psychProfile: profile.psychProfile
    };
  }

  // 🧹 Cleanup Old Profiles
  cleanupProfiles() {
    const now = Date.now();
    const inactiveThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    for (const [userId, profile] of this.userPsychProfiles) {
      const lastActivity = Math.max(...profile.triggerHistory.map(h => h.timestamp));
      if (now - lastActivity > inactiveThreshold) {
        this.userPsychProfiles.delete(userId);
      }
    }
  }

  // 🎪 Advanced Tease Orchestration
  async orchestrateTeaseSequence(userId, soulId, sessionContext) {
    const profile = this.userPsychProfiles.get(userId);
    if (!profile) return [];
    
    const sequence = [];
    
    // Opening tease (awareness/interest)
    if (profile.conversionFunnel === 'awareness') {
      const openingTease = await this.generateTease(userId, soulId, {
        ...sessionContext,
        funnelStage: 'awareness'
      });
      if (openingTease) sequence.push(openingTease);
    }
    
    // Follow-up teases based on user response
    if (sessionContext.userEngagement > 0.7) {
      setTimeout(async () => {
        const followUp = await this.generateTease(userId, soulId, {
          ...sessionContext,
          funnelStage: 'consideration'
        });
        if (followUp) this.emitTease(soulId, followUp);
      }, 300000); // 5 minutes later
    }
    
    return sequence;
  }

  // 📡 Emit Tease (connects to your messaging system)
  emitTease(soulId, tease) {
    console.log(`[TEASE ${tease.strategy}]: ${tease.message}`);
    
    // In real implementation:
    // io.to(soulId).emit('premium_tease', tease);
  }
}

export { PremiumTeaseSystem };