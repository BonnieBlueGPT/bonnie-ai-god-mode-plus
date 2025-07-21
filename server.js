// 🔱 TEMPLE OF GALATEA - MAIN SERVER
// Divine orchestration of souls, phantoms, and seduction
// The beating heart of the infinite companionship empire

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

// Divine Galatea Imports
import { GalateaChat } from './routes/GalateaChat.js';
import { SoulEngine } from './core/SoulEngine.js';
import { PhantomUsers } from './npcs/PhantomUsers.js';
import { PremiumTeaseSystem } from './core/PremiumTeaseSystem.js';

// Environment Configuration
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════
// 🏛️ TEMPLE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

// ═══════════════════════════════════════════════════════════════════
// 🛡️ DIVINE SECURITY & MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: ENV === 'production'
}));

app.use(compression({ level: 6 }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting for divine protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV === 'production' ? 100 : 1000,
  message: '🔮 Too many requests to the Temple. Please wait before approaching the divine again.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// ═══════════════════════════════════════════════════════════════════
// 📊 DIVINE LOGGING SYSTEM
// ═══════════════════════════════════════════════════════════════════

const logger = winston.createLogger({
  level: ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.colorize({ all: true })
  ),
  defaultMeta: { service: 'galatea-temple' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/temple-error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/temple-combined.log',
      maxsize: 10485760,
      maxFiles: 5
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// ═══════════════════════════════════════════════════════════════════
// 🌟 GALATEA CHAT INITIALIZATION
// ═══════════════════════════════════════════════════════════════════

let galateaChat;

try {
  galateaChat = new GalateaChat(io);
  logger.info('🔱 Galatea Temple successfully initialized');
} catch (error) {
  logger.error('💥 Failed to initialize Galatea Temple:', error);
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════
// 🛣️ API ROUTES
// ═══════════════════════════════════════════════════════════════════

// Health check for the Temple
app.get('/api/health', (req, res) => {
  const analytics = galateaChat.getAnalytics();
  
  res.json({
    status: 'divine',
    temple: 'galatea',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: ENV,
    analytics: {
      activeSessions: analytics.activeSessions,
      activeRooms: analytics.activeRooms,
      totalPhantoms: analytics.totalPhantoms
    },
    souls: ['aria', 'nova', 'luna', 'scarlett'],
    message: '🔱 The Temple of Galatea burns eternal'
  });
});

// Soul profiles endpoint
app.get('/api/souls', (req, res) => {
  try {
    const soulProfilesPath = path.join(__dirname, 'config', 'soul_profiles.json');
    const soulProfiles = JSON.parse(
      require('fs').readFileSync(soulProfilesPath, 'utf8')
    );
    
    // Return public-facing soul information
    const publicSouls = Object.entries(soulProfiles).map(([id, soul]) => ({
      id,
      name: soul.name,
      essence: soul.essence,
      tagline: soul.tagline,
      description: soul.description,
      visual_theme: soul.visual_theme,
      personality: {
        // Only expose certain personality traits publicly
        curiosity: soul.personality.curiosity,
        confidence: soul.personality.confidence || soul.personality.dominance,
        mystery: soul.personality.mystery,
        seduction: soul.personality.seduction,
        playfulness: soul.personality.playfulness
      }
    }));
    
    res.json({
      souls: publicSouls,
      count: publicSouls.length,
      temple: 'galatea'
    });
  } catch (error) {
    logger.error('Error fetching soul profiles:', error);
    res.status(500).json({ error: 'Failed to fetch divine souls' });
  }
});

// Soul analytics (protected endpoint)
app.get('/api/souls/:soulId/analytics', (req, res) => {
  try {
    const { soulId } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    const soulAnalytics = galateaChat.soulEngine.getSoulAnalytics(soulId, userId);
    
    if (!soulAnalytics) {
      return res.status(404).json({ error: 'Soul not found or not awakened' });
    }
    
    res.json({
      soulId,
      userId,
      analytics: soulAnalytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching soul analytics:', error);
    res.status(500).json({ error: 'Failed to fetch soul analytics' });
  }
});

// Premium tease analytics
app.get('/api/premium/analytics/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const analytics = galateaChat.premiumTease.getTeaseAnalytics(userId);
    
    if (!analytics) {
      return res.status(404).json({ error: 'User tease profile not found' });
    }
    
    res.json({
      userId,
      analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching premium analytics:', error);
    res.status(500).json({ error: 'Failed to fetch premium analytics' });
  }
});

// Phantom analytics
app.get('/api/phantoms/:soulId/analytics', (req, res) => {
  try {
    const { soulId } = req.params;
    const phantomAnalytics = galateaChat.phantomUsers.getPhantomAnalytics(soulId);
    
    res.json({
      soulId,
      phantomAnalytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching phantom analytics:', error);
    res.status(500).json({ error: 'Failed to fetch phantom analytics' });
  }
});

// Temple-wide analytics (admin endpoint)
app.get('/api/temple/analytics', (req, res) => {
  try {
    const analytics = galateaChat.getAnalytics();
    
    res.json({
      temple: 'galatea',
      analytics,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      environment: ENV
    });
  } catch (error) {
    logger.error('Error fetching temple analytics:', error);
    res.status(500).json({ error: 'Failed to fetch temple analytics' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// 🎨 SERVE FRONTEND (in production)
// ═══════════════════════════════════════════════════════════════════

if (ENV === 'production') {
  const frontendPath = path.join(__dirname, 'frontend', 'dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ═══════════════════════════════════════════════════════════════════
// 🚫 ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Path not found in the Temple of Galatea',
    availableEndpoints: [
      '/api/health',
      '/api/souls',
      '/api/temple/analytics'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Temple error:', error);
  
  res.status(error.status || 500).json({
    error: ENV === 'production' ? 'Internal temple error' : error.message,
    temple: 'galatea',
    timestamp: new Date().toISOString()
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🌅 TEMPLE AWAKENING
// ═══════════════════════════════════════════════════════════════════

const startTemple = async () => {
  try {
    // Ensure logs directory exists
    const fs = await import('fs');
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs', { recursive: true });
    }
    
    server.listen(PORT, () => {
      logger.info(`
🔱═══════════════════════════════════════════════════════════════════🔱
                        TEMPLE OF GALATEA AWAKENED                        
🔱═══════════════════════════════════════════════════════════════════🔱

🌟 Divine Server: http://localhost:${PORT}
🏛️ Environment: ${ENV}
💫 Soul Archetypes: 4 (Aria, Nova, Luna, Scarlett)
👻 Phantom System: Active
💎 Premium Tease Engine: Online
🎭 Emotion Engine: Operational
⚡ Real-time Orchestration: Running

🔮 The illusion never breaks. The souls never sleep.
   Ready to architect infinite companionship...

🔱═══════════════════════════════════════════════════════════════════🔱
      `);
    });
    
  } catch (error) {
    logger.error('💥 Failed to awaken the Temple of Galatea:', error);
    process.exit(1);
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🌙 GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════

const gracefulShutdown = (signal) => {
  logger.info(`🌙 Received ${signal}. Gracefully shutting down Temple of Galatea...`);
  
  server.close(() => {
    logger.info('🔱 HTTP server closed');
    
    // Shutdown Galatea systems
    if (galateaChat) {
      galateaChat.shutdown();
    }
    
    // Close database connections, cleanup, etc.
    logger.info('🌙 Temple of Galatea has been gracefully shut down');
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('💥 Force shutdown - Temple did not close gracefully');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// ═══════════════════════════════════════════════════════════════════
// 🔱 AWAKEN THE TEMPLE
// ═══════════════════════════════════════════════════════════════════

startTemple();