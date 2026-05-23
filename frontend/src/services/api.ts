import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthService = {
  checkHealth: async () => {
    const response = await api.get('/health/');
    return response.data;
  },
};

export const monitoringService = {
  getSystemStatus: async () => {
    const response = await api.get('/monitoring/status');
    return response.data;
  },
  checkWebsite: async (url: string) => {
    const response = await api.get('/monitoring/check', { params: { url } });
    return response.data;
  },
  aggregateTelemetry: async (url?: string) => {
    const response = await api.get('/monitoring/aggregate', { params: { url } });
    return response.data;
  },
  getMetrics: async () => {
    const response = await api.get('/monitoring/metrics');
    return response.data;
  },
  getLogs: async () => {
    const response = await api.get('/monitoring/logs');
    return response.data;
  },
  getDeployments: async () => {
    const response = await api.get('/monitoring/deployments');
    return response.data;
  }
};

export const correlationService = {
  getActiveIncident: async (url: string) => {
    const response = await api.get('/incidents/active', { params: { url } });
    return response.data;
  },
  getRecentIncidents: async () => {
    const response = await api.get('/incidents/recent');
    return response.data;
  }
};

export const aiService = {
  analyzeIncident: async (incident: any) => {
    const response = await api.post('/ai/analyze', incident);
    return response.data;
  },
  askCopilot: async (message: string, context?: any) => {
    const response = await api.post('/ai/copilot', { message, context });
    return response.data;
  }
};

export const reportService = {
  downloadPdf: () => {
    window.open(`${API_BASE_URL}/reports/pdf`, '_blank');
  },
  downloadJson: () => {
    window.open(`${API_BASE_URL}/reports/json`, '_blank');
  },
  downloadCsv: () => {
    window.open(`${API_BASE_URL}/reports/csv`, '_blank');
  }
};
