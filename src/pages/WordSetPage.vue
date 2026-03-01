<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const collectionId = computed(() => route.params.setId as string)

const collection = computed(() =>
  vocabStore.collections.find(c => c.id === collectionId.value) || null
)

const getName = (name: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return name.ru
  return name.uz
}

const getTranslation = (wordTranslate: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return wordTranslate.ru
  return wordTranslate.uz
}

const actions = [
  { key: 'learn', icon: '🧠', route: 'learn', gradient: 'from-blue-500 to-blue-600' },
  { key: 'test', icon: '✅', route: 'test', gradient: 'from-green-500 to-green-600' },
  { key: 'writing', icon: '✍️', route: 'writing', gradient: 'from-purple-500 to-purple-600' },
  { key: 'pronunciation', icon: '🔊', route: 'pronunciation', gradient: 'from-orange-500 to-orange-600' }
]

const handleBack = () => {
  router.back()
}

const navigateToAction = (action: string) => {
  hapticImpact('medium')
  router.push(`/vocabulary/set/${collectionId.value}/${action}`)
}

onMounted(async () => {
  vocabStore.initVocab()
  showBackButton()
  onBackButtonClick(handleBack)
  await vocabStore.fetchWords(collectionId.value)
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <button @click="handleBack" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ collection ? getName(collection.name) : '' }}
        </h1>
      </div>
    </div>

    <div v-if="!vocabStore.isLoadingWords && vocabStore.words.length > 0" class="px-4 py-4">
      <!-- Action Cards Grid -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="action in actions"
          :key="action.key"
          @click="navigateToAction(action.route)"
          class="rounded-2xl p-5 text-left transition-all hover:shadow-lg active:scale-[0.97]"
          :class="`bg-gradient-to-br ${action.gradient}`"
        >
          <span class="text-3xl mb-2 block">{{ action.icon }}</span>
          <span class="text-white font-semibold">{{ t(`vocabulary.actions.${action.key}`) }}</span>
        </button>
      </div>

      <!-- Words List -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('vocabulary.words_count') }}: {{ vocabStore.words.length }}
        </h3>

        <div class="space-y-2 max-h-[400px] overflow-y-auto">
          <div
            v-for="(word, index) in vocabStore.words"
            :key="word.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <span class="text-sm text-gray-400 w-6">{{ index + 1 }}.</span>
            <div class="flex-1">
              <span class="font-medium text-gray-900 dark:text-white">{{ word.word }}</span>
              <span class="text-gray-400 mx-2">-</span>
              <span class="text-gray-600 dark:text-gray-400">{{ getTranslation(word.wordTranslate) }}</span>
            </div>
            <div
              class="w-5 h-5 rounded-full flex items-center justify-center"
              :class="vocabStore.isWordLearned(collectionId, word.id) ? 'bg-green-500' : 'border-2 border-gray-300 dark:border-gray-600'"
            >
              <svg v-if="vocabStore.isWordLearned(collectionId, word.id)" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="vocabStore.isLoadingWords" class="flex items-center justify-center h-64">
      <van-loading size="40" />
    </div>

    <!-- No data -->
    <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
      {{ t('common.noData') }}
    </div>
  </div>
</template>
