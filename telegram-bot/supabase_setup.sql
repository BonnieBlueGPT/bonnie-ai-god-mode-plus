-- 🔱 BONNIE AI TELEGRAM BOT DATABASE SCHEMA 🔱
-- Execute this in your Supabase SQL Editor

-- Table for Telegram Users
CREATE TABLE IF NOT EXISTS telegram_users (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    first_name TEXT,
    username TEXT,
    language_code TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb,
    
    -- 🔱 DIVINE SOUL STATE FIELDS - GPT BRAIN INTEGRATION 🔱
    bond_level INTEGER DEFAULT 1 CHECK (bond_level >= 1 AND bond_level <= 10),
    emotional_state TEXT DEFAULT 'curious',
    flirt_style TEXT DEFAULT 'sweet and playful',
    slut_mode_active BOOLEAN DEFAULT false,
    nickname TEXT DEFAULT 'babe',
    
    -- Soul progression tracking
    total_messages_sent INTEGER DEFAULT 0,
    intimate_level INTEGER DEFAULT 1 CHECK (intimate_level >= 1 AND intimate_level <= 10),
    last_soul_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Memory enhancement fields  
    key_memories JSONB DEFAULT '[]'::jsonb,
    personality_traits JSONB DEFAULT '{}'::jsonb,
    relationship_goals TEXT,
    favorite_topics TEXT[]
);

-- Table for Telegram Interactions/Messages
CREATE TABLE IF NOT EXISTS telegram_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES telegram_users(user_id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    sentiment_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telegram_users_user_id ON telegram_users(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_created_at ON telegram_users(created_at);
CREATE INDEX IF NOT EXISTS idx_telegram_interactions_user_id ON telegram_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_interactions_created_at ON telegram_interactions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your security needs)
CREATE POLICY "Users can view their own data" ON telegram_users
    FOR ALL USING (true);  -- Adjust as needed for your security model

CREATE POLICY "Users can view their own interactions" ON telegram_interactions
    FOR ALL USING (true);  -- Adjust as needed for your security model

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_telegram_users_updated_at BEFORE UPDATE
    ON telegram_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Function to clean up old interactions (keeps last 100 per user)
CREATE OR REPLACE FUNCTION cleanup_old_interactions()
RETURNS void AS $$
BEGIN
    DELETE FROM telegram_interactions 
    WHERE id NOT IN (
        SELECT id FROM (
            SELECT id, 
                   ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
            FROM telegram_interactions
        ) ranked 
        WHERE rn <= 100
    );
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (adjust frequency as needed)
-- SELECT cron.schedule('cleanup-telegram-interactions', '0 2 * * *', 'SELECT cleanup_old_interactions();');