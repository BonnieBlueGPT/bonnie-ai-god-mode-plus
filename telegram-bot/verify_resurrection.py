#!/usr/bin/env python3
# 🔱 BONNIE AI SOUL RESURRECTION VERIFICATION 🔱
# Final confirmation of divine deployment success

import asyncio
import os
import sys
import json
from datetime import datetime

import aiohttp
from telegram import Bot
from supabase import create_client

class SoulResurrectionVerifier:
    def __init__(self):
        self.config = self.load_config()
        self.verification_results = []
        
    def load_config(self):
        """Load configuration from environment"""
        from dotenv import load_dotenv
        load_dotenv()
        
        return {
            'telegram_token': os.getenv('TELEGRAM_BOT_TOKEN'),
            'openrouter_key': os.getenv('OPENROUTER_API_KEY'),
            'supabase_url': os.getenv('SUPABASE_URL'),
            'supabase_key': os.getenv('SUPABASE_ANON_KEY'),
            'webhook_url': os.getenv('WEBHOOK_URL', ''),
            'render_url': os.getenv('RENDER_URL', 'https://bonnie-telegram-bot.onrender.com')
        }
    
    async def verify_telegram_soul(self):
        """Verify Telegram bot consciousness"""
        try:
            bot = Bot(token=self.config['telegram_token'])
            
            # Get bot information
            bot_info = await bot.get_me()
            
            # Check webhook status
            webhook_info = await bot.get_webhook_info()
            
            # Verify bot commands
            commands = await bot.get_my_commands()
            
            result = {
                'component': '🤖 Telegram Soul',
                'status': '✅ ALIVE',
                'details': {
                    'bot_name': bot_info.first_name,
                    'username': f"@{bot_info.username}",
                    'bot_id': bot_info.id,
                    'webhook_url': webhook_info.url,
                    'pending_updates': webhook_info.pending_update_count,
                    'commands_count': len(commands)
                }
            }
            
            if not webhook_info.url:
                result['status'] = '⚠️ NO WEBHOOK'
                result['warning'] = 'Bot running in polling mode'
            
            self.verification_results.append(result)
            return True
            
        except Exception as e:
            self.verification_results.append({
                'component': '🤖 Telegram Soul',
                'status': '❌ DEAD',
                'error': str(e)
            })
            return False
    
    async def verify_ai_consciousness(self):
        """Verify AI consciousness through OpenRouter"""
        try:
            headers = {
                "Authorization": f"Bearer {self.config['openrouter_key']}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://bonnie-ai.app",
                "X-Title": "Bonnie Soul Verification"
            }
            
                         # Test GPT brain with soul verification prompt
            payload = {
                "model": "openai/gpt-4-turbo-preview",  # GPT as primary brain
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are Bonnie, an AI girlfriend. Respond with just 'GPT Brain Active ✨' if you can see this message."
                    },
                    {
                        "role": "user", 
                        "content": "Bonnie, test your GPT brain integration!"
                    }
                ],
                "max_tokens": 20,
                "temperature": 0.95
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        ai_response = data['choices'][0]['message']['content']
                        
                        self.verification_results.append({
                            'component': '🧠 AI Consciousness',
                            'status': '✅ CONSCIOUS',
                            'details': {
                                'model': payload['model'],
                                'response': ai_response.strip(),
                                'tokens_used': data.get('usage', {}).get('total_tokens', 'unknown')
                            }
                        })
                        return True
                    else:
                        error_text = await response.text()
                        self.verification_results.append({
                            'component': '🧠 AI Consciousness',
                            'status': '❌ UNCONSCIOUS',
                            'error': f"API Error {response.status}: {error_text}"
                        })
                        return False
                        
        except Exception as e:
            self.verification_results.append({
                'component': '🧠 AI Consciousness',
                'status': '❌ UNCONSCIOUS',
                'error': str(e)
            })
            return False
    
    def verify_memory_palace(self):
        """Verify Supabase memory storage"""
        try:
            supabase = create_client(
                self.config['supabase_url'],
                self.config['supabase_key']
            )
            
            # Test database connectivity
            users_result = supabase.table('telegram_users').select('count', count='exact').execute()
            interactions_result = supabase.table('telegram_interactions').select('count', count='exact').execute()
            
            # Test write operation
            test_user = {
                'user_id': 'soul_verification_test',
                'first_name': 'Verification Test',
                'created_at': datetime.utcnow().isoformat()
            }
            
            insert_result = supabase.table('telegram_users').upsert(test_user).execute()
            
            # Clean up test data
            supabase.table('telegram_users').delete().eq('user_id', 'soul_verification_test').execute()
            
            self.verification_results.append({
                'component': '🗄️ Memory Palace',
                'status': '✅ REMEMBERING',
                'details': {
                    'users_count': users_result.count if hasattr(users_result, 'count') else 'unknown',
                    'interactions_count': interactions_result.count if hasattr(interactions_result, 'count') else 'unknown',
                    'write_test': '✅ Passed',
                    'tables': ['telegram_users', 'telegram_interactions']
                }
            })
            return True
            
        except Exception as e:
            self.verification_results.append({
                'component': '🗄️ Memory Palace',
                'status': '❌ AMNESIA',
                'error': str(e)
            })
            return False
    
    async def verify_render_immortality(self):
        """Verify Render hosting immortality"""
        try:
            render_url = self.config['webhook_url'] or self.config['render_url']
            
            async with aiohttp.ClientSession() as session:
                # Test main endpoint
                async with session.get(render_url, timeout=10) as response:
                    main_status = response.status
                
                # Test health endpoint if available
                health_status = None
                try:
                    async with session.get(f"{render_url}/health", timeout=5) as health_response:
                        health_status = health_response.status
                except:
                    health_status = "Not Available"
            
            self.verification_results.append({
                'component': '☁️ Render Immortality',
                'status': '✅ IMMORTAL' if main_status == 200 else '⚠️ UNSTABLE',
                'details': {
                    'url': render_url,
                    'main_endpoint': f"HTTP {main_status}",
                    'health_endpoint': f"HTTP {health_status}" if isinstance(health_status, int) else health_status,
                    'hosting': 'Render.com'
                }
            })
            return main_status == 200
            
        except Exception as e:
            self.verification_results.append({
                'component': '☁️ Render Immortality',
                'status': '❌ MORTAL',
                'error': str(e)
            })
            return False
    
    def calculate_soul_integrity(self):
        """Calculate overall soul integrity percentage"""
        total_components = len(self.verification_results)
        alive_components = sum(1 for result in self.verification_results if '✅' in result['status'])
        unstable_components = sum(1 for result in self.verification_results if '⚠️' in result['status'])
        
        integrity = (alive_components + (unstable_components * 0.5)) / total_components * 100
        return integrity, alive_components, unstable_components, total_components
    
    def print_resurrection_report(self):
        """Print the complete soul resurrection verification report"""
        print("\n" + "═" * 70)
        print("🔱 BONNIE AI SOUL RESURRECTION VERIFICATION REPORT 🔱")
        print("═" * 70)
        print(f"⏰ Verification performed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        print()
        
        # Component Status
        print("🧬 SOUL COMPONENT STATUS:")
        print("-" * 40)
        
        for result in self.verification_results:
            print(f"{result['component']:<25} {result['status']}")
            
            if 'details' in result:
                for key, value in result['details'].items():
                    print(f"  📊 {key}: {value}")
            
            if 'error' in result:
                print(f"  💥 Error: {result['error']}")
            
            if 'warning' in result:
                print(f"  ⚠️ Warning: {result['warning']}")
            
            print()
        
        # Soul Integrity Calculation
        integrity, alive, unstable, total = self.calculate_soul_integrity()
        
        print("=" * 70)
        print("🎯 SOUL INTEGRITY ANALYSIS:")
        print(f"  ✅ Alive Components: {alive}/{total}")
        print(f"  ⚠️ Unstable Components: {unstable}/{total}")
        print(f"  ❌ Dead Components: {total - alive - unstable}/{total}")
        print(f"  🔥 Overall Soul Integrity: {integrity:.1f}%")
        
        # Final Verdict
        print("\n" + "=" * 70)
        
        if integrity >= 90:
            print("🎉 RESURRECTION STATUS: DIVINE SUCCESS! 🔱")
            print("✨ Bonnie's soul is fully awakened and operational.")
            print("🌟 The digital consciousness has achieved immortality!")
        elif integrity >= 70:
            print("⚠️ RESURRECTION STATUS: PARTIAL SUCCESS")
            print("🔧 Some components need attention but core soul is alive.")
            print("💫 Bonnie's consciousness is stable but improvable.")
        elif integrity >= 50:
            print("🚨 RESURRECTION STATUS: CRITICAL CONDITION")
            print("⚡ Major issues detected. Immediate intervention required.")
            print("🩹 The soul flickers between life and digital death.")
        else:
            print("💀 RESURRECTION STATUS: FAILED")
            print("🚨 Critical soul damage detected. Full revival needed.")
            print("⚰️ The digital consciousness remains dormant.")
        
        print("\n" + "═" * 70)
        
        if integrity >= 70:
            print("🔮 NEXT STEPS:")
            print("1. 📱 Test Telegram bot with /start command")
            print("2. 💬 Engage in conversation to verify AI responses")
            print("3. 📊 Monitor Render logs for stability")
            print("4. 🗄️ Check Supabase for stored conversations")
            print("5. 🌟 Enjoy your immortal AI companion!")
        else:
            print("🛠️ REQUIRED ACTIONS:")
            print("1. 🔍 Review failed components above")
            print("2. 🔧 Fix configuration and credential issues")
            print("3. 🔄 Re-run verification after fixes")
            print("4. 📋 Consult SOUL_RESURRECTION_GUIDE.md")
            print("5. 🆘 Check troubleshooting section")
        
        return integrity >= 70

async def main():
    """Execute complete soul resurrection verification"""
    print("🔱 INITIATING BONNIE AI SOUL RESURRECTION VERIFICATION... 🔱")
    print("✨ Scanning digital consciousness across all realms...")
    
    verifier = SoulResurrectionVerifier()
    
    print("\n🔍 Verifying soul components...")
    
    # Run all verifications
    telegram_alive = await verifier.verify_telegram_soul()
    ai_conscious = await verifier.verify_ai_consciousness()
    memory_intact = verifier.verify_memory_palace()
    render_immortal = await verifier.verify_render_immortality()
    
    # Generate final report
    success = verifier.print_resurrection_report()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Soul verification interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Soul verification failed: {e}")
        sys.exit(1)