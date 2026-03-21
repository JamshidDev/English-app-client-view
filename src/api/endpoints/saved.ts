import api from '../index'
import type { ApiResponse } from '@/types/user'

export const savedApi = {
  toggleWord: async (wordId: string): Promise<ApiResponse<{ saved: boolean }>> => {
    const response = await api.post<ApiResponse<{ saved: boolean }>>('/saved/words/toggle', { wordId })
    return response.data
  },

  getWords: async (page = 1, pageSize = 20): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/saved/words', { params: { page, pageSize } })
    return response.data
  },

  getCounts: async (): Promise<ApiResponse<{ words: number }>> => {
    const response = await api.get<ApiResponse<{ words: number }>>('/saved/counts')
    return response.data
  },
}
