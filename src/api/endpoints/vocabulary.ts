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
  },

  // Bitta collection
  getById: async (collectionId: string): Promise<ApiResponse<Collection>> => {
    const response = await api.get<ApiResponse<Collection>>(`/collections/${collectionId}`)
    return response.data
  }
}

export const vocabularyApi = {
  // Collection bo'yicha so'zlar (learned status bilan)
  getByCollection: async (collectionId: string): Promise<ApiResponse<VocabularyItem[]>> => {
    const response = await api.get<ApiResponse<VocabularyItem[]>>('/vocabulary', {
      params: { collectionId }
    })
    return response.data
  },

  // So'zni "bildim" deb belgilash
  learn: async (wordId: string, collectionId: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/vocabulary/learn', { wordId, collectionId })
    return response.data
  },

  // So'zni "bilmayman" deb belgilash
  unlearn: async (wordId: string, collectionId: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/vocabulary/unlearn', { wordId, collectionId })
    return response.data
  },

  // Vocabulary yakunlash va ball olish
  complete: async (collectionId: string): Promise<ApiResponse<{ learned: number; total: number; percentage: number; score: number }>> => {
    const response = await api.post<ApiResponse<{ learned: number; total: number; percentage: number; score: number }>>('/vocabulary/complete', { collectionId })
    return response.data
  }
}
