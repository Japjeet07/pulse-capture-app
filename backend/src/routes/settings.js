const express = require('express');
const database = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const n8nService = require('../services/n8nService');

const router = express.Router();

// Get all settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await database.query(
      'SELECT * FROM settings ORDER BY created_at DESC LIMIT 1'
    );

    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        slack_webhook: '',
        openai_api_key: '',
        email_notifications: true,
        instant_alerts: true,
        admin_email: 'admin@leadcapture.com',
        email_template: `Hi {{name}},

Thank you for your interest in LeadCapture Pro! 

Based on your message about {{company}}, I believe our AI-powered lead management platform could be a great fit for your team.

Would you be available for a quick 15-minute demo this week?

Best regards,
Your Sales Team`
      });
    }

    const settings = result.rows[0];
    res.json(settings);
  } catch (error) {
    logger.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      slack_webhook,
      openai_api_key,
      email_notifications,
      instant_alerts,
      admin_email,
      email_template
    } = req.body;

    // Check if settings exist
    const existingSettings = await database.query(
      'SELECT id FROM settings ORDER BY created_at DESC LIMIT 1'
    );

    let result;
    if (existingSettings.rows.length > 0) {
      // Update existing settings
      result =         await database.query(
          `UPDATE settings SET 
           slack_webhook = $1, openai_api_key = $2, email_notifications = $3, 
           instant_alerts = $4, admin_email = $5, email_template = $6, updated_at = NOW()
           WHERE id = $7 RETURNING *`,
          [
            slack_webhook, openai_api_key, email_notifications, instant_alerts,
            admin_email, email_template, existingSettings.rows[0].id
          ]
        );
    } else {
      // Create new settings
      result = await database.query(
        `INSERT INTO settings (
          slack_webhook, openai_api_key, email_notifications, instant_alerts,
          admin_email, email_template
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          slack_webhook, openai_api_key, email_notifications, instant_alerts,
          admin_email, email_template
        ]
      );
    }

    const settings = result.rows[0];

    // Update environment variables for immediate effect
    if (slack_webhook) {
      process.env.SLACK_WEBHOOK_URL = slack_webhook;
    }
    if (openai_api_key) {
      process.env.OPENAI_API_KEY = openai_api_key;
    }

    // Note: n8n workflows now fetch settings directly from database
    // No need to sync settings to n8n files anymore

    logger.info('Settings updated successfully', { 
      slack_webhook: !!slack_webhook, 
      openai_api_key: !!openai_api_key 
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    logger.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Test Slack integration
router.post('/test/slack', authenticateToken, async (req, res) => {
  try {
    const { slack_webhook } = req.body;
    
    if (!slack_webhook) {
      return res.status(400).json({ error: 'Slack webhook URL is required' });
    }

    // Test Slack webhook
    const response = await fetch(slack_webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: '🎉 LeadCapture Pro integration test successful!',
        attachments: [{
          color: 'good',
          fields: [{
            title: 'Test Message',
            value: 'Your Slack integration is working correctly.',
            short: false
          }]
        }]
      })
    });

    if (response.ok) {
      res.json({ success: true, message: 'Slack integration test successful' });
    } else {
      throw new Error(`Slack webhook test failed: ${response.status}`);
    }
  } catch (error) {
    logger.error('Slack integration test failed:', error);
    res.status(500).json({ error: 'Slack integration test failed' });
  }
});

// Test OpenAI integration
router.post('/test/openai', authenticateToken, async (req, res) => {
  try {
    const { openai_api_key } = req.body;
    
    if (!openai_api_key) {
      return res.status(400).json({ error: 'OpenAI API key is required' });
    }

    // Test OpenAI API
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${openai_api_key}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      res.json({ success: true, message: 'OpenAI integration test successful' });
    } else {
      throw new Error(`OpenAI API test failed: ${response.status}`);
    }
  } catch (error) {
    logger.error('OpenAI integration test failed:', error);
    res.status(500).json({ error: 'OpenAI integration test failed' });
  }
});

// Test email configuration (no actual sending)
router.post('/test/email', authenticateToken, async (req, res) => {
  try {
    const { admin_email, email_template } = req.body;
    
    if (!admin_email) {
      return res.status(400).json({ error: 'Admin email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate template has required placeholders
    if (email_template && !email_template.includes('{{name}}')) {
      return res.status(400).json({ error: 'Email template must include {{name}} placeholder' });
    }

    res.json({ 
      success: true, 
      message: 'Email configuration is valid - n8n will handle actual sending' 
    });
  } catch (error) {
    logger.error('Email test failed:', error);
    res.status(500).json({ error: 'Email test failed' });
  }
});

// Test n8n connection
router.post('/test/n8n', authenticateToken, async (req, res) => {
  try {
    const result = await n8nService.testConnection();
    
    if (result.success) {
      res.json({ success: true, message: 'n8n connection successful' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    logger.error('n8n connection test failed:', error);
    res.status(500).json({ error: 'n8n connection test failed' });
  }
});

module.exports = router;
