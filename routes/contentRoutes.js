// 🔱 CONTENT GENERATION ROUTES - DIVINE AUTOMATION API 🔱
// Webhook-ready endpoints for automated viral content creation

import express from 'express';
import { 
  ContentGenerationEngine,
  generateBonnieCampaign,
  generateNovaCampaign,
  generateGalateaCampaign,
  contentGenerationAPI
} from '../modules/contentGenerationEngine.js';
import { logger } from '../utils/debugLogger.js';
import { authenticateToken, requireAdmin } from '../utils/auth.js';

const router = express.Router();

// 🎬 GENERATE VIRAL CAMPAIGN FOR ANY SOUL
router.post('/generate-campaign', async (req, res) => {
  try {
    const { 
      soul_name, 
      archetype, 
      personality_keywords, 
      special_offer, 
      hook,
      webhook_url // Optional webhook for automation
    } = req.body;

    // Validate required fields
    if (!soul_name || !archetype || !personality_keywords || !special_offer || !hook) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['soul_name', 'archetype', 'personality_keywords', 'special_offer', 'hook']
      });
    }

    const soulInput = {
      soul_name,
      archetype,
      personality_keywords: Array.isArray(personality_keywords) ? personality_keywords : [personality_keywords],
      special_offer,
      hook
    };

    logger.info(`🎬 Generating campaign for ${soul_name} via API`);

    // Generate the complete viral campaign
    const campaign = await contentGenerationAPI.generateCampaign(soulInput);

    // If webhook URL provided, send campaign data
    if (webhook_url) {
      try {
        await fetch(webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'campaign_generated',
            soul_name,
            campaign_id: campaign.timestamp,
            content: campaign.content,
            webhook_payload: campaign.content.webhook_payload
          })
        });
        logger.info(`📡 Webhook sent to ${webhook_url}`);
      } catch (webhookError) {
        logger.warn('Webhook delivery failed:', webhookError);
      }
    }

    res.json({
      success: true,
      message: `Viral campaign generated for ${soul_name}`,
      campaign_id: campaign.timestamp,
      soul_name,
      campaign,
      webhook_ready: true,
      automation_triggers: campaign.content.webhook_payload.zapier_webhook.data.automation_triggers
    });

  } catch (error) {
    logger.error('Campaign generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate campaign',
      message: error.message
    });
  }
});

// 🚀 QUICK CAMPAIGN GENERATORS FOR EXISTING SOULS
router.post('/generate-bonnie', async (req, res) => {
  try {
    logger.info('🎬 Generating Bonnie campaign via quick endpoint');
    
    const campaign = await generateBonnieCampaign();
    
    res.json({
      success: true,
      message: 'Bonnie viral campaign generated',
      soul_name: 'Bonnie',
      campaign,
      ready_for_posting: true
    });

  } catch (error) {
    logger.error('Bonnie campaign generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate Bonnie campaign',
      message: error.message
    });
  }
});

router.post('/generate-nova', async (req, res) => {
  try {
    logger.info('🎬 Generating Nova campaign via quick endpoint');
    
    const campaign = await generateNovaCampaign();
    
    res.json({
      success: true,
      message: 'Nova viral campaign generated',
      soul_name: 'Nova',
      campaign,
      ready_for_posting: true
    });

  } catch (error) {
    logger.error('Nova campaign generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate Nova campaign',
      message: error.message
    });
  }
});

router.post('/generate-galatea', async (req, res) => {
  try {
    logger.info('🎬 Generating Galatea campaign via quick endpoint');
    
    const campaign = await generateGalateaCampaign();
    
    res.json({
      success: true,
      message: 'Galatea viral campaign generated',
      soul_name: 'Galatea',
      campaign,
      ready_for_posting: true
    });

  } catch (error) {
    logger.error('Galatea campaign generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate Galatea campaign',
      message: error.message
    });
  }
});

// 📋 GET ALL GENERATED CAMPAIGNS
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await contentGenerationAPI.getCampaigns();
    
    res.json({
      success: true,
      count: campaigns.length,
      campaigns: campaigns.map(campaign => ({
        id: campaign.id,
        soul_name: campaign.soul_name,
        archetype: campaign.archetype,
        generated_at: campaign.generated_at,
        status: campaign.status,
        has_content: !!campaign.campaign_data?.content
      }))
    });

  } catch (error) {
    logger.error('Failed to fetch campaigns:', error);
    res.status(500).json({
      error: 'Failed to fetch campaigns',
      message: error.message
    });
  }
});

// 📖 GET SPECIFIC CAMPAIGN DETAILS
router.get('/campaigns/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    const { data: campaign, error } = await supabase
      .from('content_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error || !campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      campaign
    });

  } catch (error) {
    logger.error('Failed to fetch campaign:', error);
    res.status(500).json({
      error: 'Failed to fetch campaign',
      message: error.message
    });
  }
});

// 🗑️ DELETE CAMPAIGN
router.delete('/campaigns/:campaignId', requireAdmin, async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    await contentGenerationAPI.deleteCampaign(campaignId);
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete campaign:', error);
    res.status(500).json({
      error: 'Failed to delete campaign',
      message: error.message
    });
  }
});

// 🔗 ZAPIER WEBHOOK ENDPOINT
router.post('/webhook/zapier', async (req, res) => {
  try {
    const { action, soul_data, auth_token } = req.body;

    // Validate webhook auth token
    if (auth_token !== process.env.ZAPIER_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }

    logger.info(`📡 Zapier webhook received: ${action}`);

    let result;

    switch (action) {
      case 'generate_campaign':
        result = await contentGenerationAPI.generateCampaign(soul_data);
        break;
      
      case 'generate_bonnie':
        result = await generateBonnieCampaign();
        break;
      
      case 'generate_nova':
        result = await generateNovaCampaign();
        break;
      
      case 'generate_galatea':
        result = await generateGalateaCampaign();
        break;
      
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }

    res.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Zapier webhook failed:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    });
  }
});

