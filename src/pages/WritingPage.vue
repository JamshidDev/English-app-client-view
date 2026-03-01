<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import { shuffleArray } from '@/utils/helpers'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, hapticNotification, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const setId = computed(() => Number(route.params.setId))
const wordSet = computed(() => vocabStore.getWordSetById(setId.value))

const shuffledWords = ref<typeof wordSet.value.words>([])
const currentIndex = ref(0)
const userInput = ref('')
const isChecked = ref(false)
const isCorrect = ref(false)
const correctCount = ref(0)
const isComplete = ref(false)
const showHint = ref(false)

const currentWord = computed(() => shuffledWords.value[currentIndex.value])

const progress = computed(() => {
  if (shuffledWords.value.length === 0) return 0
  return ((currentIndex.value + 1) / shuffledWords.value.length) * 100
})

const getTranslation = () => {
  if (!currentWord.value) return ''
  if (currentLanguage.value === 'ru') return currentWord.value.translationRu
  return currentWord.value.translationUz
}

const handleBack = () => {
  router.back()
}

const checkAnswer = () => {
  if (!currentWord.value || isChecked.value) return

  hapticImpact('medium')
  isChecked.value = true

  const normalizedInput = userInput.value.trim().toLowerCase()
  const normalizedAnswer = currentWord.value.word.toLowerCase()

  isCorrect.value = normalizedInput === normalizedAnswer

  if (isCorrect.value) {
    correctCount.value++
    hapticNotification('success')
  } else {
    hapticNotification('error')
  }
}

const nextWord = () => {
  hapticImpact('light')

  if (currentIndex.value < shuffledWords.value.length - 1) {
    currentIndex.value++
    userInput.value = ''
    isChecked.value = false
    isCorrect.value = false
    showHint.value = false
  } else {
    isComplete.value = true
  }
}

const skipWord = () => {
  hapticImpact('light')
  nextWord()
}

const toggleHint = () => {
  showHint.value = !showHint.value
}

const restart = () => {
  hapticImpact('medium')
  shuffledWords.value = shuffleArray([...wordSet.value!.words])
  currentIndex.value = 0
  userInput.value = ''
  isChecked.value = false
  isCorrect.value = false
  correctCount.value = 0
  isComplete.value = false
  showHint.value = false
}

onMounted(() => {
  vocabStore.initVocab()
  if (wordSet.value) {
    shuffledWords.value = shuffleArray([...wordSet.value.words])
  }
  showBackButton()
  onBackButtonClick(handleBack)
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
          {{ currentIndex + 1 }}/{{ shuffledWords.length }}
        </span>
        <div class="w-10" />
      </div>

      <div class="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-primary-500 transition-all duration-300" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <!-- Complete Screen -->
    <div v-if="isComplete" class="px-4 py-12 text-center">
      <div class="text-6xl mb-6">✍️</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('vocabulary.test.score') }}
      </h2>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
        <p class="text-4xl font-bold text-primary-500">
          {{ correctCount }}/{{ shuffledWords.length }}
        </p>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          {{ Math.round((correctCount / shuffledWords.length) * 100) }}%
        </p>
      </div>

      <div class="flex gap-3">
        <van-button plain round size="large" class="flex-1" @click="handleBack">
          {{ t('vocabulary.learn.go_back') }}
        </van-button>
        <van-button type="primary" round size="large" class="flex-1" @click="restart">
          {{ t('vocabulary.test.try_again') }}
        </van-button>
      </div>
    </div>

    <!-- Writing Exercise -->
    <div v-else-if="currentWord" class="px-4 py-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('vocabulary.writing.type_word') }}</p>
        <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          {{ getTranslation() }}
        </h2>

        <!-- Hint -->
        <button
          @click="toggleHint"
          class="text-sm text-primary-500 mb-4"
        >
          {{ showHint ? currentWord.word : `💡 ${t('vocabulary.writing.hint')}` }}
        </button>

        <!-- Input -->
        <van-field
          v-model="userInput"
          :placeholder="t('vocabulary.writing.type_word')"
          :disabled="isChecked"
          size="large"
          class="rounded-xl"
          @keyup.enter="checkAnswer"
        />
      </div>

      <!-- Feedback -->
      <div v-if="isChecked" class="mb-4">
        <div
          class="p-4 rounded-xl"
          :class="isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'"
        >
          <p class="font-semibold" :class="isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ isCorrect ? t('vocabulary.writing.correct') : t('vocabulary.writing.incorrect') }}
          </p>
          <p v-if="!isCorrect" class="text-gray-600 dark:text-gray-400 mt-1">
            <span class="font-bold">{{ currentWord.word }}</span>
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="space-y-3">
        <van-button
          v-if="!isChecked"
          type="primary"
          round
          block
          size="large"
          :disabled="!userInput.trim()"
          @click="checkAnswer"
        >
          {{ t('vocabulary.writing.check') }}
        </van-button>

        <van-button
          v-if="isChecked"
          type="primary"
          round
          block
          size="large"
          @click="nextWord"
        >
          {{ t('common.next') }}
        </van-button>

        <van-button
          v-if="!isChecked"
          plain
          round
          block
          @click="skipWord"
        >
          {{ t('vocabulary.writing.skip') }}
        </van-button>
      </div>
    </div>
  </div>
</template>
