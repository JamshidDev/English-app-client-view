<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuizStore } from '@/stores/useQuizStore'
import { useTelegram } from '@/composables/useTelegram'
import QuizCard from '@/components/quiz/QuizCard.vue'
import QuizOptions from '@/components/quiz/QuizOptions.vue'
import QuizResult from '@/components/quiz/QuizResult.vue'

const { t } = useI18n()
const router = useRouter()
const quizStore = useQuizStore()
const { hapticImpact } = useTelegram()

const showResult = ref(false)

onMounted(() => {
  quizStore.initQuiz()
})

const handleStartQuiz = () => {
  hapticImpact('medium')
  quizStore.startNewSession(10)
  showResult.value = false
}

const handleSelectAnswer = (index: number) => {
  quizStore.submitAnswer(index)
}

const handleNextQuestion = () => {
  hapticImpact('light')

  if (quizStore.isLastQuestion) {
    quizStore.finishSession()
    showResult.value = true
  } else {
    quizStore.nextQuestion()
  }
}

const handleTryAgain = () => {
  hapticImpact('medium')
  quizStore.resetSession()
  quizStore.startNewSession(10)
  showResult.value = false
}

const handleGoHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="px-4 py-6">
    <!-- Start Screen -->
    <div v-if="!quizStore.currentSession && !showResult" class="text-center py-12">
      <div class="text-6xl mb-6">📝</div>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {{ t('quiz.title') }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        10 ta savolga javob bering va bilimingizni tekshiring!
      </p>

      <van-button
        type="primary"
        round
        size="large"
        @click="handleStartQuiz"
      >
        {{ t('quiz.start_quiz') }} 🚀
      </van-button>
    </div>

    <!-- Quiz in Progress -->
    <div v-else-if="quizStore.currentSession && !showResult && quizStore.currentQuiz">
      <QuizCard
        :quiz="quizStore.currentQuiz"
        :question-number="quizStore.currentQuizIndex + 1"
        :total-questions="quizStore.currentSession.totalQuestions"
      />

      <QuizOptions
        :options="quizStore.currentQuiz.options"
        :selected-index="quizStore.selectedAnswer"
        :correct-index="quizStore.currentQuiz.correctAnswerIndex"
        :is-answered="quizStore.isAnswered"
        @select="handleSelectAnswer"
      />

      <!-- Explanation -->
      <div
        v-if="quizStore.isAnswered"
        class="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4"
      >
        <p class="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
          {{ t('quiz.explanation') }}:
        </p>
        <p class="text-sm text-blue-600 dark:text-blue-400">
          {{ quizStore.currentQuiz.explanation }}
        </p>
      </div>

      <!-- Next Button -->
      <div v-if="quizStore.isAnswered" class="mt-6">
        <van-button
          type="primary"
          block
          round
          size="large"
          @click="handleNextQuestion"
        >
          {{ quizStore.isLastQuestion ? t('quiz.finish') : t('quiz.next_question') }}
        </van-button>
      </div>
    </div>

    <!-- Result Screen -->
    <div v-else-if="showResult && quizStore.currentSession">
      <QuizResult
        :score="quizStore.correctAnswers"
        :total="quizStore.currentSession.totalQuestions"
        @try-again="handleTryAgain"
        @go-home="handleGoHome"
      />
    </div>
  </div>
</template>
