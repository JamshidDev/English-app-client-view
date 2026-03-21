import api from '../index'
import type { ApiResponse } from '@/types/user'
import type { CollectionScore } from '@/types/score'

export const scoresApi = {
  getByCollection: async (collectionId: string): Promise<ApiResponse<CollectionScore>> => {
    const response = await api.get<ApiResponse<CollectionScore>>(`/scores/collection/${collectionId}`)
    return response.data
  },

  getSummary: async (): Promise<ApiResponse<{ totalStars: number; collectionsCount: number }>> => {
    const response = await api.get<ApiResponse<{ totalStars: number; collectionsCount: number }>>('/scores/summary')
    return response.data
  },
}
