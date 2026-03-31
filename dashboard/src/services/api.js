// Centralized API Service
// This makes it easy to change the backend URL in one place
const BASE_URL = 'http://localhost:8000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Remove Content-Type if sending FormData (browser sets it automatically with boundary)
    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses gracefully
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'API Error');
        return data;
      }
      return response;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: data instanceof FormData ? data : JSON.stringify(data) 
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();
