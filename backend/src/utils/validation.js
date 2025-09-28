const Joi = require('joi');

// Lead validation schemas
const leadSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  company: Joi.string().max(255).optional(),
  website: Joi.string().uri().optional(),
  problem_text: Joi.string().min(10).max(2000).required()
});

const leadUpdateSchema = Joi.object({
  status: Joi.string().valid('new', 'scored', 'outreach_sent', 'responded', 'converted', 'lost').optional(),
  use_case_label: Joi.string().max(100).optional(),
  fit_score: Joi.number().integer().min(0).max(100).optional(),
  fit_band: Joi.string().valid('High', 'Medium', 'Low').optional(),
  ai_rationale: Joi.string().max(1000).optional()
});

// Auth validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Webhook validation schemas
const webhookLeadSchema = Joi.object({
  lead_id: Joi.string().uuid().required()
});

const webhookLeadPayloadSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  company: Joi.string().max(255).optional(),
  website: Joi.string().uri().optional(),
  problem_text: Joi.string().min(10).max(2000).required()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    req.body = value;
    next();
  };
};

// Query parameter validation
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({
        error: 'Query validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    req.query = value;
    next();
  };
};

module.exports = {
  leadSchema,
  leadUpdateSchema,
  loginSchema,
  webhookLeadSchema,
  webhookLeadPayloadSchema,
  validate,
  validateQuery
};
