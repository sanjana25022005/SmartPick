import api from './api';

export const orderService = {
  // Create order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create order' 
      };
    }
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders/my-orders', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch orders' 
      };
    }
  },

  // Get all orders (Admin only)
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch orders' 
      };
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Order not found' 
      };
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update order status' 
      };
    }
  },

  // Cancel order
  cancelOrder: async (id) => {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to cancel order' 
      };
    }
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/orders/payment', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Payment failed' 
      };
    }
  },

  // Get order analytics (Admin only)
  getOrderAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/orders/analytics', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch analytics' 
      };
    }
  }
};
