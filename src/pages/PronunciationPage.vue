<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useVoiceRecorder } from '@/composables/useVoiceRecorder'
import { usePronunciationCheck } from '@/composables/usePronunciationCheck'
import PronunciationCard from '@/components/vocabulary/PronunciationCard.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, hapticNotification, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()

const {
  isRecording,
  isProcessing,
  recognizedText,
  error,
  isSupported,
  toggleRecording,
  reset: resetRecorder
} = useVoiceRecorder('en-US')

const { check, stats, resetStats } = usePronunciationCheck()

const collectionId = computed(() => route.params.setId as string)
const currentIndex = ref(0)
const isComplete = ref(false)
const currentResult = ref<{ isCorrect: boolean; recognizedText: string } | null>(null)

const currentWord = computed(() => {
  if (vocabStore.words.length === 0) return null
  return vocabStore.words[currentIndex.value]
})

const progress = computed(() => {
  if (vocabStore.words.length === 0) return 0
  return ((currentIndex.value + 1) / vocabStore.words.length) * 100
})

const handleBack = () => {
  router.back()
}

const handleToggleRecording = () => {
  hapticImpact('medium')
  toggleRecording()
}

const handleListen = () => {
  hapticImpact('light')
}

// Watch for recognition result
watch(recognizedText, (text) => {
  if (text && currentWord.value) {
    const result = check(currentWord.value.word, text)
    currentResult.value = {
      isCorrect: result.isCorrect,
      recognizedText: result.recognizedText
    }

    if (result.isCorrect) {
      hapticNotification('success')
    } else {
      hapticNotification('error')
    }
  }
})

// Watch for errors
watch(error, (err) => {
  if (err) {
    hapticNotification('error')
  }
})

const nextWord = () => {
  hapticImpact('light')
  currentResult.value = null
  resetRecorder()

  if (currentIndex.value < vocabStore.words.length - 1) {
    currentIndex.value++
  } else {
    isComplete.value = true
    hapticNotification('success')
  }
}

const prevWord = () => {
  hapticImpact('light')
  currentResult.value = null
  resetRecorder()

  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const restart = () => {
  hapticImpact('medium')
  currentIndex.value = 0
  isComplete.value = false
  currentResult.value = null
  resetRecorder()
  resetStats()
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
      <div class="flex items-center justify-between">
        <button @click="handleBack" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ currentIndex + 1 }}/{{ vocabStore.words.length }}
        </span>
        <div class="w-10" />
      </div>

      <div class="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-primary-500 transition-all duration-300" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="vocabStore.isLoadingWords" class="flex items-center justify-center h-64">
      <van-loading size="40" />
    </div>

    <!-- Not Supported Warning -->
    <div v-else-if="!isSupported" class="px-4 py-12 text-center">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
        <div class="text-5xl mb-4">⚠️</div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('vocabulary.pronunciation.not_supported') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ t('vocabulary.pronunciation.use_chrome') }}
        </p>
        <van-button type="primary" round @click="handleBack">
          {{ t('vocabulary.pronunciation.go_back') }}
        </van-button>
      </div>
    </div>

    <!-- Complete Screen -->
    <div v-else-if="isComplete" class="px-4 py-12 text-center">
      <div class="text-6xl mb-6">🎉</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('vocabulary.pronunciation.complete_title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ t('vocabulary.pronunciation.complete_message') }}
      </p>

      <!-- Stats -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-green-500">{{ stats.correct }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('vocabulary.pronunciation.total_correct') }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-red-500">{{ stats.incorrect }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('vocabulary.pronunciation.total_incorrect') }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary-500">{{ stats.accuracy }}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('vocabulary.pronunciation.accuracy') }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <van-button plain round size="large" class="flex-1" @click="handleBack">
          {{ t('vocabulary.pronunciation.go_back') }}
        </van-button>
        <van-button type="primary" round size="large" class="flex-1" @click="restart">
          {{ t('vocabulary.pronunciation.restart') }}
        </van-button>
      </div>
    </div>

    <!-- Pronunciation Exercise -->
    <div v-else-if="currentWord" class="px-4 py-6">
      <PronunciationCard
        :word="currentWord"
        :is-recording="isRecording"
        :is-processing="isProcessing"
        :result="currentResult"
        @listen="handleListen"
        @toggle-recording="handleToggleRecording"
      />

      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
        <p class="text-red-600 dark:text-red-400 text-sm">
          {{ error === 'no_speech' ? t('vocabulary.pronunciation.no_speech') :
             error === 'permission_denied' ? t('vocabulary.pronunciation.permission_denied') :
             error === 'no_microphone' ? t('vocabulary.pronunciation.no_microphone') :
             t('vocabulary.pronunciation.error_generic') }}
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex gap-3 mt-8">
        <van-button
          :disabled="currentIndex === 0"
          plain
          round
          size="large"
          class="flex-1"
          @click="prevWord"
        >
          {{ t('vocabulary.learn.previous') }}
        </van-button>
        <van-button
          type="primary"
          round
          size="large"
          class="flex-1"
          @click="nextWord"
        >
          {{ t('common.next') }}
        </van-button>
      </div>
    </div>
  </div>
</template>
