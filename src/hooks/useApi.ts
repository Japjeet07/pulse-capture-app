/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { ApiResponse } from '../config/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: execute };
}

// Hook for lead submission
export function useLeadSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLead = async (leadData: {
    name: string;
    email: string;
    company?: string;
    website?: string;
    problem_text: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiService.submitLead(leadData);
      
      if (response.success) {
        setSuccess(true);
        return response.data?.leadId;
      } else {
        setError(response.error || 'Failed to submit lead');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitLead, loading, error, success };
}

// Note: useAuth is now provided by AuthContext, not this file

// Hook for leads management
export function useLeads(params?: {
  page?: number;
  limit?: number;
  status?: string;
  fit_band?: string;
  use_case_label?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}) {
  return useApi(
    () => apiService.getLeads(params),
    [params?.page, params?.limit, params?.status, params?.fit_band, params?.use_case_label, params?.search, params?.sort_by, params?.sort_order]
  );
}

// Hook for lead details
export function useLeadDetails(leadId: string | null) {
  return useApi(
    () => leadId ? apiService.getLeadDetails(leadId) : Promise.resolve({ success: false, error: 'No lead ID provided' }),
    [leadId]
  );
}

// Hook for stats
export function useStats() {
  return useApi(() => apiService.getStats());
}

// Hook for outreach
export function useOutreach() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOutreach = async (leadId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.sendOutreach(leadId);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to send outreach');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send outreach');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendOutreach, loading, error };
}
