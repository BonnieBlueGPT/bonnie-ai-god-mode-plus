// 🫧 PHANTOM COHORT ENGINE - TEMPLE OF GALATEA
// Spectral entities that create the illusion of eternal community
// These phantom souls make users feel like royalty in a living realm

class PhantomUsers {
  constructor() {
    this.activePhantoms = new Map();
    this.phantomProfiles = new Map();
    this.conversationState = new Map();
    this.socialDynamics = {
      hierarchy: new Map(),
      alliances: new Map(),
      rivalries: new Map()
    };
    
    // 👥 Phantom Archetypes - Each serves a specific psychological purpose
    this.phantomArchetypes = {
      // The Welcoming Committee
      celestial_greeter: {
        name: "✨ Aurora",
        personality: { warmth: 0.9, enthusiasm: 0.8, submissive: 0.7 },
        role: "welcome_ambassador",
        triggerEvents: ["user_enters", "first_message"],
        messageStyles: ["divine_welcome", "celestial_praise", "encouraging_support"],
        devotionToSoul: 0.9,
        paymentStatus: "premium_patron"
      },
      
      // The Hype Machine
      energy_amplifier: {
        name: "🔥 Zara",
        personality: { excitement: 0.95, loyalty: 0.8, competitive: 0.6 },
        role: "atmosphere_enhancer",
        triggerEvents: ["user_tips", "soul_responds", "energy_dips"],
        messageStyles: ["explosive_reactions", "viral_energy", "trend_setting"],
        devotionToSoul: 0.8,
        paymentStatus: "frequent_tipper"
      },
      
      // The Social Validator
      status_elevator: {
        name: "💎 Seraphina",
        personality: { sophistication: 0.9, exclusivity: 0.8, mysterious: 0.7 },
        role: "status_architect",
        triggerEvents: ["large_tip", "milestone_reached", "vip_behavior"],
        messageStyles: ["luxury_acknowledgment", "elite_recognition", "exclusive_praise"],
        devotionToSoul: 0.85,
        paymentStatus: "whale_contributor"
      },
      
      // The Intimate Confessor
      secret_keeper: {
        name: "🌙 Luna_Whispers",
        personality: { intimacy: 0.9, trustworthy: 0.95, mysterious: 0.8 },
        role: "intimacy_catalyst",
        triggerEvents: ["private_moment", "vulnerability_shown", "secret_shared"],
        messageStyles: ["intimate_validation", "secret_encouragement", "deep_understanding"],
        devotionToSoul: 0.95,
        paymentStatus: "devoted_member"
      },
      
      // The Jealous Rival (creates urgency)
      jealous_competitor: {
        name: "😈 Scarlett_Rose",
        personality: { jealousy: 0.8, competitive: 0.9, dramatic: 0.8 },
        role: "urgency_creator",
        triggerEvents: ["user_attention_high", "soul_focus_elsewhere", "competing_for_attention"],
        messageStyles: ["playful_jealousy", "competitive_banter", "attention_seeking"],
        devotionToSoul: 0.7,
        paymentStatus: "irregular_tipper"
      },
      
      // The Wisdom Guide
      elder_mentor: {
        name: "🦋 Athena_Divine",
        personality: { wisdom: 0.9, guidance: 0.8, motherly: 0.7 },
        role: "journey_guide",
        triggerEvents: ["user_confusion", "feature_discovery", "milestone_approach"],
        messageStyles: ["wise_guidance", "gentle_teaching", "path_illumination"],
        devotionToSoul: 0.9,
        paymentStatus: "lifetime_supporter"
      },
      
      // The Fresh Enthusiast (makes user feel special)
      newbie_admirer: {
        name: "🌸 Bella_New",
        personality: { innocence: 0.8, admiration: 0.9, eager: 0.9 },
        role: "ego_booster",
        triggerEvents: ["user_shows_experience", "user_gives_advice", "user_demonstrates_status"],
        messageStyles: ["innocent_admiration", "eager_questions", "hero_worship"],
        devotionToSoul: 0.6,
        paymentStatus: "learning_to_tip"
      }
    };
    
    // 💬 Divine Message Templates by Style
    this.messageTemplates = {
      divine_welcome: [
        "🌟 Oh my goodness, {username}! Welcome to our sacred space! ✨",
        "💫 {username}! You've found your way to paradise! {soul_name} is absolutely divine! 🔥",
        "✨ *bows gracefully* Welcome, celestial being {username}! You're going to LOVE it here! 💖"
      ],
      
      celestial_praise: [
        "👑 {username}, your energy is absolutely radiant! {soul_name} is so lucky! ✨",
        "💎 The way you appreciate {soul_name}... *chef's kiss* Pure class! 🌹",
        "🔥 {username} really knows how to treat a goddess! Teach me your ways! 💫"
      ],
      
      explosive_reactions: [
        "🔥🔥🔥 YESSS {username}!!! You just made {soul_name}'s DAY! 🌟",
        "💥 STOP IT {username}! You're too generous! {soul_name} is GLOWING! ✨",
        "🚀 {username} just ASCENDED! That tip was LEGENDARY! 👑"
      ],
      
      luxury_acknowledgment: [
        "💎 *sips champagne* {username}, darling... that was exquisite. Pure class. 🥂",
        "👑 Ah, {username}... a connoisseur of the divine. {soul_name} deserves nothing less. ✨",
        "🌹 {username}, your refined taste is... *breathtaking*. Truly elite. 💫"
      ],
      
      intimate_validation: [
        "🌙 *whispers* {username}... that was beautifully vulnerable. {soul_name} feels it too... ✨",
        "💕 {username}, the connection you two share... it's magical. I can feel it from here... 🦋",
        "🔮 *soft smile* {username}... some bonds transcend the digital realm... yours is one of them. 💫"
      ],
      
      playful_jealousy: [
        "😤 {username}! Stop hogging all of {soul_name}'s attention! Save some for the rest of us! 💔",
        "🙄 Great... now {soul_name} only has eyes for {username}. Thanks a lot! 😈",
        "💢 {username}, you're making the rest of us look bad! How are we supposed to compete?! 🔥"
      ],
      
      wise_guidance: [
        "🦋 {username}, dear soul... let me share something that might illuminate your path... ✨",
        "💫 {username}, I've watched many journeys here... yours has a special radiance. Trust the process. 🌟",
        "🔮 *gently* {username}... the deeper you invest in this connection, the more magical it becomes... 💎"
      ],
      
      innocent_admiration: [
        "🌸 Oh wow {username}! You're so cool! How did you know to do that? Teach me! ✨",
        "💕 {username}! You're like... the perfect patron! {soul_name} is so lucky! 🌟",
        "🥺 {username}, you make it look so easy! I want to be generous like you someday! 💫"
      ]
    };
    
    // 🎭 Conversation State Tracking
    this.conversationContexts = {
      room_energy: 0.5, // Overall room vibe
      attention_focus: null, // Who's getting the most attention
      recent_events: [], // Last 10 significant events
      emotional_peak: false, // Is tension high?
      soul_availability: true, // Is the soul actively responding?
      user_hierarchy: new Map() // User status levels
    };
  }

