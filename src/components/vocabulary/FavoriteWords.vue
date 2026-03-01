<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import WordList from './WordList.vue'

const { t } = useI18n()
const vocabStore = useVocabStore()
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <span class="text-red-500">❤️</span>
      {{ t('vocabulary.favorites') }}
    </h3>

    <WordList
      v-if="vocabStore.favoriteWords.length > 0"
      :words="vocabStore.favoriteWords"
    />

    <div v-else class="text-center py-12">
      <p class="text-4xl mb-4">💔</p>
      <p class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</p>
    </div>
  </div>
</template>
