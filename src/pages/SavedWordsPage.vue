<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import { savedApi } from '@/api/endpoints/saved'
import { useUIToast } from '@/composables/useUIToast'

const toast = useUIToast()

const router = useRouter()
const { hapticImpact, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const words = ref<any[]>([])
const isLoading = ref(false)

const getTranslation = (wordTranslate: { uz: string; ru: string }) => {
  return currentLanguage.value === 'ru' ? wordTranslate.ru : wordTranslate.uz
}

const handleBack = () => router.back()

const unsaveWord = async (wordId: string) => {
  hapticImpact('light')
  try {
    await savedApi.toggleWord(wordId)
    words.value = words.value.filter(w => w.wordId !== wordId)
    toast.warning("O'chirildi")
  } catch {
    toast.error('Xatolik')
  }
}

onMounted(async () => {
  showBackButton()
  onBackButtonClick(handleBack)
  isLoading.value = true
  try {
    const res = await savedApi.getWords(1, 100)
    words.value = res.data.data || []
  } catch {
    words.value = []
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#131f24]">
    <div class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 pt-4 pb-3">
      <div class="flex items-center gap-2">
        <button @click="handleBack" class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">
          Saqlangan so'zlar
        </h1>
      </div>
    </div>

    <div class="px-4 py-3 space-y-2">
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 dark:bg-[#243642] rounded-2xl animate-pulse" />
      </template>

      <template v-else-if="words.length > 0">
        <div
          v-for="item in words"
          :key="item.wordId"
          class="relative"
        >
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
          <div class="relative rounded-2xl bg-white dark:bg-[#1a2730] px-4 py-3 -translate-y-1 border border-gray-100 dark:border-[#314158] flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-gray-900 dark:text-white">{{ item.word }}</h3>
                <span v-if="item.transcription" class="text-xs text-gray-400">{{ item.transcription }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {{ getTranslation(item.wordTranslate) }}
              </p>
            </div>
            <button
              @click="unsaveWord(item.wordId)"
              class="ml-3 p-2 text-[#ffc800] hover:text-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-20 px-6">
        <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#243642] flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        </div>
        <p class="text-sm font-bold text-gray-400 dark:text-gray-500">Saqlangan so'zlar yo'q</p>
      </div>
    </div>
  </div>
</template>