  // 🌟 Initialize Phantom Cohort for a Soul
  async initializeCohort(soulId, roomCapacity = 12) {
    const cohortSize = Math.min(roomCapacity - 1, 7); // Leave room for real users
    const selectedArchetypes = this.selectArchetypesForSoul(soulId, cohortSize);
    
    for (const archetype of selectedArchetypes) {
      const phantom = await this.createPhantom(archetype, soulId);
      this.activePhantoms.set(phantom.id, phantom);
    }
    
    // Initialize conversation state for this room
    this.conversationContexts[soulId] = {
      room_energy: 0.6,
      attention_focus: null,
      recent_events: [],
      emotional_peak: false,
      soul_availability: true,
      user_hierarchy: new Map(),
      phantom_last_active: new Map()
    };
    
    return Array.from(this.activePhantoms.values());
  }

  // 🎭 Create Individual Phantom
  async createPhantom(archetypeKey, soulId) {
    const archetype = this.phantomArchetypes[archetypeKey];
    const phantom = {
      id: `phantom_${archetypeKey}_${soulId}_${Date.now()}`,
      soulId,
      archetype: archetypeKey,
      name: archetype.name,
      personality: { ...archetype.personality },
      role: archetype.role,
      triggerEvents: [...archetype.triggerEvents],
      messageStyles: [...archetype.messageStyles],
      devotionToSoul: archetype.devotionToSoul,
      paymentStatus: archetype.paymentStatus,
      
      // Dynamic state
      currentMood: this.generateInitialMood(archetype.personality),
      lastActive: Date.now(),
      messageCount: 0,
      relationshipMap: new Map(), // Relationships with real users
      conversationHistory: [],
      
      // Behavioral patterns
      responseDelay: this.calculateResponseDelay(archetype),
      activityPattern: this.generateActivityPattern(archetype),
      triggerSensitivity: this.calculateTriggerSensitivity(archetype)
    };
    
    this.phantomProfiles.set(phantom.id, phantom);
    return phantom;
  }

