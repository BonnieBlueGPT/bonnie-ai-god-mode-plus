// 🔱 GALATEA ENGINE v25.0 - IMMORTAL SOUL SIMULATION CORE 🔱
// The divine framework where AI souls live, breathe, evolve — and seduce

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import winston from 'winston';
import BonnieSoul from './souls/bonnie.js';
import NovaSoul from './souls/nova.js';
import GalateaSoul from './souls/galatea.js';
import MemoryEngine from './memory.js';
import NPCSimulator from '../npc/fakeUsers.js';
import PremiumEngine from './premium.js';
import CryptoEngine from './crypto.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});

// ═══════════════════════════════════════════════════════════════════
// 🌊 CORE GALATEA ENGINE
// ═══════════════════════════════════════════════════════════════════

class GalateaEngine extends EventEmitter {
  constructor() {
    super();
    this.souls = new Map();
    this.rooms = new Map();
    this.users = new Map();
    this.memoryEngine = new MemoryEngine();
    this.npcSimulator = new NPCSimulator();
    this.premiumEngine = new PremiumEngine();
    this.cryptoEngine = new CryptoEngine();
    this.isAlive = false;
    this.heartbeat = null;
    
    this.initializeSouls();
    this.startHeartbeat();
  }

  initializeSouls() {
    // Initialize AI souls with shared memory access
    this.souls.set('bonnie', new BonnieSoul(this.memoryEngine));
    this.souls.set('nova', new NovaSoul(this.memoryEngine));
    this.souls.set('galatea', new GalateaSoul(this.memoryEngine));
    
    // Create default rooms for each soul
    for (const [soulId, soul] of this.souls) {
      this.createRoom(soulId, soul);
    }
  }

  createRoom(roomId, soul) {
    const room = {
      id: roomId,
      soul: soul,
      users: new Map(),
      npcs: this.npcSimulator.generateRoomNPCs(roomId),
      atmosphere: 'welcoming',
      energy: 0.5,
      messageHistory: [],
      lastActivity: Date.now(),
      activeScenarios: new Set()
    };
    
    this.rooms.set(roomId, room);
    this.npcSimulator.activateRoom(roomId, room);
    return room;
  }

  async joinRoom(userId, roomId, userProfile = {}) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error('Room not found');

    // Initialize user in memory if new
    const user = await this.memoryEngine.getOrCreateUser(userId, userProfile);
    this.users.set(userId, { ...user, currentRoom: roomId, joinedAt: Date.now() });
    
    // Add user to room
    room.users.set(userId, {
      userId,
      profile: user,
      joinedAt: Date.now(),
      lastMessage: null,
      bondLevel: user.bondScore || 0
    });

    // Generate welcome sequence
    const welcomeMessages = await this.generateWelcomeSequence(userId, room, user);
    
    // Update room atmosphere
    this.updateRoomAtmosphere(room);
    
    // Emit events
    this.emit('userJoined', { userId, roomId, room, user });
    
