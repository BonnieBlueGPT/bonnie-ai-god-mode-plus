// 🔱 CORE/STRIPE.JS - PAYMENT PROCESSING INFRASTRUCTURE 🔱
// Pure Stripe payment operations & webhook handling
// Isolated from business logic - only handles payments
// Path: C:\Users\Gamer\bonnie-ai\bonnie-ai-god-mode-plus\backend\core\stripe.js

import Stripe from 'stripe';
import { logger } from '../utils/debugLogger.js';

// 💳 Stripe Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

// 🌟 Stripe Client
let stripe = null;
let isInitialized = false;

// 🔧 Initialize Stripe Service
export async function initializeStripe() {
  try {
    logger.info('💳 Initializing Stripe payment system...');
    
    if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      logger.warn('⚠️ Stripe secret key not configured - payments disabled');
      return false;
    }
    
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      appInfo: {
        name: 'Galatea Empire',
        version: '1.0.0'
      }
    });
    
    // Test the connection
    await stripe.accounts.retrieve();
    
    isInitialized = true;
    logger.info('✅ Stripe payment system ready');
    return true;
  } catch (error) {
    logger.error('❌ Stripe initialization failed:', error);
    isInitialized = false;
    return false;
  }
}

// 💳 PAYMENT PROCESSING
export const payments = {
  
  // Create payment intent
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          ...metadata,
          service: 'galatea-empire'
        },
        automatic_payment_methods: {
          enabled: true
        }
      });
      
      logger.info('💳 Payment intent created:', { 
        id: paymentIntent.id, 
        amount: amount,
        currency 
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        currency
      };
    } catch (error) {
      logger.error('Payment intent creation failed:', error);
      return null;
    }
  },
  
  // Create checkout session
  async createCheckoutSession(priceId, successUrl, cancelUrl, metadata = {}) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          ...metadata,
          service: 'galatea-empire'
        }
      });
      
      logger.info('🛒 Checkout session created:', { 
        id: session.id, 
        url: session.url 
      });
      
      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      logger.error('Checkout session creation failed:', error);
      return null;
    }
  },
  
  // Retrieve payment intent
  async getPaymentIntent(paymentIntentId) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Payment intent retrieval failed:', error);
      return null;
    }
  },
  
  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });
      
      logger.info('✅ Payment confirmed:', { id: paymentIntentId });
      return paymentIntent;
    } catch (error) {
      logger.error('Payment confirmation failed:', error);
      return null;
    }
  }
};

// 💰 PRODUCT & PRICING MANAGEMENT
export const products = {
  
  // Create product
  async create(name, description, images = []) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const product = await stripe.products.create({
        name,
        description,
        images,
        metadata: {
          service: 'galatea-empire'
        }
      });
      
      logger.info('🎁 Product created:', { id: product.id, name });
      return product;
    } catch (error) {
      logger.error('Product creation failed:', error);
      return null;
    }
  },
  
  // Create price for product
  async createPrice(productId, amount, currency = 'usd', recurring = null) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const priceData = {
        product: productId,
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency
      };
      
      if (recurring) {
        priceData.recurring = recurring;
      }
      
      const price = await stripe.prices.create(priceData);
      
      logger.info('💰 Price created:', { 
        id: price.id, 
        amount, 
        currency 
      });
      
      return price;
    } catch (error) {
      logger.error('Price creation failed:', error);
      return null;
    }
  },
  
  // List all products
  async list(limit = 100) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const products = await stripe.products.list({ limit });
      return products.data;
    } catch (error) {
      logger.error('Product listing failed:', error);
      return [];
    }
  }
};