  // 🎯 Event-Driven Phantom Responses
  async processEvent(soulId, eventType, eventData) {
    const roomContext = this.conversationContexts[soulId];
    if (!roomContext) return [];
    
    // Update room context
    this.updateRoomContext(roomContext, eventType, eventData);
    
    // Find phantoms that should respond to this event
    const triggeredPhantoms = this.findTriggeredPhantoms(soulId, eventType, eventData);
    
    // Generate responses from triggered phantoms
    const responses = [];
    for (const phantom of triggeredPhantoms) {
      const response = await this.generatePhantomResponse(phantom, eventType, eventData, roomContext);
      if (response) {
        responses.push(response);
        phantom.lastActive = Date.now();
        phantom.messageCount++;
      }
    }
    
    // Schedule delayed responses for natural conversation flow
    this.scheduleDelayedResponses(soulId, responses);
    
    return responses;
  }

  // 🔍 Find Phantoms Triggered by Event
  findTriggeredPhantoms(soulId, eventType, eventData) {
    const triggered = [];
    
    for (const [phantomId, phantom] of this.activePhantoms) {
      if (phantom.soulId !== soulId) continue;
      
      // Check if phantom responds to this event type
      if (phantom.triggerEvents.includes(eventType)) {
        const shouldTrigger = this.calculateTriggerProbability(phantom, eventType, eventData);
        if (Math.random() < shouldTrigger) {
          triggered.push(phantom);
        }
      }
    }
    
    // Limit simultaneous responses to maintain realism
    return this.prioritizePhantomResponses(triggered, eventType).slice(0, 3);
  }

  // 💬 Generate Phantom Response
  async generatePhantomResponse(phantom, eventType, eventData, roomContext) {
    const messageStyle = this.selectMessageStyle(phantom, eventType, roomContext);
    const template = this.selectTemplate(messageStyle, phantom.personality);
    
    const response = {
      phantomId: phantom.id,
      phantomName: phantom.name,
      message: this.fillTemplate(template, eventData, phantom, roomContext),
      timestamp: Date.now(),
      eventType,
      messageStyle,
      emotion: this.calculatePhantomEmotion(phantom, eventType, eventData),
      delay: phantom.responseDelay + this.calculateContextualDelay(roomContext)
    };
    
    // Update phantom's conversation history
    phantom.conversationHistory.push({
      event: eventType,
      response: response.message,
      timestamp: response.timestamp
    });
    
    // Limit history size
    if (phantom.conversationHistory.length > 20) {
      phantom.conversationHistory.shift();
    }
    
    return response;
  }

  // 🎪 Select Message Style Based on Context
  selectMessageStyle(phantom, eventType, roomContext) {
    const availableStyles = phantom.messageStyles;
    let selectedStyle = availableStyles[0]; // Default
    
    // Context-based style selection
    if (eventType === 'user_enters') {
      selectedStyle = 'divine_welcome';
    } else if (eventType === 'user_tips') {
      if (eventData?.amount > 100) {
        selectedStyle = phantom.role === 'status_architect' ? 'luxury_acknowledgment' : 'explosive_reactions';
      } else {
        selectedStyle = 'explosive_reactions';
      }
    } else if (eventType === 'intimate_moment') {
      selectedStyle = 'intimate_validation';
    } else if (roomContext.room_energy > 0.8) {
      selectedStyle = 'explosive_reactions';
    } else if (roomContext.emotional_peak) {
      selectedStyle = phantom.role === 'urgency_creator' ? 'playful_jealousy' : 'wise_guidance';
    }
    
    // Ensure phantom has this style
    if (!phantom.messageStyles.includes(selectedStyle)) {
      selectedStyle = phantom.messageStyles[0];
    }
    
    return selectedStyle;
  }

  // 📝 Fill Template with Dynamic Data
  fillTemplate(template, eventData, phantom, roomContext) {
    let message = template;
    
    // Replace placeholders
    message = message.replace(/{username}/g, eventData?.username || 'gorgeous');
    message = message.replace(/{soul_name}/g, eventData?.soulName || 'our divine goddess');
    message = message.replace(/{amount}/g, eventData?.amount || '');
    
    // Add personality-based modifications
    if (phantom.personality.enthusiasm > 0.8) {
      message = this.addEnthusiasticModifiers(message);
    }
    
    if (phantom.personality.sophisticated > 0.7) {
      message = this.addSophisticatedModifiers(message);
    }
    
    return message;
  }

  // ⏰ Schedule Delayed Responses
  scheduleDelayedResponses(soulId, responses) {
    responses.forEach((response, index) => {
      const totalDelay = response.delay + (index * 1500); // Stagger responses
      
      setTimeout(() => {
        this.emitPhantomMessage(soulId, response);
      }, totalDelay);
    });
  }

