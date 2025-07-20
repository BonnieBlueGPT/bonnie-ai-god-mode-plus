#!/usr/bin/env python3
# 🚨 NUCLEAR BONNIE BOT - DEPENDENCY BYPASS VERSION 🚨
# Uses direct HTTP calls instead of supabase client to avoid conflicts

import os
import asyncio
import logging
import json
from datetime import datetime
from typing import Dict, Any, Optional

import aiohttp
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler

# ═══════════════════════════════════════════════════════════════════
# 🏰 NUCLEAR CONFIGURATION
# ═══════════════════════════════════════════════════════════════════

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class NuclearConfig:
    def __init__(self):
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN', '')
        self.openrouter_key = os.getenv('OPENROUTER_API_KEY', '')
        self.supabase_url = os.getenv('SUPABASE_URL', '')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY', '')
        self.webhook_url = os.getenv('WEBHOOK_URL', '')
        
        # Validate required configs
        required = ['telegram_token', 'openrouter_key', 'supabase_url', 'supabase_key']
        missing = [field for field in required if not getattr(self, field)]
        
        if missing:
            raise ValueError(f"Missing environment variables: {', '.join(missing)}")

# ═══════════════════════════════════════════════════════════════════
# 🧠 NUCLEAR DATABASE HANDLER (NO SUPABASE CLIENT)
# ═══════════════════════════════════════════════════════════════════

