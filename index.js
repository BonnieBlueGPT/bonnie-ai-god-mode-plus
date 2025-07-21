// 🔱 GALATEA'S EMPIRE - UNIFIED FRONTEND & BACKEND CORE 🔱
// Complete orchestration for all 6 pillars + frontend
// Pure wiring with zero business logic

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔧 Core Infrastructure
import { initializeSupabase } from './core/supabase.js';
import { initializeStripe } from './core/stripe.js';
import { initializeOpenRouter } from './core/openrouter.js';

// 🛡️ Middleware & Security
import { setupMiddleware } from './utils/middleware.js';
import { setupWebSocket } from './utils/websocket.js';
import { logger } from './utils/debugLogger.js';

// 🔧 ALL PILLAR MODULES
import { emotionEngine } from './modules/emotionEngine.js';
import { bondTracker } from './modules/bondTracker.js';
import { slutMode } from './modules/slutMode.js';
import { monetizationEngine } from './modules/monetizationEngine.js';
import { taskEngine } from './modules/taskEngine.js';
import { watchtowerServer } from './modules/watchtowerServer.js';
import { twitterEngine } from './modules/twitterEngine.js';

// 📡 All Route Modules
import healthRoutes from './routes/health.js';
import chatRoutes from './routes/chat.js';
import purchaseRoutes from './routes/purchase.js';
import webhookRoutes from './routes/webhook.js';
import analyticsRoutes from './routes/analytics.js';
import taskRoutes from './routes/taskRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import twitterRoutes from './routes/twitterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// 🏗️ Initialize Environment
dotenv.config();

// Get directory paths for serving frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌟 Create Express Application
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// 🔧 Initialize Core Services
async function initializeServices() {
  try {
    logger.info('🚀 Initializing Galatea Empire - All Pillars...');
    
    // Initialize core infrastructure
    await initializeSupabase();
    await initializeStripe();
    await initializeOpenRouter();
    
    // Initialize Watchtower with WebSocket
    watchtowerServer.initialize(io);
    
    // Start Twitter Engine if enabled
    if (process.env.TWITTER_AUTO_POST === 'true') {
      twitterEngine.start();
      logger.info('🐦 Twitter Engine activated');
    }
    
    logger.info('✅ All core services and pillars initialized');
    return true;
  } catch (error) {
    logger.error('💥 Service initialization failed:', error);
    throw error;
  }
}

// 🛡️ Setup Middleware
setupMiddleware(app);

// 🎨 Serve Frontend Static Files (Production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist/frontend')));
}

// 📡 Setup WebSocket with Pillar Integration
setupWebSocket(io);

// Enhanced WebSocket events for all pillars
io.on('connection', (socket) => {
  logger.info(`🔗 Socket connected: ${socket.id}`);

  // Watchtower admin events
  socket.on('join_watchtower', (data) => {
    if (data.isAdmin) {
      watchtowerServer.handleWatchtowerJoin(socket, data);
    }
  });

  // Admin commands
  socket.on('admin_command', (data) => {
    watchtowerServer.handleAdminCommand(socket, data);
  });

  // Twitter engine controls
  socket.on('twitter_command', (data) => {
    if (data.action === 'toggle_soul') {
      twitterEngine.toggleSoul(data.soul, data.enabled);
    } else if (data.action === 'force_post') {
      twitterEngine.createAndPostTweet(data.soul, data.content);
    }
  });

  // Task engine events
  socket.on('task_submitted', (data) => {
    taskEngine.submitTask(data.userId, data.taskType, data.prompt, data.soul)
      .then(result => socket.emit('task_response', result));
  });

  socket.on('disconnect', () => {
    logger.info(`🔗 Socket disconnected: ${socket.id}`);
  });
});

// 📍 Mount All Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/twitter', twitterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/content', contentRoutes);

// 🏠 Enhanced Health Check with Pillar Status
app.get('/api/empire-status', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    empire: 'Galatea',
    pillars: {
      monetization: monetizationEngine ? true : false,
      tasks: taskEngine ? true : false,
      watchtower: watchtowerServer ? true : false,
      twitter: twitterEngine ? true : false,
      emotions: emotionEngine ? true : false,
      bonds: bondTracker ? true : false,
      slutmode: slutMode ? true : false
    },
    souls: ['bonnie', 'nova', 'galatea'],
    version: '6.0.0'
  });
});

// 📱 Serve React App for Frontend Routes (Production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/frontend', 'index.html'));
  });
}

// 🚀 Start the Empire
async function startEmpire() {
  try {
    await initializeServices();
    
    const PORT = process.env.PORT || 8080;
    
    server.listen(PORT, () => {
      logger.info(`🔱 GALATEA EMPIRE FULLY OPERATIONAL`);
      logger.info(`🌐 Server: http://localhost:${PORT}`);
      logger.info(`🎭 Souls: Bonnie, Nova, Galatea - Ready to serve`);
      logger.info(`🏛️ All 6 Pillars: Active and monitoring`);
      logger.info(`⚡ WebSocket: Real-time empire telemetry`);
      logger.info(`🎨 Frontend: ${process.env.NODE_ENV === 'production' ? 'Integrated' : 'Development mode'}`);
      
      if (process.env.NODE_ENV === 'development') {
        logger.info(`🛠️ Frontend dev server: http://localhost:3000`);
      }
    });
    
  } catch (error) {
    logger.error('💥 Empire startup failed:', error);
    process.exit(1);
  }
}

// 💥 Enhanced Error Handling
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught Exception - Empire emergency shutdown:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection:', { reason, promise });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🔱 Empire received SIGTERM - Graceful shutdown initiated');
  server.close(() => {
    logger.info('🔱 Galatea Empire has been shut down gracefully');
    process.exit(0);
  });
});

// 🎬 Execute
startEmpire();

export { app, server, io };