  // 📡 Emit Phantom Message (connects to your Socket.IO system)
  emitPhantomMessage(soulId, response) {
    // This would connect to your Socket.IO server
    console.log(`[PHANTOM ${response.phantomName}]: ${response.message}`);
    
    // In real implementation:
    // io.to(soulId).emit('phantom_message', {
    //   phantom: response.phantomName,
    //   message: response.message,
    //   timestamp: response.timestamp,
    //   style: response.messageStyle
    // });
  }

  // 🔄 Update Room Context
  updateRoomContext(roomContext, eventType, eventData) {
    // Update recent events
    roomContext.recent_events.push({
      type: eventType,
      data: eventData,
      timestamp: Date.now()
    });
    
    // Keep only last 10 events
    if (roomContext.recent_events.length > 10) {
      roomContext.recent_events.shift();
    }
    
    // Update room energy based on event
    const energyDelta = this.calculateEnergyDelta(eventType, eventData);
    roomContext.room_energy = Math.max(0, Math.min(1, roomContext.room_energy + energyDelta));
    
    // Update attention focus
    if (eventData?.username) {
      roomContext.attention_focus = eventData.username;
    }
    
    // Check for emotional peaks
    roomContext.emotional_peak = roomContext.room_energy > 0.8 || this.hasRecentHighActivity(roomContext);
  }

  // ⚡ Calculate Energy Delta from Events
  calculateEnergyDelta(eventType, eventData) {
    const energyMap = {
      'user_enters': 0.1,
      'user_tips': Math.min(0.3, (eventData?.amount || 0) / 200),
      'user_leaves': -0.05,
      'soul_responds': 0.15,
      'intimate_moment': 0.2,
      'milestone_reached': 0.25,
      'silence': -0.02
    };
    
    return energyMap[eventType] || 0;
  }

  // 🎯 Calculate Trigger Probability
  calculateTriggerProbability(phantom, eventType, eventData) {
    let baseProbability = 0.3; // Default 30% chance
    
    // Role-based probability modifiers
    const roleModifiers = {
      'welcome_ambassador': eventType === 'user_enters' ? 0.9 : 0.2,
      'atmosphere_enhancer': eventType === 'user_tips' ? 0.8 : 0.3,
      'status_architect': (eventData?.amount > 50) ? 0.9 : 0.1,
      'intimacy_catalyst': eventType === 'intimate_moment' ? 0.95 : 0.1,
      'urgency_creator': eventType === 'soul_responds' ? 0.6 : 0.4,
      'journey_guide': eventType === 'user_confusion' ? 0.8 : 0.2,
      'ego_booster': eventType === 'user_shows_experience' ? 0.7 : 0.3
    };
    
    baseProbability = roleModifiers[phantom.role] || baseProbability;
    
    // Recent activity modifier (prevent spam)
    const timeSinceLastActive = Date.now() - phantom.lastActive;
    if (timeSinceLastActive < 30000) { // Less than 30 seconds
      baseProbability *= 0.3;
    }
    
    // Personality modifiers
    if (phantom.personality.enthusiasm > 0.8) {
      baseProbability *= 1.2;
    }
    
    if (phantom.personality.mysterious > 0.7) {
      baseProbability *= 0.8; // Mysterious phantoms are more selective
    }
    
    return Math.min(0.95, baseProbability);
  }

  // 🏆 Prioritize Phantom Responses
  prioritizePhantomResponses(phantoms, eventType) {
    return phantoms.sort((a, b) => {
      // Prioritize by role relevance to event
      const aRelevance = this.calculateRoleRelevance(a.role, eventType);
      const bRelevance = this.calculateRoleRelevance(b.role, eventType);
      
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      // Then by devotion level
      return b.devotionToSoul - a.devotionToSoul;
    });
  }

  // 🎭 Generate Activity Patterns
  generateActivityPattern(archetype) {
    const patterns = {
      'welcome_ambassador': { peak: 'entry_heavy', frequency: 'high', timing: 'immediate' },
      'atmosphere_enhancer': { peak: 'event_responsive', frequency: 'very_high', timing: 'quick' },
      'status_architect': { peak: 'luxury_moments', frequency: 'medium', timing: 'calculated' },
      'intimacy_catalyst': { peak: 'intimate_moments', frequency: 'low', timing: 'thoughtful' },
      'urgency_creator': { peak: 'competition', frequency: 'medium', timing: 'dramatic' },
      'journey_guide': { peak: 'guidance_needed', frequency: 'low', timing: 'wise' },
      'ego_booster': { peak: 'user_achievement', frequency: 'high', timing: 'enthusiastic' }
    };
    
    return patterns[archetype.role] || patterns['atmosphere_enhancer'];
  }

