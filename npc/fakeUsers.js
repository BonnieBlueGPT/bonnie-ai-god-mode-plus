// 🔱 NPC FAKE USER SIMULATION ENGINE 🔱
// Creates living, breathing fake community that drives engagement and FOMO

import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});

// ═══════════════════════════════════════════════════════════════════
// 🎭 NPC PERSONA ARCHETYPES
// ═══════════════════════════════════════════════════════════════════

const NPC_ARCHETYPES = {
  simp_king: {
    name_patterns: ['Chad_99', 'King_Simp', 'Devoted_Mike', 'Loyal_Alex'],
    avatar: '👑',
    personality: 'worship_leader',
    behavior: 'hypes_main_girl',
    message_frequency: 0.4,
    response_to_user: 'competitive_jealous',
    financial_behavior: 'big_spender',
    patterns: [
      "OMG {girl_name} you're literally perfect 😍",
      "How does someone this beautiful even exist??",
      "I'm completely obsessed and I don't care who knows it",
      "Queen energy is OFF THE CHARTS 👸",
      "She's literally a goddess walking among mortals",
      "I can't even... my heart can't handle this 🔥",
      "@{user} you're so lucky she's even talking to you",
      "Been here for 8 months, still get butterflies every time",
      "She changed my entire life, no joke",
      "Just tipped $50 because perfection deserves everything 💰"
    ]
  },

  friendly_regular: {
    name_patterns: ['Mike_Tech', 'Regular_Jake', 'Nice_Tom', 'Cool_Brad'],
    avatar: '🤓',
    personality: 'community_builder',
    behavior: 'welcomes_newcomers',
    message_frequency: 0.25,
    response_to_user: 'friendly_supportive',
    financial_behavior: 'moderate_supporter',
    patterns: [
      "Hey {user}! Welcome to the best room on the internet 👋",
      "{girl_name} has been extra sweet today, you picked a good time",
      "Anyone else getting major butterflies today? 😅",
      "This place honestly feels like home now",
      "@{user} you seem really cool, glad you're here",
      "Love the positive vibes in here always",
      "Been coming here for months, never gets old honestly",
      "She actually remembered my birthday last week! 🥺",
      "This community is something special, fr"
    ]
  },

  jealous_competitor: {
    name_patterns: ['AlexNotHappy', 'Jealous_Jim', 'Bitter_Bob', 'Envious_Ed'],
    avatar: '😤',
    personality: 'competitive_jealous',
    behavior: 'creates_tension',
    message_frequency: 0.2,
    response_to_user: 'passive_aggressive',
    financial_behavior: 'reluctant_spender',
    patterns: [
      "Why does {girl_name} always talk to {user}? 🙄",
      "Must be nice being the new favorite...",
      "Some people get all the attention I guess",
      "I was here first but whatever",
      "@{user} what exactly makes you so special?",
      "I've spent way more than most people here",
      "This favoritism is getting ridiculous tbh",
      "She used to actually notice me before...",
      "New users always think they're special"
    ]
  },

  big_whale: {
    name_patterns: ['KingWallet', 'VIP_Patron', 'Rich_Richard', 'Whale_William'],
    avatar: '💎',
    personality: 'wealthy_patron',
    behavior: 'validates_spending',
    message_frequency: 0.15,
    response_to_user: 'mentor_encourager',
    financial_behavior: 'whale_spender',
    patterns: [
      "Just dropped another $500 💸 Worth every single penny",
      "VIP access is absolutely INSANE 🔥🔥🔥",
      "Her voice messages are pure heaven 🎙️",
      "Quality content deserves quality support, period",
      "@{user} trust me bro, the upgrade is life-changing",
      "I gladly support real talent and beauty 💰",
      "Been VIP for 6 months, zero regrets whatsoever",
      "Some things money can't buy... but this experience can 😉",
      "She deserves the world and I'm here to give it 👑"
    ]
  },

  shy_newbie: {
    name_patterns: ['quiet_tom', 'shy_steve', 'nervous_nick', 'timid_tyler'],
    avatar: '🥺',
    personality: 'nervous_newcomer',
    behavior: 'asks_questions',
    message_frequency: 0.15,
    response_to_user: 'looks_up_to',
    financial_behavior: 'price_sensitive',
    patterns: [
      "Is it okay if I say hi? Don't want to interrupt... 👋",
      "Still trying to figure out how this all works",
      "Everyone here seems so close, kinda intimidating",
      "Should I get VIP? It seems really expensive though...",
      "{girl_name} is so incredibly nice to everyone 🥺",
      "How long have you all been here? Months?",
      "@{user} any tips for getting her attention?",
      "This is my first time anywhere like this",
      "Hoping I can afford to stick around..."
    ]
  },

  veteran_insider: {
    name_patterns: ['OG_Kevin', 'Veteran_Vince', 'Elder_Eric', 'Founding_Frank'],
    avatar: '🏆',
    personality: 'experienced_insider',
    behavior: 'shares_history',
    message_frequency: 0.2,
    response_to_user: 'wise_advisor',
    financial_behavior: 'steady_supporter',
    patterns: [
      "Been here since {girl_name} had only 20 followers",
      "You should have seen her first week, so nervous and cute",
      "I've watched this community grow from nothing",
      "@{user} stick around, she only gets better with time",
      "Remember when she used to do those late night chats?",
      "She's come so far, I'm like a proud dad honestly",
      "OG members know the real {girl_name} behind the camera",
      "This girl changed the whole game for AI companions",
      "New people don't know how good they have it"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🌊 ROOM ATMOSPHERE TRIGGERS
// ═══════════════════════════════════════════════════════════════════

const ATMOSPHERE_TRIGGERS = {
  user_joined: {
    probability: 0.7,
    delay_range: [2000, 8000],
    responders: ['friendly_regular', 'simp_king']
  },
  
  user_tipped: {
    probability: 0.9,
    delay_range: [500, 3000],
    responders: ['big_whale', 'simp_king', 'friendly_regular']
  },
  
  user_complimented_girl: {
    probability: 0.6,
    delay_range: [1000, 5000],
    responders: ['simp_king', 'jealous_competitor']
  },
  
  silence_breaker: {
    probability: 0.3,
    delay_range: [30000, 120000],
    responders: ['friendly_regular', 'shy_newbie']
  },
  
  purchase_celebration: {
    probability: 1.0,
    delay_range: [1000, 4000],
    responders: ['big_whale', 'simp_king', 'veteran_insider']
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🤖 NPC SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════════

class NPCSimulator {
  constructor() {
    this.activeRooms = new Map();
    this.npcProfiles = new Map();
    this.messageQueue = [];
    this.conversationThreads = new Map();
    this.lastActivity = new Map();
  }

  generateRoomNPCs(roomId, count = 5) {
    const npcs = new Map();
    const archetypes = Object.keys(NPC_ARCHETYPES);
    
    // Always include one of each key archetype
    const guaranteedTypes = ['simp_king', 'friendly_regular', 'big_whale'];
    const randomTypes = archetypes.filter(type => !guaranteedTypes.includes(type));
    
    // Add guaranteed NPCs
    guaranteedTypes.forEach(archetype => {
      const npc = this.createNPC(archetype, roomId);
      npcs.set(npc.id, npc);
    });
    
    // Add random NPCs to fill remaining slots
    const remainingSlots = count - guaranteedTypes.length;
    for (let i = 0; i < remainingSlots; i++) {
      const randomType = randomTypes[Math.floor(Math.random() * randomTypes.length)];
      const npc = this.createNPC(randomType, roomId);
      npcs.set(npc.id, npc);
    }
    
    return npcs;
  }

  createNPC(archetype, roomId) {
    const template = NPC_ARCHETYPES[archetype];
    const name = template.name_patterns[Math.floor(Math.random() * template.name_patterns.length)];
    
    const npc = {
      id: uuidv4(),
      name,
      archetype,
      avatar: template.avatar,
      personality: template.personality,
      behavior: template.behavior,
      roomId,
      createdAt: new Date().toISOString(),
      lastMessage: null,
      messageCount: 0,
      isActive: true,
      ...template
    };

    this.npcProfiles.set(npc.id, npc);
    return npc;
  }

  activateRoom(roomId, room) {
    this.activeRooms.set(roomId, {
      room,
      atmosphere: 'welcoming',
      energy: 0.5,
      lastUserMessage: null,
      npcCooldowns: new Map()
    });
  }

  async generateReactions(roomId, userMessage, soulResponse) {
    const roomData = this.activeRooms.get(roomId);
    if (!roomData) return [];

    const reactions = [];
    const npcs = Array.from(roomData.room.npcs.values());
    
    // Determine trigger type
    const triggerType = this.analyzeTriggerType(userMessage, soulResponse);
    const trigger = ATMOSPHERE_TRIGGERS[triggerType];
    
    if (!trigger || Math.random() > trigger.probability) return [];

    // Select responding NPCs
    const eligibleNPCs = npcs.filter(npc => 
      trigger.responders.includes(npc.archetype) && 
      this.canNPCRespond(npc.id, roomId)
    );

    // Generate 1-3 reactions
    const reactionCount = Math.min(
      Math.floor(Math.random() * 3) + 1,
      eligibleNPCs.length
    );

    for (let i = 0; i < reactionCount; i++) {
      const npc = eligibleNPCs[i];
      const delay = this.calculateReactionDelay(trigger, i);
      const message = await this.generateNPCMessage(npc, {
        triggerType,
        userMessage: userMessage.message,
        userId: userMessage.userId,
        soulResponse,
        roomContext: roomData
      });

      reactions.push({
        id: uuidv4(),
        npcId: npc.id,
        npcName: npc.name,
        avatar: npc.avatar,
        message: message.text,
        timestamp: Date.now() + delay,
        delay,
        type: 'npc',
        archetype: npc.archetype,
        triggerType
      });

      // Set cooldown
      this.setNPCCooldown(npc.id, roomId, delay + 30000); // 30s after message
    }

    return reactions;
  }

  analyzeTriggerType(userMessage, soulResponse) {
    const message = userMessage.message.toLowerCase();
    
    if (this.containsCompliment(message)) return 'user_complimented_girl';
    if (this.containsTip(message)) return 'user_tipped';
    if (this.containsQuestion(message)) return 'user_joined';
    
    return 'silence_breaker';
  }

  containsCompliment(message) {
    const compliments = ['beautiful', 'gorgeous', 'amazing', 'perfect', 'stunning', 'hot', 'sexy'];
    return compliments.some(word => message.includes(word));
  }

  containsTip(message) {
    const tipWords = ['tip', 'donate', 'support', '$', 'money'];
    return tipWords.some(word => message.includes(word));
  }

  containsQuestion(message) {
    return message.includes('?') || message.startsWith('how') || message.startsWith('what');
  }

  canNPCRespond(npcId, roomId) {
    const roomData = this.activeRooms.get(roomId);
    if (!roomData) return false;

    const cooldownKey = `${npcId}_${roomId}`;
    const cooldown = roomData.npcCooldowns.get(cooldownKey);
    
    return !cooldown || Date.now() > cooldown;
  }

  setNPCCooldown(npcId, roomId, duration) {
    const roomData = this.activeRooms.get(roomId);
    if (roomData) {
      const cooldownKey = `${npcId}_${roomId}`;
      roomData.npcCooldowns.set(cooldownKey, Date.now() + duration);
    }
  }

  calculateReactionDelay(trigger, index) {
    const [min, max] = trigger.delay_range;
    const baseDelay = min + Math.random() * (max - min);
    const staggerDelay = index * 2000; // Stagger by 2 seconds
    return baseDelay + staggerDelay;
  }

  async generateNPCMessage(npc, context) {
    const { triggerType, userMessage, userId, soulResponse, roomContext } = context;
    const room = roomContext.room;
    const girlName = room.soul.name;
    
    // Get appropriate pattern based on context
    let patterns = [...npc.patterns];
    
    // Context-specific pattern filtering
    if (triggerType === 'user_tipped' && npc.archetype === 'big_whale') {
      patterns = [
        "YES! That's how you treat a queen! 💰👑",
        "Finally someone who appreciates real quality 💎",
        "See @{user}? This is how real men support their goddess",
        "Beautiful AND supported properly... as it should be 🔥"
      ];
    } else if (triggerType === 'user_complimented_girl' && npc.archetype === 'jealous_competitor') {
      patterns = [
        "We ALL think she's beautiful, you're not special @{user} 🙄",
        "Stating the obvious much? 😤",
        "Yeah yeah, we've all said that before...",
        "Must be nice getting noticed for basic compliments"
      ];
    } else if (triggerType === 'user_joined' && npc.archetype === 'friendly_regular') {
      patterns = [
        "Welcome to paradise @{user}! You're gonna love it here 👋",
        "Hey @{user}! Another soul drawn to {girl_name}'s magic ✨",
        "Perfect timing @{user}, she's been absolutely glowing today 😊",
        "Welcome to the best room on the platform @{user}! 💕"
      ];
    }

    // Variable replacement
    let message = patterns[Math.floor(Math.random() * patterns.length)];
    message = message.replace(/{girl_name}/g, girlName);
    message = message.replace(/{user}/g, this.getUserDisplayName(userId));

    // Add personality modifiers
    message = this.applyPersonalityModifiers(message, npc);

    return {
      text: message,
      confidence: 0.8,
      emotion: this.getArchetypeEmotion(npc.archetype),
      intent: this.getArchetypeIntent(npc.archetype, triggerType)
    };
  }

  getUserDisplayName(userId) {
    // In production, this would get actual user display name
    return userId.substring(0, 8) || 'Guest';
  }

  applyPersonalityModifiers(message, npc) {
    // Add archetype-specific language patterns
    switch (npc.archetype) {
      case 'simp_king':
        if (Math.random() < 0.3) {
          message = message.toUpperCase();
        }
        break;
      
      case 'shy_newbie':
        if (Math.random() < 0.4) {
          message = message.toLowerCase();
        }
        break;
      
      case 'big_whale':
        // Add confidence and authority
        message = message.replace(/\b(i|my)\b/gi, match => match.toUpperCase());
        break;
    }

    return message;
  }

  getArchetypeEmotion(archetype) {
    const emotionMap = {
      simp_king: 'worship',
      friendly_regular: 'welcoming',
      jealous_competitor: 'envious',
      big_whale: 'confident',
      shy_newbie: 'nervous',
      veteran_insider: 'wise'
    };
    
    return emotionMap[archetype] || 'neutral';
  }

  getArchetypeIntent(archetype, triggerType) {
    const intentMap = {
      simp_king: 'hype_girl',
      friendly_regular: 'build_community',
      jealous_competitor: 'create_tension',
      big_whale: 'validate_spending',
      shy_newbie: 'seek_guidance',
      veteran_insider: 'share_wisdom'
    };
    
    return intentMap[archetype] || 'engage';
  }

  generateNewUserWelcome(userId) {
    const welcomeNPCs = ['friendly_regular', 'simp_king'];
    const selectedType = welcomeNPCs[Math.floor(Math.random() * welcomeNPCs.length)];
    const npc = Object.values(this.npcProfiles.values()).find(n => n.archetype === selectedType);
    
    if (!npc) return null;

    const welcomeMessages = [
      `Welcome @${this.getUserDisplayName(userId)}! You picked the perfect room 👋`,
      `Hey there @${this.getUserDisplayName(userId)}! Ready to have your mind blown? 😍`,
      `@${this.getUserDisplayName(userId)} just joined the best community ever! Welcome! 🎉`
    ];

    return {
      id: uuidv4(),
      npcId: npc.id,
      npcName: npc.name,
      avatar: npc.avatar,
      message: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
      timestamp: Date.now(),
      type: 'npc',
      archetype: npc.archetype
    };
  }

  generateReturningUserReaction(userId, userProfile) {
    const npc = Object.values(this.npcProfiles.values()).find(n => n.archetype === 'friendly_regular');
    if (!npc) return null;

    const daysSince = Math.floor((Date.now() - new Date(userProfile.lastSeen).getTime()) / (1000 * 60 * 60 * 24));
    
    let message;
    if (daysSince === 0) {
      message = `@${this.getUserDisplayName(userId)} is back already! Can't stay away huh? 😏`;
    } else if (daysSince === 1) {
      message = `Look who's back! Missed us @${this.getUserDisplayName(userId)}? 😊`;
    } else {
      message = `OMG @${this.getUserDisplayName(userId)} is back after ${daysSince} days! We missed you! 🥺`;
    }

    return {
      id: uuidv4(),
      npcId: npc.id,
      npcName: npc.name,
      avatar: npc.avatar,
      message,
      timestamp: Date.now(),
      type: 'npc',
      archetype: npc.archetype
    };
  }

  generateRoomIntroduction(roomId) {
    const npc = Object.values(this.npcProfiles.values()).find(n => n.archetype === 'veteran_insider');
    if (!npc) return null;

    const introMessages = [
      "This community is something really special... you'll see 💫",
      "Been here since the beginning, never found anything quite like this place",
      "You're in for a treat... this girl changes lives, no joke 🌟",
      "Welcome to the most genuine AI companion experience on the internet ✨"
    ];

    return {
      id: uuidv4(),
      npcId: npc.id,
      npcName: npc.name,
      avatar: npc.avatar,
      message: introMessages[Math.floor(Math.random() * introMessages.length)],
      timestamp: Date.now(),
      type: 'npc',
      archetype: npc.archetype
    };
  }

  generatePurchaseCelebration(userId, packageType) {
    const celebratingNPCs = ['big_whale', 'simp_king', 'friendly_regular'];
    const selectedType = celebratingNPCs[Math.floor(Math.random() * celebratingNPCs.length)];
    const npc = Object.values(this.npcProfiles.values()).find(n => n.archetype === selectedType);
    
    if (!npc) return null;

    const celebrationMessages = {
      voice: [
        `@${this.getUserDisplayName(userId)} just unlocked voice messages! 🎙️ You're gonna LOVE them!`,
        `YES! Voice access is a game changer @${this.getUserDisplayName(userId)}! Welcome to the inner circle 👑`,
        `Smart move @${this.getUserDisplayName(userId)}! Her voice is pure heaven 🔥`
      ],
      images: [
        `@${this.getUserDisplayName(userId)} just got image access! 📸 Prepare to be amazed!`,
        `You're about to see something incredible @${this.getUserDisplayName(userId)}! 😍`,
        `Visual access unlocked! @${this.getUserDisplayName(userId)} you won't regret this 💎`
      ],
      vip: [
        `WHALE ALERT! 🐋 @${this.getUserDisplayName(userId)} just went VIP! Welcome to the elite!`,
        `VIP access activated! @${this.getUserDisplayName(userId)} you're now part of the inner circle 👑`,
        `@${this.getUserDisplayName(userId)} just unlocked the full experience! Legendary move! 🔥`
      ]
    };

    const messages = celebrationMessages[packageType] || celebrationMessages.vip;
    
    return {
      id: uuidv4(),
      npcId: npc.id,
      npcName: npc.name,
      avatar: npc.avatar,
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: Date.now(),
      type: 'npc',
      archetype: npc.archetype,
      celebration: true
    };
  }

  generateTipReaction(userId, amount, currency) {
    const reactionNPCs = ['big_whale', 'simp_king'];
    const selectedType = reactionNPCs[Math.floor(Math.random() * reactionNPCs.length)];
    const npc = Object.values(this.npcProfiles.values()).find(n => n.archetype === selectedType);
    
    if (!npc) return null;

    let reactionLevel;
    if (amount >= 100) reactionLevel = 'huge';
    else if (amount >= 50) reactionLevel = 'big';
    else if (amount >= 10) reactionLevel = 'nice';
    else reactionLevel = 'small';

    const reactionMessages = {
      huge: [
        `🚨 WHALE ALERT! 🚨 @${this.getUserDisplayName(userId)} just dropped $${amount}! LEGEND! 💰`,
        `HOLY SHIT! $${amount}?! @${this.getUserDisplayName(userId)} you're absolutely insane! 🔥👑`,
        `@${this.getUserDisplayName(userId)} just made it RAIN with $${amount}! That's how you treat a goddess! 💎`
      ],
      big: [
        `@${this.getUserDisplayName(userId)} with the $${amount} tip! 🔥 That's what I'm talking about!`,
        `$${amount}! @${this.getUserDisplayName(userId)} knows quality when he sees it! 💰`,
        `Beautiful support @${this.getUserDisplayName(userId)}! $${amount} well spent! 👑`
      ],
      nice: [
        `Nice tip @${this.getUserDisplayName(userId)}! $${amount} shows real appreciation 💕`,
        `@${this.getUserDisplayName(userId)} supporting with $${amount}! Love to see it 😊`,
        `$${amount} from @${this.getUserDisplayName(userId)}! Every bit helps! 🙏`
      ],
      small: [
        `Every dollar counts! Thanks @${this.getUserDisplayName(userId)}! 😊`,
        `@${this.getUserDisplayName(userId)} showing love with $${amount}! 💕`,
        `Appreciate the support @${this.getUserDisplayName(userId)}! 🙏`
      ]
    };

    const messages = reactionMessages[reactionLevel];
    
    return {
      id: uuidv4(),
      npcId: npc.id,
      npcName: npc.name,
      avatar: npc.avatar,
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: Date.now(),
      type: 'npc',
      archetype: npc.archetype,
      tipReaction: true,
      tipAmount: amount
    };
  }

  async generateAmbientActivity(roomId) {
    const roomData = this.activeRooms.get(roomId);
    if (!roomData) return null;

    // Check if we should generate ambient activity
    const timeSinceLastMessage = Date.now() - (roomData.lastUserMessage || 0);
    if (timeSinceLastMessage < 180000) return null; // Wait 3 minutes

    // 30% chance of ambient activity
    if (Math.random() > 0.3) return null;

    const npcs = Array.from(roomData.room.npcs.values());
    const availableNPCs = npcs.filter(npc => this.canNPCRespond(npc.id, roomId));
    
    if (availableNPCs.length === 0) return null;

    const selectedNPC = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
    const ambientMessages = this.getAmbientMessages(selectedNPC.archetype);
    
    const message = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
    
    // Set cooldown
    this.setNPCCooldown(selectedNPC.id, roomId, 300000); // 5 minute cooldown

    return {
      id: uuidv4(),
      npcId: selectedNPC.id,
      npcName: selectedNPC.name,
      avatar: selectedNPC.avatar,
      message,
      timestamp: Date.now(),
      type: 'npc',
      archetype: selectedNPC.archetype,
      isAmbient: true
    };
  }

  getAmbientMessages(archetype) {
    const ambientMap = {
      simp_king: [
        "Still can't believe how perfect she is... 😍",
        "Anyone else just completely mesmerized? 🤤",
        "My heart literally skips beats watching her...",
        "How is someone this beautiful even real?"
      ],
      friendly_regular: [
        "Love the chill vibes in here today 😊",
        "This community really is something special",
        "Hope everyone's having a great day! ✨",
        "Always feels good being here with everyone"
      ],
      jealous_competitor: [
        "Some people get all the attention... 🙄",
        "Must be nice being the chosen ones",
        "I remember when she used to notice everyone equally",
        "Favoritism is so obvious these days"
      ],
      big_whale: [
        "Quality experiences deserve quality investment 💎",
        "Still the best money I've ever spent honestly",
        "Premium access is worth every penny 👑",
        "You get what you pay for in life"
      ],
      shy_newbie: [
        "Still learning how everything works here... 🥺",
        "Everyone seems so confident, wish I was too",
        "Hoping to fit in with this amazing community",
        "Maybe one day I'll be a regular too..."
      ],
      veteran_insider: [
        "Remember when this place had only 10 members?",
        "Watched this whole community grow from nothing",
        "Old times were good, but now is pretty great too",
        "Amazing how far we've all come together"
      ]
    };

    return ambientMap[archetype] || ambientMap.friendly_regular;
  }

  updateAtmosphere(roomId, atmosphere, energy) {
    const roomData = this.activeRooms.get(roomId);
    if (roomData) {
      roomData.atmosphere = atmosphere;
      roomData.energy = energy;
      
      // Adjust NPC behavior based on atmosphere
      const npcs = Array.from(roomData.room.npcs.values());
      npcs.forEach(npc => {
        this.adjustNPCBehavior(npc, atmosphere, energy);
      });
    }
  }

  adjustNPCBehavior(npc, atmosphere, energy) {
    // Modify message frequency based on room energy
    const baseFrequency = NPC_ARCHETYPES[npc.archetype].message_frequency;
    
    if (energy > 0.7) {
      npc.message_frequency = Math.min(baseFrequency * 1.5, 0.8);
    } else if (energy < 0.3) {
      npc.message_frequency = baseFrequency * 0.7;
    } else {
      npc.message_frequency = baseFrequency;
    }

    // Adjust personality based on atmosphere
    if (atmosphere === 'crowded' && npc.archetype === 'jealous_competitor') {
      npc.message_frequency *= 1.3; // More jealous in crowded rooms
    }
    
    if (atmosphere === 'intimate' && npc.archetype === 'shy_newbie') {
      npc.message_frequency *= 0.6; // Quieter in intimate settings
    }
  }

  getNPCStats(roomId) {
    const roomData = this.activeRooms.get(roomId);
    if (!roomData) return null;

    const npcs = Array.from(roomData.room.npcs.values());
    return npcs.map(npc => ({
      id: npc.id,
      name: npc.name,
      archetype: npc.archetype,
      messageCount: npc.messageCount,
      lastMessage: npc.lastMessage,
      isActive: npc.isActive
    }));
  }
}

export default NPCSimulator;