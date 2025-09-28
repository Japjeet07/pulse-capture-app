-- Sample data for testing the AI Lead Qualifier & Outreach Micro-App
-- This file contains test leads with various characteristics for validation

-- Insert default admin user (password will be set via environment variable)
-- Run: npm run create-admin to create admin user with proper password hash

-- Insert additional sample leads for comprehensive testing
INSERT INTO leads (name, email, company, website, problem_text, use_case_label, fit_score, fit_band, ai_rationale, company_size, industry, location, revenue_range, status, source, created_at) VALUES

-- High Priority Leads
(
    'Alex Johnson',
    'alex.johnson@innovatecorp.com',
    'InnovateCorp',
    'https://innovatecorp.com',
    'We need to automate our lead qualification process for our 200+ person sales team. Currently spending 40+ hours per week on manual lead scoring.',
    'Sales ops',
    95,
    'High',
    'Perfect fit for sales automation with large team and clear pain point. High budget potential and immediate ROI.',
    '201-1000 employees',
    'SaaS Technology',
    'San Francisco, CA',
    '$50M - $100M',
    'scored',
    'Website',
    NOW() - INTERVAL '2 hours'
),

(
    'Maria Rodriguez',
    'maria@techstartup.io',
    'TechStartup',
    'https://techstartup.io',
    'Looking for AI-powered lead management to scale our outbound sales. We process 1000+ leads monthly and need better qualification.',
    'Internal automation',
    88,
    'High',
    'Strong automation use case with high lead volume. Clear scalability needs and growth potential.',
    '51-200 employees',
    'E-commerce',
    'Austin, TX',
    '$10M - $50M',
    'scored',
    'LinkedIn',
    NOW() - INTERVAL '4 hours'
),

-- Medium Priority Leads
(
    'David Kim',
    'david.kim@enterprise-solutions.com',
    'Enterprise Solutions',
    'https://enterprise-solutions.com',
    'Our customer support team is overwhelmed with inquiries. Need automation to categorize and route tickets efficiently.',
    'Customer support',
    72,
    'Medium',
    'Good automation opportunity but may require longer implementation timeline. Medium budget potential.',
    '1000+ employees',
    'Healthcare',
    'Boston, MA',
    '$100M+',
    'scored',
    'Referral',
    NOW() - INTERVAL '1 day'
),

(
    'Sarah Chen',
    'sarah@dataprocessors.com',
    'Data Processors Inc',
    'https://dataprocessors.com',
    'We handle large datasets and need automated lead scoring based on behavioral patterns. Currently using manual Excel processes.',
    'Data processing',
    75,
    'Medium',
    'Solid data processing use case with clear automation potential. May need technical integration support.',
    '51-200 employees',
    'Finance',
    'Seattle, WA',
    '$10M - $50M',
    'scored',
    'Google Ads',
    NOW() - INTERVAL '2 days'
),

-- Low Priority Leads
(
    'Mike Thompson',
    'mike@smallbiz.com',
    'Small Business Co',
    'https://smallbiz.com',
    'Interested in lead management tools for our small team of 5 people. Looking for something simple and affordable.',
    'Other',
    45,
    'Low',
    'Small team size limits automation value. Budget constraints likely. Better fit for basic CRM tools.',
    '1-10 employees',
    'Manufacturing',
    'Denver, CO',
    '$1M - $10M',
    'scored',
    'Website',
    NOW() - INTERVAL '3 days'
),

(
    'Lisa Wang',
    'lisa@consulting-firm.com',
    'Consulting Firm',
    'https://consulting-firm.com',
    'We are a consulting firm looking to improve our lead generation. Not sure what tools we need exactly.',
    'Other',
    38,
    'Low',
    'Vague requirements and unclear automation needs. May not be ready for advanced lead management solutions.',
    '11-50 employees',
    'Education',
    'Chicago, IL',
    '$1M - $10M',
    'scored',
    'Website',
    NOW() - INTERVAL '5 days'
),

-- Edge Cases for Testing
(
    'John Smith',
    'john@testcompany.com',
    'Test Company',
    'https://testcompany.com',
    'This is a test lead to verify the system works correctly.',
    'Internal automation',
    65,
    'Medium',
    'Test lead with moderate scoring for system validation purposes.',
    '11-50 employees',
    'SaaS Technology',
    'New York, NY',
    '$10M - $50M',
    'scored',
    'Website',
    NOW() - INTERVAL '1 hour'
),

(
    'Emma Davis',
    'emma@enterprise-ai.com',
    'Enterprise AI Solutions',
    'https://enterprise-ai.com',
    'We are implementing AI across our organization and need sophisticated lead scoring that integrates with our existing AI infrastructure.',
    'Internal automation',
    92,
    'High',
    'Excellent fit for advanced AI integration. Large enterprise with sophisticated requirements and high budget potential.',
    '1000+ employees',
    'SaaS Technology',
    'San Francisco, CA',
    '$100M+',
    'scored',
    'LinkedIn',
    NOW() - INTERVAL '30 minutes'
);

-- Insert corresponding events for the sample leads
INSERT INTO events (lead_id, event_type, event_data, created_at) 
SELECT 
    l.id,
    'lead_captured',
    JSON_BUILD_OBJECT('source', l.source, 'timestamp', l.created_at),
    l.created_at
FROM leads l 
WHERE l.id NOT IN (SELECT DISTINCT lead_id FROM events WHERE event_type = 'lead_captured');

INSERT INTO events (lead_id, event_type, event_data, created_at)
SELECT 
    l.id,
    'lead_scored',
    JSON_BUILD_OBJECT(
        'use_case_label', l.use_case_label,
        'fit_score', l.fit_score,
        'fit_band', l.fit_band,
        'rationale', l.ai_rationale,
        'timestamp', l.created_at
    ),
    l.created_at + INTERVAL '5 minutes'
FROM leads l 
WHERE l.id NOT IN (SELECT DISTINCT lead_id FROM events WHERE event_type = 'lead_scored');

-- Insert some outreach examples
INSERT INTO outreach (lead_id, email_subject, email_body, status, sent_at, created_at)
SELECT 
    l.id,
    'Quick question about your ' || l.use_case_label || ' needs',
    'Hi ' || l.name || ',

I noticed you''re looking for ' || l.use_case_label || ' solutions. We''ve helped companies like ' || l.company || ' automate their lead processes and typically see 3x faster qualification times.

Would you be open to a 15-minute call this week to discuss your specific needs?

Best regards,
The Pulse Capture Team',
    'sent',
    l.created_at + INTERVAL '1 hour',
    l.created_at + INTERVAL '1 hour'
FROM leads l 
WHERE l.fit_band = 'High' 
AND l.id NOT IN (SELECT DISTINCT lead_id FROM outreach);

-- Insert analytics data
INSERT INTO analytics (metric_name, metric_value, metric_data, date_recorded)
VALUES 
    ('total_leads', 12, '{"source": "sample_data"}', CURRENT_DATE),
    ('high_priority_leads', 4, '{"fit_band": "High"}', CURRENT_DATE),
    ('medium_priority_leads', 4, '{"fit_band": "Medium"}', CURRENT_DATE),
    ('low_priority_leads', 4, '{"fit_band": "Low"}', CURRENT_DATE),
    ('avg_fit_score', 68.5, '{"calculation": "mean"}', CURRENT_DATE),
    ('outreach_sent', 4, '{"status": "sent"}', CURRENT_DATE),
    ('conversion_rate', 25.0, '{"metric": "percentage"}', CURRENT_DATE);