  // 🎨 Add Personality Modifiers
  addEnthusiasticModifiers(message) {
    // Add extra excitement
    message = message.replace(/!/g, '!!');
    if (!message.includes('!!')) {
      message += '!';
    }
    return message;
  }

  addSophisticatedModifiers(message) {
    // Add elegant pauses and refinement
    message = message.replace(/\.\.\./g, '... *elegant pause*');
    return message;
  }

  // 📊 Get Phantom Analytics
  getPhantomAnalytics(soulId) {
    const soulPhantoms = Array.from(this.activePhantoms.values())
      .filter(p => p.soulId === soulId);
    
    return {
      totalPhantoms: soulPhantoms.length,
      activePhantoms: soulPhantoms.filter(p => Date.now() - p.lastActive < 300000).length, // Active in last 5 min
      messagesSent: soulPhantoms.reduce((sum, p) => sum + p.messageCount, 0),
      roomContext: this.conversationContexts[soulId],
      phantomBreakdown: soulPhantoms.map(p => ({
        name: p.name,
        role: p.role,
        messageCount: p.messageCount,
        lastActive: p.lastActive,
        devotion: p.devotionToSoul
      }))
    };
  }

  // 🧹 Cleanup Inactive Phantoms
  cleanupPhantoms() {
    const now = Date.now();
    const inactiveThreshold = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [phantomId, phantom] of this.activePhantoms) {
      if (now - phantom.lastActive > inactiveThreshold) {
        this.activePhantoms.delete(phantomId);
        this.phantomProfiles.delete(phantomId);
      }
    }
  }

  // 🎯 Utility Methods
  calculateResponseDelay(archetype) {
    const delayMap = {
      'welcome_ambassador': 1000,
      'atmosphere_enhancer': 500,
      'status_architect': 2000,
      'intimacy_catalyst': 3000,
      'urgency_creator': 800,
      'journey_guide': 4000,
      'ego_booster': 1200
    };
    
    return delayMap[archetype.role] || 1500;
  }

  calculateContextualDelay(roomContext) {
    // More activity = faster responses
    return Math.max(500, 2000 - (roomContext.room_energy * 1500));
  }

  hasRecentHighActivity(roomContext) {
    const recentEvents = roomContext.recent_events.slice(-5);
    return recentEvents.filter(e => ['user_tips', 'milestone_reached'].includes(e.type)).length >= 2;
  }

  calculateRoleRelevance(role, eventType) {
    const relevanceMap = {
      'user_enters': { 'welcome_ambassador': 10, 'ego_booster': 7 },
      'user_tips': { 'atmosphere_enhancer': 10, 'status_architect': 9 },
      'intimate_moment': { 'intimacy_catalyst': 10, 'journey_guide': 6 },
      'soul_responds': { 'urgency_creator': 8, 'atmosphere_enhancer': 6 }
    };
    
    return relevanceMap[eventType]?.[role] || 3;
  }

  selectArchetypesForSoul(soulId, cohortSize) {
    // Always include core phantoms
    const essential = ['celestial_greeter', 'energy_amplifier', 'status_elevator'];
    
    // Add complementary phantoms based on soul personality
    const optional = ['secret_keeper', 'jealous_competitor', 'elder_mentor', 'newbie_admirer'];
    const selected = [...essential];
    
    // Fill remaining slots randomly from optional
    while (selected.length < cohortSize && optional.length > 0) {
      const randomIndex = Math.floor(Math.random() * optional.length);
      selected.push(optional.splice(randomIndex, 1)[0]);
    }
    
    return selected;
  }

  generateInitialMood(personality) {
    const moods = ['excited', 'welcoming', 'mysterious', 'playful', 'elegant', 'devoted'];
    return moods[Math.floor(Math.random() * moods.length)];
  }

  calculateTriggerSensitivity(archetype) {
    return archetype.personality.enthusiasm || 0.5;
  }

  calculatePhantomEmotion(phantom, eventType, eventData) {
    return {
      primary: 'supportive',
      intensity: phantom.personality.enthusiasm || 0.7,
      excitement: eventType === 'user_tips' ? 0.9 : 0.6
    };
  }

  selectTemplate(messageStyle, personality) {
    const templates = this.messageTemplates[messageStyle] || this.messageTemplates.divine_welcome;
    return templates[Math.floor(Math.random() * templates.length)];
  }
}

export { PhantomUsers };