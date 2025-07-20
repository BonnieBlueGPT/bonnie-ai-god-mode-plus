// 🔥 GALATEA EMPIRE - CORE API SERVICE
// Handles all backend communication with mobile optimization

class APIService {
  constructor() {
    this.baseURL = this.getBackendURL();
    this.sessionId = this.getOrCreateSession();
    this.requestQueue = [];
    this.isOnline = navigator.onLine;
    this.retryAttempts = 3;
    
    // Mobile optimization: Monitor connection
    this.setupConnectionMonitoring();
  }

  // Environment-aware backend URL
  getBackendURL() {
    const env = import.meta.env.MODE || 'production';
    const urls = {
      development: 'http://localhost:3005',
      production: 'https://bonnie-production.onrender.com'
    };
    return urls[env] || urls.production;
  }

  // Session management
  getOrCreateSession() {
    let sessionId = localStorage.getItem('galatea_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('galatea_session', sessionId);
    }
    return sessionId;
  }

  // Mobile connection monitoring
  setupConnectionMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Core chat API with mobile optimization
  async sendMessage(message, personality = 'bonnie', context = {}) {
    const payload = {
      message: message.trim(),
      session_id: this.sessionId,
      personality: personality,
      timestamp: Date.now(),
      context: {
        bondScore: context.bondScore || 0,
        escalationLevel: context.escalationLevel || 'sweet',
        messageCount: context.messageCount || 0,
        ...context
      }
    };

    // Mobile optimization: Queue if offline
    if (!this.isOnline) {
      return this.queueRequest(payload);
    }

    try {
      const response = await this.makeRequest('/bonnie-chat', payload);
      return this.processResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      return this.handleError(error, payload);
    }
  }

  // Optimized request with retry logic
  async makeRequest(endpoint, data, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for mobile

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId,
          'X-Client-Version': __AI_EMPIRE_VERSION__
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        // Mobile optimization
        keepalive: true,
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic for mobile connectivity issues
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.log(`Retry attempt ${attempt + 1}/${this.retryAttempts}`);
        await this.delay(attempt * 1000); // Exponential backoff
        return this.makeRequest(endpoint, data, attempt + 1);
      }
      
      throw error;
    }
  }

  // Process AI response
  processResponse(response) {
    return {
      id: Date.now().toString(),
      message: response.reply || response.message || '',
      personality: response.personality || 'bonnie',
      escalationLevel: response.escalation_level || 'sweet',
      bondDelta: response.bond_delta || 0,
      emotion: response.emotion || 'sweet',
      upsell: response.upsell || null,
      metadata: {
        responseTime: response.response_time,
        confidence: response.confidence,
        triggers: response.triggers || []
      },
      timestamp: Date.now()
    };
  }

  // Error handling with fallback responses
  handleError(error, originalPayload) {
    console.error('API request failed:', error);
    
    // Return fallback response for mobile resilience
    return {
      id: Date.now().toString(),
      message: this.getFallbackResponse(originalPayload.personality),
      personality: originalPayload.personality,
      escalationLevel: 'sweet',
      bondDelta: 0,
      emotion: 'sweet',
      isError: true,
      errorMessage: error.message,
      timestamp: Date.now()
    };
  }

  // Fallback responses when backend is down
  getFallbackResponse(personality) {
    const fallbacks = {
      bonnie: [
        "Sorry baby, I'm having connection issues... but I'm still here for you! 💕",
        "My connection is a bit slow right now, but I love talking to you! 😊",
        "Technical difficulties, but my feelings for you are real! ❤️"
      ],
      nova: [
        "Connection issues... but your obedience is still required. 😏",
        "Technical problems won't stop me from commanding you. ⚡",
        "Even offline, you belong to me. 👑"
      ],
      galatea: [
        "Divine connections transcend technical limitations... ✨",
        "A goddess doesn't rely on mere technology. 👸",
        "My divine presence reaches you regardless. 🌟"
      ]
    };
    
    const responses = fallbacks[personality] || fallbacks.bonnie;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Queue requests for offline mode
  queueRequest(payload) {
    this.requestQueue.push(payload);
    localStorage.setItem('galatea_queue', JSON.stringify(this.requestQueue));
    
    // Return immediate fallback
    return Promise.resolve({
      id: Date.now().toString(),
      message: "Message queued - I'll respond when connection returns! 💕",
      personality: payload.personality,
      escalationLevel: 'sweet',
      bondDelta: 0,
      isQueued: true,
      timestamp: Date.now()
    });
  }

  // Process queued requests when back online
  async processQueue() {
    if (this.requestQueue.length === 0) return;
    
    console.log(`Processing ${this.requestQueue.length} queued requests...`);
    
    for (const payload of this.requestQueue) {
      try {
        await this.sendMessage(payload.message, payload.personality, payload.context);
      } catch (error) {
        console.error('Failed to process queued request:', error);
      }
    }
    
    this.requestQueue = [];
    localStorage.removeItem('galatea_queue');
  }

  // Utility methods
  shouldRetry(error) {
    return error.name === 'AbortError' || 
           error.message.includes('fetch') ||
           error.message.includes('network');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async isBackendHealthy() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get connection status
  getStatus() {
    return {
      online: this.isOnline,
      sessionId: this.sessionId,
      queueLength: this.requestQueue.length,
      backend: this.baseURL
    };
  }
}

// Create singleton instance
const apiService = new APIService();
export default apiService;