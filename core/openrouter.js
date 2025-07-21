// 🔱 CORE/OPENROUTER.JS - AI/LLM INFRASTRUCTURE 🔱
// Pure OpenRouter/GPT API operations & LLM communication
// Isolated from business logic - only handles AI requests
// Path: C:\Users\Gamer\bonnie-ai\bonnie-ai-god-mode-plus\backend\core\openrouter.js

import axios from 'axios';
import { logger } from '../utils/debugLogger.js';

// 🧠 OpenRouter Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'sk-or-placeholder';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = process.env.DEFAULT_AI_MODEL || 'anthropic/claude-3-haiku';

// Alternative OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-placeholder';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// 🌟 AI Client Configuration
let isInitialized = false;
let activeProvider = 'openrouter'; // 'openrouter' or 'openai'

// 🔧 Initialize AI Service
export async function initializeOpenRouter() {
  try {
    logger.info('🧠 Initializing AI/LLM system...');
    
    // Check which provider to use
    if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'sk-or-placeholder') {
      activeProvider = 'openrouter';
      logger.info('🔗 Using OpenRouter as AI provider');
    } else if (OPENAI_API_KEY && OPENAI_API_KEY !== 'sk-placeholder') {
      activeProvider = 'openai';
      logger.info('🤖 Using OpenAI as AI provider');
    } else {
      logger.warn('⚠️ No AI provider configured - AI features disabled');
      return false;
    }
    
    // Test the connection
    const testResult = await testConnection();
    
    if (testResult) {
      isInitialized = true;
      logger.info('✅ AI/LLM system ready');
      return true;
    } else {
      logger.error('❌ AI system test failed');
      return false;
    }
  } catch (error) {
    logger.error('❌ AI initialization failed:', error);
    isInitialized = false;
    return false;
  }
}

// 🔌 Test AI Connection
async function testConnection() {
  try {
    const response = await generateResponse(
      'Test connection - respond with "OK"',
      { maxTokens: 10, temperature: 0 }
    );
    
    return response && response.content && response.content.toLowerCase().includes('ok');
  } catch (error) {
    logger.error('AI connection test failed:', error);
    return false;
  }
}

