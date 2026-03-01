<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useAudio } from '@/composables/useAudio'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, hapticNotification, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { speakEnglish, isSpeaking } = useAudio()
const { currentLanguage } = useLanguage()

const collectionId = computed(() => route.params.setId as string)
const currentIndex = ref(0)
const isComplete = ref(false)

const currentWord = computed(() => {
  if (vocabStore.words.length === 0) return null
  return vocabStore.words[currentIndex.value]
})

const progress = computed(() => {
  if (vocabStore.words.length === 0) return 0
  return ((currentIndex.value + 1) / vocabStore.words.length) * 100
})

const getTranslation = (wordTranslate: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return wordTranslate.ru
  return wordTranslate.uz
}

const getExampleTranslation = () => {
  if (!currentWord.value?.exampleTranslate) return ''
  if (currentLanguage.value === 'ru') return currentWord.value.exampleTranslate.ru
  return currentWord.value.exampleTranslate.uz
}

const handleBack = () => {
  router.back()
}

const playAudio = () => {
  if (currentWord.value) {
    hapticImpact('light')
    speakEnglish(currentWord.value.word)
  }
}

const nextWord = () => {
  hapticImpact('light')

  if (currentIndex.value < vocabStore.words.length - 1) {
    currentIndex.value++
  } else {
    isComplete.value = true
    hapticNotification('success')
  }
}

const prevWord = () => {
  hapticImpact('light')
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const markLearned = () => {
  if (currentWord.value) {
    hapticNotification('success')
    vocabStore.markWordAsLearned(collectionId.value, currentWord.value.id)
    nextWord()
  }
}

const restart = () => {
  hapticImpact('medium')
  currentIndex.value = 0
  isComplete.value = false
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

      <!-- Progress Bar -->
      <div class="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary-500 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="vocabStore.isLoadingWords" class="flex items-center justify-center h-64">
      <van-loading size="40" />
    </div>

    <!-- Complete Screen -->
    <div v-else-if="isComplete" class="px-4 py-12 text-center">
      <div class="text-6xl mb-6">🎉</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('vocabulary.learn.complete_title') }}
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ t('vocabulary.learn.complete_message') }}
      </p>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('vocabulary.learn.words_learned') }}</p>
        <p class="text-4xl font-bold text-primary-500">
          {{ vocabStore.getLearnedWordsCount(collectionId) }}/{{ vocabStore.words.length }}
        </p>
      </div>

      <div class="flex gap-3">
        <van-button plain round size="large" class="flex-1" @click="handleBack">
          {{ t('vocabulary.learn.go_back') }}
        </van-button>
        <van-button type="primary" round size="large" class="flex-1" @click="restart">
          {{ t('vocabulary.learn.restart') }}
        </van-button>
      </div>
    </div>

    <!-- Word Card -->
    <div v-else-if="currentWord" class="px-4 py-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <!-- English Word -->
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ currentWord.word }}
          </h2>
          <p v-if="currentWord.transcription" class="text-gray-500 dark:text-gray-400">{{ currentWord.transcription }}</p>

          <!-- Audio Button -->
          <button
            @click="playAudio"
            class="mt-4 w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto transition-all"
            :class="{ 'animate-pulse': isSpeaking }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>

        <!-- Example -->
        <div v-if="currentWord.example" class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('vocabulary.learn.example') }}</p>
          <p class="text-gray-800 dark:text-gray-200 italic">"{{ currentWord.example }}"</p>
        </div>

        <div class="border-t border-gray-100 dark:border-gray-700 my-4" />

        <!-- Translation -->
        <div class="mb-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('vocabulary.learn.translation') }}</p>
          <p class="text-xl font-semibold text-primary-600 dark:text-primary-400">{{ getTranslation(currentWord.wordTranslate) }}</p>
        </div>

        <!-- Example Translation -->
        <div v-if="currentWord.exampleTranslate" class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ t('vocabulary.learn.example_translation') }}</p>
          <p class="text-gray-700 dark:text-gray-300 italic">"{{ getExampleTranslation() }}"</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex gap-3 mb-4">
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
          {{ t('vocabulary.learn.next') }}
        </van-button>
      </div>

      <!-- Mark as Learned -->
      <van-button
        v-if="!vocabStore.isWordLearned(collectionId, currentWord.id)"
        type="success"
        plain
        round
        block
        size="large"
        @click="markLearned"
      >
        ✓ {{ t('vocabulary.learn.mark_learned') }}
      </van-button>
      <div
        v-else
        class="text-center py-3 text-green-600 dark:text-green-400 font-medium"
      >
        ✓ {{ t('vocabulary.learned') }}
      </div>
    </div>
  </div>
</template>
