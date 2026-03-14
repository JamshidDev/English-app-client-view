<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
const slideDirection = ref<'left' | 'right'>('left')
const isAnimating = ref(false)
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

const cancelAutoAdvance = () => {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

// Progress scroll
const progressContainer = ref<HTMLElement | null>(null)

const scrollToActiveBox = () => {
  nextTick(() => {
    if (!progressContainer.value) return
    const activeBox = progressContainer.value.children[currentIndex.value] as HTMLElement
    if (!activeBox) return
    const container = progressContainer.value
    const scrollLeft = activeBox.offsetLeft - container.offsetWidth / 2 + activeBox.offsetWidth / 2
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  })
}

watch(currentIndex, () => {
  scrollToActiveBox()
})

// Touch swipe
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)
const forwardSwipeAttempts = ref(0)
const showSwipeHint = ref(false)

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = true
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value || isAnimating.value) return
  isSwiping.value = false

  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const deltaY = e.changedTouches[0].clientY - touchStartY.value

  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    if (deltaX > 0 && currentIndex.value > 0) {
      // Swipe right — orqaga
      cancelAutoAdvance()
      forwardSwipeAttempts.value = 0
      slideDirection.value = 'right'
      isAnimating.value = true
      currentIndex.value--
      restoreQuestionState(currentIndex.value)
      setTimeout(() => { isAnimating.value = false }, 220)
    } else if (deltaX < 0) {
      // Swipe left — oldinga
      if (answersMap.value.has(currentIndex.value) && currentIndex.value < (quiz.value?.questions.length || 0) - 1) {
        cancelAutoAdvance()
        forwardSwipeAttempts.value = 0
        slideDirection.value = 'left'
        isAnimating.value = true
        currentIndex.value++
        restoreQuestionState(currentIndex.value)
        setTimeout(() => { isAnimating.value = false }, 220)
      } else if (!answersMap.value.has(currentIndex.value)) {
        // Javob berilmagan — ogohlantirish
        forwardSwipeAttempts.value++
        hapticNotification('warning')
        if (forwardSwipeAttempts.value >= 2) {
          showSwipeHint.value = true
          setTimeout(() => { showSwipeHint.value = false }, 2500)
          forwardSwipeAttempts.value = 0
        }
      }
    }
  }
}

// Confirm dialogs
const showExitConfirm = ref(false)
const showFinishConfirm = ref(false)

// Settings
const showSettings = ref(false)
const showReportError = ref(false)
const reportText = ref('')

// Har bir savolning javobini saqlash
const answersMap = ref<Map<number, { selected: number; correct: boolean; correctIdx: number }>>(new Map())

const currentQuestion = computed<QuizQuestion | null>(() => {
  if (!quiz.value || currentIndex.value >= quiz.value.questions.length) return null
  return quiz.value.questions[currentIndex.value]
})


const getOptionText = (option: { wordTranslate: { uz: string; ru: string } }) => {
  if (currentLanguage.value === 'ru') return option.wordTranslate.ru
  return option.wordTranslate.uz
}

const handleBack = () => {
  showExitConfirm.value = true
}

const confirmExit = () => {
  showExitConfirm.value = false
  router.back()
}

const cancelExit = () => {
  showExitConfirm.value = false
}

const openSettings = () => {
  hapticImpact('light')
  showSettings.value = true
}

const onSettingsSelect = (action: { value: string }) => {
  showSettings.value = false
  hapticImpact('light')
  if (action.value === 'report-error') {
    setTimeout(() => {
      showReportError.value = true
    }, 300)
  }
}

const submitReport = () => {
  showReportError.value = false
  reportText.value = ''
  hapticNotification('success')
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

  const firstUnanswered = data.questions.findIndex(q => q.selectedIndex == null)
  if (firstUnanswered !== -1) {
    currentIndex.value = firstUnanswered
  } else {
    currentIndex.value = 0
    restoreQuestionState(0)
  }

  answeredCount.value = answersMap.value.size
  correctCount.value = Array.from(answersMap.value.values()).filter(a => a.correct).length

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
      playCorrectSound()
    } else {
      hapticNotification('error')
      playIncorrectSound()
    }

    // Auto-advance to next question after delay
    cancelAutoAdvance()
    autoAdvanceTimer = setTimeout(() => {
      autoAdvanceTimer = null
      if (quiz.value && currentIndex.value < quiz.value.questions.length - 1) {
        slideDirection.value = 'left'
        isAnimating.value = true
        currentIndex.value++
        restoreQuestionState(currentIndex.value)
        setTimeout(() => { isAnimating.value = false }, 220)
      } else {
        // Last question — auto complete
        completeQuiz()
      }
    }, 1200)
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

