const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class N8nService {
  constructor() {
    this.n8nBaseUrl = process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.n8nApiKey = process.env.N8N_API_KEY;
  }

  // Get n8n credentials
  async getCredentials() {
    try {
      const response = await axios.get(`${this.n8nBaseUrl}/api/credentials`, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch n8n credentials:', error);
      throw new Error('Failed to fetch n8n credentials');
    }
  }

  // Update Slack webhook credential
  async updateSlackCredential(webhookUrl) {
    try {
      if (!webhookUrl) {
        logger.warn('No Slack webhook URL provided, skipping credential update');
        return { success: true, message: 'No webhook URL provided' };
      }

      // First, get existing credentials to find Slack credential ID
      const credentials = await this.getCredentials();
      const slackCredential = credentials.data.find(cred => 
        cred.type === 'slackApi' || cred.name.toLowerCase().includes('slack')
      );

      if (slackCredential) {
        // Update existing credential
        const updateData = {
          name: slackCredential.name,
          type: 'slackApi',
          data: {
            webhookUrl: webhookUrl
          }
        };

        await axios.patch(
          `${this.n8nBaseUrl}/api/credentials/${slackCredential.id}`,
          updateData,
          {
            headers: {
              'X-N8N-API-KEY': this.n8nApiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.info('Slack credential updated successfully', { 
          credentialId: slackCredential.id 
        });
      } else {
        // Create new credential
        const newCredential = {
          name: 'LeadCapture Slack Webhook',
          type: 'slackApi',
          data: {
            webhookUrl: webhookUrl
          }
        };

        const response = await axios.post(
          `${this.n8nBaseUrl}/api/credentials`,
          newCredential,
          {
            headers: {
              'X-N8N-API-KEY': this.n8nApiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.info('New Slack credential created', { 
          credentialId: response.data.id 
        });
      }

      return { success: true, message: 'Slack credential updated successfully' };
    } catch (error) {
      logger.error('Failed to update Slack credential:', error);
      throw new Error('Failed to update Slack credential');
    }
  }

  // Update OpenAI API key credential
  async updateOpenAICredential(apiKey) {
    try {
      if (!apiKey) {
        logger.warn('No OpenAI API key provided, skipping credential update');
        return { success: true, message: 'No API key provided' };
      }

      // First, get existing credentials to find OpenAI credential ID
      const credentials = await this.getCredentials();
      const openaiCredential = credentials.data.find(cred => 
        cred.type === 'openAiApi' || cred.name.toLowerCase().includes('openai')
      );

      if (openaiCredential) {
        // Update existing credential
        const updateData = {
          name: openaiCredential.name,
          type: 'openAiApi',
          data: {
            apiKey: apiKey
          }
        };

        await axios.patch(
          `${this.n8nBaseUrl}/api/credentials/${openaiCredential.id}`,
          updateData,
          {
            headers: {
              'X-N8N-API-KEY': this.n8nApiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.info('OpenAI credential updated successfully', { 
          credentialId: openaiCredential.id 
        });
      } else {
        // Create new credential
        const newCredential = {
          name: 'LeadCapture OpenAI API',
          type: 'openAiApi',
          data: {
            apiKey: apiKey
          }
        };

        const response = await axios.post(
          `${this.n8nBaseUrl}/api/credentials`,
          newCredential,
          {
            headers: {
              'X-N8N-API-KEY': this.n8nApiKey,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.info('New OpenAI credential created', { 
          credentialId: response.data.id 
        });
      }

      return { success: true, message: 'OpenAI credential updated successfully' };
    } catch (error) {
      logger.error('Failed to update OpenAI credential:', error);
      throw new Error('Failed to update OpenAI credential');
    }
  }

  // Update workflow to use new credentials
  async updateWorkflowCredentials(workflowId, credentialMappings) {
    try {
      // Get current workflow
      const workflowResponse = await axios.get(
        `${this.n8nBaseUrl}/api/workflows/${workflowId}`,
        {
          headers: {
            'X-N8N-API-KEY': this.n8nApiKey
          }
        }
      );

      const workflow = workflowResponse.data;

      // Update nodes with new credential IDs
      workflow.nodes.forEach(node => {
        if (credentialMappings[node.type]) {
          node.credentials = {
            [credentialMappings[node.type].credentialType]: {
              id: credentialMappings[node.type].credentialId,
              name: credentialMappings[node.type].credentialName
            }
          };
        }
      });

      // Update workflow
      await axios.put(
        `${this.n8nBaseUrl}/api/workflows/${workflowId}`,
        workflow,
        {
          headers: {
            'X-N8N-API-KEY': this.n8nApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Workflow credentials updated successfully', { workflowId });
      return { success: true };
    } catch (error) {
      logger.error('Failed to update workflow credentials:', error);
      throw new Error('Failed to update workflow credentials');
    }
  }

  // Test n8n connection
  async testConnection() {
    try {
      const response = await axios.get(`${this.n8nBaseUrl}/api/credentials`, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey
        }
      });
      return { success: true, message: 'n8n connection successful' };
    } catch (error) {
      logger.error('n8n connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Update n8n workflow with new webhook URL
  async updateWorkflowWebhook(webhookUrl) {
    try {
      if (!webhookUrl) {
        logger.warn('No webhook URL provided, skipping workflow update');
        return { success: true, message: 'No webhook URL provided' };
      }

      const results = [];
      
      // Update on-new-lead workflow
      const onNewLeadPath = path.join(__dirname, '../../../n8n-workflows/on-new-lead.json');
      if (fs.existsSync(onNewLeadPath)) {
        const onNewLeadWorkflow = JSON.parse(fs.readFileSync(onNewLeadPath, 'utf8'));
        const slackNode = onNewLeadWorkflow.nodes.find(node => 
          node.name === 'Send Slack Notification' && 
          node.type === 'n8n-nodes-base.httpRequest'
        );

        if (slackNode) {
          // Use the actual webhook URL from database instead of env variable
          slackNode.parameters.url = webhookUrl;
          fs.writeFileSync(onNewLeadPath, JSON.stringify(onNewLeadWorkflow, null, 2));
          results.push('on-new-lead workflow updated');
        }
      }

      // Update send-outreach workflow
      const sendOutreachPath = path.join(__dirname, '../../../n8n-workflows/send-outreach.json');
      if (fs.existsSync(sendOutreachPath)) {
        const sendOutreachWorkflow = JSON.parse(fs.readFileSync(sendOutreachPath, 'utf8'));
        const slackNode = sendOutreachWorkflow.nodes.find(node => 
          node.name === 'Send Outreach Slack Notification' && 
          node.type === 'n8n-nodes-base.httpRequest'
        );

        if (slackNode) {
          // Use the actual webhook URL from database instead of env variable
          slackNode.parameters.url = webhookUrl;
          fs.writeFileSync(sendOutreachPath, JSON.stringify(sendOutreachWorkflow, null, 2));
          results.push('send-outreach workflow updated');
        }
      }
      
      logger.info('Workflows updated with new webhook URL', { 
        webhookUrl: webhookUrl.substring(0, 50) + '...',
        results
      });
      
      return { success: true, message: 'Workflows updated successfully', results };
    } catch (error) {
      logger.error('Failed to update workflow webhook:', error);
      throw new Error('Failed to update workflow webhook');
    }
  }

  // Update n8n workflow with new OpenAI API key
  async updateWorkflowOpenAI(apiKey) {
    try {
      if (!apiKey) {
        logger.warn('No OpenAI API key provided, skipping workflow update');
        return { success: true, message: 'No API key provided' };
      }

      // Read the workflow file
      const fs = require('fs');
      const path = require('path');
      const workflowPath = path.join(__dirname, '../../../n8n-workflows/on-new-lead.json');
      
      if (!fs.existsSync(workflowPath)) {
        throw new Error('Workflow file not found');
      }

      const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      
      // Find and update the OpenAI node
      const openaiNode = workflow.nodes.find(node => 
        node.name === 'AI Lead Scoring' && 
        node.type === 'n8n-nodes-base.openAi'
      );

      if (openaiNode) {
        // Update the API key in the workflow
        if (!openaiNode.parameters) {
          openaiNode.parameters = {};
        }
        openaiNode.parameters.apiKey = apiKey;
        
        // Save the updated workflow back to file
        fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2));
        
        logger.info('Workflow updated with new OpenAI API key', { 
          apiKey: apiKey.substring(0, 10) + '...' 
        });
        
        return { success: true, message: 'OpenAI API key updated successfully' };
      } else {
        throw new Error('OpenAI node not found in workflow');
      }
    } catch (error) {
      logger.error('Failed to update workflow OpenAI key:', error);
      throw new Error('Failed to update workflow OpenAI key');
    }
  }

  // Sync all settings to n8n
  async syncSettingsToN8n(settings) {
    try {
      const results = [];

      // Update workflow with new Slack webhook URL
      if (settings.slack_webhook) {
        const webhookResult = await this.updateWorkflowWebhook(settings.slack_webhook);
        results.push(webhookResult);
      }

      // Update workflow with new OpenAI API key
      if (settings.openai_api_key) {
        const openaiResult = await this.updateWorkflowOpenAI(settings.openai_api_key);
        results.push(openaiResult);
      }

      logger.info('Settings synced to n8n successfully', { results });
      return { success: true, results };
    } catch (error) {
      logger.error('Failed to sync settings to n8n:', error);
      throw new Error('Failed to sync settings to n8n');
    }
  }
}

module.exports = new N8nService();
