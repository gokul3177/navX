/**
 * @file api.js
 * @description Centralized API service.
 * Wraps fetch calls to the backend, handles JSON parsing, error throwing,
 * and base URL resolution.
 */

// Uses the environment variable if available, otherwise defaults to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (e.g., '/simulate')
 * @param {RequestInit} [options={}] - fetch options
 * @returns {Promise<any>} Response data
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Invalid JSON response from server: ${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  /**
   * Run simulation on backend and save result.
   */
  simulate: async (payload) => {
    return fetchAPI('/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch simulation history.
   * @param {number} page 
   * @param {number} limit 
   * @param {string} [algorithm] 
   */
  getHistory: async (page = 1, limit = 10, algorithm = '') => {
    const query = new URLSearchParams({ page, limit });
    if (algorithm && algorithm !== 'ALL') query.append('algorithm', algorithm);
    return fetchAPI(`/history?${query.toString()}`);
  },

  /**
   * Fetch history stats.
   */
  getStats: async () => {
    return fetchAPI('/history/stats');
  },

  /**
   * Fetch algorithms metadata.
   */
  getAlgorithms: async () => {
    return fetchAPI('/algorithms');
  },

  /**
   * Check backend health.
   */
  checkHealth: async () => {
    return fetchAPI('/health');
  },
};
