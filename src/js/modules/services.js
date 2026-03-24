// src/js/modules/services.js
// Services Module - Manages consultation services

import API from '../api.js';

const ServicesModule = (() => {
  let cache = {
    services: [],
    lastFetch: null,
  };

  /**
   * Fetch all services
   */
  const getServices = async (filters = {}) => {
    try {
      const data = await API.services.list(filters);
      cache.services = data;
      cache.lastFetch = new Date();
      return data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  };

  /**
   * Get single service by ID
   */
  const getService = async (id) => {
    try {
      return await API.services.get(id);
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  };

  /**
   * Search services
   */
  const searchServices = async (query) => {
    return getServices({ search: query });
  };

  /**
   * Filter by category
   */
  const filterByCategory = async (category) => {
    return getServices({ category });
  };

  /**
   * Get cached services
   */
  const getCachedServices = () => {
    return cache.services;
  };

  return {
    getServices,
    getService,
    searchServices,
    filterByCategory,
    getCachedServices,
  };
})();

export default ServicesModule;
