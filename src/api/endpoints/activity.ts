import api from '../index'
import type { ApiResponse } from '@/types/user'

export const activityApi = {
  getActiveDays: async (year: number, month: number): Promise<ApiResponse<{ days: string[]; total: number }>> => {
    const response = await api.get<ApiResponse<{ days: string[]; total: number }>>('/activity', {
      params: { year, month }
    })
    return response.data
  },
}
