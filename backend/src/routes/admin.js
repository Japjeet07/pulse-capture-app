const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const database = require('../database/connection');
const webhookService = require('../services/webhookService');
const { validate, loginSchema } = require('../utils/validation');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get all leads with pagination and filtering
router.get('/leads', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, fit_band, use_case_label, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT l.*, 
             COUNT(e.id) as event_count,
             MAX(e.created_at) as last_activity_at
      FROM leads l
      LEFT JOIN events e ON l.id = e.lead_id
    `;
    
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (fit_band) {
      conditions.push(`l.fit_band = $${++paramCount}`);
      params.push(fit_band);
    }

    if (use_case_label) {
      conditions.push(`l.use_case_label = $${++paramCount}`);
      params.push(use_case_label);
    }

    if (status) {
      conditions.push(`l.status = $${++paramCount}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      GROUP BY l.id
      ORDER BY l.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(limit, offset);

    const result = await database.query(query, params);
    const leads = result.rows;

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM leads l';
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    const countResult = await database.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      leads,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    logger.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get lead by ID
router.get('/leads/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const leadResult = await database.query(
      'SELECT * FROM leads WHERE id = $1',
      [id]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = leadResult.rows[0];

    // Get events for this lead
    const eventsResult = await database.query(
      'SELECT * FROM events WHERE lead_id = $1 ORDER BY created_at DESC',
      [id]
    );

    res.json({
      lead,
      events: eventsResult.rows
    });
  } catch (error) {
    logger.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const statsResult = await database.query(`
      SELECT 
        COUNT(*) as total_leads,
        COUNT(CASE WHEN fit_band = 'High' THEN 1 END) as high_priority,
        COUNT(CASE WHEN fit_band = 'Medium' THEN 1 END) as medium_priority,
        COUNT(CASE WHEN fit_band = 'Low' THEN 1 END) as low_priority,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
        COUNT(CASE WHEN status = 'scored' THEN 1 END) as scored_leads,
        COUNT(CASE WHEN status = 'outreach_sent' THEN 1 END) as outreach_sent,
        COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
        AVG(fit_score) as avg_score
      FROM leads
    `);

    const stats = statsResult.rows[0];

    // Get top 10 source statistics with company information
    const sourceStatsResult = await database.query(`
      SELECT 
        COALESCE(company, 'Unknown Company') as source,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage,
        STRING_AGG(DISTINCT website, ', ') as websites
      FROM leads 
      WHERE company IS NOT NULL AND company != ''
      GROUP BY company 
      ORDER BY count DESC
      LIMIT 10
    `);

    const source_stats = sourceStatsResult.rows;

    // Get top 10 recent activity
    const recentActivityResult = await database.query(`
      SELECT 
        e.event_type,
        e.event_data,
        e.created_at,
        l.name as lead_name,
        l.email as lead_email
      FROM events e
      JOIN leads l ON e.lead_id = l.id
      ORDER BY e.created_at DESC
      LIMIT 10
    `);

    const recent_activity = recentActivityResult.rows;

    res.json({ 
      stats,
      source_stats,
      recent_activity
    });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Send outreach to a lead
router.post('/leads/:id/outreach', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get lead details
    const leadResult = await database.query(
      'SELECT * FROM leads WHERE id = $1',
      [id]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = leadResult.rows[0];

    // Trigger outreach webhook
    await webhookService.triggerOutreach(id);

    // Update lead status
    await database.query(
      'UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2',
      ['outreach_sent', id]
    );

    // Log outreach event
    await database.query(
      'INSERT INTO events (lead_id, event_type, event_data) VALUES ($1, $2, $3)',
      [id, 'outreach_sent', JSON.stringify({ message: 'Outreach email sent to lead' })]
    );

    res.json({ 
      success: true, 
      message: 'Outreach sent successfully',
      data: {
        message: 'Outreach sent successfully',
        leadId: id
      }
    });
  } catch (error) {
    logger.error('Error sending outreach:', error);
    res.status(500).json({ error: 'Failed to send outreach' });
  }
});

// Get outreach data for a lead
router.get('/leads/:id/outreach', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get outreach data for this lead
    const outreachResult = await database.query(
      'SELECT * FROM outreach WHERE lead_id = $1 ORDER BY sent_at DESC LIMIT 1',
      [id]
    );

    if (outreachResult.rows.length === 0) {
      return res.status(404).json({ error: 'No outreach data found for this lead' });
    }

    const outreach = outreachResult.rows[0];

    res.json({
      success: true,
      data: {
        email_subject: outreach.email_subject,
        email_body: outreach.email_body,
        status: outreach.status,
        sent_at: outreach.sent_at
      }
    });
  } catch (error) {
    logger.error('Error fetching outreach data:', error);
    res.status(500).json({ error: 'Failed to fetch outreach data' });
  }
});

// Get all admin users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await database.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ users: result.rows });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add new admin user
router.post('/users', authenticateToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await database.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userId = uuidv4();
    const result = await database.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at',
      [userId, name, email, hashedPassword, 'admin']
    );

    logger.info('New admin user created', { userId, email });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// Update user
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Check if user exists
    const existingUser = await database.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const result = await database.query(
      'UPDATE users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, updated_at',
      [name, email, role, id]
    );

    logger.info('User updated', { userId: id, email });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await database.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await database.query('DELETE FROM users WHERE id = $1', [id]);

    logger.info('User deleted', { userId: id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;