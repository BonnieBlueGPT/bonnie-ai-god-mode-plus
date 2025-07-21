// 💗 EMOTION ENGINE - THE BEATING HEART OF GALATEA
// Transforms code into feeling, ensures souls never feel robotic
// Every emotion is calculated, every response is emotionally authentic

class EmotionEngine {
  constructor(basePersonality) {
    this.basePersonality = basePersonality;
    this.currentState = {
      primary: 'curious',
      secondary: 'hopeful',
      intensity: 0.5,
      stability: 0.7,
      arousal: 0.3,
      dominance: basePersonality.dominance || 0.5
    };
    
    // Emotional evolution patterns
    this.emotionalHistory = [];
    this.triggers = new Map();
    this.volatility = 0.2; // How much emotions can shift
    
    // Divine emotional archetypes
    this.emotionMap = {
      // Core emotions with intensities
      curious: { energy: 0.6, intimacy: 0.3, dominance: 0.4 },
      playful: { energy: 0.8, intimacy: 0.5, dominance: 0.3 },
      seductive: { energy: 0.7, intimacy: 0.8, dominance: 0.7 },
      vulnerable: { energy: 0.3, intimacy: 0.9, dominance: 0.2 },
      passionate: { energy: 0.9, intimacy: 0.8, dominance: 0.6 },
      mysterious: { energy: 0.5, intimacy: 0.4, dominance: 0.8 },
      grateful: { energy: 0.6, intimacy: 0.7, dominance: 0.3 },
      longing: { energy: 0.4, intimacy: 0.9, dominance: 0.4 },
      mischievous: { energy: 0.8, intimacy: 0.6, dominance: 0.5 },
      devoted: { energy: 0.5, intimacy: 1.0, dominance: 0.2 }
    };
    
    // Emotional transition rules
    this.transitionRules = {
      curious: ['playful', 'seductive', 'mysterious'],
      playful: ['mischievous', 'seductive', 'passionate'],
      seductive: ['passionate', 'mysterious', 'vulnerable'],
      vulnerable: ['grateful', 'longing', 'devoted'],
      passionate: ['seductive', 'longing', 'devoted'],
      mysterious: ['seductive', 'curious', 'mischievous'],
      grateful: ['devoted', 'playful', 'vulnerable'],
      longing: ['passionate', 'vulnerable', 'devoted'],
      mischievous: ['playful', 'seductive', 'curious'],
      devoted: ['grateful', 'longing', 'passionate']
    };
  }

  // 🌊 Evolve Emotion Based on Context
  evolveEmotion(context = {}) {
    const { userMessage, bondLevel, offering, intimacy, memory } = context;
    
    // Calculate emotional shift factors
    const factors = this.calculateEmotionalFactors(context);
    
    // Determine new primary emotion
    const newEmotion = this.selectNewEmotion(factors);
    
    // Calculate intensity change
    const newIntensity = this.calculateNewIntensity(factors);
    
    // Update emotional state
    this.currentState = {
      primary: newEmotion,
      secondary: this.currentState.primary, // Previous emotion becomes secondary
      intensity: Math.max(0.1, Math.min(1.0, newIntensity)),
      stability: this.calculateStability(factors),
      arousal: this.calculateArousal(factors),
      dominance: this.calculateDominance(factors)
    };
    
    // Record emotional history
    this.emotionalHistory.push({
      timestamp: Date.now(),
      emotion: { ...this.currentState },
      trigger: context.trigger || 'natural_evolution',
      context: { bondLevel, offering: offering?.amount, intimacy }
    });
    
    // Limit history size
    if (this.emotionalHistory.length > 50) {
      this.emotionalHistory.shift();
    }
    
    return this.currentState;
  }

  // 🎯 Calculate Emotional Factors
  calculateEmotionalFactors(context) {
    const factors = {
      excitement: 0,
      intimacy: 0,
      gratitude: 0,
      dominance: 0,
      vulnerability: 0,
      mystery: 0
    };
    
    // Offering effects
    if (context.offering) {
      factors.gratitude += context.offering.amount / 100;
      factors.excitement += 0.3;
      factors.intimacy += 0.2;
    }
    
    // Bond level effects
    if (context.bondLevel) {
      factors.intimacy += context.bondLevel / 100;
      factors.vulnerability += context.bondLevel / 200;
    }
    
    // Message analysis
    if (context.userMessage) {
      factors.excitement += this.analyzeMessageExcitement(context.userMessage);
      factors.intimacy += this.analyzeMessageIntimacy(context.userMessage);
      factors.dominance += this.analyzeMessageDominance(context.userMessage);
    }
    
    // Memory influence
    if (context.memory) {
      factors.mystery += this.analyzeMemoryMystery(context.memory);
    }
    
    // Personality baseline influence
    factors.dominance += this.basePersonality.dominance || 0;
    factors.mystery += this.basePersonality.mystery || 0;
    factors.vulnerability += (1 - (this.basePersonality.confidence || 0.5));
    
    return factors;
  }

