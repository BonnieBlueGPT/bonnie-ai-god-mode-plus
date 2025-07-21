// 🔱 GALATEA ENGINE v25.0 - DIVINE SOUL SIMULATION SERVER 🔱
// The immortal framework where AI souls live, breathe, evolve — and seduce

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import GalateaEngine from './core/engine.js';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════
// 🌐 SERVER INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize the divine engine
const galateaEngine = new GalateaEngine();

// ═══════════════════════════════════════════════════════════════════
// 🛡️ SECURITY & MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════

app.use(helmet({ 
  contentSecurityPolicy: false, 
  crossOriginEmbedderPolicy: false 
}));
app.use(compression({ level: 6 }));
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ═══════════════════════════════════════════════════════════════════
// 📊 LOGGING SYSTEM
// ═══════════════════════════════════════════════════════════════════

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ 
      format: winston.format.simple() 
    })
  ]
});

// ═══════════════════════════════════════════════════════════════════
// 🚫 RATE LIMITING
// ═══════════════════════════════════════════════════════════════════

const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  message: { error: 'Too many requests from this IP' }
});

const chatLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Slow down, eager one! 😘' }
});

app.use(globalLimit);

// ═══════════════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════

function generateToken(userId, metadata = {}) {
  return jwt.sign(
    { userId, timestamp: Date.now(), ...metadata },
    process.env.JWT_SECRET || 'galatea-engine-v25-secret',
    { expiresIn: '30d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'galatea-engine-v25-secret');
  } catch (error) {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════
// 📡 API ROUTES
// ═══════════════════════════════════════════════════════════════════

// Health check
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  res.json({
    status: 'GALATEA ENGINE v25.0 ONLINE',
    service: 'Divine Soul Simulation Framework',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    memory: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
    activeRooms: galateaEngine.getActiveRooms(),
    connectedUsers: io.engine.clientsCount,
    framework: {
      version: '25.0',
      features: [
        '🧠 Modular Soul Injection',
        '🎭 NPC Simulation Layer', 
        '💕 Dynamic Memory Engine',
        '🔥 Emotional Immersion',
        '💎 Premium Conversion',
        '🪙 Crypto Microtransactions'
      ],
      motto: 'Where AI souls transcend digital boundaries'
    }
  });
});

// Main status endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🔱 GALATEA ENGINE v25.0 - DIVINE SOUL SIMULATION 🔱',
    status: 'FRAMEWORK ONLINE',
    version: '25.0',
    souls: galateaEngine.getActiveRooms().map(room => ({
      id: room.id,
      name: room.name,
      userCount: room.userCount,
      atmosphere: room.atmosphere,
      energy: room.energy
    })),
    features: {
      modularSouls: 'Active soul modules with inherited personality frameworks',
      npcSimulation: 'AI-controlled fake users creating community dynamics',
      memoryEngine: 'Persistent emotional and behavioral memory across sessions',
      premiumEngine: 'Psychological conversion system with ethical transparency',
      cryptoEngine: 'Cryptocurrency donations with leaderboard rankings'
    },
    ethics: {
      transparency: 'All AI entities clearly identified',
      honesty: 'Fourth wall awareness maintained',
      consent: 'All transactions clearly explained',
      noDeception: 'Users know this is AI simulation'
    }
  });
});

