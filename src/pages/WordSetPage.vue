<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import { scoresApi } from '@/api/endpoints/scores'
import type { CollectionScore } from '@/types/score'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const collectionId = computed(() => route.params.setId as string)
const scores = ref<CollectionScore | null>(null)
const showWordList = ref(false)

const collection = computed(() =>
  vocabStore.collections.find(c => c.id === collectionId.value) || null
)

const getScoreValue = (type: 'vocabulary' | 'quiz' | 'writing') => {
  if (!scores.value) return 0
  return scores.value[type] ?? 0
}

const isStar = (type: 'vocabulary' | 'quiz' | 'writing') => {
  return scores.value?.stars?.[type] ?? false
}

const getName = (name: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return name.ru
  return name.uz
}


const speakAudio = ref<HTMLAudioElement | null>(null)

const speakWord = (word: string, audioUrl?: string | null) => {
  hapticImpact('light')

  if (speakAudio.value) {
    speakAudio.value.pause()
  }

  // Bazadan kelgan audio bo'lsa — uni o'ynatamiz
  if (audioUrl) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
    const fullUrl = audioUrl.startsWith('http') ? audioUrl : `${baseUrl}${audioUrl}`
    const audio = new Audio(fullUrl)
    speakAudio.value = audio
    audio.onerror = () => speakWordFallback(word)
    audio.play().catch(() => speakWordFallback(word))
    return
  }

  speakWordFallback(word)
}

