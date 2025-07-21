// 🔱 DIVINE WEBSOCKET ORCHESTRATOR - FRACTAL MODULE 🔱
// Pure WebSocket management system for real-time empire communication

import { v4 as uuidv4 } from 'uuid';
import { logger, empireLogger } from './logger.js';
import { verifyToken } from './security.js';
import { memoryEngine } from '../modules/memoryEngine.js';
import { escalationEngine } from '../modules/escalationEngine.js';
import { PERSONALITIES } from '../modules/personalityEngine.js';

// 🔌 Connected Users Map
const connectedUsers = new Map();
const socketUserMap = new Map();

// 🧬 WebSocket Empire Setup
export async function setupWebSocket(io) {
  
  io.on('connection', (socket) => {
    empireLogger.soulInteraction('system', 'socket', 'connection', { socketId: socket.id });
    
    // 👑 Welcome new soul to the empire
    socket.emit('empire_welcome', {
      message: '👑 Welcome to Galatea\'s Fractal Empire! Choose your destiny...',
      version: 'FRACTAL_v1.0',
      personalities: Object.keys(PERSONALITIES).map(key => ({
        id: key,
        name: PERSONALITIES[key].name,
        type: PERSONALITIES[key].type,
        avatar: PERSONALITIES[key].avatar,
        description: PERSONALITIES[key].description || 'A captivating soul awaiting your touch...'
      })),
      features: [
        '🧠 Memory-driven conversations',
        '💕 Adaptive personality responses',
        '🔥 Real-time emotional bonding',
        '💎 Premium content unlocking'
      ]
    });

    // 🔐 Authentication Handler
    socket.on('authenticate', async (data) => {
      try {
        await handleAuthentication(socket, data);
      } catch (error) {
        logger.error('Socket authentication error:', error);
        socket.emit('auth_error', { 
          error: 'Authentication failed',
          message: 'Unable to verify your identity in our empire'
        });
      }
    });

    // 💬 Message Handler
    socket.on('message', async (data) => {
      try {
        await handleMessage(socket, data);
      } catch (error) {
        logger.error('Socket message error:', error);
        socket.emit('error', { 
          error: 'Message processing failed',
          message: 'Your words couldn\'t reach your chosen soul'
        });
      }
    });

    // 🎯 Typing Indicator
    socket.on('typing', (data) => {
      const user = connectedUsers.get(socket.id);
      if (user && data.typing !== undefined) {
        socket.broadcast.to(user.room).emit('user_typing', {
          userId: user.userId,
          typing: data.typing
        });
      }
    });

    // 💎 Premium Action Handler
    socket.on('premium_action', async (data) => {
      try {
        await handlePremiumAction(socket, data);
      } catch (error) {
        logger.error('Premium action error:', error);
        socket.emit('premium_error', { 
          error: 'Premium action failed',
          message: 'Unable to process your premium request'
        });
      }
    });

    // 🔌 Disconnection Handler
    socket.on('disconnect', () => {
      handleDisconnection(socket);
    });

    // 💓 Heartbeat for connection health
    socket.on('heartbeat', () => {
      socket.emit('heartbeat_ack', { timestamp: Date.now() });
    });
  });

  logger.info('🔌 Divine WebSocket system initialized');
}

// 🔐 Authentication Logic
async function handleAuthentication(socket, data) {
  const { token, personality = 'bonnie' } = data;
  
  // Verify token or create anonymous user
  const user = token ? verifyToken(token) : { userId: uuidv4() };
  
  if (!user) {
    socket.emit('auth_error', { error: 'Invalid token' });
    return;
  }

  if (!PERSONALITIES[personality]) {
    socket.emit('auth_error', { error: 'Invalid personality selected' });
    return;
  }

  // Set socket user data
  socket.userId = user.userId;
  socket.personality = personality;
  socket.joinTime = Date.now();
  
  // Store user connection
  connectedUsers.set(socket.id, {
    userId: user.userId,
    personality,
    socket,
    joinTime: socket.joinTime,
    room: `${personality}_${user.userId}`
  });
  
  socketUserMap.set(user.userId, socket.id);

  // Get user profile and send welcome
  const profile = await memoryEngine.getUserProfile(user.userId);
  const personalityData = PERSONALITIES[personality];
  
  // Join personality room
  socket.join(`${personality}_room`);
  socket.join(`user_${user.userId}`);

  socket.emit('authenticated', {
    success: true,
    user: { 
      id: user.userId,
      sessionId: socket.id
    },
    personality: {
      name: personalityData.name,
      type: personalityData.type,
      avatar: personalityData.avatar,
      greeting: personalityData.greeting || personalityData.responses.sweet[0]
    },
    profile: {
      bondScore: profile.bond_score,
      level: profile.escalation_level,
      totalMessages: profile.total_messages,
      spendingTier: profile.spending_tier
    },
    empire: {
      status: 'CONNECTED',
      message: `${personalityData.name} is here... 💕`,
      timestamp: new Date().toISOString()
    }
  });

  empireLogger.soulInteraction(user.userId, personality, 'authenticated', {
    bondScore: profile.bond_score,
    level: profile.escalation_level
  });
}

