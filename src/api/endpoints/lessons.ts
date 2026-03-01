import api from '../index'
import type { Lesson, LessonProgress } from '@/types/lesson'

export const lessonsApi = {
  getAll: async (): Promise<Lesson[]> => {
    const response = await api.get<Lesson[]>('/lessons')
    return response.data
  },

  getById: async (id: string): Promise<Lesson> => {
    const response = await api.get<Lesson>(`/lessons/${id}`)
    return response.data
  },

  getProgress: async (): Promise<LessonProgress[]> => {
    const response = await api.get<LessonProgress[]>('/lessons/progress')
    return response.data
  },

  updateProgress: async (lessonId: string, progress: number): Promise<LessonProgress> => {
    const response = await api.put<LessonProgress>(`/lessons/${lessonId}/progress`, { progress })
    return response.data
  },

  complete: async (lessonId: string): Promise<LessonProgress> => {
    const response = await api.post<LessonProgress>(`/lessons/${lessonId}/complete`)
    return response.data
  }
}
