import api from '../index'
import type { ApiResponse } from '@/types/user'
import type { WritingData, WritingAnswerResult, WritingCompleteResult } from '@/types/writing'

export const writingsApi = {
  start: async (collectionId: string): Promise<ApiResponse<WritingData>> => {
    const response = await api.post<ApiResponse<WritingData>>('/writings/start', { collectionId })
    return response.data
  },

  getByCollection: async (collectionId: string): Promise<ApiResponse<WritingData | null>> => {
    const response = await api.get<ApiResponse<WritingData | null>>(`/writings/collection/${collectionId}`)
    return response.data
  },

  submitAnswer: async (writingId: string, wordId: string, answer: string): Promise<ApiResponse<WritingAnswerResult>> => {
    const response = await api.post<ApiResponse<WritingAnswerResult>>(`/writings/${writingId}/answer`, {
      wordId,
      answer
    })
    return response.data
  },

  complete: async (writingId: string): Promise<ApiResponse<WritingCompleteResult>> => {
    const response = await api.post<ApiResponse<WritingCompleteResult>>(`/writings/${writingId}/complete`)
    return response.data
  }
}