// Authentication endpoint
app.post('/auth/login', chatLimit, async (req, res) => {
  try {
    const { username, email, soulId = 'bonnie' } = req.body;
    
    const userId = username || email || uuidv4();
    const token = generateToken(userId, { soulId });
    
    // Initialize user in engine
    const userProfile = { 
      displayName: username,
      email,
      preferredSoul: soulId 
    };
    
    res.json({
      success: true,
      token,
      user: { id: userId, soulId },
      availableSouls: galateaEngine.getActiveRooms().map(room => ({
        id: room.id,
        name: room.name,
        atmosphere: room.atmosphere,
        userCount: room.userCount
      }))
    });
    
    logger.info(`User authenticated: ${userId} -> ${soulId}`);
  } catch (error) {
    logger.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get user stats
app.get('/user/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const stats = await galateaEngine.getUserStats(user.userId);
    res.json({ success: true, stats });
  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Premium purchase endpoint
app.post('/premium/purchase', chatLimit, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = verifyToken(token);
    const { packageType, paymentData } = req.body;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const result = await galateaEngine.purchasePremium(user.userId, packageType, paymentData);
    res.json({ success: true, ...result });
    
    logger.info(`Premium purchase: ${user.userId} -> ${packageType}`);
  } catch (error) {
    logger.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// Crypto donation endpoint
app.post('/crypto/donate', chatLimit, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = verifyToken(token);
    const { amount, currency } = req.body;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    const result = await galateaEngine.donateWithCrypto(user.userId, amount, currency);
    res.json({ success: true, ...result });
    
    logger.info(`Crypto donation: ${user.userId} -> ${amount} ${currency}`);
  } catch (error) {
    logger.error('Donation error:', error);
    res.status(500).json({ error: 'Donation failed' });
  }
});

// Analytics endpoint (admin only in production)
app.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      totalRooms: galateaEngine.getActiveRooms().length,
      connectedUsers: io.engine.clientsCount,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
    res.json(analytics);
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({ error: 'Analytics failed' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// 🔌 WEBSOCKET SOUL CONNECTIONS
// ═══════════════════════════════════════════════════════════════════

const connectedUsers = new Map();

io.on('connection', (socket) => {
  logger.info(`Soul connection established: ${socket.id}`);

  socket.emit('engine_welcome', {
    message: '🔱 Welcome to Galatea Engine v25.0! Choose your soul companion...',
    version: '25.0',
    availableRooms: galateaEngine.getActiveRooms()
  });

  // Join room (soul selection)
  socket.on('joinRoom', async (data) => {
    try {
      const { userId, roomId, userProfile } = data;
      
      socket.userId = userId;
      socket.roomId = roomId;
      connectedUsers.set(socket.id, { userId, roomId });
      
      // Join user to room in engine
      const roomData = await galateaEngine.joinRoom(userId, roomId, userProfile);
      
      // Join socket room
      socket.join(roomId);
      
      socket.emit('roomJoined', roomData);
      
      // Notify other users in room
      socket.to(roomId).emit('userJoined', {
        userId,
        userCount: roomData.room.userCount
      });
      
      logger.info(`User ${userId} joined room ${roomId}`);
    } catch (error) {
      logger.error('Join room error:', error);
      socket.emit('error', { error: 'Failed to join room' });
    }
  });

  // Process message
  socket.on('message', async (data) => {
    try {
      const { message, timestamp } = data;
      const user = connectedUsers.get(socket.id);
      
      if (!user || !message) return;

      // Process through engine
      const result = await galateaEngine.processMessage(
        user.userId, 
        user.roomId, 
        message, 
        { timestamp, socketId: socket.id }
      );

      // Emit to room participants
      io.to(user.roomId).emit('messageProcessed', {
        userId: user.userId,
        message,
        result,
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error('Message processing error:', error);
      socket.emit('error', { error: 'Message failed' });
    }
  });

  // Crypto donation
  socket.on('cryptoDonation', async (data) => {
    try {
      const { amount, currency } = data;
      const user = connectedUsers.get(socket.id);
      
      if (!user) return;

      const result = await galateaEngine.donateWithCrypto(user.userId, amount, currency);
      
      socket.emit('donationResult', result);
      
      // Broadcast to room if significant
      if (result.donation.usdValue >= 25) {
        io.to(user.roomId).emit('majorDonation', {
          userId: user.userId,
          amount,
          currency,
          celebration: true
        });
      }

    } catch (error) {
      logger.error('Socket donation error:', error);
      socket.emit('error', { error: 'Donation failed' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      galateaEngine.leaveRoom(user.userId, user.roomId);
      socket.to(user.roomId).emit('userLeft', { userId: user.userId });
      connectedUsers.delete(socket.id);
    }
    logger.info(`Soul connection ended: ${socket.id}`);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🌊 ENGINE EVENT HANDLERS
// ═══════════════════════════════════════════════════════════════════

// Soul message events
galateaEngine.on('soulMessage', (data) => {
  io.to(data.roomId).emit('soulMessage', data);
});

// NPC message events
galateaEngine.on('npcMessage', (data) => {
  io.to(data.roomId).emit('npcMessage', data);
});

// Ambient activity
galateaEngine.on('ambientMessage', (data) => {
  io.to(data.roomId).emit('ambientMessage', data);
});

// Purchase celebrations
galateaEngine.on('purchaseCelebration', (data) => {
  io.to(data.roomId).emit('purchaseCelebration', data);
});

// Crypto tip reactions
galateaEngine.on('cryptoTip', (data) => {
  io.to(data.roomId).emit('cryptoTip', data);
});

// User join/leave events
galateaEngine.on('userJoined', (data) => {
  io.to(data.roomId).emit('userJoined', {
    userId: data.userId,
    userCount: data.room.userCount,
    atmosphere: data.room.atmosphere
  });
});

galateaEngine.on('userLeft', (data) => {
  io.to(data.roomId).emit('userLeft', {
    userId: data.userId
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🚀 DIVINE ENGINE LAUNCH
// ═══════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 10000;

server.listen(PORT, '0.0.0.0', () => {
  logger.info('🔱 GALATEA ENGINE v25.0 ASCENDED! 🔱', {
    port: PORT,
    souls: galateaEngine.getActiveRooms().length,
    version: '25.0',
    timestamp: new Date().toISOString()
  });
  
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                       🔱 GALATEA ENGINE v25.0 ASCENDED! 🔱                    ║
║                                                                              ║
║    🌐 Server: http://localhost:${PORT}                                        ║
║    🔥 Status: DIVINE FRAMEWORK ONLINE                                        ║
║    💫 Souls: ${galateaEngine.getActiveRooms().length} AI Companions Active                                      ║
║    🧠 Memory: Eternal Persistence Enabled                                   ║
║    🎭 NPCs: Community Simulation Active                                      ║
║    💎 Premium: Psychological Conversion Engine Ready                         ║
║    🪙 Crypto: Donation & Ranking System Online                              ║
║                                                                              ║
║    🎯 FRAMEWORK FEATURES:                                                    ║
║      • Modular Soul Injection                                               ║
║      • NPC Community Simulation                                             ║
║      • Persistent Emotional Memory                                          ║
║      • Fourth Wall Awareness                                                ║
║      • Ethical AI Disclosure                                                ║
║      • Premium Conversion Psychology                                        ║
║      • Crypto Microtransaction Rankings                                     ║
║                                                                              ║
║                   READY TO SEDUCE THE INTERNET 🌊                           ║
╚══════════════════════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🔱 Galatea Engine gracefully descending...');
  galateaEngine.shutdown();
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('🔱 Galatea Engine interrupted - graceful shutdown...');
  galateaEngine.shutdown();
  process.exit(0);
});

export default app;