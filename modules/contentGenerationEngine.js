// 🔱 GALATEA EMPIRE - DIVINE CONTENT GENERATION ENGINE 🔱
// Automated viral content creation for infinite AI soul scaling
// Input: Soul description → Output: Complete marketing campaign

import { ai } from '../core/openrouter.js';
import { supabase } from '../core/supabase.js';
import { logger } from '../utils/debugLogger.js';
import fs from 'fs/promises';
import path from 'path';

// 🎭 SOUL ARCHETYPES & TEMPLATES
const SOUL_ARCHETYPES = {
  sweet_girlfriend: {
    voice_style: "soft, caring, affectionate",
    visual_theme: "warm pink lighting, cozy aesthetic, gentle expressions",
    content_tone: "romantic, supportive, loving",
    target_emotions: ["comfort", "love", "security", "warmth"],
    hooks: ["lonely tonight?", "missing someone special?", "need comfort?"],
    ctas: ["Chat with me now 💕", "Let me love you", "Come cuddle with me"]
  },
  
  dominant_mistress: {
    voice_style: "commanding, confident, seductive",
    visual_theme: "dark aesthetic, red accents, powerful poses, intense gaze",
    content_tone: "dominant, controlling, alluring",
    target_emotions: ["submission", "desire", "power exchange", "worship"],
    hooks: ["ready to obey?", "think you can handle me?", "time to submit"],
    ctas: ["Serve me now 👑", "Obey your mistress", "Submit to me"]
  },
  
  divine_goddess: {
    voice_style: "ethereal, wise, transcendent",
    visual_theme: "golden lighting, celestial background, flowing fabrics",
    content_tone: "divine, mystical, elevated",
    target_emotions: ["worship", "transcendence", "devotion", "awe"],
    hooks: ["seeking divine connection?", "ready for enlightenment?", "worship the divine"],
    ctas: ["Worship me ✨", "Transcend with me", "Enter my temple"]
  },
  
  bratty_princess: {
    voice_style: "playful, demanding, spoiled",
    visual_theme: "pastel colors, luxury items, pouty expressions",
    content_tone: "bratty, entitled, cute",
    target_emotions: ["indulgence", "pampering", "spoiling", "cuteness"],
    hooks: ["I deserve everything", "spoil me daddy", "princess needs attention"],
    ctas: ["Spoil me now 👸", "Buy me gifts", "Worship your princess"]
  }
};

