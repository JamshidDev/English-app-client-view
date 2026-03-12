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
  { key: 'learn', icon: '🧠', route: 'learn', bg: '#58cc02', shadow: '#46a302' },
  { key: 'test', icon: '✅', route: 'test', bg: '#ce82ff', shadow: '#a568cc' },
  { key: 'writing', icon: '✍️', route: 'writing', bg: '#1cb0f6', shadow: '#1899d6' },
  { key: 'pronunciation', icon: '🔊', route: 'pronunciation', bg: '#ff9600', shadow: '#e08600' }
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
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#111111] border-b border-transparent dark:border-white/5 px-4 py-4">
      <div class="flex items-center gap-2">
        <button
          @click="handleBack"
          class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ collection ? getName(collection.name) : '' }}
        </h1>
      </div>
    </div>

    <div v-if="!vocabStore.isLoadingWords && vocabStore.words.length > 0" class="px-4 py-4">
      <!-- Action Cards Grid -->
      <div class="grid grid-cols-2 gap-3 mb-5">
        <div
          v-for="action in actions"
          :key="action.key"
          @click="navigateToAction(action.route)"
          class="relative cursor-pointer active:scale-[0.97] transition-transform"
        >
          <!-- 3D bottom layer -->
          <div
            class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl"
            :style="{ backgroundColor: action.shadow }"
          />
          <!-- Main card -->
          <div
            class="relative rounded-2xl p-5 text-left -translate-y-1 active:translate-y-0 transition-transform"
            :style="{ backgroundColor: action.bg }"
          >
            <span class="text-3xl mb-2 block">{{ action.icon }}</span>
            <span class="text-white font-bold text-sm">{{ t(`vocabulary.actions.${action.key}`) }}</span>
          </div>
        </div>
      </div>

      <!-- Words List -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1 mb-1">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white">
            {{ t('vocabulary.words_count') }}: {{ vocabStore.words.length }}
          </h3>
        </div>

        <div
          v-for="(word, index) in vocabStore.words"
          :key="word.id"
          class="relative"
        >
          <!-- 3D bottom layer -->
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-white/5" />
          <!-- Main card -->
          <div class="relative bg-white dark:bg-[#111111] rounded-xl px-4 py-3 -translate-y-0.5 flex items-center gap-3 border border-gray-100 dark:border-white/10">
            <span class="text-xs font-bold text-gray-300 dark:text-gray-600 w-5 text-right">{{ index + 1 }}</span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ word.word }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ getTranslation(word.wordTranslate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="vocabStore.isLoadingWords" class="px-4 py-4">
      <div class="grid grid-cols-2 gap-3 mb-5">
        <div v-for="i in 4" :key="i" class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200/50 dark:bg-white/5" />
          <div class="relative rounded-2xl p-5 bg-gray-100 dark:bg-white/5 -translate-y-1 animate-pulse">
            <div class="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded-lg mb-2" />
            <div class="h-3.5 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-[#111111] rounded-2xl border border-gray-100 dark:border-white/5 p-4 animate-pulse">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3 py-2.5">
          <div class="w-5 h-3 bg-gray-200 dark:bg-white/10 rounded" />
          <div class="flex-1 h-3.5 bg-gray-200 dark:bg-white/10 rounded" />
          <div class="w-5 h-5 bg-gray-200 dark:bg-white/10 rounded-full" />
        </div>
      </div>
    </div>

    <!-- No data -->
    <div v-else class="flex flex-col items-center justify-center px-6 pt-20 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
        <span class="text-2xl">📭</span>
      </div>
      <p class="text-sm text-gray-400 dark:text-gray-600">
        {{ t('common.noData') }}
      </p>
    </div>
  </div>
</template>