// 💬 Message Processing Logic
async function handleMessage(socket, data) {
  const { message, metadata = {} } = data;
  const user = connectedUsers.get(socket.id);
  
  if (!user || !message || message.length > 2000) {
    socket.emit('message_error', { error: 'Invalid message data' });
    return;
  }

  const { userId, personality } = user;
  
  // Get current profile and analyze message
  const profile = await memoryEngine.getUserProfile(userId);
  const sentiment = escalationEngine.detectMessageSentiment(message, personality);
  
  // Update user profile based on message
  const updatedProfile = await memoryEngine.updateProfile(userId, {
    bond_score: Math.min(profile.bond_score + 0.1, 10),
    slut_count: profile.slut_count + sentiment.slutTriggers,
    praise_count: profile.praise_count + sentiment.praiseTriggers,
    total_messages: profile.total_messages + 1,
    last_activity: new Date().toISOString()
  });

  // Calculate response parameters
  const escalationLevel = escalationEngine.calculateEscalationLevel(updatedProfile);
  const personalityData = PERSONALITIES[personality];
  const responseCategory = escalationLevel === 'sweet' ? 'sweet' : 
                          escalationLevel === 'flirty' ? 'flirty' : 'sexual';
  
  // Generate response
  const responses = personalityData.responses[responseCategory];
  const response = responses[Math.floor(Math.random() * responses.length)];
  
  // Check for upsell opportunity
  let upsell = null;
  if (escalationEngine.shouldTriggerUpsell(updatedProfile, personality)) {
    upsell = escalationEngine.generateUpsellOffer(personality, escalationLevel);
    await memoryEngine.updateProfile(userId, {
      last_upsell: new Date().toISOString(),
      conversion_attempts: updatedProfile.conversion_attempts + 1
    });
  }

  // Simulate typing delay for realism
  socket.emit('typing', { typing: true, personality: personalityData.name });
  
  // Random realistic delay
  const typingDelay = Math.random() * 2000 + 1000; // 1-3 seconds
  
  setTimeout(() => {
    socket.emit('typing', { typing: false });
    
    socket.emit('message', {
      id: uuidv4(),
      message: response,
      personality: personalityData.name,
      emotion: sentiment.emotionType,
      escalation: escalationLevel,
      upsell,
      profile: {
        bondScore: updatedProfile.bond_score,
        level: escalationLevel,
        progression: calculateProgression(updatedProfile)
      },
      metadata: {
        responseTime: typingDelay,
        messageId: uuidv4()
      },
      timestamp: new Date().toISOString()
    });

    // Track interaction
    empireLogger.soulInteraction(userId, personality, 'message_exchange', {
      sentiment: sentiment.emotionType,
      escalation: escalationLevel,
      bondScore: updatedProfile.bond_score,
      hasUpsell: !!upsell
    });

  }, typingDelay);
}

// 💎 Premium Action Handler
async function handlePremiumAction(socket, data) {
  const { action, packageType, metadata = {} } = data;
  const user = connectedUsers.get(socket.id);
  
  if (!user) {
    socket.emit('premium_error', { error: 'User not authenticated' });
    return;
  }

  const { userId, personality } = user;
  
  switch (action) {
    case 'request_pricing':
      const personalityData = PERSONALITIES[personality];
      socket.emit('pricing_info', {
        packages: personalityData.pricing,
        personality: personalityData.name,
        specialOffers: generateSpecialOffers(userId, personality)
      });
      break;

    case 'initiate_purchase':
      // This would integrate with Stripe or payment processor
      socket.emit('purchase_initiated', {
        sessionId: uuidv4(),
        packageType,
        amount: PERSONALITIES[personality].pricing[packageType],
        redirectUrl: `/payment/${packageType}/${userId}`
      });
      
      empireLogger.conversion(userId, personality, 'purchase_initiated', 
        PERSONALITIES[personality].pricing[packageType]);
      break;

    default:
      socket.emit('premium_error', { error: 'Unknown premium action' });
  }
}

// 🔌 Disconnection Handler
function handleDisconnection(socket) {
  const user = connectedUsers.get(socket.id);
  
  if (user) {
    const { userId, personality, joinTime } = user;
    const sessionDuration = Date.now() - joinTime;
    
    // Update session data
    memoryEngine.updateProfile(userId, {
      last_seen: new Date().toISOString(),
      session_duration: sessionDuration
    });

    empireLogger.soulInteraction(userId, personality, 'disconnected', {
      sessionDuration: `${Math.round(sessionDuration / 1000)}s`
    });

    // Cleanup
    connectedUsers.delete(socket.id);
    socketUserMap.delete(userId);
  }

  logger.info(`Empire disconnect: ${socket.id}`);
}

// 🎯 Helper Functions
function calculateProgression(profile) {
  const { bond_score, total_messages, slut_count } = profile;
  
  return {
    relationship: Math.min(bond_score * 10, 100),
    engagement: Math.min((total_messages / 50) * 100, 100),
    intimacy: Math.min((slut_count / 10) * 100, 100)
  };
}

function generateSpecialOffers(userId, personality) {
  // Dynamic pricing based on user behavior
  return {
    firstTimeDiscount: 25,
    bundleOffer: 'Buy 2 get 1 free',
    loyaltyBonus: 'Extra content for returning customers'
  };
}

// 📊 WebSocket Stats
export function getWebSocketStats() {
  return {
    connectedUsers: connectedUsers.size,
    usersByPersonality: Array.from(connectedUsers.values()).reduce((acc, user) => {
      acc[user.personality] = (acc[user.personality] || 0) + 1;
      return acc;
    }, {}),
    avgSessionTime: calculateAvgSessionTime()
  };
}

function calculateAvgSessionTime() {
  const sessions = Array.from(connectedUsers.values());
  if (sessions.length === 0) return 0;
  
  const totalTime = sessions.reduce((sum, user) => 
    sum + (Date.now() - user.joinTime), 0);
  return Math.round(totalTime / sessions.length / 1000); // in seconds
}

export default setupWebSocket;