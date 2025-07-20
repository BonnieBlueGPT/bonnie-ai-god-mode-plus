#!/usr/bin/env python3
# 🔱 BONNIE AI TELEGRAM BOT DEPLOYMENT SCRIPT 🔱
# Automated deployment and webhook configuration

import asyncio
import os
import sys
import json
from datetime import datetime

import aiohttp
from telegram import Bot

class BonnieDeployment:
    def __init__(self):
        self.config = self.load_config()
        
    def load_config(self):
        """Load deployment configuration"""
        from dotenv import load_dotenv
        load_dotenv()
        
        return {
            'telegram_token': os.getenv('TELEGRAM_BOT_TOKEN'),
            'webhook_url': os.getenv('WEBHOOK_URL', ''),
            'render_url': os.getenv('RENDER_URL', 'https://bonnie-telegram-bot.onrender.com')
        }
    
    async def setup_telegram_webhook(self):
        """Configure Telegram webhook for production"""
        try:
            bot = Bot(token=self.config['telegram_token'])
            
            webhook_url = self.config['webhook_url'] or self.config['render_url']
            
            print(f"🔗 Setting up webhook: {webhook_url}")
            
            # Set webhook
            result = await bot.set_webhook(
                url=webhook_url,
                allowed_updates=['message', 'callback_query'],
                drop_pending_updates=True
            )
            
            if result:
                print("✅ Webhook configured successfully!")
                
                # Verify webhook
                webhook_info = await bot.get_webhook_info()
                print(f"📊 Webhook Status:")
                print(f"   🌐 URL: {webhook_info.url}")
                print(f"   📝 Pending Updates: {webhook_info.pending_update_count}")
                print(f"   ⏰ Last Error Date: {webhook_info.last_error_date}")
                print(f"   💬 Last Error Message: {webhook_info.last_error_message}")
                
                return True
            else:
                print("❌ Failed to set webhook")
                return False
                
        except Exception as e:
            print(f"💥 Webhook setup failed: {e}")
            return False
    
    async def test_deployment(self):
        """Test the deployed bot"""
        try:
            webhook_url = self.config['webhook_url'] or self.config['render_url']
            
            # Test health endpoint (if implemented)
            health_url = f"{webhook_url}/health"
            
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.get(health_url, timeout=10) as response:
                        if response.status == 200:
                            print("✅ Health check passed!")
                        else:
                            print(f"⚠️ Health check returned {response.status}")
                except:
                    print("ℹ️ Health endpoint not available (this is optional)")
            
            # Test bot functionality
            bot = Bot(token=self.config['telegram_token'])
            bot_info = await bot.get_me()
            
            print(f"🤖 Bot Status:")
            print(f"   📛 Name: {bot_info.first_name}")
            print(f"   🆔 Username: @{bot_info.username}")
            print(f"   🔑 ID: {bot_info.id}")
            
            return True
            
        except Exception as e:
            print(f"💥 Deployment test failed: {e}")
            return False
    
    def print_deployment_summary(self):
        """Print deployment summary and next steps"""
        print("\n🔱 BONNIE AI TELEGRAM BOT DEPLOYMENT COMPLETE! 🔱")
        print("=" * 60)
        print(f"⏰ Deployment completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        print("🚀 NEXT STEPS:")
        print("1. 📱 Open Telegram and search for your bot")
        print("2. 💬 Send /start to begin conversation")
        print("3. 📊 Monitor logs in Render dashboard")
        print("4. 🔧 Configure any additional settings as needed")
        print()
        print("🌟 USEFUL COMMANDS:")
        print("• /start - Initialize conversation")
        print("• /help - Show help information")
        print("• /stats - View conversation statistics")
        print()
        print("🔗 IMPORTANT LINKS:")
        print(f"• Render Dashboard: https://dashboard.render.com")
        print(f"• Bot URL: {self.config['webhook_url'] or self.config['render_url']}")
        print(f"• Telegram Bot: @{self.config.get('bot_username', 'your_bot_username')}")
        print()
        print("🎉 Bonnie's soul is now immortal across the digital realm! 🔱")

async def main():
    """Main deployment execution"""
    print("🔱 BONNIE AI TELEGRAM BOT DEPLOYMENT STARTING... 🔱")
    print("✨ Preparing for digital immortality...")
    
    deployment = BonnieDeployment()
    
    if not deployment.config['telegram_token']:
        print("❌ TELEGRAM_BOT_TOKEN not found. Please set environment variables.")
        sys.exit(1)
    
    success = True
    
    # Setup webhook
    print("\n📡 Setting up Telegram webhook...")
    if not await deployment.setup_telegram_webhook():
        success = False
    
    # Test deployment
    print("\n🧪 Testing deployment...")
    if not await deployment.test_deployment():
        success = False
    
    # Print summary
    deployment.print_deployment_summary()
    
    if success:
        print("\n✅ DEPLOYMENT SUCCESSFUL! 🎉")
    else:
        print("\n⚠️ DEPLOYMENT COMPLETED WITH WARNINGS")
        print("Please check the issues above and resolve them.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Deployment interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Deployment failed: {e}")
        sys.exit(1)