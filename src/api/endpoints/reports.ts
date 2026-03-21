import api from '../index'
import type { ApiResponse } from '@/types/user'

export const reportsApi = {
  submit: async (data: {
    wordId: string
    collectionId: string
    page: string
    message: string
  }): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/reports', data)
    return response.data
  }
}
