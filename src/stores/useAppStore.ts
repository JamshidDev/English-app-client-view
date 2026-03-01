import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isLoading = ref(false)
  const loadingText = ref('')

  const setLoading = (loading: boolean, text: string = '') => {
    isLoading.value = loading
    loadingText.value = text
  }

  const showLoading = (text: string = '') => {
    isLoading.value = true
    loadingText.value = text
  }

  const hideLoading = () => {
    isLoading.value = false
    loadingText.value = ''
  }

  return {
    isLoading,
    loadingText,
    setLoading,
    showLoading,
    hideLoading
  }
})
