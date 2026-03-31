/**
 * Fees Management service
 * Handles fee structures, student assignments, and payment tracking
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { Fee, PaginationParams, PaginatedResponse } from '@/utils/types';

class FeesService {
  /**
   * Get all fees with optional filtering
   */
  async getFees(params?: PaginationParams & { studentId?: string; status?: string }): Promise<PaginatedResponse<Fee>> {
    const response = await apiClient.get<PaginatedResponse<Fee>>(API_ENDPOINTS.FEES, { params });
    return (response as any).data || response;
  }

  /**
   * Get fee dashboard statistics
   */
  async getDashboardStats(): Promise<any> {
    const response = await apiClient.get<any>(`${API_ENDPOINTS.FEES}/dashboard`);
    return response.data || response;
  }

  /**
   * Get fee by ID
   */
  async getFeeById(id: string): Promise<Fee> {
    const response = await apiClient.get<Fee>(`${API_ENDPOINTS.FEES}/${id}`);
    return (response as any).data || response;
  }

  /**
   * Create a new fee entry/assignment
   */
  async createFee(data: Partial<Fee>): Promise<Fee> {
    const response = await apiClient.post<Fee>(API_ENDPOINTS.FEES, data);
    return (response as any).data || response;
  }

  /**
   * Update fee details
   */
  async updateFee(id: string, data: Partial<Fee>): Promise<Fee> {
    const response = await apiClient.put<Fee>(`${API_ENDPOINTS.FEES}/${id}`, data);
    return (response as any).data || response;
  }

  /**
   * Delete fee record
   */
  async deleteFee(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.FEES}/${id}`);
  }

  /**
   * Record a payment for an invoice/fee
   */
  async recordPayment(id: string, paymentData: any): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.FEES}/${id}/payments`, paymentData);
  }

  /**
   * Get fee structures/types
   */
  async getFeeStructures(): Promise<any[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.FEES}/structures`);
    return (response as any).data || response;
  }
}

export const feesService = new FeesService();
