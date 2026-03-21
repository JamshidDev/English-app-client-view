import api from '../index'
import type { ApiResponse, ClientCheckData, ClientLoginData, User } from '@/types/user'

export interface RegisterPayload {
  telegramId: string
  firstName: string
  lastName?: string
  phone?: string
  photoUrl?: string
}

export const authApi = {
  check: async (telegramId: string): Promise<ApiResponse<ClientCheckData>> => {
    const response = await api.post<ApiResponse<ClientCheckData>>('/auth/check', { telegramId })
    return response.data
  },

  register: async (data: RegisterPayload): Promise<ApiResponse<ClientLoginData>> => {
    const response = await api.post<ApiResponse<ClientLoginData>>('/auth/register', data)
    return response.data
  },

  login: async (telegramId: string): Promise<ApiResponse<ClientLoginData>> => {
    const response = await api.post<ApiResponse<ClientLoginData>>('/auth/login', { telegramId })
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile')
    return response.data
  },

  refreshAvatar: async (photoUrl?: string): Promise<ApiResponse<{ avatarUrl: string | null }>> => {
    const response = await api.post<ApiResponse<{ avatarUrl: string | null }>>('/auth/refresh-avatar', { photoUrl: photoUrl || undefined })
    return response.data
  },
}
