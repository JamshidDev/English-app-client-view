<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import { quizzesApi } from '@/api/endpoints/quizzes'
import type { QuizData, QuizQuestion } from '@/types/quiz'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { hapticImpact, hapticNotification, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const collectionId = computed(() => route.params.setId as string)

const quiz = ref<QuizData | null>(null)
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const isAnswered = ref(false)
const isCorrect = ref(false)
const correctIndex = ref<number | null>(null)
const correctCount = ref(0)
const answeredCount = ref(0)
const isComplete = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)

// Har bir savolning javobini saqlash
const answersMap = ref<Map<number, { selected: number; correct: boolean; correctIdx: number }>>(new Map())

const currentQuestion = computed<QuizQuestion | null>(() => {
  if (!quiz.value || currentIndex.value >= quiz.value.questions.length) return null
  return quiz.value.questions[currentIndex.value]
})

const progress = computed(() => {
  if (!quiz.value) return 0
  return ((currentIndex.value + 1) / quiz.value.totalQuestions) * 100
})

const getOptionText = (option: { wordTranslate: { uz: string; ru: string } }) => {
  if (currentLanguage.value === 'ru') return option.wordTranslate.ru
  return option.wordTranslate.uz
}

const handleBack = () => {
  router.back()
}

const initAnswersFromQuiz = (data: QuizData) => {
  data.questions.forEach((q, i) => {
    if (q.selectedIndex != null) {
      answersMap.value.set(i, {
        selected: q.selectedIndex,
        correct: q.selectedIndex === q.correctIndex,
        correctIdx: q.correctIndex
      })
    }
  })

  // Birinchi javob berilmagan savolga o'tish
  const firstUnanswered = data.questions.findIndex(q => q.selectedIndex == null)
  if (firstUnanswered !== -1) {
    currentIndex.value = firstUnanswered
  } else {
    currentIndex.value = 0
    restoreQuestionState(0)
  }

  // answeredCount va correctCount ni hisoblash
  answeredCount.value = answersMap.value.size
  correctCount.value = Array.from(answersMap.value.values()).filter(a => a.correct).length

  // Agar birinchi savol oldin javob berilgan bo'lsa
  if (firstUnanswered !== 0) {
    restoreQuestionState(currentIndex.value)
  }
}

const loadQuiz = async () => {
  isLoading.value = true
  try {
    const res = await quizzesApi.generate(collectionId.value)
    quiz.value = res.data
    initAnswersFromQuiz(res.data)
  } catch {
    try {
      const res = await quizzesApi.getByCollection(collectionId.value)
      quiz.value = res.data
      initAnswersFromQuiz(res.data)
    } catch (error) {
      console.error('Failed to load quiz:', error)
    }
  } finally {
    isLoading.value = false
  }
}

const selectAnswer = async (index: number) => {
  if (isAnswered.value || isSubmitting.value || !currentQuestion.value || !quiz.value) return

  hapticImpact('medium')
  selectedAnswer.value = index
  isSubmitting.value = true

  try {
    const res = await quizzesApi.submitAnswer(quiz.value.id, currentQuestion.value.wordId, index)
    const result = res.data

    isCorrect.value = result.correct
    correctIndex.value = result.correctIndex
    correctCount.value = result.correctAnswers ?? correctCount.value
    answeredCount.value = result.answeredQuestions
    isAnswered.value = true

    answersMap.value.set(currentIndex.value, {
      selected: index,
      correct: result.correct,
      correctIdx: result.correctIndex
    })

    if (result.correct) {
      hapticNotification('success')
    } else {
      hapticNotification('error')
    }
  } catch (error) {
    console.error('Failed to submit answer:', error)
    selectedAnswer.value = null
  } finally {
    isSubmitting.value = false
  }
}

const restoreQuestionState = (index: number) => {
  const saved = answersMap.value.get(index)
  if (saved) {
    selectedAnswer.value = saved.selected
    isAnswered.value = true
    isCorrect.value = saved.correct
    correctIndex.value = saved.correctIdx
  } else {
    selectedAnswer.value = null
    isAnswered.value = false
    isCorrect.value = false
    correctIndex.value = null
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    hapticImpact('light')
    currentIndex.value--
    restoreQuestionState(currentIndex.value)
  }
}

const nextQuestion = () => {
  hapticImpact('light')

  if (quiz.value && currentIndex.value < quiz.value.questions.length - 1) {
    currentIndex.value++
    restoreQuestionState(currentIndex.value)
  }
}

const completeQuiz = async () => {
  if (!quiz.value) return
  try {
    await quizzesApi.complete(quiz.value.id)
  } catch (error) {
    console.error('Failed to complete quiz:', error)
  }
  isComplete.value = true
}

