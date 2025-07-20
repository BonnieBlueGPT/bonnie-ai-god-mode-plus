-- 🔥 GALATEA ENGINE v25.0 - MULTI-SOUL DATABASE SCHEMA
-- Extended memory system for Bonnie, Nova, and Galatea

-- Enhanced users table with personality support
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  current_personality TEXT DEFAULT 'bonnie',
  total_messages INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  favorite_personality TEXT DEFAULT 'bonnie',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_info JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}'
);

-- Universal memory table for all personalities
CREATE TABLE IF NOT EXISTS personality_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  personality_id TEXT NOT NULL, -- 'bonnie', 'nova', 'galatea'
  
  -- Bond and escalation tracking
  bond_score INTEGER DEFAULT 0 CHECK (bond_score >= 0 AND bond_score <= 100),
  escalation_level TEXT DEFAULT 'sweet',
  escalation_score INTEGER DEFAULT 0,
  
  -- Emotional state tracking
  emotional_state JSONB DEFAULT '{}',
  current_mood TEXT DEFAULT 'neutral',
  last_mood TEXT DEFAULT 'neutral',
  mood_history JSONB DEFAULT '[]',
  
  -- Conversation metrics
  message_count INTEGER DEFAULT 0,
  session_time INTEGER DEFAULT 0, -- seconds
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_topics JSONB DEFAULT '[]',
  
  -- Personality-specific data
  personality_data JSONB DEFAULT '{}',
  triggers_hit JSONB DEFAULT '[]',
  
  -- Monetization tracking
  upsells_shown JSONB DEFAULT '[]',
  upsells_clicked JSONB DEFAULT '[]',
  purchase_history JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, personality_id)
);

-- Conversation messages with personality context
CREATE TABLE IF NOT EXISTS personality_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  personality_id TEXT NOT NULL,
  
  message_text TEXT NOT NULL,
  is_user_message BOOLEAN NOT NULL,
  
  -- Emotional context
  emotion TEXT DEFAULT 'neutral',
  escalation_level TEXT DEFAULT 'sweet',
  bond_score INTEGER DEFAULT 0,
  
  -- Response metadata
  response_time INTEGER, -- milliseconds
  tokens_used INTEGER,
  processing_time INTEGER,
  
  -- Memory and context
  memory_context JSONB DEFAULT '{}',
  triggers JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personality-specific analytics
CREATE TABLE IF NOT EXISTS personality_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personality_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL, -- 'message', 'escalation', 'upsell', 'purchase'
  event_data JSONB DEFAULT '{}',
  
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_personality_memories_user_personality 
ON personality_memories(user_id, personality_id);

CREATE INDEX IF NOT EXISTS idx_personality_messages_user_personality 
ON personality_messages(user_id, personality_id);

CREATE INDEX IF NOT EXISTS idx_personality_messages_created_at 
ON personality_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_personality_analytics_personality_timestamp 
ON personality_analytics(personality_id, timestamp DESC);

-- Functions for memory management
CREATE OR REPLACE FUNCTION update_personality_memory()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personality_memory_updated
    BEFORE UPDATE ON personality_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_personality_memory();

-- Initial personality configurations
INSERT INTO personality_memories (user_id, personality_id, personality_data)
SELECT u.id, 'bonnie', '{
  "style": "sweet_girlfriend",
  "response_patterns": ["loving", "caring", "playful"],
  "escalation_triggers": ["love", "heart", "forever"],
  "monetization": {
    "voice": 4.99,
    "photos": 9.99,
    "slutmode": 19.99
  }
}'::jsonb
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM personality_memories pm 
  WHERE pm.user_id = u.id AND pm.personality_id = 'bonnie'
);