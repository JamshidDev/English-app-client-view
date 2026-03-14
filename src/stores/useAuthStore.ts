import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserStats } from '@/types/user'
import { authApi, type RegisterPayload } from '@/api/endpoints/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isRegistered = ref(false)
  const isAuthChecked = ref(false)

  const userStats = ref<UserStats>({
    wordsLearned: 0,
    lessonsCompleted: 0,
    quizAccuracy: 0,
    streakDays: 0
  })

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedStats = localStorage.getItem('userStats')
    const token = localStorage.getItem('token')

    if (savedUser && token) {
      user.value = JSON.parse(savedUser)
      isRegistered.value = true
    }

    if (savedStats) {
      userStats.value = JSON.parse(savedStats)
    }
  }

  const checkAuth = async (telegramId: string): Promise<boolean> => {
    try {
      const response = await authApi.check(telegramId)

      if (response.data.registered && response.data.accessToken && response.data.client) {
        user.value = response.data.client
        isRegistered.value = true
        localStorage.setItem('token', response.data.accessToken)
        localStorage.setItem('user', JSON.stringify(response.data.client))
        return true
      }

      isRegistered.value = false
      return false
    } catch (error) {
      console.error('Auth check failed:', error)

      // Check fail bo'lganda login bilan urinib ko'ramiz
      try {
        const loginResponse = await authApi.login(telegramId)

        user.value = loginResponse.data.client
        isRegistered.value = true
        localStorage.setItem('token', loginResponse.data.accessToken)
        localStorage.setItem('user', JSON.stringify(loginResponse.data.client))
        return true
      } catch {
        // Login ham fail — localStorage dan tekshiramiz
        initAuth()
        return isRegistered.value
      }
    } finally {
      isAuthChecked.value = true
    }
  }

  const register = async (payload: RegisterPayload): Promise<void> => {
    try {
      const response = await authApi.register(payload)

      user.value = response.data.client
      isRegistered.value = true
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.client))
    } catch (error: any) {
      // 409 — user allaqachon mavjud, login qilamiz
      if (error?.response?.status === 409) {
        const loginResponse = await authApi.login(payload.telegramId)

        user.value = loginResponse.data.client
        isRegistered.value = true
        localStorage.setItem('token', loginResponse.data.accessToken)
        localStorage.setItem('user', JSON.stringify(loginResponse.data.client))
        return
      }
      throw error
    }
  }

  const updateStats = (stats: Partial<UserStats>) => {
    userStats.value = { ...userStats.value, ...stats }
    localStorage.setItem('userStats', JSON.stringify(userStats.value))
  }

  const incrementWordsLearned = () => {
    userStats.value.wordsLearned++
    localStorage.setItem('userStats', JSON.stringify(userStats.value))
  }

  const incrementLessonsCompleted = () => {
    userStats.value.lessonsCompleted++
    localStorage.setItem('userStats', JSON.stringify(userStats.value))
  }

  const updateQuizAccuracy = (correct: number, total: number) => {
    const currentAccuracy = userStats.value.quizAccuracy
    const newAccuracy = Math.round((correct / total) * 100)
    userStats.value.quizAccuracy = Math.round((currentAccuracy + newAccuracy) / 2)
    localStorage.setItem('userStats', JSON.stringify(userStats.value))
  }

  const logout = () => {
    user.value = null
    isRegistered.value = false
    isAuthChecked.value = false
    userStats.value = {
      wordsLearned: 0,
      lessonsCompleted: 0,
      quizAccuracy: 0,
      streakDays: 0
    }
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userStats')
  }

  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName || ''}`.trim()
  })

  return {
    user,
    isRegistered,
    isAuthChecked,
    userStats,
    fullName,
    initAuth,
    checkAuth,
    register,
    updateStats,
    incrementWordsLearned,
    incrementLessonsCompleted,
    updateQuizAccuracy,
    logout
  }
})
