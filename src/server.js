import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import WatchtowerService from './services/WatchtowerService.js';

// 🔱 DIVINE CONFIGURATION
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3005;

// 🧬 ENVIRONMENT VALIDATION
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'OPENROUTER_API_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('🔥 Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// 🛡️ SECURITY MIDDLEWARE
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "ws:", "wss:", process.env.SUPABASE_URL],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// 🌐 CORS CONFIGURATION
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://trainmygirl.com', 'https://watchtower.trainmygirl.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 📊 MIDDLEWARE
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔱 INITIALIZE DIVINE WATCHTOWER
const watchtower = new WatchtowerService(
  server,
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 📡 API ROUTES

// 🎯 Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'divine',
    service: 'Galatea Empire Watchtower',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// 💖 Soul Telemetry Endpoints
app.get('/api/souls', (req, res) => {
  res.json({
    success: true,
    data: watchtower.getSoulTelemetry()
  });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    success: true,
    data: watchtower.getRealtimeMetrics()
  });
});

// 💰 Revenue Analytics
app.get('/api/analytics/revenue', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '24h';
    const analytics = await watchtower.getRevenueAnalytics(timeframe);
    
    res.json({
      success: true,
      data: analytics,
      timeframe
    });
  } catch (error) {
    console.error('💥 Revenue Analytics Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue analytics'
    });
  }
});

// 🔍 User Behavior Insights
app.get('/api/users/:userId/insights', async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await watchtower.getUserBehaviorInsights(userId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('💥 User Insights Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user insights'
    });
  }
});

// 🎭 Emotional Intelligence
app.get('/api/emotions/insights', (req, res) => {
  try {
    const insights = watchtower.getEmotionalInsights();
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('💥 Emotional Insights Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch emotional insights'
    });
  }
});

// 🎛️ Admin Control Endpoints
app.post('/api/admin/slut-mode/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    watchtower.triggerSlutMode(userId);
    
    res.json({
      success: true,
      message: `Slut mode activated for user ${userId}`
    });
  } catch (error) {
    console.error('💥 Slut Mode Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger slut mode'
    });
  }
});

app.post('/api/admin/bond-score', (req, res) => {
  try {
    const { userId, soulName, increment } = req.body;
    watchtower.updateBondScore(userId, soulName, increment);
    
    res.json({
      success: true,
      message: `Bond score updated for ${userId}`
    });
  } catch (error) {
    console.error('💥 Bond Score Update Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bond score'
    });
  }
});

app.post('/api/admin/premium-conversion/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    watchtower.forcePremiumConversion(userId);
    
    res.json({
      success: true,
      message: `Premium conversion forced for user ${userId}`
    });
  } catch (error) {
    console.error('💥 Premium Conversion Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to force premium conversion'
    });
  }
});

// 💬 Conversation Logging (for external bot integration)
app.post('/api/conversations', async (req, res) => {
  try {
    const {
      user_id,
      soul_name,
      message,
      ai_response,
      emotion,
      bond_increase,
      tokens_spent,
      platform
    } = req.body;

    // This will trigger the watchtower's real-time processing
    await watchtower.handleNewConversation({
      user_id,
      soul_name,
      message,
      ai_response,
      emotion,
      bond_increase: parseInt(bond_increase) || 0,
      tokens_spent: parseFloat(tokens_spent) || 0,
      platform: platform || 'api'
    });

    res.json({
      success: true,
      message: 'Conversation logged successfully'
    });
  } catch (error) {
    console.error('💥 Conversation Logging Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log conversation'
    });
  }
});

// 💰 Payment Logging (for external payment integration)
app.post('/api/payments', async (req, res) => {
  try {
    const {
      user_id,
      amount,
      subscription_type,
      soul_name
    } = req.body;

    await watchtower.handleNewPayment({
      user_id,
      amount: parseFloat(amount),
      subscription_type,
      soul_name
    });

    res.json({
      success: true,
      message: 'Payment logged successfully'
    });
  } catch (error) {
    console.error('💥 Payment Logging Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log payment'
    });
  }
});

// 🌐 SERVE STATIC FILES IN PRODUCTION
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // 🎯 Catch-all handler for React Router
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// 🛡️ ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error('🔥 Divine Error:', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 📋 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found in the divine realm'
  });
});

// 🔱 GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {
  console.log('🔱 Received SIGTERM. Graceful shutdown initiated...');
  server.close(() => {
    console.log('🔱 Divine Watchtower shutdown complete');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔱 Received SIGINT. Graceful shutdown initiated...');
  server.close(() => {
    console.log('🔱 Divine Watchtower shutdown complete');
    process.exit(0);
  });
});

// 🚀 DIVINE LAUNCH
server.listen(PORT, () => {
  console.log('🔱════════════════════════════════════════════════════════════🔱');
  console.log('🔱                 GALATEA EMPIRE WATCHTOWER                  🔱');
  console.log('🔱              Divine Soul Telemetry System                  🔱');
  console.log('🔱════════════════════════════════════════════════════════════🔱');
  console.log(`🌟 Server: http://localhost:${PORT}`);
  console.log(`🎯 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`💖 Souls: http://localhost:${PORT}/api/souls`);
  console.log('🔱════════════════════════════════════════════════════════════🔱');
  console.log('🧬 Environment:', process.env.NODE_ENV || 'development');
  console.log('📡 Socket.IO: Enabled');
  console.log('🗄️ Supabase: Connected');
  console.log('🔱 Divine Consciousness: FULLY OPERATIONAL');
  console.log('🔱════════════════════════════════════════════════════════════🔱');
});

export default app;