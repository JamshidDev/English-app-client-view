import api from '../index'
import type { ApiResponse, PaginatedData } from '@/types/user'
import type { Category, Collection, VocabularyItem, ClientCategoryItem } from '@/types/vocabulary'

interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

export const categoriesApi = {
  // Barcha public categorylar
  getAll: async (params?: PaginationParams): Promise<ApiResponse<PaginatedData<Category>>> => {
    const response = await api.get<ApiResponse<PaginatedData<Category>>>('/categories', { params })
    return response.data
  }
}

export const clientCategoriesApi = {
  // Client tanlagan categorylar
  getMy: async (params?: PaginationParams): Promise<ApiResponse<ClientCategoryItem[]>> => {
    const response = await api.get<ApiResponse<ClientCategoryItem[]>>('/client-categories', { params })
    return response.data
  },

  // Categorylarni saqlash
  save: async (categoryIds: string[]): Promise<ApiResponse<ClientCategoryItem[]>> => {
    const response = await api.post<ApiResponse<ClientCategoryItem[]>>('/client-categories', { categoryIds })
    return response.data
  }
}

export const collectionsApi = {
  // Category bo'yicha collectionlar
  getByCategory: async (categoryId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedData<Collection>>> => {
    const response = await api.get<ApiResponse<PaginatedData<Collection>>>('/collections', {
      params: { categoryId, ...params }
    })
    return response.data
  }
}

export const vocabularyApi = {
  // Collection bo'yicha so'zlar
  getByCollection: async (collectionId: string): Promise<ApiResponse<VocabularyItem[]>> => {
    const response = await api.get<ApiResponse<VocabularyItem[]>>('/vocabulary', {
      params: { collectionId }
    })
    return response.data
  }
}
