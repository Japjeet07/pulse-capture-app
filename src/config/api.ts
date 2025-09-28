/* eslint-disable @typescript-eslint/no-explicit-any */
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
    
    // Lead endpoints
    SUBMIT_LEAD: '/api/leads',
    GET_LEAD: '/api/leads',
    
    // Admin endpoints
    GET_LEADS: '/api/admin/leads',
    GET_LEAD_DETAILS: '/api/admin/leads',
    UPDATE_LEAD: '/api/admin/leads',
    SEND_OUTREACH: '/api/admin/leads',
    GET_STATS: '/api/admin/stats',
    
    // Webhook endpoints
    WEBHOOK_LEAD_PROCESSING: '/api/webhooks/lead-processing',
    WEBHOOK_SEND_OUTREACH: '/api/webhooks/send-outreach',
    
    // Settings endpoints
    GET_SETTINGS: '/api/settings',
    UPDATE_SETTINGS: '/api/settings',
    TEST_SLACK: '/api/settings/test/slack',
    TEST_OPENAI: '/api/settings/test/openai',
    TEST_EMAIL: '/api/settings/test/email',
    TEST_N8N: '/api/settings/test/n8n',
    
    // Health check
    HEALTH: '/health'
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  
  return url;
};

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  problem_text: string;
  use_case_label?: string;
  fit_score?: number;
  fit_band?: 'High' | 'Medium' | 'Low';
  ai_rationale?: string;
  company_size?: string;
  industry?: string;
  location?: string;
  revenue_range?: string;
  status: 'new' | 'scored' | 'outreach_sent' | 'responded' | 'converted' | 'lost';
  source: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  outreach_sent_at?: string;
  outreach_preview?: string;
}

export interface LeadSubmission {
  name: string;
  email: string;
  company?: string;
  website?: string;
  problem_text: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Stats {
  total_leads: number;
  new_leads: number;
  scored_leads: number;
  outreach_sent: number;
  responded: number;
  converted: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  avg_score: number;
}

export interface Event {
  id: string;
  lead_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}
