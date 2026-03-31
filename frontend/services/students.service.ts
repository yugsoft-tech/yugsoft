/**
 * Students service
 * Handles all student-related API calls
 */

import { apiClient } from '@/utils/api-client';
import { API_ENDPOINTS } from '@/utils/constants';
import { PaginationParams, PaginatedResponse, Student, CreateStudentDto, UpdateStudentDto, Document } from '@/utils/types';
import { mapStudent, mapArray } from '@/utils/mappers';

class StudentsService {
  /**
   * Get all students
   */
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Student>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.STUDENTS, { params });
    const rawData = response.data || response;
    const meta = rawData.meta || {};
    
    // Handle NestJS PaginatedResult structure { data: [], meta: { total: ... } }
    return {
      data: mapArray(mapStudent)(rawData.data || []),
      total: meta.total || rawData.total || 0,
      page: meta.page || params?.page || 1,
      limit: meta.limit || params?.limit || 10,
      totalPages: meta.totalPages || 0,
    };
  }

  /**
   * Get student by ID
   */
  async getById(id: string): Promise<Student> {
    const response = await apiClient.get(`${API_ENDPOINTS.STUDENTS}/${id}`);
    return mapStudent(response.data) as Student;
  }

  /**
   * Get students by class ID
   */
  async getByClass(classId: string): Promise<Student[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.STUDENTS}/class/${classId}`);
    return (response as any).data || response;
  }

  /**
   * Create new student
   */
  async create(data: CreateStudentDto): Promise<Student> {
    const response = await apiClient.post(API_ENDPOINTS.STUDENTS, data);
    return mapStudent(response.data) as Student;
  }

  /**
   * Update student
   */
  async update(id: string, data: UpdateStudentDto): Promise<Student> {
    const response = await apiClient.patch(`${API_ENDPOINTS.STUDENTS}/${id}`, data);
    return mapStudent(response.data) as Student;
  }

  /**
   * Delete student
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
  }

  /**
   * Get student documents
   */
  async getDocuments(studentId: string): Promise<Document[]> {
    const response = await apiClient.get(`${API_ENDPOINTS.STUDENTS}/${studentId}/documents`);
    return response.data || [];
  }

  /**
   * Promote students
   */
  async promote(data: { studentIds: string[]; targetClassId: string }): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.STUDENTS}/promote`, data);
  }
}

export const studentsService = new StudentsService();