const goToQuestion = (targetIndex: number) => {
  if (targetIndex === currentIndex.value) return
  if (!answersMap.value.has(targetIndex)) return
  if (isAnimating.value) return
  cancelAutoAdvance()
  slideDirection.value = targetIndex > currentIndex.value ? 'left' : 'right'
  isAnimating.value = true
  currentIndex.value = targetIndex
  restoreQuestionState(targetIndex)
  setTimeout(() => { isAnimating.value = false }, 250)
}

const completeQuiz = async () => {
  if (!quiz.value) return
  try {
    await quizzesApi.complete(quiz.value.id)
  } catch (error) {
    console.error('Failed to complete quiz:', error)
  }
  isComplete.value = true
  hapticNotification('success')
}

const confirmFinish = () => {
  showFinishConfirm.value = false
  completeQuiz()
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

const playCorrectSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const notes = [523.25, 659.25, 783.99] // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.08)
    osc.stop(ctx.currentTime + i * 0.08 + 0.3)
  })
}

const playIncorrectSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(420, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.3)
}

const getOptionClass = (index: number) => {
  if (!isAnswered.value) {
    return 'ring-gray-200 dark:ring-[#314158] bg-white dark:bg-[#1a2730]'
  }

  if (index === correctIndex.value) {
    return 'ring-[#58cc02] bg-white dark:bg-[#1a2730]'
  }

  if (index === selectedAnswer.value && index !== correctIndex.value) {
    return 'ring-[#ff4b4b] bg-white dark:bg-[#1a2730]'
  }

  return 'ring-gray-200 dark:ring-[#314158] bg-gray-50 dark:bg-[#1a2730]/50 opacity-40'
}

const getOptionBadgeClass = (index: number) => {
  if (isAnswered.value && index === correctIndex.value) return 'bg-[#58cc02]/20 text-[#58cc02]'
  if (isAnswered.value && index === selectedAnswer.value && index !== correctIndex.value) return 'bg-[#ff4b4b]/20 text-[#ff4b4b]'
  return 'bg-gray-100 dark:bg-[#243642] text-gray-700 dark:text-gray-300'
}

