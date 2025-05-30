import axios from 'axios';
import _ from 'lodash';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
});

// Dishes API
export const dishesApi = {
  getAll: async (filters = {}, sort = {}, pagination = {}) => {
    const params = new URLSearchParams();
    
    // Add filters
    _.forEach(filters, (value, key) => {
      if (value && value !== 'all') {
        params.append(key, value);
      }
    });
    
    // Add sorting
    if (sort.field) {
      params.append('sortField', sort.field);
      params.append('sortOrder', sort.order || 'asc');
    }
    
    // Add pagination
    if (pagination.page) {
      params.append('page', pagination.page);
    }
    if (pagination.limit) {
      params.append('limit', pagination.limit);
    }
    
    const response = await api.get(`/dishes?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/dishes/${id}/`);
    return response.data;
  },

  search: async (query) => {
    if (!query || query.length < 2) return [];
    const response = await api.get(`/dishes/search/${encodeURIComponent(query)}`);
    return response.data;
  },

  suggest: async (ingredients) => {
    const response = await api.post('/dishes/suggest', { ingredients });
    return response.data;
  },

  getSimilar: async (id) => {
    const response = await api.get(`/dishes/${id}/similar`);
    return response.data;
  }
};

// Ingredients API
export const ingredientsApi = {
  getAll: async () => {
    const response = await api.get('/ingredients');
    return response.data;
  }
};

