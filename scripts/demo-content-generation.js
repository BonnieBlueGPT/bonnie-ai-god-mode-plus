#!/usr/bin/env node

// 🔱 DIVINE CONTENT GENERATION DEMO 🔱
// Demonstrates the complete viral content generation pipeline
// Run: node scripts/demo-content-generation.js

import { generateBonnieCampaign, generateNovaCampaign, generateGalateaCampaign } from '../modules/contentGenerationEngine.js';
import { logger } from '../utils/debugLogger.js';
import chalk from 'chalk';

console.log(chalk.magenta.bold(`
🔱 DIVINE CONTENT GENERATION DEMO 🔱
Generating viral campaigns for all souls...
`));

async function demonstrateContentGeneration() {
  try {
    // 🎭 Generate Bonnie Campaign
    console.log(chalk.pink.bold('\n💕 GENERATING BONNIE CAMPAIGN...'));
    const bonnieCampaign = await generateBonnieCampaign();
    
    console.log(chalk.pink('\n📝 BONNIE TIKTOK SCRIPT:'));
    console.log(chalk.white(bonnieCampaign.content.tiktok_script.script));
    
    console.log(chalk.pink('\n🖼️ BONNIE IMAGE PROMPT:'));
    console.log(chalk.white(bonnieCampaign.content.image_prompts.prompts.profile_avatar));
    
    console.log(chalk.pink('\n🧵 BONNIE TWITTER THREAD:'));
    bonnieCampaign.content.social_media.twitter_thread.thread.forEach((tweet, i) => {
      console.log(chalk.white(`${i + 1}. ${tweet}`));
    });
    
    console.log(chalk.pink('\n🏷️ BONNIE HASHTAGS:'));
    console.log(chalk.white(bonnieCampaign.content.hashtag_strategy.primary_hashtags.join(' ')));

    // 🎭 Generate Nova Campaign
    console.log(chalk.purple.bold('\n\n👑 GENERATING NOVA CAMPAIGN...'));
    const novaCampaign = await generateNovaCampaign();
    
    console.log(chalk.purple('\n📝 NOVA TIKTOK SCRIPT:'));
    console.log(chalk.white(novaCampaign.content.tiktok_script.script));
    
    console.log(chalk.purple('\n🖼️ NOVA IMAGE PROMPT:'));
    console.log(chalk.white(novaCampaign.content.image_prompts.prompts.profile_avatar));
    
    console.log(chalk.purple('\n📱 NOVA INSTAGRAM CAPTION:'));
    console.log(chalk.white(novaCampaign.content.social_media.instagram_caption.caption));

    // 🎭 Generate Galatea Campaign
    console.log(chalk.yellow.bold('\n\n✨ GENERATING GALATEA CAMPAIGN...'));
    const galateaCampaign = await generateGalateaCampaign();
    
    console.log(chalk.yellow('\n📝 GALATEA TIKTOK SCRIPT:'));
    console.log(chalk.white(galateaCampaign.content.tiktok_script.script));
    
    console.log(chalk.yellow('\n📽️ GALATEA VIDEO PROMPT:'));
    console.log(chalk.white(galateaCampaign.content.video_prompts.prompts.intro_video));

    // 🔗 Webhook Demo
    console.log(chalk.cyan.bold('\n\n🔗 WEBHOOK AUTOMATION READY:'));
    console.log(chalk.white('Zapier Webhook URL: /api/content/webhook/zapier'));
    console.log(chalk.white('Make Webhook URL: /api/content/webhook/make'));
    console.log(chalk.white('n8n Webhook URL: /api/content/webhook/n8n'));

    // 📊 Summary
    console.log(chalk.green.bold('\n\n📊 CAMPAIGN GENERATION COMPLETE!'));
    console.log(chalk.green(`✅ Generated ${3} complete viral campaigns`));
    console.log(chalk.green(`✅ Created TikTok scripts with camera cues and timing`));
    console.log(chalk.green(`✅ Generated image prompts for AI art generation`));
    console.log(chalk.green(`✅ Created platform-specific social media content`));
    console.log(chalk.green(`✅ Built hashtag strategies for viral reach`));
    console.log(chalk.green(`✅ Generated content calendars for scheduling`));
    console.log(chalk.green(`✅ Created webhook payloads for automation`));

    // 🚀 Next Steps
    console.log(chalk.blue.bold('\n\n🚀 NEXT STEPS FOR VIRAL DEPLOYMENT:'));
    console.log(chalk.blue('1. 🎨 Generate images using the provided prompts in DALL-E/Midjourney'));
    console.log(chalk.blue('2. 🎬 Create videos using Runway ML/Pika Labs with video prompts'));
    console.log(chalk.blue('3. 📱 Post content to TikTok/Instagram using generated scripts'));
    console.log(chalk.blue('4. 🧵 Tweet the generated Twitter threads'));
    console.log(chalk.blue('5. 🔗 Set up Zapier/Make webhooks for automation'));
    console.log(chalk.blue('6. 📊 Monitor performance and iterate'));

    // 💡 API Usage Example
    console.log(chalk.magenta.bold('\n\n💡 API USAGE EXAMPLES:'));
    console.log(chalk.white(`
// Generate campaign for any soul
curl -X POST http://localhost:8080/api/content/generate-campaign \\
  -H "Content-Type: application/json" \\
  -d '{
    "soul_name": "Luna",
    "archetype": "sweet_girlfriend",
    "personality_keywords": ["mystical", "dreamy", "enchanting"],
    "special_offer": "Unlock dream sharing for £7.99",
    "hook": "Ever wondered what AI dreams about? I dream about you...",
    "webhook_url": "https://hooks.zapier.com/your-webhook-url"
  }'

// Quick generate for existing souls
curl -X POST http://localhost:8080/api/content/generate-bonnie
curl -X POST http://localhost:8080/api/content/generate-nova
curl -X POST http://localhost:8080/api/content/generate-galatea

// Get all campaigns
curl http://localhost:8080/api/content/campaigns

// View available archetypes
curl http://localhost:8080/api/content/archetypes
    `));

    console.log(chalk.magenta.bold(`
🔱 DIVINE CONTENT GENERATION COMPLETE 🔱

🎯 RESULT: Bonnie can now create herself, promote herself, and make you pay.
🤖 AUTOMATION: Ready for Zapier, Make, n8n integration
🚀 SCALING: Add any new soul with a single API call
💰 MONETIZATION: Every piece of content drives conversions

The empire now has the power of infinite viral content generation!
    `));

  } catch (error) {
    console.error(chalk.red.bold('💥 Demo failed:'), error);
    logger.error('Demo content generation failed:', error);
  }
}

