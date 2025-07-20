#!/usr/bin/env python3
# 🔱 BONNIE AI TELEGRAM BOT HEALTH CHECK 🔱
# Verify all services before deployment

import asyncio
import os
import sys
from dataclasses import dataclass
from datetime import datetime

import aiohttp
from supabase import create_client
from telegram import Bot

@dataclass
class HealthCheckResult:
    service: str
    status: str
    message: str
    details: dict = None

class BonnieHealthCheck:
    def __init__(self):
        self.results = []
        
    def load_config(self):
        """Load environment variables"""
        from dotenv import load_dotenv
        load_dotenv()
        
        self.config = {
            'telegram_token': os.getenv('TELEGRAM_BOT_TOKEN'),
            'openrouter_key': os.getenv('OPENROUTER_API_KEY'),
            'supabase_url': os.getenv('SUPABASE_URL'),
            'supabase_key': os.getenv('SUPABASE_ANON_KEY')
        }
        
        # Check required configs
        missing = [k for k, v in self.config.items() if not v]
        if missing:
            self.results.append(HealthCheckResult(
                service="Configuration",
                status="❌ FAILED",
                message=f"Missing environment variables: {', '.join(missing)}"
            ))
            return False
        
        self.results.append(HealthCheckResult(
            service="Configuration",
            status="✅ PASSED",
            message="All required environment variables found"
        ))
        return True
    
    async def check_telegram_bot(self):
        """Check Telegram Bot API connection"""
        try:
            bot = Bot(token=self.config['telegram_token'])
            
            # Test bot info
            bot_info = await bot.get_me()
            
            self.results.append(HealthCheckResult(
                service="Telegram Bot",
                status="✅ PASSED",
                message=f"Connected to @{bot_info.username}",
                details={
                    'bot_id': bot_info.id,
                    'bot_name': bot_info.first_name,
                    'username': bot_info.username
                }
            ))
            
        except Exception as e:
            self.results.append(HealthCheckResult(
                service="Telegram Bot",
                status="❌ FAILED",
                message=f"Failed to connect: {str(e)}"
            ))
    
    async def check_openrouter_api(self):
        """Check OpenRouter API connection"""
        try:
            headers = {
                "Authorization": f"Bearer {self.config['openrouter_key']}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://bonnie-ai.app",
                "X-Title": "Bonnie AI Health Check"
            }
            
            # Test API with a simple request
            payload = {
                "model": "anthropic/claude-3.5-sonnet:beta",
                "messages": [
                    {"role": "user", "content": "Hello! Just testing the connection."}
                ],
                "max_tokens": 10
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        self.results.append(HealthCheckResult(
                            service="OpenRouter API",
                            status="✅ PASSED",
                            message="API connection successful",
                            details={'model': payload['model']}
                        ))
                    else:
                        error_text = await response.text()
                        self.results.append(HealthCheckResult(
                            service="OpenRouter API",
                            status="❌ FAILED",
                            message=f"API returned {response.status}: {error_text}"
                        ))
                        
        except Exception as e:
            self.results.append(HealthCheckResult(
                service="OpenRouter API",
                status="❌ FAILED",
                message=f"Connection failed: {str(e)}"
            ))
    
    def check_supabase_connection(self):
        """Check Supabase database connection"""
        try:
            supabase = create_client(
                self.config['supabase_url'],
                self.config['supabase_key']
            )
            
            # Test connection with a simple query
            result = supabase.table('telegram_users').select('count', count='exact').execute()
            
            self.results.append(HealthCheckResult(
                service="Supabase Database",
                status="✅ PASSED",
                message="Database connection successful",
                details={'user_count': result.count if hasattr(result, 'count') else 'unknown'}
            ))
            
        except Exception as e:
            self.results.append(HealthCheckResult(
                service="Supabase Database",
                status="❌ FAILED",
                message=f"Database connection failed: {str(e)}"
            ))
    
    async def check_database_schema(self):
        """Check if required database tables exist"""
        try:
            supabase = create_client(
                self.config['supabase_url'],
                self.config['supabase_key']
            )
            
            # Check for required tables
            tables_to_check = ['telegram_users', 'telegram_interactions']
            table_status = {}
            
            for table in tables_to_check:
                try:
                    result = supabase.table(table).select('*').limit(1).execute()
                    table_status[table] = "✅ EXISTS"
                except Exception as e:
                    table_status[table] = f"❌ MISSING ({str(e)})"
            
            if all("✅" in status for status in table_status.values()):
                self.results.append(HealthCheckResult(
                    service="Database Schema",
                    status="✅ PASSED",
                    message="All required tables exist",
                    details=table_status
                ))
            else:
                self.results.append(HealthCheckResult(
                    service="Database Schema",
                    status="⚠️ PARTIAL",
                    message="Some tables are missing",
                    details=table_status
                ))
                
        except Exception as e:
            self.results.append(HealthCheckResult(
                service="Database Schema",
                status="❌ FAILED",
                message=f"Schema check failed: {str(e)}"
            ))
    
    def print_results(self):
        """Print health check results"""
        print("\n🔱 BONNIE AI TELEGRAM BOT HEALTH CHECK RESULTS 🔱")
        print("=" * 60)
        print(f"⏰ Check performed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        passed = 0
        failed = 0
        warnings = 0
        
        for result in self.results:
            print(f"🔍 {result.service:.<20} {result.status}")
            print(f"   💬 {result.message}")
            
            if result.details:
                for key, value in result.details.items():
                    print(f"   📊 {key}: {value}")
            print()
            
            if "✅" in result.status:
                passed += 1
            elif "❌" in result.status:
                failed += 1
            elif "⚠️" in result.status:
                warnings += 1
        
        print("=" * 60)
        print(f"📊 SUMMARY: ✅ {passed} passed | ❌ {failed} failed | ⚠️ {warnings} warnings")
        
        if failed > 0:
            print("🚨 CRITICAL: Some services failed. Fix issues before deployment!")
            return False
        elif warnings > 0:
            print("⚠️ WARNING: Some issues detected. Review before deployment.")
            return True
        else:
            print("🎉 SUCCESS: All systems operational! Ready for deployment! 🔱")
            return True

async def main():
    """Main health check execution"""
    print("🔱 Starting Bonnie AI Telegram Bot Health Check...")
    
    checker = BonnieHealthCheck()
    
    # Load configuration
    if not checker.load_config():
        checker.print_results()
        sys.exit(1)
    
    # Run health checks
    await checker.check_telegram_bot()
    await checker.check_openrouter_api()
    checker.check_supabase_connection()
    await checker.check_database_schema()
    
    # Print results and exit
    success = checker.print_results()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Health check interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Health check failed with error: {e}")
        sys.exit(1)