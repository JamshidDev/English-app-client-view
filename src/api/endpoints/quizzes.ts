import api from '../index'
import type { ApiResponse } from '@/types/user'
import type { QuizData, AnswerResult } from '@/types/quiz'

export const quizzesApi = {
  generate: async (collectionId: string): Promise<ApiResponse<QuizData>> => {
    const response = await api.post<ApiResponse<QuizData>>('/quizzes/generate', { collectionId })
    return response.data
  },

  getByCollection: async (collectionId: string): Promise<ApiResponse<QuizData>> => {
    const response = await api.get<ApiResponse<QuizData>>(`/quizzes/collection/${collectionId}`)
    return response.data
  },

  submitAnswer: async (quizId: string, wordId: string, selectedIndex: number): Promise<ApiResponse<AnswerResult>> => {
    const response = await api.post<ApiResponse<AnswerResult>>(`/quizzes/${quizId}/answer`, {
      wordId,
      selectedIndex
    })
    return response.data
  },

  complete: async (quizId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(`/quizzes/${quizId}/complete`)
    return response.data
  }
}