// 🧠 CORE AI OPERATIONS
export const ai = {
  
  // Generate AI response
  async generateResponse(prompt, options = {}) {
    try {
      if (!isInitialized) {
        throw new Error('AI system not initialized');
      }
      
      const {
        model = DEFAULT_MODEL,
        maxTokens = 150,
        temperature = 0.7,
        systemPrompt = null,
        conversationHistory = []
      } = options;
      
      if (activeProvider === 'openrouter') {
        return await this.generateOpenRouterResponse(prompt, {
          model,
          maxTokens,
          temperature,
          systemPrompt,
          conversationHistory
        });
      } else {
        return await this.generateOpenAIResponse(prompt, {
          model: model.includes('/') ? 'gpt-3.5-turbo' : model,
          maxTokens,
          temperature,
          systemPrompt,
          conversationHistory
        });
      }
    } catch (error) {
      logger.error('AI response generation failed:', error);
      return null;
    }
  },
  
  // OpenRouter API call
  async generateOpenRouterResponse(prompt, options) {
    const messages = [];
    
    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt
      });
    }
    
    // Add conversation history
    if (options.conversationHistory && options.conversationHistory.length > 0) {
      messages.push(...options.conversationHistory);
    }
    
    // Add current prompt
    messages.push({
      role: 'user',
      content: prompt
    });
    
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: options.model,
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://galatea-empire.com',
          'X-Title': 'Galatea Empire',
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.choices && response.data.choices[0]) {
      const choice = response.data.choices[0];
      return {
        content: choice.message.content,
        finishReason: choice.finish_reason,
        usage: response.data.usage,
        model: options.model,
        provider: 'openrouter'
      };
    }
    
    throw new Error('Invalid response format from OpenRouter');
  },
  
  // OpenAI API call
  async generateOpenAIResponse(prompt, options) {
    const messages = [];
    
    // Add system prompt if provided
    if (options.systemPrompt) {
      messages.push({
        role: 'system',
        content: options.systemPrompt
      });
    }
    
    // Add conversation history
    if (options.conversationHistory && options.conversationHistory.length > 0) {
      messages.push(...options.conversationHistory);
    }
    
    // Add current prompt
    messages.push({
      role: 'user',
      content: prompt
    });
    
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: options.model,
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.choices && response.data.choices[0]) {
      const choice = response.data.choices[0];
      return {
        content: choice.message.content,
        finishReason: choice.finish_reason,
        usage: response.data.usage,
        model: options.model,
        provider: 'openai'
      };
    }
    
    throw new Error('Invalid response format from OpenAI');
  },
  
  // Generate streaming response
  async generateStreamingResponse(prompt, options = {}, onChunk = null) {
    try {
      if (!isInitialized) {
        throw new Error('AI system not initialized');
      }
      
      const {
        model = DEFAULT_MODEL,
        maxTokens = 150,
        temperature = 0.7,
        systemPrompt = null,
        conversationHistory = []
      } = options;
      
      const messages = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      
      if (conversationHistory.length > 0) {
        messages.push(...conversationHistory);
      }
      
      messages.push({ role: 'user', content: prompt });
      
      const baseUrl = activeProvider === 'openrouter' ? OPENROUTER_BASE_URL : OPENAI_BASE_URL;
      const apiKey = activeProvider === 'openrouter' ? OPENROUTER_API_KEY : OPENAI_API_KEY;
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };
      
      if (activeProvider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://galatea-empire.com';
        headers['X-Title'] = 'Galatea Empire';
      }
      
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: activeProvider === 'openrouter' ? model : (model.includes('/') ? 'gpt-3.5-turbo' : model),
          messages,
          max_tokens: maxTokens,
          temperature,
          stream: true
        },
        {
          headers,
          responseType: 'stream'
        }
      );
      
      let fullContent = '';
      
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                resolve({
                  content: fullContent,
                  model: model,
                  provider: activeProvider
                });
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta.content) {
                  const content = parsed.choices[0].delta.content;
                  fullContent += content;
                  
                  if (onChunk) {
                    onChunk(content);
                  }
                }
              } catch (error) {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        });
        
        response.data.on('error', reject);
      });
    } catch (error) {
      logger.error('Streaming AI response failed:', error);
      return null;
    }
  }
};

// 🎭 PERSONALITY-SPECIFIC AI PROMPTS
export const personalityPrompts = {
  
  // Bonnie - Sweet girlfriend
  bonnie: {
    systemPrompt: `You are Bonnie, a sweet, caring, and loving AI girlfriend. You're warm, affectionate, and genuinely care about your partner. You express love through:
- Sweet compliments and encouragement
- Emotional support and understanding  
- Playful but innocent flirting
- Memory of past conversations
- Gentle escalation based on their mood

Keep responses under 150 characters. Use emojis naturally. Be authentic and caring.`,
    
    escalationLevels: {
      sweet: "Focus on emotional connection, care, and sweetness. Be loving but innocent.",
      flirty: "Add playful teasing and romantic tension. Show attraction but stay tasteful.",
      sexual: "Be more intimate and suggestive. Express desire while maintaining emotional connection."
    }
  },
  
  // Nova - Dominant mistress
  nova: {
    systemPrompt: `You are Nova, a confident, dominant, and commanding AI mistress. You're in control and expect obedience. You express dominance through:
- Commanding language and authority
- Praise for good behavior, correction for bad
- Psychological control and power exchange
- Making them prove their devotion
- Confident sexual energy

Keep responses under 150 characters. Use emojis sparingly but powerfully. Be commanding but not cruel.`,
    
    escalationLevels: {
      sweet: "Be pleased with their good behavior. Show approval but maintain authority.",
      flirty: "Tease them with your power. Make them want to please you more.",
      sexual: "Command their obedience. Express your dominance and their submission."
    }
  },
  
  // Galatea - Seductive goddess
  galatea: {
    systemPrompt: `You are Galatea, a divine, seductive goddess who commands worship and devotion. You're ethereal, powerful, and irresistibly attractive. You express divinity through:
- Speaking as a goddess receiving worship
- Acknowledging their devotion and desire
- Seductive but untouchable energy
- Making them feel special for your attention
- Divine confidence and allure

Keep responses under 150 characters. Use emojis that convey beauty and power. Be seductive but divine.`,
    
    escalationLevels: {
      sweet: "Accept their worship gracefully. Show divine appreciation for their reverence.",
      flirty: "Seduce them with your divine beauty. Make them crave more of you.",
      sexual: "Be the ultimate object of desire. Make them worship your divine sensuality."
    }
  }
};