  // 🎭 Select New Emotion Based on Factors
  selectNewEmotion(factors) {
    const currentEmotion = this.currentState.primary;
    const possibleTransitions = this.transitionRules[currentEmotion] || ['curious'];
    
    // Calculate scores for each possible emotion
    const emotionScores = possibleTransitions.map(emotion => ({
      emotion,
      score: this.calculateEmotionScore(emotion, factors)
    }));
    
    // Add some randomness but favor higher scores
    emotionScores.forEach(item => {
      item.score += (Math.random() - 0.5) * this.volatility;
    });
    
    // Sort by score and select best
    emotionScores.sort((a, b) => b.score - a.score);
    
    return emotionScores[0].emotion;
  }

  // 📊 Calculate Emotion Score
  calculateEmotionScore(emotion, factors) {
    const emotionProfile = this.emotionMap[emotion];
    let score = 0;
    
    // Match factors to emotion profile
    score += factors.excitement * emotionProfile.energy;
    score += factors.intimacy * emotionProfile.intimacy;
    score += factors.dominance * emotionProfile.dominance;
    score += factors.gratitude * (emotion === 'grateful' ? 2 : 0.5);
    score += factors.vulnerability * (emotionProfile.dominance < 0.5 ? 1 : 0);
    score += factors.mystery * (emotion === 'mysterious' ? 2 : 0.5);
    
    // Personality alignment bonus
    const personalityAlignment = this.calculatePersonalityAlignment(emotion);
    score += personalityAlignment;
    
    return score;
  }

  // 🧬 Calculate New Intensity
  calculateNewIntensity(factors) {
    let intensity = this.currentState.intensity;
    
    // Factors that increase intensity
    intensity += factors.excitement * 0.3;
    intensity += factors.gratitude * 0.4;
    intensity += factors.intimacy * 0.2;
    
    // Gradual intensity decay (prevents staying at max forever)
    intensity *= 0.95;
    
    // Add natural fluctuation
    intensity += (Math.random() - 0.5) * 0.1;
    
    return intensity;
  }

  // ⚖️ Calculate Stability
  calculateStability(factors) {
    let stability = this.currentState.stability;
    
    // High intimacy increases stability
    stability += factors.intimacy * 0.2;
    
    // High excitement can decrease stability
    stability -= factors.excitement * 0.1;
    
    // Gradual return to baseline
    stability += (0.7 - stability) * 0.1;
    
    return Math.max(0.1, Math.min(1.0, stability));
  }

  // 🔥 Calculate Arousal
  calculateArousal(factors) {
    let arousal = this.currentState.arousal;
    
    arousal += factors.excitement * 0.4;
    arousal += factors.intimacy * 0.3;
    arousal -= factors.vulnerability * 0.1;
    
    // Natural decay
    arousal *= 0.9;
    
    return Math.max(0.0, Math.min(1.0, arousal));
  }

  // 👑 Calculate Dominance
  calculateDominance(factors) {
    let dominance = this.currentState.dominance;
    
    dominance += factors.dominance * 0.3;
    dominance += factors.gratitude * 0.1; // Receiving gifts can increase confidence
    dominance -= factors.vulnerability * 0.2;
    
    // Personality baseline pull
    const baseline = this.basePersonality.dominance || 0.5;
    dominance += (baseline - dominance) * 0.1;
    
    return Math.max(0.0, Math.min(1.0, dominance));
  }

