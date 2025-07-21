// 🔱 DIVINE SECURITY ENGINE - FRACTAL MODULE 🔱
// Pure authentication and security management system

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { logger } from './logger.js';

// 🔐 JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'galatea-empire-secret-key-divine-fractal';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// 🎫 Token Generation
export function generateToken(userId, metadata = {}) {
  try {
    const payload = {
      userId,
      timestamp: Date.now(),
      empire: 'galatea-fractal',
      ...metadata
    };
    
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'galatea-empire',
      audience: 'empire-users'
    });
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw new Error('Unable to generate authentication token');
  }
}

// 🔍 Token Verification
export function verifyToken(token) {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'galatea-empire',
      audience: 'empire-users'
    });
    
    // Check if token is expired (additional check)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.info('Token expired:', { error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token:', { error: error.message });
    } else {
      logger.error('Token verification failed:', error);
    }
    return null;
  }
}

// 🔄 Token Refresh
export function refreshToken(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true });
    
    // Check if token is not too old (max 7 days past expiration)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - (decoded.exp * 1000) > maxAge) {
      return null;
    }
    
    // Generate new token with same user data
    return generateToken(decoded.userId, {
      personality: decoded.personality,
      refreshed: true
    });
  } catch (error) {
    logger.error('Token refresh failed:', error);
    return null;
  }
}

// 🔒 Password Hashing
export async function hashPassword(password) {
  try {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
  } catch (error) {
    logger.error('Password hashing failed:', error);
    throw new Error('Unable to secure password');
  }
}

// ✅ Password Verification
export async function verifyPassword(password, hashedPassword) {
  try {
    if (!password || !hashedPassword) return false;
    
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Password verification failed:', error);
    return false;
  }
}

// 🛡️ Input Sanitization
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

// 📧 Email Validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 🔢 User ID Validation
export function validateUserId(userId) {
  if (!userId || typeof userId !== 'string') return false;
  
  // Allow alphanumeric, hyphens, and underscores, 3-50 characters
  const userIdRegex = /^[a-zA-Z0-9_-]{3,50}$/;
  return userIdRegex.test(userId);
}

// 🎭 Personality Validation
export function validatePersonality(personality) {
  const validPersonalities = ['bonnie', 'nova', 'galatea'];
  return validPersonalities.includes(personality);
}

// 🔐 Authentication Middleware
export function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.body.token || 
                  req.query.token;
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid token to access this empire'
      });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        message: 'Your access to the empire has expired'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user.userId;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication system error',
      message: 'Unable to verify your identity'
    });
  }
}

// 🔒 Optional Authentication Middleware
export function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.body.token || 
                  req.query.token;
    
    if (token) {
      const user = verifyToken(token);
      if (user) {
        req.user = user;
        req.userId = user.userId;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth, just log
    logger.warn('Optional auth error:', error);
    next();
  }
}

// 🚨 Rate Limiting Helper
export function createSecurityHeaders(req, res, next) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server signature
  res.removeHeader('X-Powered-By');
  
  next();
}

// 🔍 IP Address Extraction
export function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip ||
         'unknown';
}

// 🛡️ Request Validation
export function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, { 
        abortEarly: false,
        stripUnknown: true 
      });
      
      if (error) {
        return res.status(400).json({
          error: 'Invalid request data',
          details: error.details.map(detail => detail.message),
          message: 'Please check your input and try again'
        });
      }
      
      req.body = value;
      next();
    } catch (error) {
      logger.error('Request validation error:', error);
      res.status(500).json({
        error: 'Validation system error',
        message: 'Unable to process your request'
      });
    }
  };
}

// 🔐 Session Management
const activeSessions = new Map();

export function createSession(userId, metadata = {}) {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    userId,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    metadata
  };
  
  activeSessions.set(sessionId, session);
  
  // Cleanup old sessions periodically
  if (activeSessions.size % 100 === 0) {
    cleanupExpiredSessions();
  }
  
  return sessionId;
}

export function getSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.lastActivity = Date.now();
    return session;
  }
  return null;
}

export function destroySession(sessionId) {
  return activeSessions.delete(sessionId);
}

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function cleanupExpiredSessions() {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  const now = Date.now();
  
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastActivity > maxAge) {
      activeSessions.delete(sessionId);
    }
  }
}

// 📊 Security Statistics
export function getSecurityStats() {
  return {
    activeSessions: activeSessions.size,
    sessionsByAge: getSessionsByAge(),
    recentActivity: getRecentActivity()
  };
}

function getSessionsByAge() {
  const now = Date.now();
  const sessions = Array.from(activeSessions.values());
  
  return {
    last5min: sessions.filter(s => now - s.lastActivity < 5 * 60 * 1000).length,
    last1hour: sessions.filter(s => now - s.lastActivity < 60 * 60 * 1000).length,
    last24hours: sessions.filter(s => now - s.lastActivity < 24 * 60 * 60 * 1000).length
  };
}

function getRecentActivity() {
  const sessions = Array.from(activeSessions.values());
  return sessions
    .sort((a, b) => b.lastActivity - a.lastActivity)
    .slice(0, 10)
    .map(s => ({
      userId: s.userId,
      lastActivity: new Date(s.lastActivity).toISOString(),
      duration: Date.now() - s.createdAt
    }));
}

export default {
  generateToken,
  verifyToken,
  refreshToken,
  hashPassword,
  verifyPassword,
  sanitizeInput,
  validateEmail,
  validateUserId,
  validatePersonality,
  requireAuth,
  optionalAuth,
  createSecurityHeaders,
  getClientIP,
  validateRequest,
  createSession,
  getSession,
  destroySession,
  getSecurityStats
};