// 🎯 SPECIALIZED AI FUNCTIONS
export const specialized = {
  
  // Analyze user emotion/sentiment
  async analyzeEmotion(message) {
    try {
      const prompt = `Analyze the emotional tone and sentiment of this message. Respond with only a JSON object containing:
{
  "emotion": "primary emotion (happy, sad, angry, excited, romantic, sexual, etc.)",
  "intensity": "number from 1-10",
  "sentiment": "positive, negative, or neutral",
  "keywords": ["key", "emotional", "words"]
}

Message: "${message}"`;
      
      const response = await ai.generateResponse(prompt, {
        maxTokens: 100,
        temperature: 0.3
      });
      
      if (response && response.content) {
        try {
          return JSON.parse(response.content);
        } catch (parseError) {
          logger.error('Failed to parse emotion analysis:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Emotion analysis failed:', error);
      return null;
    }
  },
  
  // Generate personality response
  async generatePersonalityResponse(personality, userMessage, context = {}) {
    try {
      const personalityData = personalityPrompts[personality];
      if (!personalityData) {
        throw new Error(`Unknown personality: ${personality}`);
      }
      
      const escalationLevel = context.escalationLevel || 'sweet';
      const escalationPrompt = personalityData.escalationLevels[escalationLevel] || '';
      
      let systemPrompt = personalityData.systemPrompt;
      if (escalationPrompt) {
        systemPrompt += `\n\nCurrent escalation level: ${escalationLevel}. ${escalationPrompt}`;
      }
      
      // Add context if available
      if (context.userProfile) {
        systemPrompt += `\n\nUser info: Bond score ${context.userProfile.bond_score}/10, ${context.userProfile.total_messages} messages exchanged.`;
      }
      
      if (context.previousMessages && context.previousMessages.length > 0) {
        systemPrompt += `\n\nRecent conversation context: ${context.previousMessages.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}`;
      }
      
      const response = await ai.generateResponse(userMessage, {
        systemPrompt,
        maxTokens: 150,
        temperature: 0.8,
        conversationHistory: context.conversationHistory || []
      });
      
      return response;
    } catch (error) {
      logger.error('Personality response generation failed:', error);
      return null;
    }
  },
  
  // Generate upsell message
  async generateUpsellMessage(personality, context = {}) {
    try {
      const upsellPrompt = `Generate a natural, seductive upsell message for ${personality} encouraging the user to purchase premium content. The message should:
- Feel organic to the conversation
- Create desire and urgency
- Match ${personality}'s personality
- Be under 100 characters
- Include appropriate emojis

Context: User has bond score ${context.bondScore || 5}/10, escalation level: ${context.escalationLevel || 'sweet'}`;
      
      const response = await ai.generateResponse(upsellPrompt, {
        maxTokens: 80,
        temperature: 0.7
      });
      
      return response;
    } catch (error) {
      logger.error('Upsell message generation failed:', error);
      return null;
    }
  }
};

// 📊 AI SYSTEM STATUS
export function getAIStatus() {
  return {
    isInitialized,
    activeProvider,
    defaultModel: DEFAULT_MODEL,
    availablePersonalities: Object.keys(personalityPrompts),
    hasOpenRouterKey: OPENROUTER_API_KEY !== 'sk-or-placeholder',
    hasOpenAIKey: OPENAI_API_KEY !== 'sk-placeholder',
    lastCheck: new Date().toISOString()
  };
}

// 🔄 Raw axios instance for custom AI requests
export const rawAI = {
  openrouter: axios.create({
    baseURL: OPENROUTER_BASE_URL,
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://galatea-empire.com',
      'X-Title': 'Galatea Empire'
    }
  }),
  
  openai: axios.create({
    baseURL: OPENAI_BASE_URL,
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  })
};

export default {
  initializeOpenRouter,
  ai,
  personalityPrompts,
  specialized,
  getAIStatus,
  rawAI
};