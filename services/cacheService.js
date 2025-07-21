// 🔱 DIVINE CACHE SERVICE - FRACTAL MODULE 🔱
// Pure in-memory caching system with TTL and optimization

import NodeCache from 'node-cache';
import { logger } from '../utils/logger.js';

// 💾 Cache Configuration
const CACHE_CONFIG = {
  stdTTL: 600, // 10 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Better performance, but be careful with object mutations
  maxKeys: 50000, // Maximum number of keys
  deleteOnExpire: true
};

// 🌟 Cache Service Class
export class CacheService {
  constructor(config = CACHE_CONFIG) {
    this.cache = new NodeCache(config);
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      flushes: 0
    };
    
    // Set up event listeners
    this.setupEventListeners();
    
    logger.info('Cache service initialized', { 
      ttl: config.stdTTL, 
      maxKeys: config.maxKeys 
    });
  }

  // 📥 Get value from cache
  get(key) {
    try {
      const value = this.cache.get(key);
      
      if (value !== undefined) {
        this.stats.hits++;
        return value;
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      logger.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  // 📤 Set value in cache
  set(key, value, ttl = null) {
    try {
      let success;
      
      if (ttl !== null) {
        success = this.cache.set(key, value, ttl);
      } else {
        success = this.cache.set(key, value);
      }
      
      if (success) {
        this.stats.sets++;
        return true;
      } else {
        logger.warn('Cache set failed:', { key, reason: 'unknown' });
        return false;
      }
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  // 🗑️ Delete key from cache
  del(key) {
    try {
      const deletedCount = this.cache.del(key);
      
      if (deletedCount > 0) {
        this.stats.deletes++;
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  // 🧹 Flush all cache
  flushAll() {
    try {
      this.cache.flushAll();
      this.stats.flushes++;
      logger.info('Cache flushed successfully');
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  // 🔍 Check if key exists
  has(key) {
    return this.cache.has(key);
  }

  // ⏰ Get TTL for key
  getTtl(key) {
    return this.cache.getTtl(key);
  }

  // 🔄 Update TTL for existing key
  ttl(key, ttl) {
    try {
      return this.cache.ttl(key, ttl);
    } catch (error) {
      logger.error('Cache TTL update error:', error);
      return false;
    }
  }

  // 📋 Get all keys
  keys() {
    return this.cache.keys();
  }

  // 🎯 Multiple get operation
  mget(keys) {
    try {
      const results = {};
      
      keys.forEach(key => {
        const value = this.get(key);
        if (value !== null) {
          results[key] = value;
        }
      });
      
      return results;
    } catch (error) {
      logger.error('Cache mget error:', error);
      return {};
    }
  }

  // 🎯 Multiple set operation
  mset(keyValuePairs, ttl = null) {
    try {
      let successCount = 0;
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        if (this.set(key, value, ttl)) {
          successCount++;
        }
      }
      
      return successCount;
    } catch (error) {
      logger.error('Cache mset error:', error);
      return 0;
    }
  }

  // 📊 Get cache statistics
  getStats() {
    const cacheStats = this.cache.getStats();
    
    return {
      ...this.stats,
      keys: cacheStats.keys,
      hits_ratio: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      memory_usage: cacheStats.ksize + cacheStats.vsize,
      key_count: cacheStats.keys,
      expired_keys: cacheStats.expired,
      check_period: this.cache.options.checkperiod
    };
  }

  // 🔧 Advanced cache operations

  // 📈 Increment numeric value
  increment(key, amount = 1) {
    const current = this.get(key) || 0;
    const newValue = current + amount;
    this.set(key, newValue);
    return newValue;
  }

  // 📉 Decrement numeric value
  decrement(key, amount = 1) {
    const current = this.get(key) || 0;
    const newValue = Math.max(0, current - amount);
    this.set(key, newValue);
    return newValue;
  }

  // 📝 Append to string value
  append(key, value) {
    const current = this.get(key) || '';
    const newValue = current + value;
    this.set(key, newValue);
    return newValue;
  }

  // 📋 Add to list (array)
  listPush(key, value, maxLength = null) {
    let list = this.get(key) || [];
    
    if (!Array.isArray(list)) {
      list = [list]; // Convert to array if not already
    }
    
    list.push(value);
    
    // Trim list if max length specified
    if (maxLength && list.length > maxLength) {
      list = list.slice(-maxLength);
    }
    
    this.set(key, list);
    return list.length;
  }

  // 📋 Get from list (array)
  listGet(key, index = null) {
    const list = this.get(key);
    
    if (!Array.isArray(list)) {
      return null;
    }
    
    if (index !== null) {
      return list[index] || null;
    }
    
    return list;
  }

  // 🏷️ Cache with tags for bulk operations
  setWithTags(key, value, tags = [], ttl = null) {
    // Store the main value
    this.set(key, value, ttl);
    
    // Store tag associations
    tags.forEach(tag => {
      const tagKey = `tag:${tag}`;
      let taggedKeys = this.get(tagKey) || [];
      
      if (!taggedKeys.includes(key)) {
        taggedKeys.push(key);
        this.set(tagKey, taggedKeys);
      }
    });
    
    return true;
  }

  // 🏷️ Delete by tag
  deleteByTag(tag) {
    const tagKey = `tag:${tag}`;
    const taggedKeys = this.get(tagKey) || [];
    
    let deletedCount = 0;
    taggedKeys.forEach(key => {
      if (this.del(key)) {
        deletedCount++;
      }
    });
    
    // Remove the tag itself
    this.del(tagKey);
    
    return deletedCount;
  }

  // 🎯 Cache warming
  warm(keyValuePairs, ttl = null) {
    logger.info('Starting cache warming', { keys: Object.keys(keyValuePairs).length });
    
    const results = this.mset(keyValuePairs, ttl);
    
    logger.info('Cache warming completed', { 
      successful: results, 
      total: Object.keys(keyValuePairs).length 
    });
    
    return results;
  }

  // 🧹 Cleanup expired keys manually
  cleanup() {
    try {
      const beforeKeys = this.cache.getStats().keys;
      
      // Force check for expired keys
      this.cache.keys().forEach(key => {
        this.cache.get(key); // This will remove expired keys
      });
      
      const afterKeys = this.cache.getStats().keys;
      const cleaned = beforeKeys - afterKeys;
      
      if (cleaned > 0) {
        logger.info(`Cache cleanup: removed ${cleaned} expired keys`);
      }
      
      return cleaned;
    } catch (error) {
      logger.error('Cache cleanup error:', error);
      return 0;
    }
  }

  // 🎯 Pattern-based operations
  getByPattern(pattern) {
    try {
      const regex = new RegExp(pattern);
      const matchingKeys = this.keys().filter(key => regex.test(key));
      
      return this.mget(matchingKeys);
    } catch (error) {
      logger.error('Cache pattern get error:', error);
      return {};
    }
  }

  deleteByPattern(pattern) {
    try {
      const regex = new RegExp(pattern);
      const matchingKeys = this.keys().filter(key => regex.test(key));
      
      let deletedCount = 0;
      matchingKeys.forEach(key => {
        if (this.del(key)) {
          deletedCount++;
        }
      });
      
      return deletedCount;
    } catch (error) {
      logger.error('Cache pattern delete error:', error);
      return 0;
    }
  }

  // 🔧 Event listeners setup
  setupEventListeners() {
    // Listen to cache events
    this.cache.on('set', (key, value) => {
      // Optional: Log cache sets for debugging
      // logger.debug('Cache set:', { key, size: JSON.stringify(value).length });
    });

    this.cache.on('del', (key, value) => {
      // Optional: Log cache deletions
      // logger.debug('Cache delete:', { key });
    });

    this.cache.on('expired', (key, value) => {
      logger.debug('Cache key expired:', { key });
    });

    this.cache.on('flush', () => {
      logger.info('Cache flushed');
    });
  }

  // 🔄 Reset statistics
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      flushes: 0
    };
    
    logger.info('Cache statistics reset');
  }

  // 🎛️ Configuration management
  updateConfig(newConfig) {
    // Note: Some config changes require cache restart
    Object.assign(this.cache.options, newConfig);
    logger.info('Cache configuration updated', newConfig);
  }

  // 💾 Export cache for backup (development only)
  export() {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Cache export attempted in production');
      return null;
    }
    
    const data = {};
    this.keys().forEach(key => {
      data[key] = this.get(key);
    });
    
    return data;
  }

  // 📥 Import cache from backup (development only)
  import(data, overwrite = false) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Cache import attempted in production');
      return false;
    }
    
    let importedCount = 0;
    
    for (const [key, value] of Object.entries(data)) {
      if (overwrite || !this.has(key)) {
        if (this.set(key, value)) {
          importedCount++;
        }
      }
    }
    
    logger.info(`Cache import completed: ${importedCount} keys imported`);
    return importedCount;
  }
}

// 🌟 Create singleton instance
export const cacheService = new CacheService();

// 🔧 Convenience methods for common cache patterns

// Profile caching helpers
export const profileCache = {
  get: (userId) => cacheService.get(`profile_${userId}`),
  set: (userId, profile, ttl = 300) => cacheService.set(`profile_${userId}`, profile, ttl),
  del: (userId) => cacheService.del(`profile_${userId}`),
  refresh: (userId, profile) => {
    cacheService.del(`profile_${userId}`);
    return cacheService.set(`profile_${userId}`, profile, 300);
  }
};

// Session caching helpers
export const sessionCache = {
  get: (sessionId) => cacheService.get(`session_${sessionId}`),
  set: (sessionId, data, ttl = 3600) => cacheService.set(`session_${sessionId}`, data, ttl),
  del: (sessionId) => cacheService.del(`session_${sessionId}`),
  extend: (sessionId, ttl = 3600) => cacheService.ttl(`session_${sessionId}`, ttl)
};

// Activity caching helpers
export const activityCache = {
  get: (userId) => cacheService.get(`activity_${userId}`),
  push: (userId, activity, maxItems = 20) => {
    return cacheService.listPush(`activity_${userId}`, activity, maxItems);
  },
  clear: (userId) => cacheService.del(`activity_${userId}`)
};

export default cacheService;