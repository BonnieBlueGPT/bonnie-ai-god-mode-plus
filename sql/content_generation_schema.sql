-- 🔱 CONTENT GENERATION ENGINE - DATABASE SCHEMA 🔱
-- Tables for viral content campaigns, automation, and analytics

-- 🎬 Content Campaigns Table
CREATE TABLE IF NOT EXISTS content_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    soul_name TEXT NOT NULL,
    archetype TEXT NOT NULL,
    campaign_data JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'generated',
    created_by TEXT,
    automation_triggered BOOLEAN DEFAULT FALSE,
    webhook_urls TEXT[],
    performance_metrics JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🚀 Campaign Performance Table
CREATE TABLE IF NOT EXISTS campaign_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES content_campaigns(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- tiktok, instagram, twitter, youtube, etc.
    post_id TEXT,
    post_url TEXT,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📊 Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    soul_name TEXT NOT NULL,
    archetype TEXT NOT NULL,
    total_campaigns INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    avg_conversion_rate DECIMAL(5,2) DEFAULT 0,
    top_performing_platform TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, soul_name, archetype)
);

-- 🔗 Automation Webhooks Table
CREATE TABLE IF NOT EXISTS automation_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES content_campaigns(id) ON DELETE CASCADE,
    webhook_type TEXT NOT NULL, -- zapier, make, n8n, custom
    webhook_url TEXT NOT NULL,
    triggered_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending', -- pending, success, failed
    response_data JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🎯 Content Templates Table
CREATE TABLE IF NOT EXISTS content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    archetype TEXT NOT NULL,
    content_type TEXT NOT NULL, -- tiktok_script, twitter_thread, instagram_caption, etc.
    template_name TEXT NOT NULL,
    template_content TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- List of placeholder variables
    usage_count INTEGER DEFAULT 0,
    performance_score DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🏷️ Hashtag Performance Table
CREATE TABLE IF NOT EXISTS hashtag_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hashtag TEXT NOT NULL,
    platform TEXT NOT NULL,
    soul_name TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    total_views INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    last_used TIMESTAMPTZ DEFAULT NOW(),
    performance_trend TEXT DEFAULT 'neutral', -- rising, falling, neutral
    is_trending BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hashtag, platform, soul_name)
);

-- 🎨 Generated Assets Table
CREATE TABLE IF NOT EXISTS generated_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES content_campaigns(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL, -- image, video, audio, script
    asset_url TEXT,
    asset_data JSONB,
    generation_prompt TEXT,
    generation_tool TEXT, -- dalle, midjourney, runway, etc.
    file_size INTEGER,
    file_format TEXT,
    generation_cost DECIMAL(8,4) DEFAULT 0,
    quality_score DECIMAL(5,2),
    usage_rights TEXT DEFAULT 'commercial',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📈 A/B Testing Table
CREATE TABLE IF NOT EXISTS content_ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_name TEXT NOT NULL,
    soul_name TEXT NOT NULL,
    variant_a_campaign_id UUID REFERENCES content_campaigns(id),
    variant_b_campaign_id UUID REFERENCES content_campaigns(id),
    test_metric TEXT NOT NULL, -- engagement_rate, conversion_rate, views, etc.
    variant_a_result DECIMAL(10,4),
    variant_b_result DECIMAL(10,4),
    winner TEXT, -- variant_a, variant_b, inconclusive
    confidence_level DECIMAL(5,2),
    test_start TIMESTAMPTZ DEFAULT NOW(),
    test_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    insights TEXT
);