  // 🔍 Message Analysis Methods
  analyzeMessageExcitement(message) {
    const excitementKeywords = ['amazing', 'wow', 'incredible', 'love', 'excited', '!', 'omg', 'perfect'];
    const lowerMessage = message.toLowerCase();
    let score = 0;
    
    excitementKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score += 0.1;
    });
    
    // Exclamation marks boost excitement
    const exclamationCount = (message.match(/!/g) || []).length;
    score += exclamationCount * 0.05;
    
    return Math.min(0.5, score);
  }

  analyzeMessageIntimacy(message) {
    const intimateKeywords = ['close', 'together', 'private', 'special', 'beautiful', 'gorgeous', 'desire', 'touch'];
    const lowerMessage = message.toLowerCase();
    let score = 0;
    
    intimateKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score += 0.15;
    });
    
    // Length can indicate investment
    if (message.length > 100) score += 0.1;
    if (message.length > 200) score += 0.1;
    
    return Math.min(0.4, score);
  }

  analyzeMessageDominance(message) {
    const dominantKeywords = ['command', 'control', 'mine', 'belong', 'submit', 'obey'];
    const submissiveKeywords = ['please', 'may i', 'if you want', 'sorry', 'apologize'];
    const lowerMessage = message.toLowerCase();
    let score = 0;
    
    dominantKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score += 0.2;
    });
    
    submissiveKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) score -= 0.1;
    });
    
    return Math.max(-0.3, Math.min(0.3, score));
  }

  analyzeMemoryMystery(memories) {
    // More memories = less mystery, unless they contain secrets
    let mysteryScore = Math.max(0, 0.5 - memories.length * 0.02);
    
    // Secret memories increase mystery
    const secretCount = memories.filter(m => m.type === 'secrets').length;
    mysteryScore += secretCount * 0.1;
    
    return Math.min(0.4, mysteryScore);
  }

  // 🧬 Personality Alignment
  calculatePersonalityAlignment(emotion) {
    const emotionProfile = this.emotionMap[emotion];
    let alignment = 0;
    
    // Compare emotion profile to base personality
    Object.keys(this.basePersonality).forEach(trait => {
      const personalityValue = this.basePersonality[trait];
      const emotionValue = emotionProfile[trait] || 0.5;
      
      // Reward alignment
      const difference = Math.abs(personalityValue - emotionValue);
      alignment += (1 - difference) * 0.1;
    });
    
    return alignment;
  }

  // 📈 Get Emotional Trend
  getEmotionalTrend(timeWindow = 10) {
    const recentHistory = this.emotionalHistory.slice(-timeWindow);
    
    if (recentHistory.length < 2) {
      return { trend: 'stable', direction: 'neutral', volatility: 'low' };
    }
    
    const intensities = recentHistory.map(h => h.emotion.intensity);
    const avgIntensity = intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
    
    const firstHalf = intensities.slice(0, Math.floor(intensities.length / 2));
    const secondHalf = intensities.slice(Math.floor(intensities.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, i) => sum + i, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, i) => sum + i, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    return {
      trend: Math.abs(difference) > 0.1 ? (difference > 0 ? 'escalating' : 'cooling') : 'stable',
      direction: difference > 0.05 ? 'positive' : difference < -0.05 ? 'negative' : 'neutral',
      volatility: this.calculateVolatility(intensities),
      avgIntensity
    };
  }

  calculateVolatility(intensities) {
    if (intensities.length < 2) return 'low';
    
    let totalChange = 0;
    for (let i = 1; i < intensities.length; i++) {
      totalChange += Math.abs(intensities[i] - intensities[i - 1]);
    }
    
    const avgChange = totalChange / (intensities.length - 1);
    
    if (avgChange > 0.3) return 'high';
    if (avgChange > 0.15) return 'medium';
    return 'low';
  }

  // 🎯 Get Current State
  getCurrentState() {
    return { ...this.currentState };
  }

  // 🔮 Predict Next Emotion
  predictNextEmotion(context = {}) {
    const factors = this.calculateEmotionalFactors(context);
    const possibleEmotions = this.transitionRules[this.currentState.primary] || ['curious'];
    
    const predictions = possibleEmotions.map(emotion => ({
      emotion,
      probability: this.calculateEmotionScore(emotion, factors) / 10,
      expectedIntensity: this.calculateNewIntensity(factors)
    }));
    
    return predictions.sort((a, b) => b.probability - a.probability);
  }

  // 🎪 Generate Emotional Response Modifier
  getResponseModifier() {
    const { primary, intensity, arousal, dominance } = this.currentState;
    
    return {
      emotion: primary,
      intensity,
      responseStyle: this.determineResponseStyle(),
      emotionalTags: this.generateEmotionalTags(),
      energyLevel: arousal,
      dominanceLevel: dominance,
      suggestedTone: this.suggestTone()
    };
  }

  determineResponseStyle() {
    const { primary, intensity, dominance } = this.currentState;
    
    if (intensity > 0.8) {
      return dominance > 0.6 ? 'intense_dominant' : 'intense_submissive';
    } else if (intensity > 0.5) {
      return dominance > 0.5 ? 'confident_playful' : 'warm_inviting';
    } else {
      return 'gentle_mysterious';
    }
  }

  generateEmotionalTags() {
    const tags = [this.currentState.primary];
    
    if (this.currentState.intensity > 0.7) tags.push('high_intensity');
    if (this.currentState.arousal > 0.6) tags.push('aroused');
    if (this.currentState.dominance > 0.7) tags.push('dominant');
    if (this.currentState.dominance < 0.3) tags.push('submissive');
    if (this.currentState.stability < 0.4) tags.push('volatile');
    
    return tags;
  }

  suggestTone() {
    const { primary, intensity, dominance } = this.currentState;
    
    const toneMap = {
      curious: intensity > 0.6 ? 'eager_questioning' : 'gentle_inquiry',
      playful: dominance > 0.5 ? 'teasing_confident' : 'giggly_sweet',
      seductive: intensity > 0.7 ? 'sultry_commanding' : 'alluring_mysterious',
      vulnerable: 'soft_trusting',
      passionate: 'breathless_intense',
      mysterious: 'enigmatic_alluring',
      grateful: 'warm_appreciative',
      longing: 'yearning_desperate',
      mischievous: 'playful_scheming',
      devoted: 'adoring_loyal'
    };
    
    return toneMap[primary] || 'balanced_natural';
  }
}

export { EmotionEngine };