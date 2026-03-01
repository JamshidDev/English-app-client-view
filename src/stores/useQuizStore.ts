import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quiz, QuizResult, QuizSession } from '@/types/quiz'
import { quizzes as quizzesData } from '@/data/quizzes'
import { useAuthStore } from './useAuthStore'
import { shuffleArray } from '@/utils/helpers'

export const useQuizStore = defineStore('quiz', () => {
  const quizzes = ref<Quiz[]>(quizzesData)
  const currentSession = ref<QuizSession | null>(null)
  const currentQuizIndex = ref(0)
  const selectedAnswer = ref<number | null>(null)
  const isAnswered = ref(false)
  const quizHistory = ref<QuizSession[]>([])

  const initQuiz = () => {
    const savedHistory = localStorage.getItem('quizHistory')
    if (savedHistory) {
      quizHistory.value = JSON.parse(savedHistory)
    }
  }

  const currentQuiz = computed(() => {
    if (!currentSession.value) return null
    const quizId = currentSession.value.quizIds[currentQuizIndex.value]
    return quizzes.value.find(q => q.id === quizId) || null
  })

  const sessionProgress = computed(() => {
    if (!currentSession.value) return 0
    return ((currentQuizIndex.value + 1) / currentSession.value.totalQuestions) * 100
  })

  const correctAnswers = computed(() => {
    if (!currentSession.value) return 0
    return currentSession.value.results.filter(r => r.isCorrect).length
  })

  const startNewSession = (count: number = 10) => {
    const shuffled = shuffleArray([...quizzes.value])
    const selectedQuizzes = shuffled.slice(0, Math.min(count, shuffled.length))

    currentSession.value = {
      id: crypto.randomUUID(),
      quizIds: selectedQuizzes.map(q => q.id),
      results: [],
      score: 0,
      totalQuestions: selectedQuizzes.length
    }

    currentQuizIndex.value = 0
    selectedAnswer.value = null
    isAnswered.value = false
  }

  const submitAnswer = (answerIndex: number) => {
    if (!currentSession.value || !currentQuiz.value || isAnswered.value) return

    selectedAnswer.value = answerIndex
    isAnswered.value = true

    const isCorrect = answerIndex === currentQuiz.value.correctAnswerIndex

    const result: QuizResult = {
      quizId: currentQuiz.value.id,
      selectedAnswerIndex: answerIndex,
      isCorrect,
      answeredAt: new Date().toISOString()
    }

    currentSession.value.results.push(result)

    if (isCorrect) {
      currentSession.value.score++
    }
  }

  const nextQuestion = () => {
    if (!currentSession.value) return

    if (currentQuizIndex.value < currentSession.value.totalQuestions - 1) {
      currentQuizIndex.value++
      selectedAnswer.value = null
      isAnswered.value = false
    }
  }

  const finishSession = () => {
    if (!currentSession.value) return

    const authStore = useAuthStore()

    currentSession.value.completedAt = new Date().toISOString()
    quizHistory.value.push(currentSession.value)

    authStore.updateQuizAccuracy(
      currentSession.value.score,
      currentSession.value.totalQuestions
    )

    localStorage.setItem('quizHistory', JSON.stringify(quizHistory.value))
  }

  const resetSession = () => {
    currentSession.value = null
    currentQuizIndex.value = 0
    selectedAnswer.value = null
    isAnswered.value = false
  }

  const getQuizById = (id: string) => {
    return quizzes.value.find(q => q.id === id)
  }

  const isLastQuestion = computed(() => {
    if (!currentSession.value) return false
    return currentQuizIndex.value >= currentSession.value.totalQuestions - 1
  })

  return {
    quizzes,
    currentSession,
    currentQuizIndex,
    selectedAnswer,
    isAnswered,
    quizHistory,
    currentQuiz,
    sessionProgress,
    correctAnswers,
    isLastQuestion,
    initQuiz,
    startNewSession,
    submitAnswer,
    nextQuestion,
    finishSession,
    resetSession,
    getQuizById
  }
})
