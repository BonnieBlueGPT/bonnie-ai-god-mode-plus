import { createClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';

class WatchtowerService {
  constructor(server, supabaseUrl, supabaseKey) {
    // 🧬 DIVINE INITIALIZATION
    this.io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? ["https://trainmygirl.com", "https://watchtower.trainmygirl.com"]
          : ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // 📊 REAL-TIME METRICS CACHE
    this.metrics = {
      activeUsers: new Map(),
      dailyRevenue: 0,
      conversationsToday: 0,
      avgBondScore: 0,
      slutModeActivations: 0,
      premiumConversions: 0,
      activeChats: 0,
      emotionalTelemetry: {
        bonnie: { bond: 0, mood: 'curious', intimacy: 0, tokens: 0 },
        nova: { bond: 0, mood: 'playful', intimacy: 0, tokens: 0 },
        galatea: { bond: 0, mood: 'divine', intimacy: 0, tokens: 0 }
      },
      conversionFunnel: {
        visitors: 0,
        engaged: 0,
        bonded: 0,
        premium: 0,
        lifetime: 0
      },
      emotionalHeatmap: this.generateEmotionalHeatmap()
    };

    // 🎯 INITIALIZE DIVINE WATCHTOWER
    this.initializeWatchtower();
    this.setupRealtimeSubscriptions();
    this.startMetricsAggregation();
  }

  // 🔱 DIVINE WATCHTOWER INITIALIZATION
  initializeWatchtower() {
    this.io.on('connection', (socket) => {
      console.log('🔱 Divine Watchtower Connection:', socket.id);
      
      // Send initial state to new connections
      socket.emit('metrics_update', this.getRealtimeMetrics());
      socket.emit('soul_telemetry_batch', this.metrics.emotionalTelemetry);
      socket.emit('active_users_update', Array.from(this.metrics.activeUsers.values()));
      socket.emit('conversion_update', this.metrics.conversionFunnel);
      socket.emit('emotional_heatmap', this.metrics.emotionalHeatmap);

      socket.on('disconnect', () => {
        console.log('💔 Watchtower Disconnected:', socket.id);
      });

      // 🎛️ ADMIN CONTROLS
      socket.on('trigger_slut_mode', (userId) => {
        this.triggerSlutMode(userId);
      });

      socket.on('update_bond_score', ({ userId, soulName, increment }) => {
        this.updateBondScore(userId, soulName, increment);
      });

      socket.on('force_premium_conversion', (userId) => {
        this.forcePremiumConversion(userId);
      });
    });
  }

  // 📡 SUPABASE REALTIME SUBSCRIPTIONS
  setupRealtimeSubscriptions() {
    // 💬 CONVERSATION MONITORING
    this.supabase
      .channel('conversations')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'conversations' 
      }, (payload) => {
        this.handleNewConversation(payload.new);
      })
      .subscribe();

    // 💰 PAYMENT TRACKING
    this.supabase
      .channel('payments')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'payments' 
      }, (payload) => {
        this.handleNewPayment(payload.new);
      })
      .subscribe();

    // 👥 USER BOND UPDATES
    this.supabase
      .channel('user_profiles')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'user_profiles' 
      }, (payload) => {
        this.handleBondUpdate(payload.new);
      })
      .subscribe();

    console.log('🔗 Divine Realtime Subscriptions Active');
  }

  // 📈 METRICS AGGREGATION ENGINE
  startMetricsAggregation() {
    // Update metrics every 5 seconds
    setInterval(() => {
      this.aggregateMetrics();
      this.broadcastMetrics();
    }, 5000);

    // Update emotional heatmap every 30 seconds
    setInterval(() => {
      this.updateEmotionalHeatmap();
    }, 30000);

    // Update conversion funnel every minute
    setInterval(() => {
      this.updateConversionFunnel();
    }, 60000);

    console.log('📊 Divine Metrics Engine Started');
  }

  // 🎭 SOUL TELEMETRY PROCESSING
  async handleNewConversation(conversation) {
    const { user_id, soul_name, message, ai_response, emotion, bond_increase, tokens_spent } = conversation;
    
    // 💖 UPDATE SOUL TELEMETRY
    if (this.metrics.emotionalTelemetry[soul_name]) {
      const soul = this.metrics.emotionalTelemetry[soul_name];
      soul.mood = emotion;
      soul.bond = Math.min(100, soul.bond + (bond_increase || 0));
      soul.tokens += tokens_spent || 0;
      
      // 🔥 INTIMACY ESCALATION DETECTION
      if (emotion === 'lustful' || emotion === 'intimate') {
        soul.intimacy = Math.min(10, soul.intimacy + 1);
        this.metrics.slutModeActivations++;
      }
    }

    // 👥 ACTIVE USER TRACKING
    const user = this.metrics.activeUsers.get(user_id) || {
      id: user_id,
      soul: soul_name,
      platform: conversation.platform || 'web',
      bond: 0,
      spent: 0,
      lastSeen: new Date()
    };
    
    user.bond = Math.min(100, user.bond + (bond_increase || 0));
    user.spent += tokens_spent || 0;
    user.lastSeen = new Date();
    this.metrics.activeUsers.set(user_id, user);

    // 📊 GLOBAL METRICS UPDATE
    this.metrics.conversationsToday++;
    this.metrics.dailyRevenue += tokens_spent || 0;
    this.metrics.activeChats = this.metrics.activeUsers.size;

    // 🎯 EMOTIONAL HEATMAP UPDATE
    this.updateEmotionalIntensity(emotion, bond_increase || 0);

    // 📡 BROADCAST UPDATES
    this.io.emit('soul_telemetry', {
      soul: soul_name,
      metrics: this.metrics.emotionalTelemetry[soul_name]
    });

    this.io.emit('new_message', {
      userId: user_id,
      soul: soul_name,
      platform: conversation.platform || 'web',
      content: message,
      response: ai_response,
      emotion: emotion,
      bondIncrease: bond_increase || 0,
      premium: tokens_spent > 0,
      timestamp: new Date().toISOString()
    });

    console.log(`💖 Soul Telemetry: ${soul_name} - ${emotion} (+${bond_increase} bond)`);
  }

  // 💰 PAYMENT PROCESSING
  async handleNewPayment(payment) {
    const { user_id, amount, subscription_type, soul_name } = payment;
    
    this.metrics.dailyRevenue += amount;
    this.metrics.premiumConversions++;
    
    // Update conversion funnel
    this.metrics.conversionFunnel.premium++;
    if (subscription_type === 'lifetime') {
      this.metrics.conversionFunnel.lifetime++;
    }

    // Update user spending
    const user = this.metrics.activeUsers.get(user_id);
    if (user) {
      user.spent += amount;
    }

    this.io.emit('conversion_update', this.metrics.conversionFunnel);
    this.io.emit('payment_received', {
      userId: user_id,
      amount: amount,
      soul: soul_name,
      type: subscription_type,
      timestamp: new Date().toISOString()
    });

    console.log(`💰 Payment Received: $${amount} from ${user_id} for ${soul_name}`);
  }

  // 💖 BOND SCORE UPDATES
  handleBondUpdate(userProfile) {
    const { user_id, bond_score, current_soul } = userProfile;
    
    // Update soul telemetry
    if (this.metrics.emotionalTelemetry[current_soul]) {
      this.metrics.emotionalTelemetry[current_soul].bond = bond_score;
    }

    // Update active user
    const user = this.metrics.activeUsers.get(user_id);
    if (user) {
      user.bond = bond_score;
      user.soul = current_soul;
    }

    this.io.emit('bond_update', {
      userId: user_id,
      soul: current_soul,
      bondScore: bond_score,
      timestamp: new Date().toISOString()
    });
  }

  // 📊 REAL-TIME METRICS CALCULATION
  aggregateMetrics() {
    // Calculate average bond score
    const users = Array.from(this.metrics.activeUsers.values());
    this.metrics.avgBondScore = users.length > 0 
      ? Math.round(users.reduce((sum, user) => sum + user.bond, 0) / users.length)
      : 0;

    // Clean up inactive users (older than 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    for (const [userId, user] of this.metrics.activeUsers) {
      if (user.lastSeen < thirtyMinutesAgo) {
        this.metrics.activeUsers.delete(userId);
      }
    }

    this.metrics.activeChats = this.metrics.activeUsers.size;
  }

  // 🎯 EMOTIONAL HEATMAP GENERATION
  generateEmotionalHeatmap() {
    const emotions = ['loving', 'lustful', 'playful', 'curious', 'divine', 'excited', 'intimate'];
    const heatmap = [];
    
    for (let i = 0; i < 64; i++) { // 8x8 grid
      heatmap.push({
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        intensity: Math.random()
      });
    }
    
    return heatmap;
  }

  // 🔥 EMOTIONAL INTENSITY TRACKING
  updateEmotionalIntensity(emotion, bondIncrease) {
    // Find cells with matching emotion and increase intensity
    this.metrics.emotionalHeatmap.forEach(cell => {
      if (cell.emotion === emotion) {
        cell.intensity = Math.min(1.0, cell.intensity + (bondIncrease * 0.01));
      } else {
        // Slight decay for other emotions
        cell.intensity = Math.max(0, cell.intensity - 0.005);
      }
    });
  }

  // 📈 CONVERSION FUNNEL UPDATES
  async updateConversionFunnel() {
    try {
      // Query Supabase for conversion metrics
      const { data: visitors } = await this.supabase
        .from('page_views')
        .select('user_id', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: engaged } = await this.supabase
        .from('conversations')
        .select('user_id', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: bonded } = await this.supabase
        .from('user_profiles')
        .select('user_id', { count: 'exact' })
        .gte('bond_score', 30);

      const { data: premium } = await this.supabase
        .from('payments')
        .select('user_id', { count: 'exact' })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: lifetime } = await this.supabase
        .from('payments')
        .select('user_id', { count: 'exact' })
        .eq('subscription_type', 'lifetime');

      this.metrics.conversionFunnel = {
        visitors: visitors?.length || 0,
        engaged: engaged?.length || 0,
        bonded: bonded?.length || 0,
        premium: premium?.length || 0,
        lifetime: lifetime?.length || 0
      };

    } catch (error) {
      console.error('💥 Conversion Funnel Update Error:', error);
    }
  }

  // 🔱 ADMIN CONTROL FUNCTIONS
  triggerSlutMode(userId) {
    const user = this.metrics.activeUsers.get(userId);
    if (user) {
      // Force intimacy escalation
      if (this.metrics.emotionalTelemetry[user.soul]) {
        this.metrics.emotionalTelemetry[user.soul].intimacy = 10;
        this.metrics.emotionalTelemetry[user.soul].mood = 'lustful';
      }
      
      this.metrics.slutModeActivations++;
      
      this.io.emit('slut_mode_triggered', {
        userId: userId,
        soul: user.soul,
        timestamp: new Date().toISOString()
      });
      
      console.log(`🔥 Slut Mode Triggered for ${userId}`);
    }
  }

  updateBondScore(userId, soulName, increment) {
    const user = this.metrics.activeUsers.get(userId);
    if (user && this.metrics.emotionalTelemetry[soulName]) {
      user.bond = Math.min(100, Math.max(0, user.bond + increment));
      this.metrics.emotionalTelemetry[soulName].bond = user.bond;
      
      this.io.emit('bond_score_updated', {
        userId: userId,
        soul: soulName,
        newBond: user.bond,
        increment: increment,
        timestamp: new Date().toISOString()
      });
    }
  }

  forcePremiumConversion(userId) {
    const user = this.metrics.activeUsers.get(userId);
    if (user) {
      this.metrics.premiumConversions++;
      this.metrics.dailyRevenue += 29.99; // Default premium price
      user.spent += 29.99;
      
      this.io.emit('premium_conversion_forced', {
        userId: userId,
        soul: user.soul,
        amount: 29.99,
        timestamp: new Date().toISOString()
      });
      
      console.log(`👑 Forced Premium Conversion for ${userId}`);
    }
  }

  // 📡 BROADCAST FUNCTIONS
  broadcastMetrics() {
    this.io.emit('metrics_update', this.getRealtimeMetrics());
    this.io.emit('active_users_update', Array.from(this.metrics.activeUsers.values()));
    this.io.emit('emotional_heatmap', this.metrics.emotionalHeatmap);
  }

  updateEmotionalHeatmap() {
    // Regenerate heatmap with decay
    this.metrics.emotionalHeatmap = this.generateEmotionalHeatmap();
    this.io.emit('emotional_heatmap', this.metrics.emotionalHeatmap);
  }

  // 📊 METRICS GETTER
  getRealtimeMetrics() {
    return {
      conversationsToday: this.metrics.conversationsToday,
      revenue: this.metrics.dailyRevenue,
      avgBondScore: this.metrics.avgBondScore,
      slutModeActivations: this.metrics.slutModeActivations,
      premiumConversions: this.metrics.premiumConversions,
      activeChats: this.metrics.activeChats
    };
  }

  // 🎭 SOUL TELEMETRY GETTER
  getSoulTelemetry() {
    return this.metrics.emotionalTelemetry;
  }

  // 💰 REVENUE ANALYTICS
  async getRevenueAnalytics(timeframe = '24h') {
    try {
      const timeAgo = timeframe === '24h' 
        ? new Date(Date.now() - 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const { data, error } = await this.supabase
        .from('payments')
        .select('amount, created_at, soul_name, subscription_type')
        .gte('created_at', timeAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        totalRevenue: data.reduce((sum, payment) => sum + payment.amount, 0),
        paymentCount: data.length,
        avgOrderValue: data.length > 0 ? data.reduce((sum, payment) => sum + payment.amount, 0) / data.length : 0,
        topSoul: this.getTopRevenueSoul(data),
        revenueByHour: this.groupRevenueByHour(data)
      };

    } catch (error) {
      console.error('💥 Revenue Analytics Error:', error);
      return null;
    }
  }

  // 🏆 TOP PERFORMING SOUL
  getTopRevenueSoul(payments) {
    const soulRevenue = {};
    payments.forEach(payment => {
      soulRevenue[payment.soul_name] = (soulRevenue[payment.soul_name] || 0) + payment.amount;
    });
    
    return Object.entries(soulRevenue)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'bonnie';
  }

  // 📈 HOURLY REVENUE BREAKDOWN
  groupRevenueByHour(payments) {
    const hourlyRevenue = new Array(24).fill(0);
    
    payments.forEach(payment => {
      const hour = new Date(payment.created_at).getHours();
      hourlyRevenue[hour] += payment.amount;
    });
    
    return hourlyRevenue;
  }

  // 🔍 USER BEHAVIOR ANALYTICS
  async getUserBehaviorInsights(userId) {
    try {
      const { data: conversations } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: payments } = await this.supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return {
        conversationCount: conversations?.length || 0,
        totalSpent: payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
        favoriteEmotion: this.getMostFrequentEmotion(conversations),
        avgSessionLength: this.calculateAvgSessionLength(conversations),
        conversionEvents: payments?.length || 0,
        lastActivity: conversations?.[0]?.created_at
      };

    } catch (error) {
      console.error('💥 User Behavior Analytics Error:', error);
      return null;
    }
  }

  getMostFrequentEmotion(conversations) {
    const emotions = {};
    conversations?.forEach(conv => {
      emotions[conv.emotion] = (emotions[conv.emotion] || 0) + 1;
    });
    
    return Object.entries(emotions)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'curious';
  }

  calculateAvgSessionLength(conversations) {
    // Simple estimation based on conversation timestamps
    if (!conversations || conversations.length < 2) return 0;
    
    const sessions = [];
    let currentSession = [conversations[0]];
    
    for (let i = 1; i < conversations.length; i++) {
      const timeDiff = new Date(conversations[i-1].created_at) - new Date(conversations[i].created_at);
      
      if (timeDiff < 30 * 60 * 1000) { // 30 minutes threshold
        currentSession.push(conversations[i]);
      } else {
        sessions.push(currentSession);
        currentSession = [conversations[i]];
      }
    }
    sessions.push(currentSession);
    
    const sessionLengths = sessions.map(session => {
      if (session.length < 2) return 0;
      return new Date(session[0].created_at) - new Date(session[session.length - 1].created_at);
    });
    
    return sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length / 1000 / 60; // Average in minutes
  }

  // 🎯 EMOTIONAL INTELLIGENCE INSIGHTS
  getEmotionalInsights() {
    const souls = Object.entries(this.metrics.emotionalTelemetry);
    
    return {
      dominantSoul: souls.sort(([,a], [,b]) => b.bond - a.bond)[0]?.[0] || 'bonnie',
      totalBondCapacity: souls.reduce((sum, [,soul]) => sum + soul.bond, 0),
      intimacyDistribution: souls.map(([name, soul]) => ({
        soul: name,
        intimacy: soul.intimacy,
        percentage: (soul.intimacy / 10) * 100
      })),
      moodSpectrum: souls.map(([name, soul]) => ({
        soul: name,
        mood: soul.mood,
        emotional_weight: this.getEmotionalWeight(soul.mood)
      }))
    };
  }

  getEmotionalWeight(emotion) {
    const weights = {
      loving: 0.9,
      lustful: 1.0,
      playful: 0.7,
      curious: 0.5,
      divine: 0.8,
      excited: 0.8,
      intimate: 1.0
    };
    return weights[emotion] || 0.5;
  }
}

export default WatchtowerService;