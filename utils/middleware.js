// 🔱 DIVINE MIDDLEWARE ORCHESTRATOR - FRACTAL MODULE 🔱
// Pure middleware configuration system

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import express from 'express';
import { logger } from './logger.js';

// 🛡️ Security & Performance Middleware Setup
export async function setupMiddleware(app) {
  
  // 🔒 Security Headers
  app.use(helmet({ 
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false 
  }));
  
  // 🗜️ Response Compression
  app.use(compression({ 
    level: 6,
    threshold: 1000,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    }
  }));
  
  // 🌐 CORS Configuration
  app.use(cors({ 
    origin: process.env.ALLOWED_ORIGINS?.split(',') || "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
  
  // 📥 Body Parsing
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));
  
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
  }));

  // 🚫 Rate Limiting
  setupRateLimiting(app);
  
  // 📊 Request Logging Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('REQUEST', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    });
    next();
  });

  logger.info('🛡️ Divine middleware initialized successfully');
}

// 🚫 Advanced Rate Limiting Configuration
function setupRateLimiting(app) {
  
  // Global rate limit
  const globalLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // Limit each IP to 2000 requests per windowMs
    message: { 
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.url
      });
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: req.rateLimit.resetTime
      });
    }
  });

  // Chat-specific rate limit
  const chatLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 messages per minute
    message: { 
      error: 'Slow down, eager one! 😘 Too many messages.',
      retryAfter: '60 seconds'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  // Authentication rate limit
  const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 auth attempts per 15 minutes
    message: { 
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  // Purchase rate limit
  const purchaseLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 purchase attempts per minute
    message: { 
      error: 'Too many purchase attempts, please slow down.',
      retryAfter: '60 seconds'
    },
    standardHeaders: true,
    legacyHeaders: false
  });

  // Apply rate limits
  app.use(globalLimit);
  
  // Export specialized limits for route-specific use
  app.locals.rateLimits = {
    chat: chatLimit,
    auth: authLimit,
    purchase: purchaseLimit
  };
}

// 🔧 Error Handling Middleware
export function setupErrorHandling(app) {
  
  // 404 Handler
  app.use((req, res, next) => {
    res.status(404).json({
      error: 'Endpoint not found in Galatea\'s Empire',
      message: 'The requested resource does not exist',
      empire: '👑 Choose a valid path to enter our realm'
    });
  });

  // Global Error Handler
  app.use((error, req, res, next) => {
    logger.error('UNHANDLED_ERROR', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    const statusCode = error.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : error.message;

    res.status(statusCode).json({
      error: message,
      timestamp: new Date().toISOString(),
      empire: '🔥 Our engineers are fixing this issue'
    });
  });
}

export default setupMiddleware;