import { apiClient } from '@/utils/api-client';

export const superAdminService = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/super-admin/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch super admin stats', error);
      // Return mock data if API fails to allow UI development
      return {
        activeSchools: 1240,
        totalUsers: 850000,
        mrr: 4200000
      };
    }
  },

  getSchools: async () => {
    try {
      const response = await apiClient.get('/super-admin/schools');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch schools', error);
      return [];
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get('/super-admin/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch global users', error);
      return [];
    }
  },

  getPlans: async () => {
    try {
      const response = await apiClient.get('/super-admin/plans');
      return response;
    } catch (error) {
      console.error('Failed to fetch plans', error);
      return { data: [], meta: {} };
    }
  }
};