const speakWordFallback = (word: string) => {
  const url = `https://api.dictionaryapi.dev/media/pronunciations/en/${word.toLowerCase()}-us.mp3`
  const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(word)}`

  const audio = new Audio(url)
  speakAudio.value = audio

  audio.onerror = () => {
    const fallback = new Audio(googleUrl)
    speakAudio.value = fallback
    fallback.onerror = () => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word)
        utterance.lang = 'en-US'
        utterance.rate = 0.9
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
      }
    }
    fallback.play().catch(() => {})
  }

  audio.play().catch(() => {
    audio.onerror?.(new Event('error'))
  })
}

const actions = [
  { key: 'learn', route: 'learn', bg: '#58cc02', shadow: '#46a302' },
  { key: 'writing', route: 'writing', bg: '#1cb0f6', shadow: '#1899d6' },
  { key: 'test', route: 'test', bg: '#ce82ff', shadow: '#a568cc' }
]

const handleBack = () => {
  router.back()
}

const navigateToAction = (action: string) => {
  hapticImpact('medium')
  router.push(`/vocabulary/set/${collectionId.value}/${action}`)
}

const fetchScores = async () => {
  try {
    const res = await scoresApi.getByCollection(collectionId.value)
    scores.value = res.data
  } catch {
    scores.value = null
  }
}

onMounted(async () => {
  vocabStore.initVocab()
  showBackButton()
  onBackButtonClick(handleBack)
  await Promise.all([
    vocabStore.fetchCollection(collectionId.value),
    vocabStore.fetchWords(collectionId.value),
    fetchScores()
  ])
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
      <div class="flex items-center justify-between">
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
        <!-- Words count badge -->
        <div v-if="vocabStore.words.length > 0" @click="showWordList = true; hapticImpact('light')" class="flex items-center gap-1.5 bg-[#58cc02]/10 dark:bg-[#58cc02]/20 px-2.5 py-1 rounded-full cursor-pointer active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span class="text-xs font-extrabold text-[#58cc02]">{{ vocabStore.words.length }}</span>
        </div>
      </div>
    </div>

    <div v-if="!vocabStore.isLoadingWords && vocabStore.words.length > 0" class="px-5 py-6">
      <!-- Score Circle -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative w-36 h-36">
          <!-- Background circle -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-b from-[#fff8e1] to-[#fff0c2] dark:from-[#2a2210] dark:to-[#1e1a0d] border-4 border-[#ffd54f]/30 dark:border-[#ffc800]/20" />

          <!-- Inner shadow ring -->
          <div class="absolute inset-2 rounded-full border-2 border-[#ffc800]/15 dark:border-[#ffc800]/10" />

          <!-- Center content -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#ffc800] mb-1" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
            </svg>
            <span class="text-4xl font-black text-[#e6a800] dark:text-[#ffc800] leading-none">{{ scores?.totalStars ?? 0 }}</span>
            <span class="text-[10px] font-extrabold text-[#c49000] dark:text-[#d4a017] uppercase tracking-widest mt-1">{{ t('vocabulary.actions.score') }}</span>
          </div>
        </div>
      </div>

      <!-- Module Scores Card -->
      <div class="relative mb-6">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-[#e5e7eb] dark:bg-[#1a2730]" />
        <div class="relative bg-white dark:bg-[#243642] rounded-2xl px-4 py-5 -translate-y-[4px] border border-gray-100 dark:border-[#314158]">
          <div class="grid grid-cols-3 divide-x divide-gray-100 dark:divide-[#314158]">
            <!-- Learn -->
            <div class="flex flex-col items-center gap-2 px-2">
              <div class="w-10 h-10 rounded-full bg-[#58cc02]/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <span class="text-2xl font-black text-[#58cc02] leading-none">{{ getScoreValue('vocabulary') }}</span>
              <svg v-if="isStar('vocabulary')" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#ffc800]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ t('vocabulary.actions.learn') }}</span>
            </div>
            <!-- Writing -->
            <div class="flex flex-col items-center gap-2 px-2">
              <div class="w-10 h-10 rounded-full bg-[#1cb0f6]/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#1cb0f6]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <span class="text-2xl font-black text-[#1cb0f6] leading-none">{{ getScoreValue('writing') }}</span>
              <svg v-if="isStar('writing')" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#ffc800]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ t('vocabulary.actions.writing') }}</span>
            </div>
            <!-- Test -->
            <div class="flex flex-col items-center gap-2 px-2">
              <div class="w-10 h-10 rounded-full bg-[#ce82ff]/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#ce82ff]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span class="text-2xl font-black text-[#ce82ff] leading-none">{{ getScoreValue('quiz') }}</span>
              <svg v-if="isStar('quiz')" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#ffc800]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ t('vocabulary.actions.test') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="space-y-4">
        <div
          v-for="action in actions"
          :key="action.key"
          @click="navigateToAction(action.route)"
          class="relative cursor-pointer group"
        >
          <!-- 3D bottom layer -->
          <div
            class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl"
            :style="{ backgroundColor: action.shadow }"
          />
          <!-- Main card -->
          <div
            class="relative rounded-2xl px-5 py-4 -translate-y-[5px] group-active:translate-y-0 transition-transform flex items-center gap-4"
            :style="{ backgroundColor: action.bg }"
          >
            <div class="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <!-- Learn icon -->
              <svg v-if="action.key === 'learn'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <!-- Writing icon -->
              <svg v-else-if="action.key === 'writing'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <!-- Test icon -->
              <svg v-else-if="action.key === 'test'" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-white font-extrabold text-base">{{ t(`vocabulary.actions.${action.key}`) }}</span>
              <p class="text-white/80 text-xs mt-0.5 font-medium">{{ t(`vocabulary.actions.${action.key}_desc`) }}</p>
            </div>
            <!-- Arrow -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white/60 shrink-0 group-active:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>


    </div>

    <!-- Loading -->
    <div v-else-if="vocabStore.isLoadingWords" class="px-5 py-6">
      <!-- Score circle skeleton -->
      <div class="flex justify-center mb-8">
        <div class="w-36 h-36 rounded-full bg-gray-100 dark:bg-[#243642] animate-pulse" />
      </div>
      <!-- Guide text skeleton -->
      <div class="flex justify-center mb-5">
        <div class="h-4 bg-gray-100 dark:bg-[#243642] rounded w-3/4 animate-pulse" />
      </div>
      <!-- Card skeletons -->
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-gray-200/50 dark:bg-[#1a2730]" />
          <div class="relative rounded-2xl px-5 py-4 bg-gray-100 dark:bg-[#243642] -translate-y-[5px] animate-pulse flex items-center gap-4">
            <div class="w-11 h-11 bg-gray-200 dark:bg-[#314158] rounded-xl shrink-0" />
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-[#314158] rounded w-1/3 mb-2" />
              <div class="h-3 bg-gray-200 dark:bg-[#314158] rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
      <!-- Words count skeleton -->
      <div class="flex justify-center mt-6">
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-gray-200/50 dark:bg-[#1a2730]" />
          <div class="relative rounded-2xl px-6 py-3 bg-gray-100 dark:bg-[#243642] -translate-y-[4px] animate-pulse flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-200 dark:bg-[#314158] rounded-xl" />
            <div class="h-5 bg-gray-200 dark:bg-[#314158] rounded w-20" />
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

  <!-- Word List Action Sheet -->
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="showWordList" class="fixed inset-0 bg-black/50 z-50" @click="showWordList = false" />
    </Transition>
    <Transition name="sheet">
      <div v-if="showWordList" class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a2730] rounded-t-3xl max-h-[80vh] flex flex-col">
        <!-- Handle -->
        <div class="flex justify-center pt-3 pb-2">
          <div class="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-3 border-b border-gray-100 dark:border-white/5">
          <div>
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white">
              {{ collection ? getName(collection.name) : '' }}
            </h3>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ vocabStore.words.length }} ta so'z</p>
          </div>
          <button @click="showWordList = false" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Words list -->
        <div class="overflow-y-auto flex-1 px-5 py-3">
          <div
            v-for="(word, index) in vocabStore.words"
            :key="word.id"
            class="flex items-center gap-3 py-3"
            :class="{ 'border-b border-gray-50 dark:border-white/5': index < vocabStore.words.length - 1 }"
          >
            <span class="w-6 text-center text-[11px] font-bold text-gray-300 dark:text-gray-600">{{ index + 1 }}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-[15px] text-gray-900 dark:text-white">{{ word.word }}</span>
                <span v-if="word.transcription" class="text-[11px] text-gray-400 dark:text-gray-500">{{ word.transcription }}</span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {{ currentLanguage === 'ru' ? word.wordTranslate?.ru : word.wordTranslate?.uz }}
              </p>
            </div>
            <!-- Sound button -->
            <button
              @click.stop="word.audioUrl && speakWord(word.word, word.audioUrl)"
              :disabled="!word.audioUrl"
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              :class="word.audioUrl ? 'bg-[#1cb0f6]/10 active:scale-90' : 'bg-gray-100 dark:bg-white/5 opacity-30 cursor-not-allowed'"
            >
              <svg class="w-4 h-4" :class="word.audioUrl ? 'text-[#1cb0f6]' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