// 🔄 WEBHOOK PROCESSING
export const webhooks = {
  
  // Verify webhook signature
  verifySignature(payload, signature) {
    try {
      if (!STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET === 'whsec_placeholder') {
        logger.warn('⚠️ Webhook secret not configured - skipping verification');
        return JSON.parse(payload);
      }
      
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
      
      return event;
    } catch (error) {
      logger.error('Webhook verification failed:', error);
      return null;
    }
  },
  
  // Process webhook event
  async processEvent(event) {
    try {
      logger.info('🔔 Processing webhook event:', { 
        type: event.type, 
        id: event.id 
      });
      
      switch (event.type) {
        case 'payment_intent.succeeded':
          return await this.handlePaymentSuccess(event.data.object);
          
        case 'payment_intent.payment_failed':
          return await this.handlePaymentFailed(event.data.object);
          
        case 'checkout.session.completed':
          return await this.handleCheckoutCompleted(event.data.object);
          
        case 'customer.subscription.created':
          return await this.handleSubscriptionCreated(event.data.object);
          
        case 'customer.subscription.deleted':
          return await this.handleSubscriptionCancelled(event.data.object);
          
        default:
          logger.info(`Unhandled webhook event: ${event.type}`);
          return { handled: false, type: event.type };
      }
    } catch (error) {
      logger.error('Webhook processing failed:', error);
      return { error: error.message };
    }
  },
  
  // Handle successful payment
  async handlePaymentSuccess(paymentIntent) {
    logger.info('✅ Payment succeeded:', { 
      id: paymentIntent.id, 
      amount: paymentIntent.amount / 100 
    });
    
    return {
      handled: true,
      type: 'payment_success',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      metadata: paymentIntent.metadata
    };
  },
  
  // Handle failed payment
  async handlePaymentFailed(paymentIntent) {
    logger.warn('❌ Payment failed:', { 
      id: paymentIntent.id, 
      lastError: paymentIntent.last_payment_error 
    });
    
    return {
      handled: true,
      type: 'payment_failed',
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error,
      metadata: paymentIntent.metadata
    };
  },
  
  // Handle checkout completion
  async handleCheckoutCompleted(session) {
    logger.info('🛒 Checkout completed:', { 
      id: session.id, 
      amount: session.amount_total / 100 
    });
    
    return {
      handled: true,
      type: 'checkout_completed',
      sessionId: session.id,
      amount: session.amount_total / 100,
      metadata: session.metadata
    };
  },
  
  // Handle subscription created
  async handleSubscriptionCreated(subscription) {
    logger.info('🔄 Subscription created:', { 
      id: subscription.id, 
      customer: subscription.customer 
    });
    
    return {
      handled: true,
      type: 'subscription_created',
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      metadata: subscription.metadata
    };
  },
  
  // Handle subscription cancelled
  async handleSubscriptionCancelled(subscription) {
    logger.info('🔄 Subscription cancelled:', { 
      id: subscription.id, 
      customer: subscription.customer 
    });
    
    return {
      handled: true,
      type: 'subscription_cancelled',
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      metadata: subscription.metadata
    };
  }
};

// 👤 CUSTOMER MANAGEMENT
export const customers = {
  
  // Create customer
  async create(email, name = null, metadata = {}) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          service: 'galatea-empire'
        }
      });
      
      logger.info('👤 Customer created:', { id: customer.id, email });
      return customer;
    } catch (error) {
      logger.error('Customer creation failed:', error);
      return null;
    }
  },
  
  // Get customer
  async get(customerId) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const customer = await stripe.customers.retrieve(customerId);
      return customer;
    } catch (error) {
      logger.error('Customer retrieval failed:', error);
      return null;
    }
  },
  
  // Update customer
  async update(customerId, updates) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const customer = await stripe.customers.update(customerId, updates);
      logger.info('👤 Customer updated:', { id: customerId });
      return customer;
    } catch (error) {
      logger.error('Customer update failed:', error);
      return null;
    }
  }
};

// 📊 ANALYTICS & REPORTING
export const analytics = {
  
  // Get payment analytics
  async getPaymentStats(startDate, endDate) {
    try {
      if (!isInitialized) {
        throw new Error('Stripe not initialized');
      }
      
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });
      
      const stats = {
        totalAmount: 0,
        totalCharges: charges.data.length,
        successfulCharges: 0,
        failedCharges: 0
      };
      
      charges.data.forEach(charge => {
        stats.totalAmount += charge.amount / 100;
        if (charge.paid) {
          stats.successfulCharges++;
        } else {
          stats.failedCharges++;
        }
      });
      
      return stats;
    } catch (error) {
      logger.error('Payment analytics failed:', error);
      return null;
    }
  }
};

// 📊 SERVICE STATUS
export function getStripeStatus() {
  return {
    isInitialized,
    publishableKey: STRIPE_PUBLISHABLE_KEY.substring(0, 12) + '...',
    webhookConfigured: STRIPE_WEBHOOK_SECRET !== 'whsec_placeholder',
    environment: STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'live' : 'test',
    lastCheck: new Date().toISOString()
  };
}

// 🔄 Raw Stripe client access
export { stripe as rawStripe };

export default {
  initializeStripe,
  payments,
  products,
  webhooks,
  customers,
  analytics,
  getStripeStatus
};