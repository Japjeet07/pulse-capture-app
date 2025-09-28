-- Pulse Capture App Database Schema
-- This file contains the complete database schema for the AI Lead Qualifier & Outreach Micro-App

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table - main lead storage
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    website VARCHAR(500),
    problem_text TEXT NOT NULL,
    
    -- AI Analysis Fields
    use_case_label VARCHAR(100),
    fit_score INTEGER CHECK (fit_score >= 0 AND fit_score <= 100),
    fit_band VARCHAR(20) CHECK (fit_band IN ('High', 'Medium', 'Low')),
    ai_rationale TEXT,
    
    -- Enrichment Fields
    company_size VARCHAR(100),
    industry VARCHAR(100),
    location VARCHAR(255),
    revenue_range VARCHAR(100),
    
    -- Status and Metadata
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'scored', 'outreach_sent', 'responded', 'converted', 'lost')),
    source VARCHAR(100) DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Outreach tracking
    outreach_sent_at TIMESTAMP WITH TIME ZONE,
    outreach_preview TEXT,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table for tracking lead activities
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outreach table for tracking email campaigns
CREATE TABLE IF NOT EXISTS outreach (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    email_subject VARCHAR(500),
    email_body TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table for storing aggregated metrics
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    metric_data JSONB,
    date_recorded DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slack_webhook TEXT,
    openai_api_key TEXT,
    email_notifications BOOLEAN DEFAULT true,
    instant_alerts BOOLEAN DEFAULT true,
    admin_email VARCHAR(255) DEFAULT 'admin@leadcapture.com',
    email_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_fit_band ON leads(fit_band);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON events(lead_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_outreach_lead_id ON outreach(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON outreach(status);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES (
    'admin@leadcapture.com',
    '$2a$10$PLACEHOLDER_HASH_WILL_BE_SET_BY_SCRIPT', -- password hash will be set by create-admin script
    'Admin User',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Sample leads for testing (optional - can be removed in production)
INSERT INTO leads (name, email, company, problem_text, use_case_label, fit_score, fit_band, ai_rationale, status, source) VALUES
(
    'Sarah Mitchell',
    'sarah.mitchell@techflow.com',
    'TechFlow Inc',
    'Interested in your lead management solution for our growing team of 50+ sales reps.',
    'Sales ops',
    92,
    'High',
    'High intent lead with clear use case for sales team automation. Strong fit for our solution.',
    'scored',
    'Website'
),
(
    'David Chen',
    'david@growthstartup.io',
    'Growth Startup',
    'Looking for an AI-powered solution to help scale our lead qualification process.',
    'Internal automation',
    78,
    'Medium',
    'Good fit for automation use case but smaller company size may limit budget.',
    'scored',
    'LinkedIn'
),
(
    'Jennifer Rodriguez',
    'j.rodriguez@marketingpro.com',
    'Marketing Pro',
    'Would like to schedule a demo to see how your platform can improve our ROI.',
    'Sales ops',
    85,
    'High',
    'Strong interest with ROI focus. Good candidate for demo and conversion.',
    'scored',
    'Referral'
),
(
    'Michael Thompson',
    'mike.t@salesforce.dev',
    'SalesForce Dev',
    'Currently evaluating lead management tools. Your AI features look promising.',
    'Data processing',
    71,
    'Medium',
    'Technical background but evaluation stage suggests longer sales cycle.',
    'scored',
    'Google Ads'
),
(
    'Lisa Wang',
    'lisa.wang@enterprise.co',
    'Enterprise Co',
    'Enterprise client interested in bulk lead processing capabilities.',
    'Data processing',
    58,
    'Low',
    'Enterprise client but low engagement and generic inquiry.',
    'scored',
    'Website'
) ON CONFLICT DO NOTHING;
