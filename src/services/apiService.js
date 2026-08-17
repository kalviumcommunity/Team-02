const API_BASE_URL = 'http://localhost:5000/api';

export const apiService = {
  // Login Authentication (POST /api/auth/login)
  async login(email, password, role) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      return await response.json();
    } catch (err) {
      console.warn('Backend API connection failed, using local auth fallback:', err);
      return { success: false, message: 'Backend server offline. Utilizing local authentication mode.' };
    }
  },

  // Fetch Requests
  async getRequests(storeId = '', status = 'ALL', priority = 'ALL') {
    try {
      const query = new URLSearchParams({ storeId, status, priority }).toString();
      const res = await fetch(`${API_BASE_URL}/requests?${query}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Create Request
  async createRequest(reqData) {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData)
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  // Update Status
  async updateStatus(id, newStatus, reason, actor, role, shipmentRef = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, reason, actor, role, shipmentRef })
      });
      return await res.json();
    } catch (err) {
      return null;
    }
  }
};
