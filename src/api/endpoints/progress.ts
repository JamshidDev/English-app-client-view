import api from '../index'
import type { UserStats } from '@/types/user'

export interface DailyProgress {
  date: string
  wordsLearned: number
  lessonsCompleted: number
  quizzesTaken: number
}

export interface Achievement {
  id: string
  key: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  target: number
}

export const progressApi = {
  getStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>('/progress/stats')
    return response.data
  },

  getDailyProgress: async (days: number = 7): Promise<DailyProgress[]> => {
    const response = await api.get<DailyProgress[]>(`/progress/daily?days=${days}`)
    return response.data
  },

  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>('/progress/achievements')
    return response.data
  },

  updateStreak: async (): Promise<{ streakDays: number }> => {
    const response = await api.post<{ streakDays: number }>('/progress/streak')
    return response.data
  }
}