onMounted(async () => {
  showBackButton()
  onBackButtonClick(handleBack)
  await loadQuiz()
  // Wait for progress boxes to render after v-if becomes true
  setTimeout(() => {
    scrollToActiveBox()
  }, 50)
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="h-screen overflow-hidden bg-white dark:bg-[#131f24] flex flex-col">
    <!-- Header -->
    <div v-if="!isComplete" class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-3 pt-2 pb-0">
      <div class="flex items-center justify-between mb-1.5">
        <button
          @click="handleBack"
          class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div class="flex items-center gap-1.5">
          <!-- Finish button (3D) -->
          <div class="relative" @click="showFinishConfirm = true">
            <div class="absolute inset-0 bottom-0 h-[calc(100%-1px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
            <button class="relative w-9 h-9 rounded-xl bg-white dark:bg-[#1a2730] flex items-center justify-center border-2 border-gray-200 dark:border-[#314158] text-gray-500 dark:text-gray-400 -translate-y-[2px] active:translate-y-0 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
            </button>
          </div>
          <!-- Settings button (3D) -->
          <div class="relative" @click="openSettings">
            <div class="absolute inset-0 bottom-0 h-[calc(100%-1px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
            <button class="relative w-9 h-9 rounded-xl bg-white dark:bg-[#1a2730] flex items-center justify-center border-2 border-gray-200 dark:border-[#314158] text-gray-500 dark:text-gray-400 -translate-y-[2px] active:translate-y-0 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Progress Boxes -->
      <div
        v-if="quiz && !isLoading"
        ref="progressContainer"
        class="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2 py-1"
        style="overflow-y: hidden;"
      >
        <div
          v-for="i in (quiz?.totalQuestions || 0)"
          :key="i"
          class="progress-box w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 cursor-pointer"
          :class="[
            i - 1 === currentIndex ? 'active-progress' : '',
            answersMap.has(i - 1) && answersMap.get(i - 1)!.correct
              ? 'bg-[#58cc02] text-white'
              : answersMap.has(i - 1) && !answersMap.get(i - 1)!.correct
                ? 'bg-[#ff4b4b] text-white'
                : i - 1 === currentIndex
                  ? 'bg-white dark:bg-[#1a2730] text-[#1cb0f6]'
                  : 'bg-gray-100 dark:bg-[#243642] text-gray-400 dark:text-gray-500'
          ]"
          @click="goToQuestion(i - 1)"
        >
          {{ i }}
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="flex-1 flex flex-col animate-pulse">
      <!-- Skeleton: Progress boxes -->
      <div class="px-4 pt-1 pb-2">
        <div class="flex items-center gap-1.5 px-2">
          <div v-for="n in 10" :key="n" class="w-7 h-7 rounded-lg bg-gray-200 dark:bg-[#243642] flex-shrink-0" />
        </div>
      </div>
      <!-- Skeleton: Word card -->
      <div class="px-4 mt-2">
        <div class="bg-white dark:bg-[#1a2730] rounded-2xl border border-gray-100 dark:border-[#314158] p-6">
          <div class="h-3 bg-gray-200 dark:bg-[#243642] rounded w-36 mb-4" />
          <div class="h-8 bg-gray-200 dark:bg-[#243642] rounded-lg w-32" />
        </div>
      </div>
      <!-- Skeleton: Option cards -->
      <div class="px-4 mt-4 space-y-3">
        <div v-for="n in 4" :key="n" class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
          <div class="relative w-full px-4 py-3.5 rounded-xl bg-white dark:bg-[#1a2730] ring-2 ring-gray-200 dark:ring-[#314158] -translate-y-[2px]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#243642]" />
              <div class="h-4 bg-gray-200 dark:bg-[#243642] rounded flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Screen -->
    <div v-else-if="isComplete && quiz" class="flex-1 flex flex-col items-center justify-center px-5">
      <!-- Circle Progress -->
      <div class="relative w-40 h-40 mb-6">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="68" fill="none" stroke-width="12" class="stroke-gray-200 dark:stroke-white/10" />
          <circle
            cx="80" cy="80" r="68" fill="none"
            stroke="#58cc02" stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="2 * Math.PI * 68"
            :stroke-dashoffset="2 * Math.PI * 68 * (1 - (answeredCount > 0 ? correctCount / answeredCount : 0))"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-4xl font-black text-gray-900 dark:text-white leading-none">
            {{ answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0 }}%
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
            {{ correctCount }}/{{ answeredCount }}
          </span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="flex gap-3 w-full mb-6">
        <!-- Correct -->
        <div class="flex-1 relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#46a302]" />
          <div class="relative bg-[#58cc02] rounded-2xl p-4 -translate-y-1 text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <div class="text-3xl font-extrabold text-white mb-0.5">
              {{ correctCount }}
            </div>
            <div class="text-white/80 text-xs font-bold flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {{ t('vocabulary.learn.correct_answers') }}
            </div>
          </div>
        </div>
        <!-- Incorrect -->
        <div class="flex-1 relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#cc1f1f]" />
          <div class="relative bg-[#ff4b4b] rounded-2xl p-4 -translate-y-1 text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <div class="text-3xl font-extrabold text-white mb-0.5">
              {{ answeredCount - correctCount }}
            </div>
            <div class="text-white/80 text-xs font-bold flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              {{ t('vocabulary.learn.incorrect_answers') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="w-full space-y-3">
        <!-- Qayta boshlash -->
        <div class="relative" @click="restart">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
          <button class="relative w-full py-3.5 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            {{ t('vocabulary.test.try_again') }}
          </button>
        </div>

        <!-- Keyingi mashq -->
        <div class="relative" @click="router.back()">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#1899d6]" />
          <button class="relative w-full py-3.5 rounded-xl bg-[#1cb0f6] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            {{ t('vocabulary.learn.next_exercise') }}
          </button>
        </div>

        <!-- Asosiy oynaga qaytish -->
        <div class="relative" @click="router.push('/')">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
          <button class="relative w-full py-3.5 rounded-xl bg-white dark:bg-[#1a2730] text-gray-700 dark:text-gray-300 font-extrabold text-sm border-2 border-gray-200 dark:border-[#314158] -translate-y-1 active:translate-y-0 transition-transform">
            {{ t('vocabulary.learn.go_home') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Question -->
    <div v-else-if="currentQuestion" class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-hidden relative" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <Transition :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'">
          <div :key="currentIndex" class="absolute inset-0 overflow-y-auto px-4 py-5">
            <!-- Question Card -->
            <div class="relative mb-6">
              <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-gray-300 dark:bg-[#0f1a1f]" />
              <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl px-5 py-6 -translate-y-1.5 border border-gray-100 dark:border-[#314158] shadow-sm">
                <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{{ t('vocabulary.test.choose_correct') }}</p>
                <h2 class="text-4xl font-black text-gray-900 dark:text-white">
                  {{ currentQuestion.word }}
                </h2>
              </div>
            </div>

            <!-- Options -->
            <div class="space-y-3">
              <div
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                class="relative"
                @click="selectAnswer(index)"
              >
                <div
                  class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl"
                  :class="'bg-gray-200 dark:bg-[#243642]'"
                />
                <button
                  :disabled="isAnswered || isSubmitting"
                  class="relative w-full px-4 py-3.5 rounded-xl border-0 text-left active:translate-y-0 transition-all ring-2"
                  :class="[getOptionClass(index), isSubmitting && selectedAnswer === index ? 'translate-y-0' : '-translate-y-[2px]']"
                >
                  <div class="flex items-center gap-3">
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-colors"
                      :class="getOptionBadgeClass(index)"
                    >
                      {{ ['A', 'B', 'C', 'D'][index] }}
                    </span>
                    <span
                      class="font-bold flex-1 text-[15px] transition-colors"
                      :class="isAnswered && index === correctIndex ? 'text-[#58cc02]' : isAnswered && index === selectedAnswer && index !== correctIndex ? 'text-[#ff4b4b]' : 'text-gray-800 dark:text-gray-200'"
                    >{{ getOptionText(option) }}</span>
                    <!-- iOS-style loading spinner -->
                    <svg
                      v-if="isSubmitting && selectedAnswer === index"
                      class="w-5 h-5 flex-shrink-0 ios-spinner"
                      viewBox="0 0 24 24"
                    >
                      <g v-for="n in 12" :key="n" :transform="`rotate(${(n - 1) * 30} 12 12)`">
                        <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          :opacity="n / 12" class="text-gray-400"
                        />
                      </g>
                    </svg>
                    <!-- Correct icon -->
                    <svg
                      v-else-if="isAnswered && index === correctIndex"
                      xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#58cc02] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <!-- Incorrect icon (exclamation circle) -->
                    <svg
                      v-else-if="isAnswered && index === selectedAnswer && index !== correctIndex"
                      xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#ff4b4b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </div>

    <!-- Swipe Hint Toast -->
    <Transition name="fade">
      <div v-if="showSwipeHint" class="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-center whitespace-nowrap">
        Avval javob tanlang!
      </div>
    </Transition>

    <!-- Exit Confirmation Dialog -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showExitConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="cancelExit">
          <div class="absolute inset-0 bg-black/50" />
          <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl p-6 w-full max-w-sm text-center">
            <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#ff9600]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#ff9600]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 class="text-lg font-extrabold text-gray-900 dark:text-white mb-1">
              {{ t('vocabulary.learn.exit_confirm') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {{ t('vocabulary.learn.exit_message') }}
            </p>

            <div class="space-y-2.5">
              <div class="relative" @click="confirmExit">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-red-600" />
                <button class="relative w-full py-3 rounded-xl bg-red-500 text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  {{ t('vocabulary.learn.exit_yes') }}
                </button>
              </div>

              <div class="relative" @click="cancelExit">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
                <button class="relative w-full py-3 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  {{ t('vocabulary.learn.exit_no') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Finish Confirmation Dialog -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFinishConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="showFinishConfirm = false">
          <div class="absolute inset-0 bg-black/50" />
          <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl p-6 w-full max-w-sm text-center">
            <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#58cc02]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
            </div>
            <h3 class="text-lg font-extrabold text-gray-900 dark:text-white mb-1">
              Testni yakunlaysizmi?
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Natijalaringiz ko'rsatiladi
            </p>

            <div class="space-y-2.5">
              <div class="relative" @click="confirmFinish">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
                <button class="relative w-full py-3 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  Ha, yakunlash
                </button>
              </div>

              <div class="relative" @click="showFinishConfirm = false">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
                <button class="relative w-full py-3 rounded-xl bg-white dark:bg-[#1a2730] text-gray-700 dark:text-gray-300 font-extrabold text-sm border-2 border-gray-200 dark:border-[#314158] -translate-y-1 active:translate-y-0 transition-transform">
                  Yo'q, davom etish
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Settings Action Sheet -->
    <van-action-sheet v-model:show="showSettings">
      <div class="px-4 py-3 divide-y divide-gray-100 dark:divide-white/10">
        <!-- Report Error -->
        <button @click="onSettingsSelect({ value: 'report-error' })" class="w-full flex items-center gap-4 py-3 px-1 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
          <div class="w-11 h-11 rounded-full bg-[#ff4b4b] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-[15px]">Xatolik haqida xabar berish</span>
        </button>
      </div>

      <div class="px-4 pb-5 pt-2">
        <div class="relative" @click="showSettings = false">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
          <button class="relative w-full py-3.5 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            Yopish
          </button>
        </div>
      </div>
    </van-action-sheet>

    <!-- Report Error Action Sheet -->
    <van-action-sheet v-model:show="showReportError">
      <div class="px-5 pt-5 pb-6">
        <div class="text-center mb-4">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#ff4b4b]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span class="font-extrabold text-[#ff4b4b] text-base">Xatolik haqida xabar berish</span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Savolda xatolik bormi? Bizga yozing, tuzatamiz</div>
        </div>

        <van-field
          v-model="reportText"
          type="textarea"
          rows="3"
          placeholder="Xatolikni batafsil yozing"
          class="!rounded-xl !bg-gray-50 dark:!bg-white/5 mb-4"
        />

        <div class="relative" @click="reportText.trim() && submitReport()">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl" :class="reportText.trim() ? 'bg-[#46a302]' : 'bg-gray-200 dark:bg-[#243642]'" />
          <button
            :disabled="!reportText.trim()"
            class="relative w-full py-3.5 rounded-xl font-extrabold text-sm transition-all"
            :class="reportText.trim()
              ? 'bg-[#58cc02] text-white -translate-y-1 active:translate-y-0 dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
              : 'bg-gray-100 dark:bg-[#243642] text-gray-400 dark:text-gray-500 -translate-y-1 cursor-not-allowed'"
          >
            Yuborish
          </button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Left (next question) */
.slide-left-enter-active {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.15s ease-out;
}
.slide-left-leave-active {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.12s ease-in;
}
.slide-left-enter-from {
  transform: translateX(40%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-40%);
  opacity: 0;
}

/* Slide Right (prev question) */
.slide-right-enter-active {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.15s ease-out;
}
.slide-right-leave-active {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.12s ease-in;
}
.slide-right-enter-from {
  transform: translateX(-40%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(40%);
  opacity: 0;
}

/* Progress box animation */
.progress-box {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 0 0 0 #1cb0f6;
}

.progress-box.active-progress {
  box-shadow: inset 0 0 0 2px #1cb0f6;
  transform: scale(1.1);
}

/* iOS-style spinner */
.ios-spinner {
  animation: ios-spin 1s steps(12) infinite;
}

@keyframes ios-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
