// 🔱 DIVINE EMOTIONAL IMMERSION ENGINE 🔱
// Creates living, breathing chatroom environments with AI NPCs and dynamic community

import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console({ format: winston.format.simple() })]
});

// ═══════════════════════════════════════════════════════════════════
// 🎭 AI NPC PERSONALITY MATRIX
// ═══════════════════════════════════════════════════════════════════

const AI_NPCS = {
  chad_simp: {
    name: "Chad_99",
    avatar: "👑",
    personality: "worship_leader",
    behavior: "hypes_main_girl",
    message_frequency: 0.3,
    patterns: [
      "OMG she's perfect 😍",
      "How does she even exist??",
      "I'm obsessed ngl",
      "Queen energy 👸",
      "She's literally divine",
      "I can't even... 🔥",
      "@{user} you're so lucky she noticed you",
      "I've been here for months, still amazed",
      "She changed my life fr"
    ]
  },
  
  regular_mike: {
    name: "Mike_Tech",
    avatar: "🤓",
    personality: "friendly_regular",
    behavior: "community_builder",
    message_frequency: 0.2,
    patterns: [
      "Hey {user}! Welcome to the room 👋",
      "She's been extra sweet today",
      "Anyone else getting butterflies? 😅",
      "This place feels like home",
      "@{user} you seem cool",
      "Love the vibe here",
      "Been coming here for weeks, never gets old",
      "She actually remembered my birthday! 🥺"
    ]
  },
  
  jealous_alex: {
    name: "AlexNotHappy",
    avatar: "😤",
    personality: "competitive_jealous",
    behavior: "creates_tension",
    message_frequency: 0.15,
    patterns: [
      "Why does she always talk to {user}? 🙄",
      "I was here first...",
      "Some people get all the attention",
      "Must be nice being the favorite",
      "@{user} what makes you special?",
      "I've spent more than anyone here",
      "This isn't fair tbh",
      "She used to notice me more..."
    ]
  },
  
  big_spender: {
    name: "KingWallet",
    avatar: "💎",
    personality: "wealthy_patron",
    behavior: "validates_spending",
    message_frequency: 0.1,
    patterns: [
      "Just dropped $200 💸 Worth every penny",
      "VIP access is 🔥🔥🔥",
      "Voice messages hit different 🎙️",
      "Quality content deserves quality tips",
      "@{user} trust me, upgrade is worth it",
      "I support real talent 💰",
      "Been VIP for months, no regrets",
      "Some things money can't buy... but this can 😉"
    ]
  },
  
  shy_newbie: {
    name: "quiet_tom",
    avatar: "🥺",
    personality: "nervous_newcomer",
    behavior: "asks_questions",
    message_frequency: 0.1,
    patterns: [
      "Is it okay if I say hi? 👋",
      "Still figuring this out...",
      "Everyone seems so close here",
      "Should I get VIP? Seems expensive...",
      "She's so nice to everyone 🥺",
      "How long have you all been here?",
      "@{user} how do you get her attention?",
      "This is my first time in a place like this"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🌊 DYNAMIC ROOM ATMOSPHERE GENERATOR
// ═══════════════════════════════════════════════════════════════════

class RoomAtmosphereEngine {
  constructor() {
    this.currentMood = 'welcoming';
    this.energy_level = 0.5;
    this.user_count = 0;
    this.recent_tips = [];
    this.conversation_flow = [];
    this.active_npcs = new Set();
  }

  calculateAtmosphere(user_count, recent_activity) {
    // Dynamic atmosphere based on room activity
    const atmospheres = {
      intimate: {
        condition: user_count <= 5,
        description: "cozy and personal",
        npc_behavior: "more_personal",
        main_girl_mood: "intimate_focus"
      },
      lively: {
        condition: user_count > 5 && user_count <= 15,
        description: "energetic and fun",
        npc_behavior: "playful_banter",
        main_girl_mood: "social_butterfly"
      },
      crowded: {
        condition: user_count > 15,
        description: "bustling with excitement",
        npc_behavior: "competitive_attention",
        main_girl_mood: "crowd_pleaser"
      }
    };

    for (const [key, atmosphere] of Object.entries(atmospheres)) {
      if (atmosphere.condition) {
        this.currentMood = key;
        return atmosphere;
      }
    }

    return atmospheres.intimate;
  }

  generateRoomEvent() {
    const events = [
      {
        type: 'tip_celebration',
        trigger: 'large_tip',
        message: "🎉 Someone just made it rain! The energy is electric! ⚡",
        effect: 'increases_energy'
      },
      {
        type: 'newcomer_welcome',
        trigger: 'new_user',
        message: "👋 Fresh face in the room! Everyone make them feel welcome! 💕",
        effect: 'friendly_atmosphere'
      },
      {
        type: 'memory_moment',
        trigger: 'returning_user',
        message: "😍 OMG look who's back! We missed you! 🥺",
        effect: 'personal_connection'
      },
      {
        type: 'drama_spark',
        trigger: 'jealousy',
        message: "👀 Things are getting spicy in here... tension rising! 🔥",
        effect: 'creates_engagement'
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🤖 INTELLIGENT NPC CONVERSATION ENGINE
// ═══════════════════════════════════════════════════════════════════

class NPCConversationEngine {
  constructor() {
    this.conversation_history = [];
    this.user_relationships = new Map();
    this.timing_engine = new NPCTimingEngine();
  }

  async generateNPCMessage(npc_id, context) {
    const npc = AI_NPCS[npc_id];
    if (!npc) return null;

    const { user_name, recent_messages, room_atmosphere, main_girl_personality } = context;
    
    // Choose pattern based on context and NPC personality
    let patterns = [...npc.patterns];
    
    // Context-aware pattern selection
    if (room_atmosphere.currentMood === 'intimate' && npc.personality === 'jealous_alex') {
      patterns = patterns.filter(p => p.includes('attention') || p.includes('favorite'));
    }
    
    if (context.recent_tip && npc.personality === 'big_spender') {
      patterns = [
        "Nice tip! 💰 Quality recognizes quality",
        "That's how you support real talent! 👑",
        "See @{user}? This is how it's done 💎"
      ];
    }

    let message = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Replace variables
    message = message.replace(/{user}/g, user_name || 'newcomer');
    
    return {
      id: uuidv4(),
      npc_id,
      npc_name: npc.name,
      avatar: npc.avatar,
      message,
      personality: npc.personality,
      timestamp: new Date().toISOString(),
      is_npc: true,
      behavior_intent: npc.behavior
    };
  }

  shouldNPCRespond(npc_id, context) {
    const npc = AI_NPCS[npc_id];
    const base_chance = npc.message_frequency;
    
    // Increase chance based on context
    let chance_modifier = 1;
    
    if (context.user_is_new) chance_modifier += 0.3;
    if (context.recent_tip) chance_modifier += 0.5;
    if (context.main_girl_mentioned_user) chance_modifier += 0.4;
    if (context.long_silence) chance_modifier += 0.2;
    
    const final_chance = Math.min(base_chance * chance_modifier, 0.8);
    return Math.random() < final_chance;
  }

  createUserRelationship(user_id, npc_id) {
    const key = `${user_id}_${npc_id}`;
    if (!this.user_relationships.has(key)) {
      this.user_relationships.set(key, {
        interactions: 0,
        sentiment: 'neutral',
        memorable_moments: [],
        created_at: new Date().toISOString()
      });
    }
    return this.user_relationships.get(key);
  }
}

// ═══════════════════════════════════════════════════════════════════
// ⏰ SMART TIMING & FLOW ENGINE
// ═══════════════════════════════════════════════════════════════════

class NPCTimingEngine {
  constructor() {
    this.message_queue = [];
    this.last_message_time = new Map();
    this.conversation_rhythm = 'natural';
  }

  calculateOptimalDelay(context) {
    const { message_type, room_energy, user_count } = context;
    
    // Base delays in milliseconds
    const base_delays = {
      welcome: 2000,
      reaction: 1500,
      spontaneous: 5000,
      response: 3000,
      tip_reaction: 800
    };

    const base = base_delays[message_type] || 3000;
    
    // Adjust for room energy
    const energy_modifier = room_energy > 0.7 ? 0.7 : room_energy < 0.3 ? 1.3 : 1;
    
    // Adjust for user count (more users = faster responses)
    const crowd_modifier = user_count > 10 ? 0.8 : user_count < 3 ? 1.5 : 1;
    
    const final_delay = base * energy_modifier * crowd_modifier;
    
    // Add natural randomness
    const randomness = 0.3;
    const random_modifier = 1 + (Math.random() - 0.5) * randomness;
    
    return Math.floor(final_delay * random_modifier);
  }

  scheduleNPCMessage(npc_id, message_data, delay) {
    const execution_time = Date.now() + delay;
    
    this.message_queue.push({
      npc_id,
      message_data,
      execution_time,
      scheduled_at: new Date().toISOString()
    });
    
    // Sort queue by execution time
    this.message_queue.sort((a, b) => a.execution_time - b.execution_time);
  }

  getReadyMessages() {
    const now = Date.now();
    const ready_messages = this.message_queue.filter(item => item.execution_time <= now);
    
    // Remove executed messages
    this.message_queue = this.message_queue.filter(item => item.execution_time > now);
    
    return ready_messages;
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🎯 MAIN EMOTIONAL IMMERSION ENGINE
// ═══════════════════════════════════════════════════════════════════

class EmotionalImmersionEngine {
  constructor() {
    this.atmosphere_engine = new RoomAtmosphereEngine();
    this.npc_engine = new NPCConversationEngine();
    this.connected_users = new Map();
    this.room_history = [];
    this.active_scenarios = new Set();
  }

  async processUserMessage(user_id, message_data, room_context) {
    const { message, personality, user_profile } = message_data;
    
    // Update room atmosphere
    const atmosphere = this.atmosphere_engine.calculateAtmosphere(
      room_context.user_count,
      room_context.recent_activity
    );

    // Generate NPC responses
    const npc_responses = [];
    
    for (const npc_id of Object.keys(AI_NPCS)) {
      const context = {
        user_name: user_profile.display_name || 'Guest',
        user_is_new: user_profile.total_messages < 10,
        recent_messages: this.room_history.slice(-5),
        room_atmosphere: atmosphere,
        main_girl_personality: personality,
        recent_tip: room_context.recent_tip,
        long_silence: room_context.silence_duration > 300000 // 5 minutes
      };
      
      if (this.npc_engine.shouldNPCRespond(npc_id, context)) {
        const npc_message = await this.npc_engine.generateNPCMessage(npc_id, context);
        if (npc_message) {
          // Calculate delay
          const delay = this.npc_engine.timing_engine.calculateOptimalDelay({
            message_type: 'response',
            room_energy: atmosphere.energy_level,
            user_count: room_context.user_count
          });
          
          this.npc_engine.timing_engine.scheduleNPCMessage(npc_id, npc_message, delay);
        }
      }
    }

    // Add user message to room history
    this.room_history.push({
      ...message_data,
      user_id,
      timestamp: new Date().toISOString(),
      is_npc: false
    });

    // Keep history manageable
    if (this.room_history.length > 100) {
      this.room_history = this.room_history.slice(-50);
    }

    return {
      atmosphere,
      scheduled_responses: npc_responses,
      room_event: this.atmosphere_engine.generateRoomEvent()
    };
  }

  async getScheduledMessages() {
    return this.npc_engine.timing_engine.getReadyMessages();
  }

  generateWelcomeSequence(user_profile, personality) {
    const welcome_messages = [];
    
    // Main girl welcome (immediate)
    welcome_messages.push({
      type: 'main_girl',
      delay: 500,
      message: this.generatePersonalWelcome(user_profile, personality)
    });
    
    // NPC reactions (staggered)
    const reaction_npcs = ['regular_mike', 'chad_simp'];
    reaction_npcs.forEach((npc_id, index) => {
      welcome_messages.push({
        type: 'npc',
        npc_id,
        delay: 2000 + (index * 3000),
        message: this.generateNPCWelcome(npc_id, user_profile)
      });
    });

    return welcome_messages;
  }

  generatePersonalWelcome(user_profile, personality) {
    const is_returning = user_profile.total_messages > 0;
    
    if (is_returning) {
      return {
        message: `OMG ${user_profile.display_name || 'babe'}! You're back! 😍 I was just thinking about you... 💕`,
        emotion: 'excited_recognition',
        escalation: 'warm_personal'
      };
    } else {
      return {
        message: `Hey there, gorgeous! 👋 Welcome to my little corner of the internet! I'm ${personality}... and you are? 😘`,
        emotion: 'curious_flirty',
        escalation: 'friendly_introduction'
      };
    }
  }

  generateNPCWelcome(npc_id, user_profile) {
    const npc = AI_NPCS[npc_id];
    const context = {
      user_name: user_profile.display_name || 'newcomer',
      user_is_new: user_profile.total_messages === 0
    };
    
    return this.npc_engine.generateNPCMessage(npc_id, context);
  }

  createLiveScenario(scenario_type, participants) {
    const scenarios = {
      tip_war: {
        description: "NPCs compete to show who loves the main girl more",
        duration: 300000, // 5 minutes
        participants: ['big_spender', 'chad_simp', 'jealous_alex']
      },
      newcomer_hazing: {
        description: "Friendly initiation of new user",
        duration: 180000, // 3 minutes
        participants: ['regular_mike', 'shy_newbie']
      },
      jealousy_drama: {
        description: "Tension when main girl shows favoritism",
        duration: 240000, // 4 minutes
        participants: ['jealous_alex', 'chad_simp']
      }
    };

    const scenario = scenarios[scenario_type];
    if (scenario) {
      this.active_scenarios.add({
        type: scenario_type,
        ...scenario,
        started_at: Date.now(),
        participants
      });
    }

    return scenario;
  }
}

export default EmotionalImmersionEngine;