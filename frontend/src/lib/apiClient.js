/**
 * apiClient.js - Thin wrapper around native fetch.
 * Centralizes all outgoing HTTP requests to the backend.
 */

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').trim().replace(/\/+$/, '');
const BASE_URL = rawBaseUrl.endsWith('/api/v1') ? rawBaseUrl : `${rawBaseUrl}/api/v1`;

async function fetchWithAuth(endpoint, options = {}) {
  let token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized (Token expired)
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refreshToken }),
        });

        if (refreshResponse.ok) {
          const resJson = await refreshResponse.json();
          const data = resJson.data;
          
          localStorage.setItem('token', data.accessToken);
          if (data.refreshToken) {
             localStorage.setItem('refreshToken', data.refreshToken);
          }
          
          // Retry original request with new token
          headers.Authorization = `Bearer ${data.accessToken}`;
          response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
        } else {
          // Refresh failed, clear session
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    } else {
      // No refresh token, force logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  // If response is not ok after potential retry, throw error
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  const json = await response.json();
  return json.data;
}

export const apiClient = {
  get: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options) => fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
