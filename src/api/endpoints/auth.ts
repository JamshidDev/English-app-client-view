import api from '../index'
import type { ApiResponse, ClientCheckData, ClientLoginData } from '@/types/user'

export interface RegisterPayload {
  telegramId: string
  firstName: string
  lastName?: string
  phone?: string
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
  }
}
