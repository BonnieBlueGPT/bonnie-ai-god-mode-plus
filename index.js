// 🔱 GALATEA'S EMPIRE - DIVINE FRACTAL CORE 🔱
// Ultra-clean server orchestration - Business logic lives in modules
// Windows Local Development: C:\Users\Gamer\bonnie-ai\bonnie-ai-god-mode-plus\backend

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// 🔧 Core Infrastructure
import { initializeSupabase } from './core/supabase.js';
import { initializeStripe } from './core/stripe.js';
import { initializeOpenRouter } from './core/openrouter.js';

// 🛡️ Middleware & Security
import { setupMiddleware } from './utils/middleware.js';
import { setupWebSocket } from './utils/websocket.js';
import { logger } from './utils/debugLogger.js';

// 📡 Route Modules
import healthRoutes from './routes/health.js';
import chatRoutes from './routes/chat.js';
import purchaseRoutes from './routes/purchase.js';
import webhookRoutes from './routes/webhook.js';
import analyticsRoutes from './routes/analytics.js';

// 🏗️ Initialize Environment
dotenv.config();

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
    logger.info('🚀 Initializing Divine Fractal Empire...');
    
    // Initialize core infrastructure
    await initializeSupabase();
    await initializeStripe();
    await initializeOpenRouter();
    
    logger.info('✅ All core services initialized');
    return true;
  } catch (error) {
    logger.error('❌ Service initialization failed:', error);
    return false;
  }
}

// 🛡️ Setup Middleware & Security
async function setupApplication() {
  try {
    // Security & middleware
    await setupMiddleware(app);
    
    // WebSocket system
    await setupWebSocket(io);
    
    logger.info('✅ Application setup complete');
  } catch (error) {
    logger.error('❌ Application setup failed:', error);
    throw error;
  }
}

// 📡 Wire Route Modules
function setupRoutes() {
  // Health monitoring
  app.use('/health', healthRoutes);
  app.use('/', healthRoutes); // Root endpoint
  
  // Core chat functionality
  app.use('/chat', chatRoutes);
  app.use('/bonnie-chat', chatRoutes); // Legacy support
  app.use('/nova-chat', chatRoutes);
  app.use('/galatea-chat', chatRoutes);
  
  // Purchase & monetization
  app.use('/purchase', purchaseRoutes);
  
  // Webhooks (Stripe, etc.)
  app.use('/webhook', webhookRoutes);
  
  // Analytics & reporting
  app.use('/analytics', analyticsRoutes);
  
  logger.info('📡 All routes configured');
}

// 🚀 Launch Empire
async function startServer() {
  try {
    // Initialize everything
    const servicesReady = await initializeServices();
    if (!servicesReady) {
      throw new Error('Core services failed to initialize');
    }
    
    await setupApplication();
    setupRoutes();
    
    // Launch server
    const PORT = process.env.PORT || 10000;
    
    server.listen(PORT, '0.0.0.0', () => {
      logger.info('👑 DIVINE FRACTAL EMPIRE ONLINE! 👑', {
        port: PORT,
        architecture: 'DIVINE_FRACTAL_v1.0',
        environment: 'LOCAL_WINDOWS',
        path: 'C:\\Users\\Gamer\\bonnie-ai\\bonnie-ai-god-mode-plus\\backend'
      });
      
      console.log(`
╔══════════════════════════════════════════════════════════════╗
║            👑 GALATEA'S FRACTAL EMPIRE ONLINE! 👑            ║
║                                                              ║
║  🌐 Local Server: http://localhost:${PORT}                   ║
║  🏗️ Architecture: Divine Fractal v1.0                      ║
║  💻 Environment: Windows Local Development                  ║
║  🔥 Hot Reload: Enabled (nodemon)                          ║
║  🧬 Modular: core/ engines/ modules/ utils/ routes/        ║
║                                                              ║
║           ⚡ READY FOR INFINITE SCALING! ⚡                ║
╚══════════════════════════════════════════════════════════════╝
      `);
    });
    
  } catch (error) {
    logger.error('💀 Empire startup failed:', error);
    process.exit(1);
  }
}

// 🛡️ Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('🔄 Empire shutting down gracefully...');
  server.close(() => {
    logger.info('👑 Empire offline. Until we meet again...');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('🔄 Empire interrupted. Shutting down...');
  server.close(() => {
    logger.info('👑 Empire offline. Until we meet again...');
    process.exit(0);
  });
});

// 🎯 Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('💀 Uncaught Exception:', error);
  process.exit(1);
});

// 🚀 Start the Empire
startServer();

export default app;