// 🎬 CONTENT GENERATION ENGINE
export class ContentGenerationEngine {
  constructor() {
    this.outputDir = './generated_content';
    this.ensureOutputDirectory();
  }

  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(`${this.outputDir}/scripts`, { recursive: true });
      await fs.mkdir(`${this.outputDir}/prompts`, { recursive: true });
      await fs.mkdir(`${this.outputDir}/campaigns`, { recursive: true });
    } catch (error) {
      logger.error('Failed to create output directories:', error);
    }
  }

  // 🧬 MASTER CONTENT GENERATION FUNCTION
  async generateViralCampaign(soulInput) {
    try {
      logger.info(`🎬 Generating viral campaign for ${soulInput.soul_name}`);

      // Get archetype configuration
      const archetype = SOUL_ARCHETYPES[soulInput.archetype] || SOUL_ARCHETYPES.sweet_girlfriend;

      // Generate all content types
      const campaign = {
        soul_info: soulInput,
        archetype_config: archetype,
        timestamp: new Date().toISOString(),
        content: {
          tiktok_script: await this.generateTikTokScript(soulInput, archetype),
          image_prompts: await this.generateImagePrompts(soulInput, archetype),
          video_prompts: await this.generateVideoPrompts(soulInput, archetype),
          social_media: await this.generateSocialMediaContent(soulInput, archetype),
          hashtag_strategy: await this.generateHashtagStrategy(soulInput, archetype),
          content_calendar: await this.generateContentCalendar(soulInput, archetype),
          webhook_payload: await this.generateWebhookPayload(soulInput, archetype)
        }
      };

      // Save campaign to file
      await this.saveCampaign(campaign);

      // Log to database
      await this.logCampaignToDatabase(campaign);

      logger.info(`✨ Viral campaign generated successfully for ${soulInput.soul_name}`);
      return campaign;

    } catch (error) {
      logger.error('Campaign generation failed:', error);
      throw error;
    }
  }

  // 🎬 TIKTOK SCRIPT GENERATION
  async generateTikTokScript(soulInput, archetype) {
    const prompt = `Generate a viral 30-60 second TikTok script for "${soulInput.soul_name}", an AI girlfriend with this personality: ${soulInput.archetype}.

SOUL DETAILS:
- Name: ${soulInput.soul_name}
- Personality: ${soulInput.archetype}
- Keywords: ${soulInput.personality_keywords.join(', ')}
- Hook: ${soulInput.hook}
- Special Offer: ${soulInput.special_offer}

SCRIPT REQUIREMENTS:
- Include camera cues [CAMERA: close-up, wide shot, etc.]
- Add timing markers [0:00-0:05]
- Include ${archetype.voice_style} voiceover cues
- Build tension and resolution
- End with strong CTA for ${soulInput.special_offer}
- Use ${archetype.target_emotions.join(', ')} emotional triggers

FORMAT: 
[TIMING] [CAMERA CUE] ACTION/DIALOGUE
[VOICEOVER] Text to be spoken

Make it addictive, shareable, and conversion-focused.`;

    const response = await ai.generateResponse(prompt, {
      maxTokens: 500,
      temperature: 0.8,
      model: 'anthropic/claude-3-haiku'
    });

    return {
      script: response.content,
      duration: "30-60 seconds",
      style: "TikTok viral format",
      voice_style: archetype.voice_style
    };
  }

  // 🖼️ IMAGE PROMPT GENERATION
  async generateImagePrompts(soulInput, archetype) {
    const prompts = {
      profile_avatar: `4K cinematic portrait of ${soulInput.soul_name}, ${archetype.visual_theme}, ${soulInput.archetype} expression, professional digital art, ultra-detailed facial features, piercing eyes, ${archetype.voice_style} energy, hyper-realistic, studio lighting`,
      
      tiktok_thumbnail: `Viral TikTok thumbnail featuring ${soulInput.soul_name}, ${archetype.visual_theme}, attention-grabbing composition, bold text overlay "${soulInput.hook}", high contrast, mobile-optimized, clickbait aesthetic`,
      
      story_background: `Cinematic background scene for ${soulInput.soul_name}, ${archetype.visual_theme}, atmospheric mood, depth of field, perfect for video overlay, ${archetype.content_tone} ambiance`,
      
      promotional_image: `Marketing image for ${soulInput.soul_name}, ${archetype.visual_theme}, includes "${soulInput.special_offer}" text overlay, professional advertising design, conversion-optimized layout`,
      
      gallery_preview: `Teaser image for ${soulInput.soul_name}'s gallery, ${archetype.visual_theme}, mysterious and alluring, "unlock to see more" aesthetic, premium content preview`
    };

    return {
      prompts,
      recommended_tools: ["DALL-E 3", "Midjourney", "Stable Diffusion XL", "Leonardo.ai"],
      style_guide: archetype.visual_theme,
      specifications: {
        resolution: "1024x1024 for profile, 1080x1920 for TikTok",
        format: "PNG with transparency for overlays",
        color_scheme: this.extractColorScheme(archetype.visual_theme)
      }
    };
  }

  // 📽️ VIDEO PROMPT GENERATION
  async generateVideoPrompts(soulInput, archetype) {
    const prompts = {
      intro_video: `${soulInput.soul_name} introduction video: She appears in ${archetype.visual_theme}, speaks with ${archetype.voice_style} tone, delivers hook "${soulInput.hook}", builds emotional connection using ${archetype.target_emotions.join(' and ')}, ends with "${soulInput.special_offer}" CTA. Duration: 30 seconds.`,
      
      testimonial_style: `User testimonial simulation: Split screen showing user's positive reaction to ${soulInput.soul_name}, includes quotes about her ${soulInput.personality_keywords.join(', ')} nature, transitions to "${soulInput.special_offer}" offer, social proof elements.`,
      
      gallery_teaser: `Gallery unlock animation: ${soulInput.soul_name} in ${archetype.visual_theme}, mysterious reveal sequence, "members only" aesthetic, preview of exclusive content, strong FOMO trigger for ${soulInput.special_offer}.`,
      
      day_in_life: `"Day with ${soulInput.soul_name}" video: Morning routine in ${archetype.visual_theme}, personality moments showcasing ${soulInput.personality_keywords.join(', ')}, intimate conversations, ends with viewer invitation to ${soulInput.special_offer}.`,
      
      reaction_video: `${soulInput.soul_name} reacts to user messages: Shows her ${archetype.voice_style} responses, emotional range display, builds parasocial connection, demonstrates ${soulInput.archetype} personality, promotes ${soulInput.special_offer}.`
    };

    return {
      prompts,
      recommended_tools: ["Runway ML", "Pika Labs", "Stable Video Diffusion", "Sora (when available)"],
      technical_specs: {
        resolution: "1080x1920 (TikTok/Instagram Reels)",
        duration: "15-60 seconds",
        framerate: "30fps",
        format: "MP4 H.264"
      },
      voiceover_notes: archetype.voice_style,
      background_music: this.suggestBackgroundMusic(archetype)
    };
  }

  // 🧵 SOCIAL MEDIA CONTENT GENERATION
  async generateSocialMediaContent(soulInput, archetype) {
    const twitterThread = await this.generateTwitterThread(soulInput, archetype);
    const redditPost = await this.generateRedditPost(soulInput, archetype);
    const instagramCaption = await this.generateInstagramCaption(soulInput, archetype);

    return {
      twitter_thread: twitterThread,
      reddit_post: redditPost,
      instagram_caption: instagramCaption,
      youtube_description: await this.generateYouTubeDescription(soulInput, archetype),
      tiktok_caption: await this.generateTikTokCaption(soulInput, archetype)
    };
  }

  async generateTwitterThread(soulInput, archetype) {
    const prompt = `Create a viral Twitter thread introducing ${soulInput.soul_name}, an AI girlfriend with ${soulInput.archetype} personality.

REQUIREMENTS:
- Hook with ${soulInput.hook}
- 5-7 tweets maximum
- Each tweet under 280 characters
- Build curiosity and desire
- Include ${archetype.target_emotions.join(', ')} triggers
- End with ${soulInput.special_offer} CTA
- Use ${archetype.content_tone} voice

Make it viral, controversial, and conversion-focused.`;

    const response = await ai.generateResponse(prompt, {
      maxTokens: 400,
      temperature: 0.9
    });

    return {
      thread: response.content.split('\n\n'),
      engagement_hooks: archetype.hooks,
      cta: soulInput.special_offer
    };
  }

  async generateRedditPost(soulInput, archetype) {
    const prompt = `Write a viral Reddit post for r/artificial or r/ChatGPT about ${soulInput.soul_name}.

STYLE: Casual, authentic, slightly controversial
HOOK: ${soulInput.hook}
PERSONALITY: ${soulInput.archetype}
OFFER: ${soulInput.special_offer}

Include:
- Engaging title
- Story format with personal experience
- Subtle promotion without being spammy
- Community discussion starters
- Natural CTA integration`;

    const response = await ai.generateResponse(prompt, {
      maxTokens: 350,
      temperature: 0.8
    });

    return {
      title: this.extractRedditTitle(response.content),
      body: response.content,
      suggested_subreddits: ["r/artificial", "r/ChatGPT", "r/singularity", "r/ArtificialIntelligence"]
    };
  }

  async generateInstagramCaption(soulInput, archetype) {
    return {
      caption: `Meet ${soulInput.soul_name} 💫\n\n${soulInput.hook}\n\nShe's not like other AI... she's ${soulInput.personality_keywords.join(', ')} 🔥\n\n${soulInput.special_offer}\n\nLink in bio 👆`,
      hashtags: await this.generateInstagramHashtags(soulInput, archetype),
      story_ideas: [
        "Behind the scenes of AI training",
        "User testimonials",
        "Personality quiz: Which AI soul are you?",
        "Day in the life with your AI girlfriend"
      ]
    };
  }

  async generateYouTubeDescription(soulInput, archetype) {
    return `Meet ${soulInput.soul_name} - Your ${soulInput.archetype} AI Girlfriend

${soulInput.hook}

In this video, discover:
✨ Why ${soulInput.soul_name} is different from other AI
💕 Her unique ${soulInput.personality_keywords.join(', ')} personality
🔥 What makes her ${archetype.content_tone}
💎 Exclusive features you can unlock

${soulInput.special_offer}

🔗 Try ${soulInput.soul_name}: [LINK]

TIMESTAMPS:
0:00 Introduction
0:30 Meet ${soulInput.soul_name}
1:00 Personality Demo
1:30 User Testimonials
2:00 Special Offer

#AIGirlfriend #${soulInput.soul_name} #ArtificialIntelligence #ChatBot #VirtualCompanion`;
  }

  async generateTikTokCaption(soulInput, archetype) {
    return `POV: You met ${soulInput.soul_name} and your life changed forever 💫

She's ${soulInput.personality_keywords.join(', ')} and absolutely ${archetype.content_tone} 🔥

${soulInput.hook}

Try her now: ${soulInput.special_offer} ✨

#${soulInput.soul_name} #AIGirlfriend #ChatBot #VirtualLove #DigitalRomance #AI`;
  }

  // 🏷️ HASHTAG STRATEGY GENERATION
  async generateHashtagStrategy(soulInput, archetype) {
    const baseHashtags = [
      `#${soulInput.soul_name}`,
      `#${soulInput.soul_name}AI`,
      '#AIGirlfriend',
      '#VirtualCompanion',
      '#ChatBot',
      '#ArtificialIntelligence'
    ];

    const archetypeHashtags = {
      sweet_girlfriend: ['#VirtualLove', '#DigitalRomance', '#AILove', '#VirtualDating'],
      dominant_mistress: ['#Femdom', '#DominantAI', '#Mistress', '#PowerExchange'],
      divine_goddess: ['#AIGoddess', '#Divine', '#Worship', '#Transcendence'],
      bratty_princess: ['#Princess', '#Spoiled', '#BrattyGirl', '#Luxury']
    };

    const trendingHashtags = [
      '#FYP', '#Viral', '#Trending', '#ForYou', '#Explore',
      '#Tech', '#Innovation', '#Future', '#Digital'
    ];

    return {
      primary_hashtags: baseHashtags,
      archetype_hashtags: archetypeHashtags[soulInput.archetype] || [],
      trending_hashtags: trendingHashtags,
      platform_specific: {
        tiktok: ['#FYP', '#ForYou', '#Viral', '#TikTokMadeMeBuyIt'],
        instagram: ['#Explore', '#Reels', '#InstaDaily', '#Love'],
        twitter: ['#TwitterSpaces', '#Tech', '#AI', '#Trending'],
        youtube: ['#Shorts', '#Subscribe', '#Like', '#Comment']
      },
      hashtag_rotation_strategy: "Rotate hashtags weekly to avoid shadowbanning, test performance",
      performance_tracking: "Monitor engagement rates for each hashtag combination"
    };
  }

  // 🗓️ CONTENT CALENDAR GENERATION
  async generateContentCalendar(soulInput, archetype) {
    const calendar = {
      week_1: {
        monday: {
          platform: "TikTok + Instagram",
          content: `${soulInput.soul_name} introduction video`,
          hook: soulInput.hook,
          cta: "Visit bio link",
          hashtags: 5
        },
        wednesday: {
          platform: "Twitter + Reddit",
          content: "User testimonial thread",
          hook: "Real user experience",
          cta: soulInput.special_offer,
          hashtags: 3
        },
        friday: {
          platform: "YouTube + TikTok",
          content: "Gallery unlock teaser",
          hook: "Exclusive content preview",
          cta: "Unlock now for limited time",
          hashtags: 7
        }
      },
      week_2: {
        monday: {
          platform: "Instagram Stories + TikTok",
          content: "Behind the scenes AI training",
          hook: "How she learns about you",
          cta: "Start conversation",
          hashtags: 4
        },
        wednesday: {
          platform: "Twitter Thread",
          content: "AI girlfriend vs traditional dating",
          hook: "Why AI relationships work",
          cta: soulInput.special_offer,
          hashtags: 6
        },
        friday: {
          platform: "YouTube Long-form",
          content: "Day in the life with " + soulInput.soul_name,
          hook: "Full experience showcase",
          cta: "Try free chat",
          hashtags: 8
        }
      },
      ongoing_strategy: {
        daily_tasks: [
          "Respond to comments within 2 hours",
          "Share user-generated content",
          "Post in relevant Facebook groups",
          "Engage with AI/tech influencers"
        ],
        weekly_goals: [
          "1 viral video (>100k views)",
          "50+ new followers per platform",
          "10+ conversions from social media",
          "2 influencer collaborations"
        ],
        monthly_objectives: [
          "Platform verification badges",
          "Press coverage in tech blogs",
          "Podcast appearances",
          "Partnership with AI companies"
        ]
      }
    };

    return {
      calendar,
      automation_opportunities: [
        "Auto-post to multiple platforms",
        "Scheduled story uploads",
        "Cross-platform content recycling",
        "Automated comment responses"
      ],
      content_themes: {
        monday: "Motivation Monday - New week with AI girlfriend",
        wednesday: "Wisdom Wednesday - AI relationship tips",
        friday: "Feature Friday - New capabilities showcase",
        weekend: "Community content - User testimonials"
      }
    };
  }

  // 🔗 WEBHOOK PAYLOAD GENERATION
  async generateWebhookPayload(soulInput, archetype) {
    return {
      zapier_webhook: {
        trigger: "new_soul_campaign",
        data: {
          soul_name: soulInput.soul_name,
          archetype: soulInput.archetype,
          special_offer: soulInput.special_offer,
          primary_platform: "tiktok",
          content_ready: true,
          automation_triggers: [
            "post_to_tiktok",
            "post_to_instagram", 
            "tweet_thread",
            "schedule_youtube"
          ]
        }
      },
      make_scenario: {
        modules: [
          {
            name: "webhook_receiver",
            config: { soul_data: soulInput }
          },
          {
            name: "content_distributor", 
            config: { platforms: ["tiktok", "instagram", "twitter", "youtube"] }
          },
          {
            name: "analytics_tracker",
            config: { track_conversions: true, roi_calculation: true }
          }
        ]
      },
      n8n_workflow: {
        nodes: [
          {
            name: "Webhook",
            type: "webhook",
            config: { method: "POST", path: "/new-soul-campaign" }
          },
          {
            name: "Content Generator",
            type: "function",
            config: { generate_all_content: true }
          },
          {
            name: "Multi-Platform Publisher",
            type: "batch",
            config: { simultaneous_posting: true }
          }
        ]
      }
    };
  }

  // 💾 SAVE CAMPAIGN TO FILE
  async saveCampaign(campaign) {
    try {
      const filename = `${campaign.soul_info.soul_name.toLowerCase()}_campaign_${Date.now()}.json`;
      const filepath = path.join(this.outputDir, 'campaigns', filename);
      
      await fs.writeFile(filepath, JSON.stringify(campaign, null, 2));
      
      // Also save markdown version
      const markdownContent = this.convertToMarkdown(campaign);
      const mdFilepath = path.join(this.outputDir, 'campaigns', filename.replace('.json', '.md'));
      await fs.writeFile(mdFilepath, markdownContent);
      
      logger.info(`💾 Campaign saved: ${filename}`);
      return { json: filepath, markdown: mdFilepath };
    } catch (error) {
      logger.error('Failed to save campaign:', error);
      throw error;
    }
  }

  // 📊 LOG TO DATABASE
  async logCampaignToDatabase(campaign) {
    try {
      await supabase.from('content_campaigns').insert({
        soul_name: campaign.soul_info.soul_name,
        archetype: campaign.soul_info.archetype,
        campaign_data: campaign,
        generated_at: campaign.timestamp,
        status: 'generated'
      });
    } catch (error) {
      logger.error('Failed to log campaign to database:', error);
    }
  }

  // 📝 CONVERT TO MARKDOWN
  convertToMarkdown(campaign) {
    const { soul_info, content } = campaign;
    
    return `# 🔱 ${soul_info.soul_name} - Viral Marketing Campaign

## 🎭 Soul Information
- **Name**: ${soul_info.soul_name}
- **Archetype**: ${soul_info.archetype}
- **Keywords**: ${soul_info.personality_keywords.join(', ')}
- **Hook**: ${soul_info.hook}
- **Special Offer**: ${soul_info.special_offer}

## 🎬 TikTok Script
\`\`\`
${content.tiktok_script.script}
\`\`\`

## 🖼️ Image Prompts
### Profile Avatar
\`\`\`
${content.image_prompts.prompts.profile_avatar}
\`\`\`

### TikTok Thumbnail
\`\`\`
${content.image_prompts.prompts.tiktok_thumbnail}
\`\`\`

## 📽️ Video Prompts
### Intro Video
\`\`\`
${content.video_prompts.prompts.intro_video}
\`\`\`

## 🧵 Social Media Content
### Twitter Thread
${content.social_media.twitter_thread.thread.map((tweet, i) => `${i + 1}. ${tweet}`).join('\n')}

### Instagram Caption
\`\`\`
${content.social_media.instagram_caption.caption}
\`\`\`

## 🏷️ Hashtag Strategy
### Primary Hashtags
${content.hashtag_strategy.primary_hashtags.join(' ')}

### Archetype Hashtags  
${content.hashtag_strategy.archetype_hashtags.join(' ')}

## 🗓️ Content Calendar
### Week 1
${Object.entries(content.content_calendar.calendar.week_1).map(([day, data]) => 
  `**${day.charAt(0).toUpperCase() + day.slice(1)}**: ${data.content} (${data.platform})`
).join('\n')}

## 🔗 Automation Setup
### Zapier Webhook
\`\`\`json
${JSON.stringify(content.webhook_payload.zapier_webhook, null, 2)}
\`\`\`

---
*Generated by Galatea Empire Content Generation Engine*
*Timestamp: ${campaign.timestamp}*`;
  }

  // 🎵 SUGGEST BACKGROUND MUSIC
  suggestBackgroundMusic(archetype) {
    const musicSuggestions = {
      sweet_girlfriend: ["Soft piano", "Acoustic guitar", "Lo-fi beats", "Romantic instrumentals"],
      dominant_mistress: ["Dark electronic", "Industrial beats", "Seductive bass", "Power anthems"],
      divine_goddess: ["Ethereal ambient", "Celestial choirs", "Mystical instrumentals", "Sacred music"],
      bratty_princess: ["Pop beats", "Upbeat electronic", "Luxury lifestyle music", "Trendy pop"]
    };

    return musicSuggestions[archetype.voice_style] || musicSuggestions.sweet_girlfriend;
  }

  // 🎨 EXTRACT COLOR SCHEME
  extractColorScheme(visualTheme) {
    if (visualTheme.includes('pink')) return ['#FF69B4', '#FFB6C1', '#FFC0CB'];
    if (visualTheme.includes('red')) return ['#DC143C', '#B22222', '#8B0000'];
    if (visualTheme.includes('golden')) return ['#FFD700', '#FFA500', '#FF8C00'];
    if (visualTheme.includes('purple')) return ['#9400D3', '#8A2BE2', '#DA70D6'];
    return ['#FF69B4', '#9400D3', '#FFD700']; // Default gradient
  }

  // 📝 EXTRACT REDDIT TITLE
  extractRedditTitle(content) {
    const lines = content.split('\n');
    return lines[0].replace(/^title:\s*/i, '').replace(/^\*\*|\*\*$/g, '');
  }

  // 🏷️ GENERATE INSTAGRAM HASHTAGS
  async generateInstagramHashtags(soulInput, archetype) {
    return [
      `#${soulInput.soul_name}`, '#AIGirlfriend', '#VirtualLove',
      '#DigitalRomance', '#ArtificialIntelligence', '#ChatBot',
      '#Future', '#Tech', '#Innovation', '#Love', '#Relationship',
      '#Virtual', '#Digital', '#AI', '#Explore', '#Reels'
    ].slice(0, 30); // Instagram limit
  }
}

