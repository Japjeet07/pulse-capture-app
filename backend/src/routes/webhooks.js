const express = require('express');
const database = require('../database/connection');
const logger = require('../utils/logger');

const router = express.Router();

// Webhook endpoint for n8n lead processing results
router.post('/lead-processing', async (req, res) => {
  try {
    const { 
      lead_id, 
      use_case_label, 
      fit_score, 
      fit_band, 
      ai_rationale, 
      company_size, 
      industry, 
      location, 
      revenue_range 
    } = req.body;

    if (!lead_id) {
      return res.status(400).json({ error: 'lead_id is required' });
    }

    logger.info('Lead processing results received from n8n', { lead_id });

    // Update lead with AI analysis from n8n
    await database.query(
      `UPDATE leads SET 
       use_case_label = $1, fit_score = $2, fit_band = $3, ai_rationale = $4, 
       company_size = $5, industry = $6, location = $7, revenue_range = $8, status = 'scored'
       WHERE id = $9`,
      [use_case_label, fit_score, fit_band, ai_rationale, company_size, industry, location, revenue_range, lead_id]
    );

    // Log scoring event
    await database.query(
      'INSERT INTO events (lead_id, event_type, event_data) VALUES ($1, $2, $3)',
      [lead_id, 'lead_scored', JSON.stringify({ 
        use_case_label, fit_score, fit_band, ai_rationale,
        company_size, industry, location, revenue_range 
      })]
    );

    logger.info('Lead updated from n8n processing', { lead_id, score: fit_score });

    res.json({
      success: true,
      message: 'Lead processing completed'
    });
  } catch (error) {
    logger.error('Lead processing webhook failed:', error);
    res.status(500).json({ error: 'Lead processing failed' });
  }
});

// Webhook endpoint for n8n outreach results
router.post('/send-outreach', async (req, res) => {
  try {
    const { 
      lead_id, 
      email_subject, 
      email_body, 
      outreach_status = 'sent' 
    } = req.body;

    if (!lead_id) {
      return res.status(400).json({ error: 'lead_id is required' });
    }

    logger.info('Outreach results received from n8n', { lead_id });

    // Store outreach in database
    const outreachResult = await database.query(
      `INSERT INTO outreach (lead_id, email_subject, email_body, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [lead_id, email_subject, email_body, outreach_status]
    );

    const outreach = outreachResult.rows[0];

    // Update lead status
    await database.query(
      `UPDATE leads SET 
       status = $1, outreach_sent_at = $2, outreach_preview = $3 
       WHERE id = $4`,
      ['outreach_sent', new Date(), email_body.substring(0, 200) + '...', lead_id]
    );

    // Log outreach event
    await database.query(
      'INSERT INTO events (lead_id, event_type, event_data) VALUES ($1, $2, $3)',
      [lead_id, 'outreach_sent', JSON.stringify({ 
        subject: email_subject,
        sent_at: new Date()
      })]
    );

    logger.info('Outreach recorded from n8n', { lead_id, outreach_id: outreach.id });

    res.json({
      success: true,
      message: 'Outreach processing completed',
      lead_id: lead_id,
      outreach: outreach
    });
  } catch (error) {
    logger.error('Outreach webhook failed:', error);
    res.status(500).json({ error: 'Outreach processing failed' });
  }
});

// Test webhook endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;