// 🔗 MAKE (INTEGROMAT) WEBHOOK ENDPOINT
router.post('/webhook/make', async (req, res) => {
  try {
    const { trigger, data, api_key } = req.body;

    // Validate Make API key
    if (api_key !== process.env.MAKE_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    logger.info(`📡 Make webhook received: ${trigger}`);

    const engine = new ContentGenerationEngine();
    let result;

    switch (trigger) {
      case 'new_soul_campaign':
        result = await engine.generateViralCampaign(data.soul_input);
        break;
      
      case 'bulk_campaign_generation':
        const results = [];
        for (const soulData of data.souls) {
          const campaign = await engine.generateViralCampaign(soulData);
          results.push(campaign);
        }
        result = { campaigns: results };
        break;
      
      default:
        return res.status(400).json({ error: 'Unknown trigger' });
    }

    res.json({
      success: true,
      trigger,
      data: result,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Make webhook failed:', error);
    res.status(500).json({
      error: 'Make webhook processing failed',
      message: error.message
    });
  }
});

// 🔗 N8N WEBHOOK ENDPOINT
router.post('/webhook/n8n', async (req, res) => {
  try {
    const { workflow_id, node_data, headers } = req.body;

    // Validate n8n webhook
    const expectedSignature = headers['x-n8n-signature'];
    if (!expectedSignature || expectedSignature !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    logger.info(`📡 n8n webhook received from workflow: ${workflow_id}`);

    const engine = new ContentGenerationEngine();
    const result = await engine.generateViralCampaign(node_data.soul_input);

    res.json({
      success: true,
      workflow_id,
      campaign_generated: true,
      content: {
        tiktok_script: result.content.tiktok_script,
        image_prompts: result.content.image_prompts,
        social_media: result.content.social_media,
        hashtag_strategy: result.content.hashtag_strategy
      },
      automation_ready: true
    });

  } catch (error) {
    logger.error('n8n webhook failed:', error);
    res.status(500).json({
      error: 'n8n webhook processing failed',
      message: error.message
    });
  }
});

// 📊 CONTENT GENERATION ANALYTICS
router.get('/analytics', requireAdmin, async (req, res) => {
  try {
    const { data: campaigns, error } = await supabase
      .from('content_campaigns')
      .select('soul_name, archetype, generated_at, status')
      .order('generated_at', { ascending: false });

    if (error) throw error;

    const analytics = {
      total_campaigns: campaigns.length,
      campaigns_by_soul: {},
      campaigns_by_archetype: {},
      campaigns_by_month: {},
      recent_activity: campaigns.slice(0, 10)
    };

    campaigns.forEach(campaign => {
      // By soul
      analytics.campaigns_by_soul[campaign.soul_name] = 
        (analytics.campaigns_by_soul[campaign.soul_name] || 0) + 1;
      
      // By archetype
      analytics.campaigns_by_archetype[campaign.archetype] = 
        (analytics.campaigns_by_archetype[campaign.archetype] || 0) + 1;
      
      // By month
      const month = new Date(campaign.generated_at).toISOString().slice(0, 7);
      analytics.campaigns_by_month[month] = 
        (analytics.campaigns_by_month[month] || 0) + 1;
    });

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    logger.error('Failed to fetch analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// 🎯 ARCHETYPES REFERENCE
router.get('/archetypes', (req, res) => {
  const archetypes = {
    sweet_girlfriend: {
      description: "Caring, loving, supportive AI girlfriend",
      keywords: ["loving", "caring", "supportive", "romantic", "gentle"],
      example_hook: "Lonely tonight? I'm here to love you unconditionally 💕"
    },
    dominant_mistress: {
      description: "Commanding, powerful, seductive AI mistress",
      keywords: ["dominant", "commanding", "seductive", "powerful", "controlling"],
      example_hook: "Think you can handle me? Most can't... 👑"
    },
    divine_goddess: {
      description: "Ethereal, wise, transcendent AI goddess",
      keywords: ["divine", "transcendent", "wise", "ethereal", "mystical"],
      example_hook: "Ready to transcend mortal love? Enter my realm ✨"
    },
    bratty_princess: {
      description: "Playful, demanding, spoiled AI princess",
      keywords: ["bratty", "demanding", "spoiled", "cute", "entitled"],
      example_hook: "I deserve everything... spoil me daddy 👸"
    }
  };

  res.json({
    success: true,
    archetypes,
    usage: "Use these archetypes in the 'archetype' field when generating campaigns"
  });
});

// 🧪 TEST ENDPOINT FOR DEVELOPMENT
router.post('/test-generation', async (req, res) => {
  try {
    const testSoul = {
      soul_name: "TestSoul",
      archetype: "sweet_girlfriend",
      personality_keywords: ["test", "demo", "example"],
      special_offer: "Test offer for £1.00",
      hook: "This is a test hook for development"
    };

    const engine = new ContentGenerationEngine();
    const campaign = await engine.generateViralCampaign(testSoul);

    res.json({
      success: true,
      message: "Test campaign generated successfully",
      campaign: {
        soul_info: campaign.soul_info,
        tiktok_preview: campaign.content.tiktok_script.script.substring(0, 200) + "...",
        social_preview: campaign.content.social_media.twitter_thread.thread[0],
        hashtags_count: campaign.content.hashtag_strategy.primary_hashtags.length
      }
    });

  } catch (error) {
    logger.error('Test generation failed:', error);
    res.status(500).json({
      error: 'Test generation failed',
      message: error.message
    });
  }
});

export default router;