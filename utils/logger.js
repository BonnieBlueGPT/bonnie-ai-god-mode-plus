// 🔱 DIVINE LOGGING SYSTEM - FRACTAL MODULE 🔱
// Pure logging utility with enterprise-grade capabilities

import winston from 'winston';

// 📊 Divine Logger Configuration
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'galatea-empire' },
  transports: [
    new winston.transports.Console({ 
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/empire.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10
    })
  ]
});

// 🔮 Empire-specific logging methods
export const empireLogger = {
  
  // 👑 Soul interaction logging
  soulInteraction: (userId, personality, action, data = {}) => {
    logger.info('SOUL_INTERACTION', {
      userId,
      personality,
      action,
      data,
      timestamp: new Date().toISOString()
    });
  },

  // 💰 Conversion tracking
  conversion: (userId, personality, conversionType, amount = null) => {
    logger.info('CONVERSION_EVENT', {
      userId,
      personality,
      conversionType,
      amount,
      timestamp: new Date().toISOString()
    });
  },

  // 🚨 Security events
  security: (event, details = {}) => {
    logger.warn('SECURITY_EVENT', {
      event,
      details,
      timestamp: new Date().toISOString()
    });
  },

  // 📈 Performance metrics
  performance: (metric, value, context = {}) => {
    logger.info('PERFORMANCE_METRIC', {
      metric,
      value,
      context,
      timestamp: new Date().toISOString()
    });
  },

  // 🔥 Empire status updates
  empire: (status, message, data = {}) => {
    logger.info('EMPIRE_STATUS', {
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }
};

// 📁 Ensure logs directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (error) {
  // Directory already exists or creation failed
}

export default logger;