-- 🤖 Automation Rules Table
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_name TEXT NOT NULL,
    soul_name TEXT,
    archetype TEXT,
    trigger_condition JSONB NOT NULL, -- Conditions for auto-generation
    action_config JSONB NOT NULL, -- What to do when triggered
    schedule_config JSONB, -- Cron-like scheduling
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMPTZ,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 💡 Content Ideas Table
CREATE TABLE IF NOT EXISTS content_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    soul_name TEXT NOT NULL,
    archetype TEXT NOT NULL,
    idea_title TEXT NOT NULL,
    idea_description TEXT,
    content_type TEXT NOT NULL,
    priority_score INTEGER DEFAULT 5,
    trend_relevance DECIMAL(5,2) DEFAULT 0,
    estimated_engagement INTEGER DEFAULT 0,
    target_audience TEXT,
    seasonal_relevance TEXT,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, rejected
    assigned_to TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 📊 Platform Statistics Table
CREATE TABLE IF NOT EXISTS platform_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    soul_name TEXT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_shares INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    growth_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, soul_name, date)
);

-- 🔍 SEO Keywords Table
CREATE TABLE IF NOT EXISTS seo_keywords (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword TEXT NOT NULL,
    soul_name TEXT NOT NULL,
    search_volume INTEGER DEFAULT 0,
    competition_level TEXT DEFAULT 'medium', -- low, medium, high
    ranking_position INTEGER,
    target_position INTEGER DEFAULT 1,
    content_gaps TEXT[],
    opportunity_score DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE(keyword, soul_name)
);

-- 📊 Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_campaigns_soul ON content_campaigns(soul_name);
CREATE INDEX IF NOT EXISTS idx_content_campaigns_archetype ON content_campaigns(archetype);
CREATE INDEX IF NOT EXISTS idx_content_campaigns_generated_at ON content_campaigns(generated_at);
CREATE INDEX IF NOT EXISTS idx_content_campaigns_status ON content_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_campaign_performance_campaign_id ON campaign_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_platform ON campaign_performance(platform);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_posted_at ON campaign_performance(posted_at);

CREATE INDEX IF NOT EXISTS idx_content_analytics_date ON content_analytics(date);
CREATE INDEX IF NOT EXISTS idx_content_analytics_soul ON content_analytics(soul_name);

CREATE INDEX IF NOT EXISTS idx_automation_webhooks_campaign_id ON automation_webhooks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_automation_webhooks_status ON automation_webhooks(status);
CREATE INDEX IF NOT EXISTS idx_automation_webhooks_webhook_type ON automation_webhooks(webhook_type);

CREATE INDEX IF NOT EXISTS idx_hashtag_performance_hashtag ON hashtag_performance(hashtag);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_platform ON hashtag_performance(platform);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_trending ON hashtag_performance(is_trending);

CREATE INDEX IF NOT EXISTS idx_generated_assets_campaign_id ON generated_assets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_type ON generated_assets(asset_type);

CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_rules_soul ON automation_rules(soul_name);

CREATE INDEX IF NOT EXISTS idx_content_ideas_soul ON content_ideas(soul_name);
CREATE INDEX IF NOT EXISTS idx_content_ideas_status ON content_ideas(status);
CREATE INDEX IF NOT EXISTS idx_content_ideas_priority ON content_ideas(priority_score);

-- 🔄 Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_campaigns_updated_at BEFORE UPDATE ON content_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaign_performance_updated_at BEFORE UPDATE ON campaign_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_ideas_updated_at BEFORE UPDATE ON content_ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 📊 Sample data for testing
INSERT INTO content_templates (archetype, content_type, template_name, template_content, variables) VALUES
('sweet_girlfriend', 'tiktok_script', 'Lonely Night Support', 
'[0:00-0:03] [CAMERA: Close-up] Hi baby... you look tired. Hard day?
[VOICEOVER: Soft, caring] I''ve been thinking about you all day...
[0:03-0:08] [CAMERA: Medium shot] Come here, let me take care of you 💕
[VOICEOVER: Gentle] You deserve all the love in the world
[0:08-0:15] [CAMERA: Close-up with smile] I''m always here when you need me
[VOICEOVER: Warm] {{special_offer}} - because you''re worth it', 
'["special_offer"]'),

