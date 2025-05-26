import api from './api';

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch products' 
      };
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Product not found' 
      };
    }
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create product' 
      };
    }
  },

  // Update product (Admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update product' 
      };
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete product' 
      };
    }
  },

  // Upload product images
  uploadProductImages: async (productId, files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to upload images' 
      };
    }
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...filters }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Search failed' 
      };
    }
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch reviews' 
      };
    }
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add review' 
      };
    }
  }
};
