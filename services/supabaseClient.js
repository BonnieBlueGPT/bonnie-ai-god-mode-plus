// 🔱 DIVINE SUPABASE CLIENT - FRACTAL MODULE 🔱
// Pure database service wrapper with connection management

import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

// 🗄️ Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'placeholder-key';

// 🌟 Create Supabase client with optimal configuration
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false // Server-side, no need to persist
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'galatea-empire-fractal'
    }
  }
});

// 🔧 Database Service Class
export class SupabaseService {
  constructor() {
    this.client = supabaseClient;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
  }

  // 🔌 Test database connection
  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .select('count')
        .limit(1);

      if (error) {
        logger.error('Supabase connection test failed:', error);
        this.isConnected = false;
        return false;
      }

      this.isConnected = true;
      logger.info('Supabase connection successful');
      return true;
    } catch (error) {
      logger.error('Supabase connection error:', error);
      this.isConnected = false;
      return false;
    }
  }

  // 👤 User Profile Operations
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('getUserProfile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('getUserProfile failed:', error);
      return null;
    }
  }

  async createUserProfile(profileData) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        logger.error('createUserProfile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('createUserProfile failed:', error);
      return null;
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('updateUserProfile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('updateUserProfile failed:', error);
      return null;
    }
  }

  async upsertUserProfile(profileData) {
    try {
      const { data, error } = await this.client
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        logger.error('upsertUserProfile error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('upsertUserProfile failed:', error);
      return null;
    }
  }

  // 📝 Activity Tracking Operations
  async logActivity(activityData) {
    try {
      const { data, error } = await this.client
        .from('user_activities')
        .insert(activityData);

      if (error) {
        logger.error('logActivity error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('logActivity failed:', error);
      return false;
    }
  }

  async batchLogActivities(activities) {
    try {
      const { data, error } = await this.client
        .from('user_activities')
        .insert(activities);

      if (error) {
        logger.error('batchLogActivities error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('batchLogActivities failed:', error);
      return false;
    }
  }

  async getUserActivities(userId, limit = 50, activityType = null) {
    try {
      let query = this.client
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (activityType) {
        query = query.eq('activity_type', activityType);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('getUserActivities error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('getUserActivities failed:', error);
      return [];
    }
  }

  // 💰 Purchase & Payment Operations
  async logPurchase(purchaseData) {
    try {
      const { data, error } = await this.client
        .from('purchases')
        .insert(purchaseData);

      if (error) {
        logger.error('logPurchase error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('logPurchase failed:', error);
      return false;
    }
  }

  async getUserPurchases(userId) {
    try {
      const { data, error } = await this.client
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('getUserPurchases error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('getUserPurchases failed:', error);
      return [];
    }
  }

  // 📊 Analytics & Reporting
  async getAnalytics(timeRange = '24h') {
    try {
      let timeFilter;
      const now = new Date();
      
      switch (timeRange) {
        case '1h':
          timeFilter = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data: activities, error } = await this.client
        .from('user_activities')
        .select('*')
        .gte('timestamp', timeFilter.toISOString());

      if (error) {
        logger.error('getAnalytics error:', error);
        return null;
      }

      // Process analytics data
      const analytics = this.processAnalyticsData(activities);
      return analytics;
    } catch (error) {
      logger.error('getAnalytics failed:', error);
      return null;
    }
  }

  processAnalyticsData(activities) {
    const stats = {
      totalUsers: new Set(activities.map(a => a.user_id)).size,
      totalMessages: activities.filter(a => a.activity_type === 'message').length,
      totalPurchases: activities.filter(a => a.activity_type === 'purchase').length,
      personalityBreakdown: {},
      emotionBreakdown: {},
      hourlyDistribution: {}
    };

    // Process personality breakdown
    activities.forEach(activity => {
      if (activity.personality) {
        stats.personalityBreakdown[activity.personality] = 
          (stats.personalityBreakdown[activity.personality] || 0) + 1;
      }

      // Process emotion breakdown
      if (activity.activity_data?.emotion) {
        stats.emotionBreakdown[activity.activity_data.emotion] = 
          (stats.emotionBreakdown[activity.activity_data.emotion] || 0) + 1;
      }

      // Process hourly distribution
      const hour = new Date(activity.timestamp).getHours();
      stats.hourlyDistribution[hour] = (stats.hourlyDistribution[hour] || 0) + 1;
    });

    return stats;
  }

  // 🔍 Search & Query Operations
  async searchUsers(criteria) {
    try {
      let query = this.client
        .from('user_profiles')
        .select('*');

      // Apply search criteria
      if (criteria.spendingTier) {
        query = query.eq('spending_tier', criteria.spendingTier);
      }
      if (criteria.minBondScore) {
        query = query.gte('bond_score', criteria.minBondScore);
      }
      if (criteria.personality) {
        query = query.eq('favorite_personality', criteria.personality);
      }
      if (criteria.limit) {
        query = query.limit(criteria.limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('searchUsers error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('searchUsers failed:', error);
      return [];
    }
  }

  // 🧹 Cleanup & Maintenance
  async cleanupOldActivities(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await this.client
        .from('user_activities')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        logger.error('cleanupOldActivities error:', error);
        return false;
      }

      logger.info(`Cleaned up activities older than ${daysOld} days`);
      return true;
    } catch (error) {
      logger.error('cleanupOldActivities failed:', error);
      return false;
    }
  }

  // 📊 Connection Status & Health
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectionAttempts: this.connectionAttempts,
      supabaseUrl: SUPABASE_URL.split('@')[1] || 'unknown', // Hide sensitive parts
      lastCheck: new Date().toISOString()
    };
  }

  // 🔄 Retry mechanism for failed operations
  async withRetry(operation, maxRetries = this.maxRetries) {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        attempts++;
        logger.warn(`Operation failed, attempt ${attempts}/${maxRetries}:`, error);
        
        if (attempts >= maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  }
}

// 🌟 Create singleton service instance
export const supabaseService = new SupabaseService();

// 🔧 Initialize connection on startup
export async function initializeSupabase() {
  try {
    const isConnected = await supabaseService.testConnection();
    if (isConnected) {
      logger.info('🗄️ Supabase service initialized successfully');
    } else {
      logger.warn('⚠️ Supabase connection failed, operating in offline mode');
    }
    return isConnected;
  } catch (error) {
    logger.error('Supabase initialization failed:', error);
    return false;
  }
}

export default supabaseClient;