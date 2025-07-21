// 🔱 DIVINE MEMORY ENGINE - FRACTAL MODULE 🔱
// Pure user memory and learning system with persistent storage

import { logger, empireLogger } from '../utils/logger.js';
import { supabaseClient } from '../services/supabaseClient.js';
import { cacheService } from '../services/cacheService.js';
import { v4 as uuidv4 } from 'uuid';

// 🧠 User Memory Management Engine
export class MemoryEngine {
  constructor() {
    this.memoryCache = new Map();
    this.activityQueue = [];
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    
    // Start background processes
    this.startMemoryMaintenance();
  }

  // 👤 Get comprehensive user profile
  async getUserProfile(userId) {
    try {
      if (!userId) {
        logger.warn('getUserProfile called with invalid userId');
        return this.createNewProfile('anonymous');
      }

      // Try cache first for performance
      const cacheKey = `profile_${userId}`;
      let profile = cacheService.get(cacheKey);
      if (profile) {
        return profile;
      }

      // Load from database
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Database error fetching profile:', error);
      }

      // Create new profile if doesn't exist
      profile = data || this.createNewProfile(userId);
      
      // Cache the profile
      cacheService.set(cacheKey, profile, 300); // 5 minutes
      
      return profile;
    } catch (error) {
      logger.error('getUserProfile error:', error);
      return this.createNewProfile(userId);
    }
  }

  // 🆕 Create new user profile with intelligent defaults
  createNewProfile(userId) {
    const now = new Date().toISOString();
    
    return {
      user_id: userId,
      
      // Relationship metrics
      bond_score: 0,
      trust_level: 0,
      intimacy_score: 0,
      loyalty_score: 0,
      
      // Interaction tracking
      total_messages: 0,
      session_count: 0,
      total_time_spent: 0,
      avg_session_length: 0,
      
      // Behavioral analysis
      slut_count: 0,
      praise_count: 0,
      romantic_count: 0,
      dominant_count: 0,
      submissive_count: 0,
      
      // Preferences & personality fit
      favorite_personality: 'bonnie',
      personality_preferences: {},
      communication_style: 'neutral',
      response_patterns: {},
      
      // Conversion tracking
      conversion_attempts: 0,
      successful_conversions: 0,
      total_spent: 0,
      spending_tier: 'free',
      last_upsell: null,
      upsell_resistance: 0,
      
      // Engagement patterns
      peak_activity_hours: [],
      preferred_topics: [],
      escalation_level: 'sweet',
      max_escalation_reached: 'sweet',
      
      // Emotional intelligence
      emotional_state: 'neutral',
      mood_history: [],
      trigger_words: [],
      positive_keywords: [],
      negative_keywords: [],
      
      // Lifecycle management
      lifecycle_stage: 'new', // new, engaged, converting, loyal, churned
      risk_score: 0, // churn prediction
      last_activity: now,
      last_seen: now,
      first_interaction: now,
      
      // Metadata
      created_at: now,
      updated_at: now,
      version: '2.0'
    };
  }

  // 🔄 Update user profile with intelligent merging
  async updateProfile(userId, updates) {
    try {
      const currentProfile = await this.getUserProfile(userId);
      
      // Intelligent update merging
      const updatedProfile = this.mergeProfileUpdates(currentProfile, updates);
      updatedProfile.updated_at = new Date().toISOString();
      
      // Update database
      const { error } = await supabaseClient
        .from('user_profiles')
        .upsert(updatedProfile, { onConflict: 'user_id' });

      if (error) {
        logger.error('Profile update error:', error);
        return currentProfile; // Return old profile on error
      }

      // Update cache
      const cacheKey = `profile_${userId}`;
      cacheService.set(cacheKey, updatedProfile, 300);
      
      // Track significant changes
      this.trackProfileChanges(userId, currentProfile, updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      logger.error('updateProfile failed:', error);
      return null;
    }
  }

  // 🔀 Intelligent profile merging with behavioral analysis
  mergeProfileUpdates(currentProfile, updates) {
    const merged = { ...currentProfile, ...updates };
    
    // Recalculate derived metrics
    merged.avg_session_length = merged.total_time_spent / (merged.session_count || 1);
    
    // Update lifecycle stage based on engagement
    merged.lifecycle_stage = this.calculateLifecycleStage(merged);
    
    // Update risk score for churn prediction
    merged.risk_score = this.calculateRiskScore(merged);
    
    // Update communication style based on patterns
    merged.communication_style = this.detectCommunicationStyle(merged);
    
    // Validate numerical ranges
    merged.bond_score = Math.min(Math.max(merged.bond_score || 0, 0), 10);
    merged.trust_level = Math.min(Math.max(merged.trust_level || 0, 0), 10);
    merged.intimacy_score = Math.min(Math.max(merged.intimacy_score || 0, 0), 10);
    
    return merged;
  }

  // 📊 Calculate user lifecycle stage
  calculateLifecycleStage(profile) {
    const { total_messages, session_count, total_spent, bond_score, last_activity } = profile;
    
    // Check if churned (inactive for 7+ days)
    const daysSinceLastActivity = (Date.now() - new Date(last_activity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity > 7) return 'churned';
    
    // Loyal customer
    if (total_spent > 100 && session_count > 20) return 'loyal';
    
    // Converting user
    if (total_spent > 0 || bond_score > 7) return 'converting';
    
    // Engaged user
    if (total_messages > 20 && session_count > 3) return 'engaged';
    
    // New user
    return 'new';
  }

  // ⚠️ Calculate churn risk score (0-10)
  calculateRiskScore(profile) {
    const { last_activity, session_count, bond_score, upsell_resistance, total_messages } = profile;
    
    let risk = 0;
    
    // Time since last activity
    const hoursSinceLastActivity = (Date.now() - new Date(last_activity).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastActivity > 168) risk += 4; // 1 week
    else if (hoursSinceLastActivity > 48) risk += 2; // 2 days
    else if (hoursSinceLastActivity > 24) risk += 1; // 1 day
    
    // Low engagement
    if (session_count < 2) risk += 2;
    if (total_messages < 10) risk += 1;
    
    // Low bond
    if (bond_score < 3) risk += 2;
    
    // High upsell resistance
    if (upsell_resistance > 5) risk += 1;
    
    return Math.min(risk, 10);
  }

  // 💬 Detect communication style from behavioral patterns
  detectCommunicationStyle(profile) {
    const { slut_count, praise_count, romantic_count, dominant_count, submissive_count, total_messages } = profile;
    
    if (total_messages < 5) return 'neutral';
    
    const ratio = (field) => field / total_messages;
    
    if (ratio(slut_count) > 0.3) return 'sexual';
    if (ratio(praise_count) > 0.2) return 'worshipful';
    if (ratio(romantic_count) > 0.25) return 'romantic';
    if (ratio(dominant_count) > 0.2) return 'dominant';
    if (ratio(submissive_count) > 0.2) return 'submissive';
    
    return 'casual';
  }

  // 📝 Track user activity with intelligent queuing
  async trackUserActivity(userId, activity) {
    try {
      const activityLog = {
        id: uuidv4(),
        user_id: userId,
        activity_type: activity.type,
        activity_data: activity.data,
        personality: activity.personality,
        timestamp: new Date().toISOString(),
        session_id: activity.session_id || null,
        metadata: activity.metadata || {}
      };

      // Add to queue for batch processing
      this.activityQueue.push(activityLog);
      
      // Process queue if batch size reached
      if (this.activityQueue.length >= this.batchSize) {
        await this.flushActivityQueue();
      }

      // Update real-time cache
      this.updateActivityCache(userId, activity);

    } catch (error) {
      logger.error('Activity tracking error:', error);
    }
  }

  // 🔄 Flush activity queue to database
  async flushActivityQueue() {
    if (this.activityQueue.length === 0) return;

    try {
      const activities = [...this.activityQueue];
      this.activityQueue = [];

      const { error } = await supabaseClient
        .from('user_activities')
        .insert(activities);

      if (error) {
        logger.error('Activity flush error:', error);
        // Re-add failed activities to queue
        this.activityQueue.unshift(...activities);
      } else {
        logger.info(`Flushed ${activities.length} activities to database`);
      }
    } catch (error) {
      logger.error('Activity queue flush failed:', error);
    }
  }

  // 💾 Update activity cache for real-time analytics
  updateActivityCache(userId, activity) {
    const cacheKey = `recent_activity_${userId}`;
    let recentActivities = cacheService.get(cacheKey) || [];
    
    recentActivities.unshift({
      type: activity.type,
      timestamp: new Date().toISOString(),
      data: activity.data
    });
    
    // Keep only last 20 activities
    recentActivities = recentActivities.slice(0, 20);
    
    cacheService.set(cacheKey, recentActivities, 3600); // 1 hour
  }

  // 🔍 Get user activity history
  async getUserActivityHistory(userId, limit = 50, activityType = null) {
    try {
      let query = supabaseClient
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
        logger.error('Activity history fetch error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('getUserActivityHistory failed:', error);
      return [];
    }
  }

  // 📈 Get user analytics and insights
  async getUserAnalytics(userId) {
    try {
      const profile = await this.getUserProfile(userId);
      const activities = await this.getUserActivityHistory(userId, 100);
      
      // Calculate engagement metrics
      const analytics = {
        overview: {
          lifecycleStage: profile.lifecycle_stage,
          riskScore: profile.risk_score,
          totalValue: profile.total_spent,
          engagement: this.calculateEngagementScore(profile)
        },
        
        behavioral: {
          communicationStyle: profile.communication_style,
          preferredPersonality: profile.favorite_personality,
          escalationLevel: profile.escalation_level,
          responsiveness: this.calculateResponsiveness(activities)
        },
        
        conversion: {
          conversionRate: profile.successful_conversions / (profile.conversion_attempts || 1),
          avgOrderValue: profile.total_spent / (profile.successful_conversions || 1),
          upsellSuccess: 1 - (profile.upsell_resistance / 10),
          spendingTier: profile.spending_tier
        },
        
        predictions: {
          churnProbability: profile.risk_score / 10,
          lifetimeValue: this.predictLifetimeValue(profile),
          nextPurchaseProbability: this.predictPurchaseProbability(profile),
          optimalPersonality: this.recommendPersonality(profile)
        }
      };

      return analytics;
    } catch (error) {
      logger.error('getUserAnalytics failed:', error);
      return null;
    }
  }

  // 📊 Calculate engagement score (0-100)
  calculateEngagementScore(profile) {
    const factors = {
      messages: Math.min(profile.total_messages / 50, 1) * 25,
      sessions: Math.min(profile.session_count / 10, 1) * 20,
      bond: (profile.bond_score / 10) * 25,
      recency: this.getRecencyScore(profile.last_activity) * 15,
      spending: Math.min(profile.total_spent / 100, 1) * 15
    };

    return Math.round(Object.values(factors).reduce((sum, score) => sum + score, 0));
  }

  // ⏰ Get recency score based on last activity
  getRecencyScore(lastActivity) {
    const hours = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
    
    if (hours < 1) return 1.0;
    if (hours < 24) return 0.8;
    if (hours < 168) return 0.5; // 1 week
    if (hours < 720) return 0.2; // 1 month
    return 0.0;
  }

  // 📊 Calculate responsiveness from activity patterns
  calculateResponsiveness(activities) {
    if (activities.length < 2) return 0.5;

    const responses = activities.filter(a => a.activity_type === 'message');
    const avgResponseTime = this.calculateAvgResponseTime(responses);
    
    // Convert response time to score (faster = higher score)
    if (avgResponseTime < 30) return 1.0; // Very responsive (< 30 seconds)
    if (avgResponseTime < 300) return 0.8; // Responsive (< 5 minutes)
    if (avgResponseTime < 1800) return 0.6; // Moderate (< 30 minutes)
    if (avgResponseTime < 3600) return 0.4; // Slow (< 1 hour)
    return 0.2; // Very slow
  }

  // ⏱️ Calculate average response time between messages
  calculateAvgResponseTime(responses) {
    if (responses.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < responses.length; i++) {
      const current = new Date(responses[i-1].timestamp);
      const previous = new Date(responses[i].timestamp);
      intervals.push((current - previous) / 1000); // in seconds
    }

    return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  }

  // 💰 Predict lifetime value using behavioral patterns
  predictLifetimeValue(profile) {
    const baseValue = profile.total_spent;
    const engagementMultiplier = this.calculateEngagementScore(profile) / 100;
    const bondMultiplier = profile.bond_score / 10;
    const loyaltyBonus = profile.lifecycle_stage === 'loyal' ? 1.5 : 1.0;

    return Math.round((baseValue + 50) * engagementMultiplier * bondMultiplier * loyaltyBonus);
  }

  // 🎯 Predict purchase probability
  predictPurchaseProbability(profile) {
    let probability = 0.1; // Base 10% chance

    // Increase based on bond score
    probability += (profile.bond_score / 10) * 0.4;

    // Increase based on escalation level
    const escalationBonus = {
      sweet: 0.0,
      flirty: 0.1,
      sexual: 0.2
    };
    probability += escalationBonus[profile.escalation_level] || 0;

    // Increase if previously purchased
    if (profile.total_spent > 0) probability += 0.3;

    // Decrease based on upsell resistance
    probability -= (profile.upsell_resistance / 10) * 0.2;

    return Math.min(Math.max(probability, 0), 1);
  }

  // 🎭 Recommend optimal personality based on user behavior
  recommendPersonality(profile) {
    const { communication_style, slut_count, praise_count, romantic_count } = profile;

    switch (communication_style) {
      case 'sexual':
        return slut_count > praise_count ? 'nova' : 'galatea';
      case 'worshipful':
        return 'galatea';
      case 'romantic':
        return 'bonnie';
      case 'dominant':
        return 'nova';
      case 'submissive':
        return 'nova';
      default:
        return 'bonnie'; // Safe default
    }
  }

  // 📝 Track significant profile changes
  trackProfileChanges(userId, oldProfile, newProfile) {
    const significantChanges = [];

    // Check for bond score changes
    if (Math.abs(newProfile.bond_score - oldProfile.bond_score) >= 1) {
      significantChanges.push({
        type: 'bond_change',
        from: oldProfile.bond_score,
        to: newProfile.bond_score
      });
    }

    // Check for escalation level changes
    if (newProfile.escalation_level !== oldProfile.escalation_level) {
      significantChanges.push({
        type: 'escalation_change',
        from: oldProfile.escalation_level,
        to: newProfile.escalation_level
      });
    }

    // Check for lifecycle stage changes
    if (newProfile.lifecycle_stage !== oldProfile.lifecycle_stage) {
      significantChanges.push({
        type: 'lifecycle_change',
        from: oldProfile.lifecycle_stage,
        to: newProfile.lifecycle_stage
      });
    }

    // Log significant changes
    if (significantChanges.length > 0) {
      empireLogger.soulInteraction(userId, newProfile.favorite_personality, 'profile_evolution', {
        changes: significantChanges,
        bondScore: newProfile.bond_score,
        stage: newProfile.lifecycle_stage
      });
    }
  }

  // 🔧 Start background maintenance processes
  startMemoryMaintenance() {
    // Flush activity queue periodically
    setInterval(() => {
      this.flushActivityQueue();
    }, this.flushInterval);

    // Clean up old cache entries
    setInterval(() => {
      cacheService.cleanup();
    }, 300000); // 5 minutes

    logger.info('Memory engine maintenance processes started');
  }

  // 📊 Get memory engine statistics
  getMemoryStats() {
    return {
      cacheSize: this.memoryCache.size,
      queueSize: this.activityQueue.length,
      batchSize: this.batchSize,
      flushInterval: this.flushInterval,
      lastFlush: new Date().toISOString()
    };
  }

  // 🔍 Search users by criteria
  async searchUsers(criteria, limit = 20) {
    try {
      let query = supabaseClient
        .from('user_profiles')
        .select('*')
        .limit(limit);

      // Apply search criteria
      if (criteria.spendingTier) {
        query = query.eq('spending_tier', criteria.spendingTier);
      }
      if (criteria.lifecycleStage) {
        query = query.eq('lifecycle_stage', criteria.lifecycleStage);
      }
      if (criteria.minBondScore) {
        query = query.gte('bond_score', criteria.minBondScore);
      }
      if (criteria.personality) {
        query = query.eq('favorite_personality', criteria.personality);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('User search error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('searchUsers failed:', error);
      return [];
    }
  }
}

// 🌟 Create singleton instance
export const memoryEngine = new MemoryEngine();

export default memoryEngine;