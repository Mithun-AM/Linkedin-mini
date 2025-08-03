// A reusable function to create API methods
const createApiMethod = (method: 'GET' | 'POST' | 'PATCH' | 'DELETE') => 
  async (url: string, body?: object) => {
    const token = localStorage.getItem('token');
    if (!token && method !== 'GET') {
      throw new Error('Unauthorized: No token found.');
    }

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api${url}`, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `${method} request failed`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json();
    }
    return {};
};

const api = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'), // ✨ NEW
};

export default api;