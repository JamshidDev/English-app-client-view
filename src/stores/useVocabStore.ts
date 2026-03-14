import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, Collection, VocabularyItem, CollectionProgress } from '@/types/vocabulary'
import { clientCategoriesApi, categoriesApi, collectionsApi, vocabularyApi } from '@/api/endpoints/vocabulary'
import { useAuthStore } from './useAuthStore'

export const useVocabStore = defineStore('vocab', () => {
  const categories = ref<Category[]>([])
  const collections = ref<Collection[]>([])
  const words = ref<VocabularyItem[]>([])
  const selectedCategoryId = ref<string | null>(null)
  const isLoadingCategories = ref(false)
  const isLoadingCollections = ref(false)
  const isLoadingWords = ref(false)

  // Local progress
  const collectionProgress = ref<CollectionProgress[]>([])

  const initVocab = () => {
    const savedProgress = localStorage.getItem('collectionProgress')
    if (savedProgress) {
      collectionProgress.value = JSON.parse(savedProgress)
    }
  }

  // Categorylarni yuklash: avval client-categories, yo'q bo'lsa categories
  const fetchCategories = async () => {
    isLoadingCategories.value = true
    try {
      const clientRes = await clientCategoriesApi.getMy({ page: 1, pageSize: 20 })
      const clientData = Array.isArray(clientRes.data) ? clientRes.data : (clientRes.data as any)?.data || []
      const clientCategories = clientData.map((item: any) => item.category).filter(Boolean)
      if (clientCategories.length > 0) {
        categories.value = clientCategories
      } else {
        const allRes = await categoriesApi.getAll({ page: 1, pageSize: 20 })
        const allData = allRes.data?.data || allRes.data || []
        categories.value = Array.isArray(allData) ? allData : []
      }

      if (categories.value.length > 0) {
        const currentExists = categories.value.some(c => c.id === selectedCategoryId.value)
        if (!currentExists) {
          selectedCategoryId.value = categories.value[0].id
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      isLoadingCategories.value = false
    }
  }

  // Sahifa ochilganda eski datani tozalash
  const resetCollections = () => {
    collections.value = []
    isLoadingCollections.value = true
  }

  // Category bo'yicha collectionlarni yuklash
  const fetchCollections = async (categoryId: string) => {
    isLoadingCollections.value = true
    try {
      const res = await collectionsApi.getByCategory(categoryId, { page: 1, pageSize: 20 })
      collections.value = res.data.data
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      isLoadingCollections.value = false
    }
  }

  // Collection bo'yicha so'zlarni yuklash
  const fetchWords = async (collectionId: string) => {
    isLoadingWords.value = true
    try {
      const res = await vocabularyApi.getByCollection(collectionId)
      words.value = res.data
    } catch (error) {
      console.error('Failed to fetch words:', error)
    } finally {
      isLoadingWords.value = false
    }
  }

  const selectCategory = async (categoryId: string) => {
    selectedCategoryId.value = categoryId
    collections.value = []
    await fetchCollections(categoryId)
  }

  const selectedCategory = computed(() => {
    return categories.value.find(c => c.id === selectedCategoryId.value) || null
  })

  // Progress
  const getCollectionProgress = (collectionId: string): CollectionProgress | undefined => {
    return collectionProgress.value.find(p => p.collectionId === collectionId)
  }

  const getLearnedWordsCount = (collectionId: string): number => {
    const progress = getCollectionProgress(collectionId)
    if (!progress) return 0
    return progress.wordsProgress.filter(wp => wp.learned).length
  }

  const markWordAsLearned = (collectionId: string, wordId: string) => {
    const authStore = useAuthStore()
    let progress = collectionProgress.value.find(p => p.collectionId === collectionId)

    if (!progress) {
      progress = { collectionId, wordsProgress: [], lastAccessedAt: new Date().toISOString() }
      collectionProgress.value.push(progress)
    }

    const existing = progress.wordsProgress.find(wp => wp.wordId === wordId)

    if (!existing) {
      progress.wordsProgress.push({ wordId, learned: true, learnedAt: new Date().toISOString() })
      authStore.incrementWordsLearned()
    } else if (!existing.learned) {
      existing.learned = true
      existing.learnedAt = new Date().toISOString()
      authStore.incrementWordsLearned()
    }

    progress.lastAccessedAt = new Date().toISOString()
    saveProgress()
  }

  const isWordLearned = (collectionId: string, wordId: string): boolean => {
    const progress = getCollectionProgress(collectionId)
    if (!progress) return false
    return progress.wordsProgress.find(wp => wp.wordId === wordId)?.learned || false
  }

  const saveProgress = () => {
    localStorage.setItem('collectionProgress', JSON.stringify(collectionProgress.value))
  }

  const resetCollectionProgress = (collectionId: string) => {
    const index = collectionProgress.value.findIndex(p => p.collectionId === collectionId)
    if (index > -1) {
      collectionProgress.value.splice(index, 1)
      saveProgress()
    }
  }

  return {
    categories,
    collections,
    words,
    selectedCategoryId,
    selectedCategory,
    isLoadingCategories,
    isLoadingCollections,
    isLoadingWords,
    collectionProgress,
    initVocab,
    resetCollections,
    fetchCategories,
    fetchCollections,
    fetchWords,
    selectCategory,
    getCollectionProgress,
    getLearnedWordsCount,
    markWordAsLearned,
    isWordLearned,
    resetCollectionProgress
  }
})
