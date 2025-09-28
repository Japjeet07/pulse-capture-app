import { API_CONFIG, buildApiUrl, ApiResponse, Lead, LeadSubmission, AuthResponse, User, Stats, Event } from '../config/api';

interface SettingsData {
  slack_webhook: string;
  openai_api_key: string;
  email_notifications: boolean;
  instant_alerts: boolean;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('auth-token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
  }

  // Get authentication headers
  private getHeaders(requiresAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      } else {
        console.error('No token available for authenticated request');
        throw new Error('Access token required');
      }
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit & { requiresAuth?: boolean } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = buildApiUrl(endpoint);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(options.requiresAuth),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.HEALTH);
  }

  // Authentication methods
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
    });

    this.setToken(null);
    return response;
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>(API_CONFIG.ENDPOINTS.VERIFY);
  }

  // Lead methods
  async submitLead(leadData: LeadSubmission): Promise<ApiResponse<{ leadId: string }>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUBMIT_LEAD);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.getHeaders(false), // Lead submission should not require authentication
        },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Backend returns { success: true, message: '...', leadId: '...' }
      // Convert to expected format: { success: true, data: { leadId: '...' } }
      return {
        success: data.success,
        data: { leadId: data.leadId },
        message: data.message
      };
    } catch (error) {
      console.error('Lead submission failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getLead(leadId: string): Promise<ApiResponse<{ lead: Lead }>> {
    return this.request<{ lead: Lead }>(`${API_CONFIG.ENDPOINTS.GET_LEAD}/${leadId}`);
  }

  // Admin methods
  async getLeads(params?: {
    page?: number;
    limit?: number;
    status?: string;
    fit_band?: string;
    use_case_label?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Promise<ApiResponse<{ leads: Lead[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `${API_CONFIG.ENDPOINTS.GET_LEADS}?${queryParams.toString()}`
      : API_CONFIG.ENDPOINTS.GET_LEADS;

    try {
      const url = buildApiUrl(endpoint);
      const response = await fetch(url, {
        headers: {
          ...this.getHeaders(true),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // The backend returns { leads, pagination } directly
      return {
        success: true,
        data: {
          leads: data.leads || [],
          pagination: data.pagination || {}
        }
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getLeadDetails(leadId: string): Promise<ApiResponse<{ lead: Lead & { events: Event[]; outreach: unknown[] } }>> {
    return this.request<{ lead: Lead & { events: Event[]; outreach: unknown[] } }>(`${API_CONFIG.ENDPOINTS.GET_LEAD_DETAILS}/${leadId}`, { requiresAuth: true });
  }

  async updateLead(leadId: string, updates: Partial<Lead>): Promise<ApiResponse<{ lead: Lead }>> {
    return this.request<{ lead: Lead }>(`${API_CONFIG.ENDPOINTS.UPDATE_LEAD}/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async sendOutreach(leadId: string): Promise<ApiResponse<{ message: string; leadId: string }>> {
    return this.request<{ message: string; leadId: string }>(`${API_CONFIG.ENDPOINTS.SEND_OUTREACH}/${leadId}/outreach`, {
      method: 'POST',
      requiresAuth: true,
    });
  }

  async getStats(): Promise<ApiResponse<{ stats: Stats; source_stats: { source: string; count: number; percentage: number }[]; recent_activity: unknown[] }>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GET_STATS);
      const response = await fetch(url, {
        headers: {
          ...this.getHeaders(true),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // The backend returns { stats, source_stats, recent_activity } directly
      return {
        success: true,
        data: {
          stats: data.stats || {},
          source_stats: data.source_stats || [],
          recent_activity: data.recent_activity || []
        }
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Webhook methods (for testing)
  async triggerLeadProcessing(leadData: unknown): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.WEBHOOK_LEAD_PROCESSING, {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async triggerSendOutreach(leadId: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.WEBHOOK_SEND_OUTREACH, {
      method: 'POST',
      body: JSON.stringify({ lead_id: leadId }),
    });
  }

  // Settings methods
  async getSettings(): Promise<ApiResponse<SettingsData>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.GET_SETTINGS);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.getHeaders(true),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Backend returns settings directly, so we need to wrap it
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateSettings(settings: SettingsData): Promise<ApiResponse<SettingsData>> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.UPDATE_SETTINGS);
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...this.getHeaders(true),
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Backend returns { success: true, message: '...' }
      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async testSlackIntegration(slackWebhook: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TEST_SLACK, {
      method: 'POST',
      body: JSON.stringify({ slack_webhook: slackWebhook }),
      requiresAuth: true
    });
  }

  async testOpenAIIntegration(openaiApiKey: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TEST_OPENAI, {
      method: 'POST',
      body: JSON.stringify({ openai_api_key: openaiApiKey }),
      requiresAuth: true
    });
  }

  async testEmailIntegration(adminEmail: string, emailTemplate: string): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TEST_EMAIL, {
      method: 'POST',
      body: JSON.stringify({ admin_email: adminEmail, email_template: emailTemplate }),
      requiresAuth: true
    });
  }

  async testN8nIntegration(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.TEST_N8N, {
      method: 'POST',
      requiresAuth: true
    });
  }

  async getOutreachData(leadId: string): Promise<ApiResponse<{ email_subject: string; email_body: string; status: string; sent_at: string }>> {
    return this.request(`${API_CONFIG.ENDPOINTS.GET_LEAD_DETAILS}/${leadId}/outreach`, {
      method: 'GET',
      requiresAuth: true
    });
  }

  // Admin management methods
  async getAdminUsers(): Promise<ApiResponse<{ users: User[] }>> {
    try {
      const url = buildApiUrl('/api/admin/users');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.getHeaders(true),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Backend returns { users: [...] } directly, so we need to wrap it
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async createAdminUser(userData: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User }>> {
    try {
      const url = buildApiUrl('/api/admin/users');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.getHeaders(true),
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Backend returns { success: true, message: '...', user: {...} }
      return {
        success: data.success,
        data: { user: data.user },
        message: data.message
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async updateAdminUser(userId: string, userData: { name: string; email: string; role: string }): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      requiresAuth: true
    });
  }

  async deleteAdminUser(userId: string): Promise<ApiResponse> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      requiresAuth: true
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
