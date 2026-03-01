import { ref, computed } from 'vue'
import type { WordCategory } from '@/types/vocabulary'
import { categories } from '@/data/vocabulary'

const STORAGE_KEY = 'pinned_categories'

const pinnedCategories = ref<WordCategory[]>([])
const isInitialized = ref(false)

export function useCategoryPins() {
  const initPins = () => {
    if (isInitialized.value) return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        pinnedCategories.value = JSON.parse(saved)
      } catch {
        pinnedCategories.value = []
      }
    }
    isInitialized.value = true
  }

  const savePins = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedCategories.value))
  }

  const isPinned = (category: WordCategory): boolean => {
    return pinnedCategories.value.includes(category)
  }

  const togglePin = (category: WordCategory) => {
    const index = pinnedCategories.value.indexOf(category)
    if (index > -1) {
      pinnedCategories.value.splice(index, 1)
    } else {
      pinnedCategories.value.push(category)
    }
    savePins()
  }

  const pinCategory = (category: WordCategory) => {
    if (!isPinned(category)) {
      pinnedCategories.value.push(category)
      savePins()
    }
  }

  const unpinCategory = (category: WordCategory) => {
    const index = pinnedCategories.value.indexOf(category)
    if (index > -1) {
      pinnedCategories.value.splice(index, 1)
      savePins()
    }
  }

  const displayCategories = computed(() => {
    if (pinnedCategories.value.length === 0) {
      return categories
    }
    return categories.filter(cat => pinnedCategories.value.includes(cat.key as WordCategory))
  })

  const hasPinnedCategories = computed(() => pinnedCategories.value.length > 0)

  const pinnedCount = computed(() => pinnedCategories.value.length)

  return {
    pinnedCategories,
    displayCategories,
    hasPinnedCategories,
    pinnedCount,
    initPins,
    isPinned,
    togglePin,
    pinCategory,
    unpinCategory
  }
}
