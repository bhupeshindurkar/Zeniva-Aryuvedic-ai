/**
 * Zeniva AI - Central API Client Configuration
 * Supports local dev (proxy & port 8000) and production deployment (Vercel / Render / Railway)
 */

export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://127.0.0.1:8000');

export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL.replace(/\/$/, '')}${cleanPath}`;
};

export const apiFetch = async (path, options = {}) => {
  const url = getApiUrl(path);
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  return res;
};
