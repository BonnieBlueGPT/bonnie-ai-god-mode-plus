// 🔱 CORE/SUPABASE.JS - DATABASE INFRASTRUCTURE 🔱
// Pure Supabase client & database operations
// Isolated from business logic - only handles data persistence
// Path: C:\Users\Gamer\bonnie-ai\bonnie-ai-god-mode-plus\backend\core\supabase.js

import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/debugLogger.js';

// 🗄️ Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'placeholder-key';

// 🌟 Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false // Server-side, no session persistence needed
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'galatea-empire-fractal-v1'
    }
  }
});

// 🔧 Connection Management
let isConnected = false;
let connectionAttempts = 0;

// 🔌 Test Database Connection
export async function testConnection() {
  try {
    connectionAttempts++;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      logger.error('Supabase connection failed:', error);
      isConnected = false;
      return false;
    }

    isConnected = true;
    logger.info('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection error:', error);
    isConnected = false;
    return false;
  }
}

// 🔧 Initialize Supabase Service
export async function initializeSupabase() {
  logger.info('🔌 Initializing Supabase connection...');
  
  const connected = await testConnection();
  
  if (connected) {
    logger.info('🗄️ Supabase service ready');
  } else {
    logger.warn('⚠️ Supabase connection failed - operating in offline mode');
  }
  
  return connected;
}

// 👤 USER PROFILE OPERATIONS
export const userProfileDB = {
  
  // Get user profile by ID
  async get(userId) {
    try {
      const { data, error } = await supabase
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
      logger.error('Profile fetch failed:', error);
      return null;
    }
  },

  // Create or update user profile
  async upsert(profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        logger.error('Profile upsert error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Profile upsert failed:', error);
      return null;
    }
  },

  // Update specific fields
  async update(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Profile update error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Profile update failed:', error);
      return null;
    }
  },

  // Delete user profile
  async delete(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) {
        logger.error('Profile delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Profile delete failed:', error);
      return false;
    }
  }
};

// 📝 ACTIVITY LOGGING OPERATIONS
export const activityDB = {
  
  // Log single activity
  async log(activityData) {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          ...activityData,
          timestamp: new Date().toISOString()
        });

      if (error) {
        logger.error('Activity log error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Activity logging failed:', error);
      return false;
    }
  },

  // Batch log multiple activities
  async batchLog(activities) {
    try {
      const timestampedActivities = activities.map(activity => ({
        ...activity,
        timestamp: activity.timestamp || new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_activities')
        .insert(timestampedActivities);

      if (error) {
        logger.error('Batch activity log error:', error);
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Batch activity logging failed:', error);
      return false;
    }
  },

  // Get user activity history
  async getHistory(userId, limit = 50, activityType = null) {
    try {
      let query = supabase
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
        logger.error('Activity history error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Activity history fetch failed:', error);
      return [];
    }
  }
};

// 💰 PURCHASE OPERATIONS
export const purchaseDB = {
  
  // Log purchase
  async log(purchaseData) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          ...purchaseData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error('Purchase log error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Purchase logging failed:', error);
      return null;
    }
  },

  // Get user purchases
  async getUserPurchases(userId) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('User purchases error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('User purchases fetch failed:', error);
      return [];
    }
  },

  // Update purchase status
  async updateStatus(purchaseId, status, metadata = {}) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .update({ 
          status, 
          metadata: { ...metadata },
          updated_at: new Date().toISOString() 
        })
        .eq('id', purchaseId)
        .select()
        .single();

      if (error) {
        logger.error('Purchase status update error:', error);
        return null;
      }

      return data;
    } catch (error) {
      logger.error('Purchase status update failed:', error);
      return null;
    }
  }
};

// 📊 ANALYTICS OPERATIONS
export const analyticsDB = {
  
  // Get analytics data for time range
  async getMetrics(timeRange = '24h') {
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
        case '30d':
          timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .gte('timestamp', timeFilter.toISOString());

      if (error) {
        logger.error('Analytics fetch error:', error);
        return null;
      }

      return activities || [];
    } catch (error) {
      logger.error('Analytics fetch failed:', error);
      return null;
    }
  },

  // Get user count
  async getUserCount() {
    try {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        logger.error('User count error:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('User count failed:', error);
      return 0;
    }
  }
};

// 🔍 SEARCH OPERATIONS
export const searchDB = {
  
  // Search users by criteria
  async users(criteria = {}, limit = 20) {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*')
        .limit(limit);

      // Apply filters
      if (criteria.spendingTier) {
        query = query.eq('spending_tier', criteria.spendingTier);
      }
      if (criteria.minBondScore) {
        query = query.gte('bond_score', criteria.minBondScore);
      }
      if (criteria.personality) {
        query = query.eq('favorite_personality', criteria.personality);
      }
      if (criteria.lifecycleStage) {
        query = query.eq('lifecycle_stage', criteria.lifecycleStage);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('User search error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('User search failed:', error);
      return [];
    }
  }
};

// 🧹 MAINTENANCE OPERATIONS
export const maintenanceDB = {
  
  // Clean old activities
  async cleanOldActivities(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error } = await supabase
        .from('user_activities')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (error) {
        logger.error('Cleanup error:', error);
        return false;
      }

      logger.info(`🧹 Cleaned activities older than ${daysOld} days`);
      return true;
    } catch (error) {
      logger.error('Cleanup failed:', error);
      return false;
    }
  }
};

// 📊 CONNECTION STATUS
export function getConnectionStatus() {
  return {
    isConnected,
    connectionAttempts,
    supabaseUrl: SUPABASE_URL.includes('supabase.co') ? 'supabase.co' : 'custom',
    lastCheck: new Date().toISOString()
  };
}

// 🔄 Raw client access for advanced operations
export { supabase as rawClient };

export default {
  supabase,
  initializeSupabase,
  testConnection,
  userProfileDB,
  activityDB,
  purchaseDB,
  analyticsDB,
  searchDB,
  maintenanceDB,
  getConnectionStatus
};