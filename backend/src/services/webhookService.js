const axios = require('axios');
const logger = require('../utils/logger');

class WebhookService {
  async triggerLeadProcessing(leadData) {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_A;
      
      if (!webhookUrl) {
        logger.warn('N8N_WEBHOOK_A not configured, skipping webhook call');
        return { success: false, reason: 'Webhook URL not configured' };
      }

      const payload = {
        lead_id: leadData.id,
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        website: leadData.website,
        problem_text: leadData.problem_text,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(webhookUrl, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PulseCapture-Backend/1.0'
        }
      });

      logger.info('Lead processing webhook triggered successfully', {
        leadId: leadData.id,
        status: response.status
      });

      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      logger.error('Failed to trigger lead processing webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async triggerOutreach(leadId) {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_B;
      
      if (!webhookUrl) {
        logger.warn('N8N_WEBHOOK_B not configured, skipping webhook call');
        return { success: false, reason: 'Webhook URL not configured' };
      }

      const payload = {
        lead_id: leadId,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(webhookUrl, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PulseCapture-Backend/1.0'
        }
      });

      logger.info('Outreach webhook triggered successfully', {
        leadId: leadId,
        status: response.status,
        responseData: response.data
      });

      // Check if n8n returned an error (HTTP 4xx/5xx or success: false)
      if (response.status >= 400 || (response.data && response.data.success === false)) {
        logger.error('n8n workflow returned error:', {
          status: response.status,
          data: response.data
        });
        return {
          success: false,
          error: response.data?.error || `n8n workflow failed with status ${response.status}`,
          data: response.data
        };
      }

      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      logger.error('Failed to trigger outreach webhook:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendSlackNotification(leadData, aiAnalysis) {
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL;
      
      if (!webhookUrl) {
        logger.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
        return { success: false, reason: 'Slack webhook not configured' };
      }

      const message = {
        text: `🎯 New Lead: ${leadData.name}`,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `🎯 New Lead: ${leadData.name}`
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Email:* ${leadData.email}`
              },
              {
                type: "mrkdwn",
                text: `*Company:* ${leadData.company || 'Not provided'}`
              },
              {
                type: "mrkdwn",
                text: `*Score:* ${aiAnalysis.fit_score}/100 (${aiAnalysis.fit_band})`
              },
              {
                type: "mrkdwn",
                text: `*Use Case:* ${aiAnalysis.use_case_label}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Message:* ${leadData.problem_text}`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*AI Rationale:* ${aiAnalysis.rationale}`
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "View in Dashboard"
                },
                url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
                style: "primary"
              }
            ]
          }
        ]
      };

      const response = await axios.post(webhookUrl, message, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      logger.info('Slack notification sent successfully', {
        leadId: leadData.id,
        status: response.status
      });

      return {
        success: true,
        status: response.status
      };
    } catch (error) {
      logger.error('Failed to send Slack notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new WebhookService();
