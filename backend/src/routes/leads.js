const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../database/connection');
const webhookService = require('../services/webhookService');
const { validate, leadSchema } = require('../utils/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Create new lead (public endpoint)
router.post('/', validate(leadSchema), async (req, res) => {
  try {
    const { name, email, company, website, problem_text } = req.body;
    const leadId = uuidv4();

    // Insert lead into database
    const result = await database.query(
      `INSERT INTO leads (id, name, email, company, website, problem_text, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'new') 
       RETURNING *`,
      [leadId, name, email, company, website, problem_text]
    );

    const lead = result.rows[0];

    // Log lead capture event
    await database.query(
      'INSERT INTO events (lead_id, event_type, event_data) VALUES ($1, $2, $3)',
      [leadId, 'lead_captured', JSON.stringify({ source: 'website' })]
    );

    logger.info('Lead captured successfully', { leadId, email });

    // Trigger n8n workflow for all processing
    setImmediate(async () => {
      try {
        // Only trigger n8n workflow - no manual processing
        await webhookService.triggerLeadProcessing(lead);
        logger.info('Lead sent to n8n for processing', { leadId });
      } catch (error) {
        logger.error('Failed to trigger n8n workflow:', error);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Lead captured successfully',
      leadId: leadId
    });
  } catch (error) {
    logger.error('Lead creation error:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// Get lead by ID (public endpoint for thank you page)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.query(
      'SELECT id, name, email, company, status, created_at FROM leads WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = result.rows[0];
    res.json({ success: true, lead });
  } catch (error) {
    logger.error('Lead retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve lead' });
  }
});

module.exports = router;