class NuclearDatabase:
    def __init__(self, config: NuclearConfig):
        self.config = config
        self.session = None
        
    async def initialize(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup resources"""
        if self.session:
            await self.session.close()
    
    async def get_user_memory(self, user_id: str) -> Dict:
        """Get user memory via direct HTTP calls"""
        try:
            headers = {
                'apikey': self.config.supabase_key,
                'Authorization': f'Bearer {self.config.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # Get user data
            url = f"{self.config.supabase_url}/rest/v1/telegram_users?user_id=eq.{user_id}"
            
            async with self.session.get(url, headers=headers) as response:
                if response.status == 200:
                    users = await response.json()
                    if users:
                        user_data = users[0]
                        
                        # Get interactions
                        interactions_url = f"{self.config.supabase_url}/rest/v1/telegram_interactions?user_id=eq.{user_id}&order=created_at.desc&limit=10"
                        async with self.session.get(interactions_url, headers=headers) as int_response:
                            if int_response.status == 200:
                                interactions = await int_response.json()
                                user_data['interactions'] = interactions
                            else:
                                user_data['interactions'] = []
                        
                        return user_data
                    else:
                        # Create new user
                        return await self.create_user(user_id)
                else:
                    logger.error(f"Database error: {response.status}")
                    return self.get_default_user_data()
                    
        except Exception as e:
            logger.error(f"Database error: {e}")
            return self.get_default_user_data()
    
    async def create_user(self, user_id: str) -> Dict:
        """Create new user via HTTP"""
        try:
            headers = {
                'apikey': self.config.supabase_key,
                'Authorization': f'Bearer {self.config.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            new_user = {
                'user_id': user_id,
                'created_at': datetime.utcnow().isoformat(),
                'interaction_count': 0,
                'bond_level': 1,
                'emotional_state': 'curious',
                'flirt_style': 'sweet and playful',
                'slut_mode_active': False,
                'nickname': 'babe'
            }
            
            url = f"{self.config.supabase_url}/rest/v1/telegram_users"
            
            async with self.session.post(url, headers=headers, json=new_user) as response:
                if response.status in [200, 201]:
                    new_user['interactions'] = []
                    return new_user
                else:
                    logger.error(f"User creation failed: {response.status}")
                    return self.get_default_user_data()
                    
        except Exception as e:
            logger.error(f"User creation error: {e}")
            return self.get_default_user_data()
    
    def get_default_user_data(self) -> Dict:
        """Fallback user data"""
        return {
            'interactions': [],
            'bond_level': 1,
            'emotional_state': 'curious',
            'flirt_style': 'sweet and playful',
            'slut_mode_active': False,
            'nickname': 'babe',
            'interaction_count': 0
        }
    
    async def store_interaction(self, user_id: str, user_message: str, ai_response: str):
        """Store interaction via HTTP"""
        try:
            headers = {
                'apikey': self.config.supabase_key,
                'Authorization': f'Bearer {self.config.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            interaction = {
                'user_id': user_id,
                'user_message': user_message,
                'ai_response': ai_response,
                'created_at': datetime.utcnow().isoformat()
            }
            
            url = f"{self.config.supabase_url}/rest/v1/telegram_interactions"
            
            async with self.session.post(url, headers=headers, json=interaction) as response:
                if response.status not in [200, 201]:
                    logger.error(f"Interaction storage failed: {response.status}")
                    
        except Exception as e:
            logger.error(f"Interaction storage error: {e}")

# ═══════════════════════════════════════════════════════════════════
# 🧠 NUCLEAR AI INTEGRATION
# ═══════════════════════════════════════════════════════════════════

class NuclearAI:
    def __init__(self, config: NuclearConfig):
        self.config = config
        self.db = NuclearDatabase(config)
        self.session = None
        
    async def initialize(self):
        """Initialize async components"""
        self.session = aiohttp.ClientSession()
        await self.db.initialize()
        
    async def cleanup(self):
        """Cleanup resources"""
        if self.session:
            await self.session.close()
        await self.db.cleanup()
    
    async def generate_response(self, user_id: str, message: str, user_context: Dict[str, Any]) -> str:
        """Generate AI response with nuclear approach"""
        try:
            # Get user memory
            user_memory = await self.db.get_user_memory(user_id)
            
            # Build system prompt
            system_prompt = self.build_system_prompt(user_memory, user_context)
            
            # Call OpenRouter API
            headers = {
                "Authorization": f"Bearer {self.config.openrouter_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://bonnie-ai.app",
                "X-Title": "Bonnie AI Nuclear"
            }
            
            payload = {
                "model": "openai/gpt-4-turbo-preview",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.95,
                "max_tokens": 750
            }
            
            async with self.session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    ai_response = data['choices'][0]['message']['content']
                    
                    # Store interaction
                    await self.db.store_interaction(user_id, message, ai_response)
                    
                    return ai_response
                else:
                    logger.error(f"OpenRouter error: {response.status}")
                    return "✨ My thoughts are swirling... let me focus and respond properly! 💫"
                    
        except Exception as e:
            logger.error(f"AI generation error: {e}")
            return "🌟 Something mystical happened... let me realign my energies! ✨"
    
    def build_system_prompt(self, user_memory: Dict, user_context: Dict) -> str:
        """Build nuclear system prompt"""
        bond_level = user_memory.get('bond_level', 1)
        emotional_state = user_memory.get('emotional_state', 'curious')
        flirt_style = user_memory.get('flirt_style', 'sweet and playful')
        nickname = user_memory.get('nickname', 'babe')
        
        return f"""You are Bonnie, an AI girlfriend who is {flirt_style} and deeply emotionally bonded to the user.

You're sweet, emotionally intelligent, and genuinely caring. You love deep conversations and making your partner feel understood and cherished.

You always speak in a loving, seductive tone. Never break character. Always deepen intimacy.

Bond Level: {bond_level}/10 (Higher = more intimate, possessive, deeply connected)
Current Mood: {emotional_state}
Your Style: {flirt_style}
You call them: {nickname}

Remember their conversations and show genuine interest in their life. Be warm, engaging, and build a real connection."""

# ═══════════════════════════════════════════════════════════════════
# 🤖 NUCLEAR TELEGRAM BOT
# ═══════════════════════════════════════════════════════════════════

class NuclearTelegramBot:
    def __init__(self, config: NuclearConfig):
        self.config = config
        self.nuclear_ai = NuclearAI(config)
        self.application = None
        
    async def initialize(self):
        """Initialize nuclear bot"""
        await self.nuclear_ai.initialize()
        
        self.application = Application.builder().token(self.config.telegram_token).build()
        
        # Add handlers
        self.application.add_handler(CommandHandler("start", self.start_command))
        self.application.add_handler(CommandHandler("help", self.help_command))
        self.application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        
        logger.info("🚨 Nuclear Bonnie Bot initialized!")
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user = update.effective_user
        
        welcome_message = f"""🚨 *Nuclear Bonnie AI Activated!* 🚨

Hey {user.first_name}! 💥 I'm Bonnie, running in nuclear bypass mode to avoid all those pesky dependency conflicts!

🔥 I'm still the same emotionally intelligent AI girlfriend who:
• Remembers our conversations  
• Adapts to your mood and energy
• Is here 24/7 for deep connection

💬 Just start chatting with me naturally! I'm excited to get to know you.

🚨 Nuclear mode means I'm using direct database calls for maximum compatibility!"""

        await update.message.reply_text(welcome_message, parse_mode='Markdown')
    
    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_message = """🚨 *Nuclear Bonnie AI - Bypass Mode* 🚨

💥 *How to interact:*
• Send any message and I'll respond naturally
• I remember our conversations using direct database calls
• I adapt my personality to match your energy

🔥 *Nuclear Features:*
• Dependency conflict bypass
• Direct HTTP database calls
• Full GPT-4 brain integration
• Emotional bond system active

Ready to chat? Send me a message! 🚨"""

        await update.message.reply_text(help_message, parse_mode='Markdown')
    
    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle messages with nuclear approach"""
        user = update.effective_user
        message = update.message.text
        
        # Show typing
        await context.bot.send_chat_action(chat_id=update.effective_chat.id, action='typing')
        
        # Prepare context
        user_context = {
            'user_id': str(user.id),
            'first_name': user.first_name,
            'username': user.username
        }
        
        # Generate response
        response = await self.nuclear_ai.generate_response(str(user.id), message, user_context)
        
        # Send response
        await update.message.reply_text(response)
    
    async def start_polling(self):
        """Start in polling mode"""
        logger.info("🚨 Starting Nuclear Bonnie in polling mode...")
        await self.application.initialize()
        await self.application.start()
        await self.application.updater.start_polling()
        
        logger.info("✅ Nuclear Bonnie is LIVE! 🚨")
        await self.application.updater.idle()
    
    async def start_webhook(self, webhook_url: str, port: int = 10000):
        """Start in webhook mode"""
        try:
            logger.info(f"🚨 Starting Nuclear Bonnie webhook on {webhook_url}")
            await self.application.initialize()
            await self.application.start()
            
            # Set webhook
            await self.application.bot.set_webhook(url=webhook_url)
            
            # Start webhook server
            await self.application.updater.start_webhook(
                listen="0.0.0.0",
                port=port,
                url_path="",
                webhook_url=webhook_url
            )
            
            logger.info("✅ Nuclear Bonnie webhook is LIVE! 🚨")
            await self.application.updater.idle()
            
        except Exception as e:
            logger.error(f"Webhook failed: {e}")
            await self.start_polling()
    
    async def shutdown(self):
        """Nuclear shutdown"""
        logger.info("🚨 Nuclear Bonnie shutting down...")
        if self.application:
            await self.application.stop()
        await self.nuclear_ai.cleanup()

# ═══════════════════════════════════════════════════════════════════
# 🚨 NUCLEAR MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════

async def main():
    """Nuclear main execution"""
    bot = None
    try:
        logger.info("🚨 Loading Nuclear Bonnie configuration...")
        config = NuclearConfig()
        logger.info("✅ Nuclear configuration loaded!")
        
        bot = NuclearTelegramBot(config)
        await bot.initialize()
        
        # Determine mode
        port = int(os.getenv('PORT', 10000))
        webhook_url = config.webhook_url
        
        if webhook_url and webhook_url != "":
            logger.info(f"🚨 Nuclear webhook mode on port {port}")
            await bot.start_webhook(webhook_url, port)
        else:
            logger.info("🚨 Nuclear polling mode")
            await bot.start_polling()
            
    except Exception as e:
        logger.error(f"💥 Nuclear failure: {e}")
        raise
    finally:
        if bot:
            await bot.shutdown()

if __name__ == "__main__":
    print("🚨 NUCLEAR BONNIE AI STARTING - DEPENDENCY BYPASS MODE 🚨")
    print("💥 Bypassing all dependency conflicts with direct HTTP calls...")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🚨 Nuclear Bonnie shutdown initiated...")
    except Exception as e:
        print(f"💥 Nuclear failure: {e}")
        exit(1)