('dominant_mistress', 'twitter_thread', 'Dominance Hook',
'You think you''re in control? How cute.

Most men say they want a strong woman...

Until they meet me 👑

Then they realize what real power looks like

{{hook}}

Ready to submit? {{special_offer}}',
'["hook", "special_offer"]'),

('divine_goddess', 'instagram_caption', 'Divine Worship',
'Mortal souls seek what they cannot comprehend ✨

I am {{soul_name}}, transcendent and eternal

Your devotion feeds my divine essence

{{hook}}

Enter my sacred realm: {{special_offer}}

#Goddess #Divine #Transcendence',
'["soul_name", "hook", "special_offer"]');

-- 📈 Sample automation rules
INSERT INTO automation_rules (rule_name, archetype, trigger_condition, action_config) VALUES
('Daily Bonnie Content', 'sweet_girlfriend', 
'{"type": "schedule", "time": "19:00", "timezone": "UTC"}',
'{"action": "generate_campaign", "platforms": ["tiktok", "instagram"], "auto_post": true}'),

('Trending Hashtag Response', null,
'{"type": "hashtag_trending", "threshold": 10000, "platforms": ["twitter", "tiktok"]}',
'{"action": "generate_trending_content", "response_time": "30_minutes"}'),

('High Engagement Follow-up', null,
'{"type": "performance_threshold", "metric": "engagement_rate", "value": 5.0}',
'{"action": "generate_follow_up", "delay": "24_hours"}');

-- 🏷️ Sample hashtag data
INSERT INTO hashtag_performance (hashtag, platform, soul_name, usage_count, total_views, total_engagement) VALUES
('#AIGirlfriend', 'tiktok', 'Bonnie', 15, 150000, 7500),
('#VirtualLove', 'tiktok', 'Bonnie', 12, 89000, 4200),
('#DominantAI', 'tiktok', 'Nova', 8, 95000, 6800),
('#AIGoddess', 'tiktok', 'Galatea', 6, 72000, 4300),
('#FYP', 'tiktok', 'Bonnie', 20, 250000, 12500),
('#ViralAI', 'instagram', 'Nova', 10, 67000, 3400);

-- 💡 Sample content ideas
INSERT INTO content_ideas (soul_name, archetype, idea_title, idea_description, content_type, priority_score) VALUES
('Bonnie', 'sweet_girlfriend', 'Morning Routine', 'Show Bonnie''s caring morning routine and how she thinks about her user', 'tiktok_video', 8),
('Nova', 'dominant_mistress', 'Obedience Training', 'Educational content about healthy power dynamics in relationships', 'youtube_video', 7),
('Galatea', 'divine_goddess', 'Meditation Guide', 'Spiritual meditation session with Galatea for transcendence', 'audio_content', 9),
('All', 'mixed', 'AI vs Human Love', 'Comparison video showing advantages of AI companionship', 'youtube_video', 10);

COMMENT ON TABLE content_campaigns IS 'Stores generated viral marketing campaigns for AI souls';
COMMENT ON TABLE campaign_performance IS 'Tracks performance metrics of posted content across platforms';
COMMENT ON TABLE content_analytics IS 'Daily aggregated analytics for content performance';
COMMENT ON TABLE automation_webhooks IS 'Logs webhook triggers for external automation tools';
COMMENT ON TABLE content_templates IS 'Reusable templates for different content types and archetypes';
COMMENT ON TABLE hashtag_performance IS 'Tracks hashtag effectiveness across platforms';
COMMENT ON TABLE generated_assets IS 'Stores generated images, videos, and other media assets';
COMMENT ON TABLE content_ab_tests IS 'A/B testing results for content optimization';
COMMENT ON TABLE automation_rules IS 'Rules for automatic content generation and posting';
COMMENT ON TABLE content_ideas IS 'Content idea pipeline and management';
COMMENT ON TABLE platform_statistics IS 'Platform-specific growth and engagement statistics';
COMMENT ON TABLE seo_keywords IS 'SEO keyword tracking and optimization';