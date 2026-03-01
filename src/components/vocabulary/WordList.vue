<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useLanguage } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import type { Word } from '@/types/vocabulary'

defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  (e: 'select', word: Word): void
}>()

const { t } = useI18n()
const vocabStore = useVocabStore()
const { currentLanguage } = useLanguage()
const { hapticImpact, hapticSelection } = useTelegram()

const getTranslation = (word: Word) => {
  return currentLanguage.value === 'ru' ? word.translationRu : word.translationUz
}

const handleSelect = (word: Word) => {
  hapticImpact('light')
  emit('select', word)
}

const toggleFavorite = (e: Event, wordId: string) => {
  e.stopPropagation()
  hapticSelection()
  vocabStore.toggleFavorite(wordId)
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="word in words"
      :key="word.id"
      @click="handleSelect(word)"
      class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md active:scale-[0.98] flex items-center gap-4"
    >
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-gray-900 dark:text-white">{{ word.word }}</span>
          <span class="text-xs text-gray-400">{{ word.transcription }}</span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ getTranslation(word) }}</p>
      </div>

      <button
        @click="(e) => toggleFavorite(e, word.id)"
        class="w-8 h-8 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 transition-colors"
          :class="vocabStore.isFavorite(word.id) ? 'text-red-500 fill-red-500' : 'text-gray-300 dark:text-gray-600'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>

    <div v-if="words.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ t('common.noData') }}
    </div>
  </div>
</template>
