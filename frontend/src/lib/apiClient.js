/**
 * apiClient.js - Thin wrapper around native fetch.
 * Centralizes all outgoing HTTP requests to the backend.
 */

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').trim().replace(/\/+$/, '');
const BASE_URL = rawBaseUrl.endsWith('/api/v1') ? rawBaseUrl : `${rawBaseUrl}/api/v1`;

const slowListeners = new Set();
let slowRequestCount = 0;

function notifySlowBackend(isSlow) {
  slowListeners.forEach((listener) => {
    try {
      listener(isSlow);
    } catch (e) {
      console.error('Error notifying slow backend listener:', e);
    }
  });
}

export function subscribeSlowBackend(listener) {
  slowListeners.add(listener);
  listener(slowRequestCount > 0);
  return () => slowListeners.delete(listener);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      // If Render backend is spinning up from cold sleep, it often returns 502, 503, or 504
      if ([502, 503, 504].includes(response.status) && attempt < maxRetries) {
        await sleep(2500);
        continue;
      }
      return response;
    } catch (err) {
      // Transient network dropped connection while server is binding port
      if (attempt < maxRetries) {
        await sleep(2500);
        continue;
      }
      throw err;
    }
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  let token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let isRequestSlow = false;
  const slowTimer = setTimeout(() => {
    isRequestSlow = true;
    slowRequestCount++;
    notifySlowBackend(true);
  }, 5000);

  try {
    let response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetchWithRetry(`${BASE_URL}/auth/refresh-token`, {
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
            response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
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
      let msg = errorData.message;
      if (!msg) {
        if (response.status === 408 || response.status === 502 || response.status === 503 || response.status === 504 || isRequestSlow) {
          msg = `Backend is a bit slow, but dont worry it will work😉 (HTTP ${response.status})`;
        } else {
          msg = `API Error: ${response.status}`;
        }
      } else if (isRequestSlow) {
        msg = `${msg} (Backend is a bit slow, but dont worry it will work😉)`;
      }
      throw new Error(msg);
    }

    const json = await response.json();
    return json.data;
  } catch (err) {
    if (isRequestSlow && !err.message.includes('Backend is a bit slow')) {
      throw new Error(`${err.message} - Backend is a bit slow, but dont worry it will work😉`);
    }
    throw err;
  } finally {
    clearTimeout(slowTimer);
    if (isRequestSlow) {
      slowRequestCount = Math.max(0, slowRequestCount - 1);
      if (slowRequestCount === 0) {
        notifySlowBackend(false);
      }
    }
  }
}

export const apiClient = {
  get: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options) => fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
