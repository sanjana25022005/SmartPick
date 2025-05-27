import api from './api';

export const paymentService = {
  // Initialize Razorpay payment
  initializeRazorpay: async (paymentData) => {
    try {
      const response = await api.post('/payments/razorpay/create', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to initialize payment' 
      };
    }
  },

  // Verify Razorpay payment
  verifyRazorpayPayment: async (verificationData) => {
    try {
      const response = await api.post('/payments/razorpay/verify', verificationData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Payment verification failed' 
      };
    }
  },

  // Initialize Stripe payment
  initializeStripe: async (paymentData) => {
    try {
      const response = await api.post('/payments/stripe/create', paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to initialize payment' 
      };
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get payment status' 
      };
    }
  }
};
