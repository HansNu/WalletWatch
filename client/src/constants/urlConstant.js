// src/api/client.js
const API_BASE = '/WalletAPI'; // This will be proxied by Vite

const apiClient = async (endpoint, options = {}) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add auth headers here later if needed, e.g.:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const walletApi = {
  getUserByUserId: (userId) => 
    apiClient('/user/getUserByUserId', {
      method: 'POST',
      body: { userId }
    }),
};

export default walletApi;