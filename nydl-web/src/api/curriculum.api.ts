import api from './axios';
import type { ApiResponse } from '@/types';

export interface CurriculumModule {
  id: string;
  courseId: string;
  curriculumId?: string;
  title: string;
  description: string;
  order: number;
  lessons?: CurriculumLesson[];
}

export interface CurriculumLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  lessonType: 'VIDEO' | 'TEXT' | 'LIVE' | 'PRACTICE' | 'QUIZ';
  content: string;
  duration: number;
  durationMinutes?: number;
  order: number;
  resources?: { title: string; url: string }[];
}

export interface CurriculumDetail {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  modules: CurriculumModule[];
}

export const curriculumApi = {
  getDetail: (courseId: string) =>
    api.get<ApiResponse<CurriculumDetail[]>>('/curriculum/detail', { params: { courseId } }),

  createModule: (data: { courseId: string; curriculumId: string; title: string; description: string; order: number }) =>
    api.post<ApiResponse<CurriculumModule>>('/curriculum/modules', data),

  updateModule: (id: string, data: { title: string; description: string; order: number }) =>
    api.put<ApiResponse<CurriculumModule>>(`/curriculum/modules/${id}`, data),

  deleteModule: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/curriculum/modules/${id}`),

  createLesson: (data: {
    moduleId: string;
    title: string;
    description?: string;
    lessonType: string;
    content: string;
    duration: number;
    order: number;
    resources?: { title: string; url: string }[];
  }) =>
    api.post<ApiResponse<CurriculumLesson>>('/curriculum/lessons', data),

  updateLesson: (id: string, data: {
    title: string;
    description?: string;
    lessonType: string;
    content: string;
    duration: number;
    order: number;
    resources?: { title: string; url: string }[];
  }) =>
    api.put<ApiResponse<CurriculumLesson>>(`/curriculum/lessons/${id}`, data),

  deleteLesson: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/curriculum/lessons/${id}`),
};