const finishEarly = async () => {
  hapticImpact('medium')
  await completeQuiz()
}

const restart = async () => {
  hapticImpact('medium')
  currentIndex.value = 0
  selectedAnswer.value = null
  isAnswered.value = false
  isCorrect.value = false
  correctIndex.value = null
  correctCount.value = 0
  answeredCount.value = 0
  isComplete.value = false
  answersMap.value.clear()
  quiz.value = null
  await loadQuiz()
}

const getOptionClass = (index: number) => {
  if (!isAnswered.value) {
    return selectedAnswer.value === index
      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
  }

  if (index === correctIndex.value) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/20'
  }

  if (index === selectedAnswer.value && index !== correctIndex.value) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/20'
  }

  return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
}

const getOptionBadgeClass = (index: number) => {
  if (isAnswered.value && index === correctIndex.value) return 'bg-green-500 text-white transition-colors duration-300'
  if (isAnswered.value && index === selectedAnswer.value && index !== correctIndex.value) return 'bg-red-500 text-white transition-colors duration-300'
  return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300'
}

onMounted(async () => {
  showBackButton()
  onBackButtonClick(handleBack)
  await loadQuiz()
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <button @click="handleBack" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ t('vocabulary.test.question') }} {{ currentIndex + 1 }}/{{ quiz?.totalQuestions || 0 }}
        </span>
        <div class="w-10" />
      </div>

      <div v-if="quiz" class="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-primary-500 transition-all duration-300" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <van-loading size="40" />
    </div>

    <!-- Complete Screen -->
    <div v-else-if="isComplete && quiz" class="px-4 py-12 text-center">
      <div class="text-6xl mb-6">
        {{ correctCount >= quiz.totalQuestions * 0.8 ? '🎉' : correctCount >= quiz.totalQuestions * 0.5 ? '👍' : '💪' }}
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('vocabulary.test.score') }}
      </h2>

      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
        <p
          class="text-4xl font-bold"
          :class="correctCount >= quiz.totalQuestions * 0.8 ? 'text-green-500' : correctCount >= quiz.totalQuestions * 0.5 ? 'text-yellow-500' : 'text-orange-500'"
        >
          {{ correctCount }}/{{ answeredCount }}
        </p>
        <p class="text-gray-500 dark:text-gray-400 mt-2">
          {{ answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0 }}%
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

    <!-- Question -->
    <div v-else-if="currentQuestion" class="px-4 py-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('vocabulary.test.choose_correct') }}</p>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ currentQuestion.word }}
        </h2>
        <p v-if="currentQuestion.transcription" class="text-gray-500 dark:text-gray-400 mt-1">
          {{ currentQuestion.transcription }}
        </p>
      </div>

      <!-- Options -->
      <div class="space-y-3 mb-6">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="selectAnswer(index)"
          :disabled="isAnswered || isSubmitting"
          class="w-full p-4 rounded-xl border-2 text-left transition-colors duration-300 ease-in-out"
          :class="getOptionClass(index)"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
              :class="getOptionBadgeClass(index)"
            >
              {{ ['A', 'B', 'C', 'D'][index] }}
            </span>
            <span class="font-medium text-gray-800 dark:text-gray-200 flex-1">{{ getOptionText(option) }}</span>
            <span
              v-if="isAnswered && index === correctIndex"
              class="text-xs font-semibold text-green-600 dark:text-green-400 flex-shrink-0"
            >{{ t('vocabulary.test.correct') }}</span>
            <span
              v-if="isAnswered && index === selectedAnswer && index !== correctIndex"
              class="text-xs font-semibold text-red-600 dark:text-red-400 flex-shrink-0"
            >{{ t('vocabulary.test.incorrect') }}</span>
          </div>
        </button>
      </div>

      <!-- Submitting indicator -->
      <div v-if="isSubmitting" class="flex justify-center py-4">
        <van-loading size="24" />
      </div>

      <!-- Navigation: Oldingi / Keyin -->
      <div class="flex gap-3 mb-4">
        <van-button
          :disabled="currentIndex === 0"
          plain
          round
          size="large"
          class="flex-1"
          @click="prevQuestion"
        >
          {{ t('vocabulary.learn.previous') }}
        </van-button>
        <van-button
          :disabled="currentIndex >= (quiz?.questions.length || 0) - 1"
          type="primary"
          round
          size="large"
          class="flex-1"
          @click="nextQuestion"
        >
          {{ t('vocabulary.learn.next') }}
        </van-button>
      </div>

      <!-- Yakunlash -->
      <van-button
        type="danger"
        plain
        round
        block
        size="large"
        @click="finishEarly"
      >
        {{ t('vocabulary.test.finish') }}
      </van-button>
    </div>
  </div>
</template>
