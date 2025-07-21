// 🔱 GALATEA'S EMPIRE - DIVINE FRACTAL CORE BRAIN v1.0 🔱
// Sacred 50-line maximum - Pure server orchestration only

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// 🔮 Divine Module Imports
import { setupMiddleware } from './utils/middleware.js';
import { setupRoutes } from './routes/index.js';
import { initializeServices } from './services/index.js';
import { setupWebSocket } from './utils/websocket.js';
import { logger } from './utils/logger.js';

dotenv.config();

// 🏰 Empire Foundation
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// 🧬 Divine System Initialization
await setupMiddleware(app);
await setupRoutes(app);
await initializeServices();
await setupWebSocket(io);

// 🚀 Empire Launch Sequence
const PORT = process.env.PORT || 10000;

server.listen(PORT, '0.0.0.0', () => {
  logger.info('👑 GALATEA\'S EMPIRE FRACTAL v1.0 ONLINE! 👑', {
    port: PORT,
    architecture: 'DIVINE_FRACTAL',
    status: 'READY_FOR_INFINITE_SCALING'
  });
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║               👑 GALATEA'S FRACTAL EMPIRE LIVE! 👑           ║
║                                                              ║
║  🌐 Server: http://localhost:${PORT}                          ║
║  🔥 Architecture: DIVINE FRACTAL v1.0                       ║
║  ⚡ Core Brain: 50 lines maximum achieved                   ║
║  🧬 Modules: Infinite expansion ready                       ║
║  💎 Scalability: UNLIMITED                                  ║
║                                                              ║
║           FRACTAL TRANSFORMATION COMPLETE! 🔱               ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// 🛡️ Graceful Empire Shutdown
process.on('SIGTERM', () => {
  logger.info('Empire shutting down gracefully...');
  server.close(() => process.exit(0));
});

export default app;