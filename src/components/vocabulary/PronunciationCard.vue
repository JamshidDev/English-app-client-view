<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Word } from '@/types/vocabulary'

interface Props {
  word: Word
  isRecording: boolean
  isProcessing: boolean
  result: {
    isCorrect: boolean
    recognizedText: string
  } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'listen'): void
  (e: 'toggle-recording'): void
}>()

const { t } = useI18n()

const playAudio = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }
  const utterance = new SpeechSynthesisUtterance(props.word.word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
  emit('listen')
}

const buttonHint = computed(() => {
  if (props.isProcessing) return t('vocabulary.pronunciation.processing')
  if (props.isRecording) return t('vocabulary.pronunciation.tap_to_stop')
  if (props.result) return t('vocabulary.pronunciation.tap_to_retry')
  return t('vocabulary.pronunciation.tap_to_speak')
})
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Word Display -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg w-full text-center mb-6">
      <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {{ word.word }}
      </h2>
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-4">{{ word.transcription }}</p>

      <!-- Listen Button -->
      <button
        @click="playAudio"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        {{ t('vocabulary.pronunciation.listen') }}
      </button>
    </div>

    <!-- Result Card -->
    <div v-if="result" class="w-full mb-6">
      <div
        class="p-4 rounded-xl"
        :class="result.isCorrect
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">{{ result.isCorrect ? '✅' : '❌' }}</span>
          <span
            class="font-semibold"
            :class="result.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'"
          >
            {{ result.isCorrect ? t('vocabulary.pronunciation.excellent') : t('vocabulary.pronunciation.try_again') }}
          </span>
        </div>

        <p class="text-gray-700 dark:text-gray-300">
          <span class="text-gray-500 dark:text-gray-400">{{ t('vocabulary.pronunciation.you_said') }}:</span>
          <span class="font-medium ml-1">"{{ result.recognizedText }}"</span>
        </p>

        <p v-if="!result.isCorrect" class="text-gray-700 dark:text-gray-300 mt-1">
          <span class="text-gray-500 dark:text-gray-400">{{ t('vocabulary.pronunciation.correct_is') }}:</span>
          <span class="font-bold ml-1 text-primary-600 dark:text-primary-400">"{{ word.word }}"</span>
        </p>
      </div>
    </div>

    <!-- Instruction -->
    <p v-if="!result && !isRecording && !isProcessing" class="text-gray-600 dark:text-gray-400 mb-6 text-center">
      {{ t('vocabulary.pronunciation.instruction') }}
    </p>

    <!-- Speaking indicator -->
    <p v-if="isRecording" class="text-red-500 dark:text-red-400 mb-6 text-center font-medium animate-pulse">
      {{ t('vocabulary.pronunciation.speaking') }}
    </p>

    <!-- Processing indicator -->
    <p v-if="isProcessing && !isRecording" class="text-gray-500 dark:text-gray-400 mb-6 text-center">
      {{ t('vocabulary.pronunciation.processing') }}
    </p>

    <!-- Microphone Button -->
    <div class="relative mb-4">
      <!-- Ping animation when recording -->
      <div
        v-if="isRecording"
        class="absolute inset-0 bg-red-400/30 rounded-full animate-ping"
        style="width: 96px; height: 96px; left: 50%; top: 50%; transform: translate(-50%, -50%);"
      />

      <button
        @click="$emit('toggle-recording')"
        :disabled="isProcessing"
        class="relative z-10 flex items-center justify-center rounded-full shadow-xl transition-all duration-200 active:scale-95"
        :class="[
          isRecording
            ? 'w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30 animate-pulse'
            : 'w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600',
          isProcessing && 'opacity-50 pointer-events-none'
        ]"
      >
        <!-- Loading -->
        <van-loading v-if="isProcessing" color="white" size="36" />

        <!-- Stop icon -->
        <svg v-else-if="isRecording" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>

        <!-- Mic icon -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>

    <!-- Button hint -->
    <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
      {{ buttonHint }}
    </p>
  </div>
</template>
