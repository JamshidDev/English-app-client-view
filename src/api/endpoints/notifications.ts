import api from '../index'
import type { ApiResponse } from '@/types/user'

export const notificationsApi = {
  getAll: async (page = 1, pageSize = 20): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/notifications', { params: { page, pageSize } })
    return response.data
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count')
    return response.data
  },

  markRead: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.patch<ApiResponse<any>>(`/notifications/${id}/read`)
    return response.data
  },

  markAllRead: async (): Promise<ApiResponse<any>> => {
    const response = await api.patch<ApiResponse<any>>('/notifications/read-all')
    return response.data
  },
}