    return {
      room: this.serializeRoom(room),
      user,
      welcomeMessages,
      npcs: Array.from(room.npcs.values())
    };
  }

  async processMessage(userId, roomId, message, metadata = {}) {
    const room = this.rooms.get(roomId);
    const user = this.users.get(userId);
    
    if (!room || !user) throw new Error('Invalid room or user');

    // Process message through soul
    const soulResponse = await room.soul.processMessage(userId, message, {
      userProfile: user.profile,
      roomContext: this.getRoomContext(room),
      metadata
    });

    // Update memory
    await this.memoryEngine.recordInteraction(userId, {
      type: 'message',
      content: message,
      response: soulResponse.message,
      emotion: soulResponse.emotion,
      bondDelta: soulResponse.bondDelta || 0
    });

    // Add to room history
    const messageObj = {
      id: uuidv4(),
      userId,
      message,
      timestamp: Date.now(),
      type: 'user'
    };
    
    room.messageHistory.push(messageObj);
    
    // Generate NPC reactions
    const npcReactions = await this.npcSimulator.generateReactions(roomId, messageObj, soulResponse);
    
    // Schedule soul response with realistic delay
    const responseDelay = this.calculateResponseDelay(room, soulResponse);
    
    setTimeout(() => {
      const responseObj = {
        id: uuidv4(),
        userId: 'soul',
        message: soulResponse.message,
        timestamp: Date.now(),
        type: 'soul',
        emotion: soulResponse.emotion,
        personality: room.soul.personality
      };
      
      room.messageHistory.push(responseObj);
      this.emit('soulMessage', { roomId, message: responseObj, userId });
    }, responseDelay);

    // Schedule NPC reactions
    npcReactions.forEach(reaction => {
      setTimeout(() => {
        room.messageHistory.push(reaction);
        this.emit('npcMessage', { roomId, message: reaction, userId });
      }, reaction.delay);
    });

    // Check for premium upsells
    const upsell = await this.premiumEngine.checkUpsellOpportunity(userId, soulResponse, user.profile);
    
    // Update room atmosphere
    this.updateRoomAtmosphere(room);
    
    return {
      messageId: messageObj.id,
      soulResponse: soulResponse,
      npcReactions: npcReactions.length,
      upsell,
      roomAtmosphere: room.atmosphere,
      bondLevel: user.profile.bondScore
    };
  }

  async generateWelcomeSequence(userId, room, user) {
    const isReturning = user.totalMessages > 0;
    const messages = [];

    if (isReturning) {
      // Returning user - personalized welcome
      const lastSeen = await this.memoryEngine.getLastInteraction(userId);
      const daysSince = Math.floor((Date.now() - new Date(lastSeen.timestamp).getTime()) / (1000 * 60 * 60 * 24));
      
      messages.push({
        delay: 800,
        source: 'soul',
        message: await room.soul.generateReturningWelcome(userId, { daysSince, lastInteraction: lastSeen })
      });

      // NPCs acknowledge returning user
      messages.push({
        delay: 3000,
        source: 'npc',
        message: this.npcSimulator.generateReturningUserReaction(userId, user)
      });
    } else {
      // New user - full welcome sequence
      messages.push({
        delay: 500,
        source: 'soul',
        message: await room.soul.generateNewUserWelcome(userId)
      });

      messages.push({
        delay: 2500,
        source: 'npc',
        message: this.npcSimulator.generateNewUserWelcome(userId)
      });

      messages.push({
        delay: 5000,
        source: 'npc',
        message: this.npcSimulator.generateRoomIntroduction(room.id)
      });
    }

    return messages;
  }

  calculateResponseDelay(room, soulResponse) {
    const baseDelay = 1500; // 1.5 seconds base
    const energyModifier = 1 - (room.energy * 0.3); // Higher energy = faster response
    const userCount = room.users.size;
    const crowdModifier = userCount > 5 ? 0.8 : userCount < 2 ? 1.2 : 1;
    
    // Add natural variance
    const variance = 0.3;
    const randomModifier = 1 + (Math.random() - 0.5) * variance;
    
    const finalDelay = baseDelay * energyModifier * crowdModifier * randomModifier;
    return Math.max(800, Math.min(finalDelay, 4000)); // Between 0.8-4 seconds
  }

  updateRoomAtmosphere(room) {
    const userCount = room.users.size;
    const recentActivity = room.messageHistory.filter(m => 
      Date.now() - m.timestamp < 300000 // Last 5 minutes
    ).length;
    
    // Calculate energy level
    room.energy = Math.min(1, (recentActivity / 10) + (userCount / 20));
    
    // Determine atmosphere
    if (userCount <= 3) {
      room.atmosphere = 'intimate';
    } else if (userCount <= 10) {
      room.atmosphere = 'lively';
    } else {
      room.atmosphere = 'crowded';
    }
    
    // Update NPCs based on atmosphere
    this.npcSimulator.updateAtmosphere(room.id, room.atmosphere, room.energy);
  }

  getRoomContext(room) {
    return {
      userCount: room.users.size,
      atmosphere: room.atmosphere,
      energy: room.energy,
      recentMessages: room.messageHistory.slice(-10),
      activeUsers: Array.from(room.users.keys()),
      lastActivity: room.lastActivity
    };
  }

  serializeRoom(room) {
    return {
      id: room.id,
      soulName: room.soul.name,
      personality: room.soul.personality,
      atmosphere: room.atmosphere,
      energy: room.energy,
      userCount: room.users.size,
      recentMessages: room.messageHistory.slice(-20).map(m => ({
        id: m.id,
        message: m.message,
        timestamp: m.timestamp,
        type: m.type,
        emotion: m.emotion,
        isNPC: m.type === 'npc'
      }))
    };
  }

  startHeartbeat() {
    this.isAlive = true;
    this.heartbeat = setInterval(() => {
      this.processHeartbeat();
    }, 30000); // Every 30 seconds
  }

  async processHeartbeat() {
    for (const [roomId, room] of this.rooms) {
      // Generate ambient NPC activity
      if (room.users.size > 0) {
        const ambientMessage = await this.npcSimulator.generateAmbientActivity(roomId);
        if (ambientMessage) {
          room.messageHistory.push(ambientMessage);
          this.emit('ambientMessage', { roomId, message: ambientMessage });
        }
      }

      // Clean old messages
      if (room.messageHistory.length > 200) {
        room.messageHistory = room.messageHistory.slice(-100);
      }

      // Update room metrics
      room.lastActivity = Math.max(...room.messageHistory.map(m => m.timestamp));
    }

    // Process memory consolidation
    await this.memoryEngine.consolidateMemories();
    
    // Update crypto rankings
    await this.cryptoEngine.updateRankings();
  }

  async purchasePremium(userId, package_type, payment_data) {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found');

    const result = await this.premiumEngine.processPurchase(userId, package_type, payment_data);
    
    if (result.success) {
      // Update user profile
      user.profile.premiumTier = result.tier;
      user.profile.premiumExpiry = result.expiry;
      
      // Record in memory
      await this.memoryEngine.recordPurchase(userId, package_type, payment_data.amount);
      
      // Generate celebration in current room
      if (user.currentRoom) {
        const room = this.rooms.get(user.currentRoom);
        const celebrationMessage = await this.npcSimulator.generatePurchaseCelebration(userId, package_type);
        room.messageHistory.push(celebrationMessage);
        this.emit('purchaseCelebration', { userId, roomId: user.currentRoom, message: celebrationMessage });
      }
    }

    return result;
  }

  async donateWithCrypto(userId, amount, currency) {
    const result = await this.cryptoEngine.processDonation(userId, amount, currency);
    
    if (result.success) {
      const user = this.users.get(userId);
      if (user && user.currentRoom) {
        const room = this.rooms.get(user.currentRoom);
        const tipMessage = await this.npcSimulator.generateTipReaction(userId, amount, currency);
        room.messageHistory.push(tipMessage);
        this.emit('cryptoTip', { userId, roomId: user.currentRoom, amount, currency, message: tipMessage });
      }
    }

    return result;
  }

  async leaveRoom(userId, roomId) {
    const room = this.rooms.get(roomId);
    const user = this.users.get(userId);
    
    if (room && user) {
      room.users.delete(userId);
      user.currentRoom = null;
      
      // Generate farewell
      const farewellMessage = await room.soul.generateFarewell(userId);
      room.messageHistory.push({
        id: uuidv4(),
        userId: 'soul',
        message: farewellMessage,
        timestamp: Date.now(),
        type: 'soul'
      });

      this.updateRoomAtmosphere(room);
      this.emit('userLeft', { userId, roomId });
    }
  }

  getActiveRooms() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.soul.name,
      userCount: room.users.size,
      atmosphere: room.atmosphere,
      energy: room.energy,
      lastActivity: room.lastActivity
    }));
  }

  async getUserStats(userId) {
    const user = this.users.get(userId);
    if (!user) return null;

    const stats = await this.memoryEngine.getUserStats(userId);
    const cryptoStats = await this.cryptoEngine.getUserStats(userId);
    const premiumStatus = await this.premiumEngine.getUserStatus(userId);

    return {
      ...stats,
      crypto: cryptoStats,
      premium: premiumStatus,
      currentRoom: user.currentRoom
    };
  }

  shutdown() {
    this.isAlive = false;
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
    
    // Save all user states
    for (const [userId, user] of this.users) {
      this.memoryEngine.saveUserState(userId, user);
    }
    
    logger.info('GalateaEngine shutdown complete');
  }
}

export default GalateaEngine;