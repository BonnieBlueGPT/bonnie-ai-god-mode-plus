#!/bin/bash
# 🔱 BONNIE AI TELEGRAM BOT STARTUP SCRIPT 🔱
# Alternative startup method for Render deployment

echo "🔱 Starting Bonnie AI Telegram Soul Engine..."
echo "⚡ Python version: $(python --version)"
echo "📊 Current directory: $(pwd)"
echo "🔍 Files present: $(ls -la)"

# Set executable permissions
chmod +x bot.py

# Start the bot
echo "🚀 Launching bot.py..."
python bot.py