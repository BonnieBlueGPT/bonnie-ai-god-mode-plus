// 🔥 GALATEA EMPIRE - CHAT SERVICE
// Handles all backend communication for AI girlfriends

import { API_ENDPOINTS, CONFIG } from '../config/environment.js';
import personalityManager from '../core/PersonalityManager.js';

class ChatService {
  constructor() {
    this.isConnected = false;
    this.socket = null;
    this.messageQueue = [];
    this.eventHandlers = new Map();
  }

  // Initialize connection to backend
  async initialize() {
    try {
      console.log('🚀 Initializing ChatService...');
      
      // For now, use HTTP API (WebSocket integration can be added later)
      this.isConnected = true;
      
      console.log('✅ ChatService initialized');
      this.emit('connected');
      
      return true;
    } catch (error) {
      console.error('❌ ChatService initialization failed:', error);
      this.emit('error', error);
      return false;
    }
  }

  // Send message to AI girlfriend
  async sendMessage(message, options = {}) {
    if (!this.isConnected) {
      throw new Error('ChatService not connected');
    }

    const personality = personalityManager.getCurrentPersonality();
    const memory = personalityManager.getCurrentMemory();

    const payload = {
      message: message.trim(),
      personality: personality.id,
      context: {
        bondScore: memory.bondScore,
        escalationLevel: memory.escalationLevel,
        conversationHistory: memory.conversationHistory.slice(-5), // Last 5 messages
        timestamp: Date.now()
      },
      ...options
    };

    try {
      console.log('📤 Sending message:', payload);

      // Make API call to backend
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const aiResponse = await response.json();
      
      console.log('📨 Received response:', aiResponse);

      // Process the response
      const processedResponse = this.processAIResponse(aiResponse);
      
      // Update memory
      personalityManager.addMessage(message, true);
      personalityManager.addMessage(processedResponse.message, false);
      
      if (processedResponse.bondDelta) {
        personalityManager.updateBondScore(processedResponse.bondDelta);
      }
      
      if (processedResponse.escalationLevel) {
        personalityManager.setEscalationLevel(processedResponse.escalationLevel);
      }

      this.emit('messageReceived', processedResponse);
      
      return processedResponse;

    } catch (error) {
      console.error('❌ Message send failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Process AI response from backend
  processAIResponse(response) {
    const personality = personalityManager.getCurrentPersonality();
    
    return {
      id: response.id || Date.now().toString(),
      message: response.message || response.text || '',
      personality: personality.name,
      avatar: personality.avatar,
      escalationLevel: response.escalationLevel || 'sweet',
      bondDelta: response.bondDelta || 0,
      timestamp: response.timestamp || Date.now(),
      typing: response.typing || false,
      upsell: response.upsell || null,
      emotions: response.emotions || [],
      metadata: response.metadata || {}
    };
  }

  // Get conversation history
  getConversationHistory() {
    const memory = personalityManager.getCurrentMemory();
    return memory.conversationHistory || [];
  }

  // Clear conversation
  clearConversation() {
    personalityManager.updateMemory({ 
      conversationHistory: [],
      lastInteraction: Date.now()
    });
    this.emit('conversationCleared');
  }

  // Event system
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Event handler error for ${event}:`, error);
        }
      });
    }
  }

  // Connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      backend: CONFIG.BACKEND_URL,
      personality: personalityManager.currentPersonality
    };
  }

  // Disconnect
  disconnect() {
    this.isConnected = false;
    this.emit('disconnected');
    console.log('🔌 ChatService disconnected');
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService;