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
  { key: 'learn', route: 'learn', bg: '#58cc02', shadow: '#46a302' },
  { key: 'test', route: 'test', bg: '#ce82ff', shadow: '#a568cc' },
  { key: 'writing', route: 'writing', bg: '#1cb0f6', shadow: '#1899d6' },
  { key: 'pronunciation', route: 'pronunciation', bg: '#ff9600', shadow: '#e08600' }
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
  <div class="min-h-screen bg-white dark:bg-[#131f24]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 pt-4 pb-3">
      <div class="flex items-center gap-2">
        <button
          @click="handleBack"
          class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">
          {{ collection ? getName(collection.name) : '' }}
        </h1>
      </div>
    </div>

    <div v-if="!vocabStore.isLoadingWords && vocabStore.words.length > 0" class="px-4 py-4">
      <!-- Action Cards Grid -->
      <div class="grid grid-cols-2 gap-2.5 mb-4">
        <div
          v-for="action in actions"
          :key="action.key"
          @click="navigateToAction(action.route)"
          class="relative cursor-pointer active:scale-[0.97] transition-transform"
        >
          <!-- 3D bottom layer -->
          <div
            class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl"
            :style="{ backgroundColor: action.shadow }"
          />
          <!-- Main card -->
          <div
            class="relative rounded-xl px-3.5 py-3 -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            :style="{ backgroundColor: action.bg }"
          >
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-1.5">
              <!-- Learn icon -->
              <svg v-if="action.key === 'learn'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <!-- Test icon -->
              <svg v-else-if="action.key === 'test'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <!-- Writing icon -->
              <svg v-else-if="action.key === 'writing'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <!-- Pronunciation icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            </div>
            <span class="text-white font-bold text-xs">{{ t(`vocabulary.actions.${action.key}`) }}</span>
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
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#1a2730]" />
          <!-- Main card -->
          <div class="relative bg-white dark:bg-[#1a2730] rounded-xl px-4 py-3 -translate-y-0.5 flex items-center gap-3 border border-gray-100 dark:border-[#314158]">
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
    <div v-else-if="vocabStore.isLoadingWords" class="px-4 py-3">
      <div class="grid grid-cols-2 gap-2.5 mb-4">
        <div v-for="i in 4" :key="i" class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200/50 dark:bg-[#243642]" />
          <div class="relative rounded-xl px-3.5 py-3 bg-gray-100 dark:bg-[#1a2730] -translate-y-1 animate-pulse">
            <div class="w-8 h-8 bg-gray-200 dark:bg-[#243642] rounded-lg mb-1.5" />
            <div class="h-3 bg-gray-200 dark:bg-[#243642] rounded w-2/3" />
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <div v-for="i in 5" :key="i" class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
          <div class="relative bg-white dark:bg-[#1a2730] rounded-xl px-4 py-3 -translate-y-0.5 flex items-center gap-3 border border-gray-100 dark:border-[#314158] animate-pulse">
            <div class="w-5 h-3 bg-gray-200 dark:bg-[#243642] rounded" />
            <div class="flex-1">
              <div class="h-3.5 bg-gray-200 dark:bg-[#243642] rounded w-1/2 mb-1.5" />
              <div class="h-2.5 bg-gray-200 dark:bg-[#243642] rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No data -->
    <div v-else class="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div class="relative mb-5">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
        <div class="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#1a2730] -translate-y-[3px] flex items-center justify-center border border-gray-100 dark:border-[#314158]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      </div>
      <p class="text-sm font-bold text-gray-400 dark:text-gray-500">
        {{ t('common.noData') }}
      </p>
    </div>
  </div>
</template>