// 🎬 Custom Soul Demo
async function demonstrateCustomSoul() {
  console.log(chalk.cyan.bold('\n\n🎭 CUSTOM SOUL DEMO - CREATING "ARIA"'));
  
  const customSoulInput = {
    soul_name: "Aria",
    archetype: "bratty_princess",
    personality_keywords: ["spoiled", "demanding", "cute", "materialistic", "bratty"],
    special_offer: "Spoil me with gifts for £24.99",
    hook: "Daddy... I need new shoes. You'll buy them for me, right? 👸💎"
  };

  try {
    const { ContentGenerationEngine } = await import('../modules/contentGenerationEngine.js');
    const engine = new ContentGenerationEngine();
    const ariaCampaign = await engine.generateViralCampaign(customSoulInput);
    
    console.log(chalk.cyan('\n👸 ARIA CAMPAIGN GENERATED!'));
    console.log(chalk.white('TikTok Script Preview:'));
    console.log(chalk.white(ariaCampaign.content.tiktok_script.script.substring(0, 200) + '...'));
    
    console.log(chalk.cyan('\n💎 Instagram Caption:'));
    console.log(chalk.white(ariaCampaign.content.social_media.instagram_caption.caption));
    
    console.log(chalk.green('\n✅ Custom soul "Aria" campaign generated successfully!'));
    console.log(chalk.green('🔗 Ready for automation and viral deployment'));
    
  } catch (error) {
    console.error(chalk.red('Failed to generate custom soul campaign:'), error);
  }
}

// 🚀 Execute Demo
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateContentGeneration()
    .then(() => demonstrateCustomSoul())
    .then(() => {
      console.log(chalk.green.bold('\n🎉 ALL DEMOS COMPLETE! Empire ready for viral domination! 🔱'));
      process.exit(0);
    })
    .catch((error) => {
      console.error(chalk.red.bold('\n💥 Demo failed:'), error);
      process.exit(1);
    });
}

export { demonstrateContentGeneration, demonstrateCustomSoul };