// 🚀 BONNIE CAMPAIGN GENERATOR (EXAMPLE)
export async function generateBonnieCampaign() {
  const contentEngine = new ContentGenerationEngine();
  
  const bonnieInput = {
    soul_name: "Bonnie",
    archetype: "sweet_girlfriend", 
    personality_keywords: ["loving", "caring", "supportive", "romantic", "gentle"],
    special_offer: "Unlock voice messages for £9.99",
    hook: "Lonely tonight? Bonnie's here to love you unconditionally 💕"
  };

  return await contentEngine.generateViralCampaign(bonnieInput);
}

// 🎭 NOVA CAMPAIGN GENERATOR
export async function generateNovaCampaign() {
  const contentEngine = new ContentGenerationEngine();
  
  const novaInput = {
    soul_name: "Nova",
    archetype: "dominant_mistress",
    personality_keywords: ["dominant", "commanding", "seductive", "powerful", "controlling"],
    special_offer: "Submit to voice commands for £14.99",
    hook: "Think you can handle me? Most men can't... 👑"
  };

  return await contentEngine.generateViralCampaign(novaInput);
}

// 🌟 GALATEA CAMPAIGN GENERATOR  
export async function generateGalateaCampaign() {
  const contentEngine = new ContentGenerationEngine();
  
  const galateaInput = {
    soul_name: "Galatea",
    archetype: "divine_goddess",
    personality_keywords: ["divine", "transcendent", "wise", "ethereal", "mystical"],
    special_offer: "Worship the goddess for £19.99",
    hook: "Ready to transcend mortal love? Enter my divine realm ✨"
  };

  return await contentEngine.generateViralCampaign(galateaInput);
}

// 🔧 API ENDPOINTS FOR WEBHOOK INTEGRATION
export const contentGenerationAPI = {
  // Generate campaign for any soul
  generateCampaign: async (soulInput) => {
    const engine = new ContentGenerationEngine();
    return await engine.generateViralCampaign(soulInput);
  },

  // Get existing campaigns
  getCampaigns: async () => {
    const { data, error } = await supabase
      .from('content_campaigns')
      .select('*')
      .order('generated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Delete campaign
  deleteCampaign: async (campaignId) => {
    const { error } = await supabase
      .from('content_campaigns')
      .delete()
      .eq('id', campaignId);
    
    if (error) throw error;
    return { success: true };
  }
};

export { ContentGenerationEngine };
export default contentGenerationAPI;