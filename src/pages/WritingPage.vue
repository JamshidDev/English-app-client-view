<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import { shuffleArray } from '@/utils/helpers'
import type { VocabularyItem } from '@/types/vocabulary'
import { writingsApi } from '@/api/endpoints/writings'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact, hapticNotification, showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()
const { currentLanguage } = useLanguage()

const collectionId = computed(() => route.params.setId as string)

const shuffledWords = ref<VocabularyItem[]>([])
const writingId = ref<string | null>(null)
const writingScore = ref<{ correctAnswers: number; totalQuestions: number; percentage: number; score: number } | null>(null)
const currentIndex = ref(0)
const userInput = ref('')
const isChecked = ref(false)
const isCorrect = ref(false)
const correctCount = ref(0)
const isComplete = ref(false)
const showHint = ref(false)
const isLoading = ref(false)
const slideDirection = ref<'left' | 'right'>('left')
const isAnimating = ref(false)
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null

const cancelAutoAdvance = () => {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

const inputRef = ref<HTMLInputElement | null>(null)

const focusInput = () => {
  setTimeout(() => {
    inputRef.value?.focus()
  }, 250)
}

// Answers map — har bir savolning javobini saqlash
const answersMap = ref<Map<number, { input: string; correct: boolean }>>(new Map())

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
      if (answersMap.value.has(currentIndex.value) && currentIndex.value < shuffledWords.value.length - 1) {
        cancelAutoAdvance()
        forwardSwipeAttempts.value = 0
        slideDirection.value = 'left'
        isAnimating.value = true
        currentIndex.value++
        restoreQuestionState(currentIndex.value)
        setTimeout(() => { isAnimating.value = false }, 220)
      } else if (!answersMap.value.has(currentIndex.value)) {
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

const currentWord = computed(() => shuffledWords.value[currentIndex.value])


const getTranslation = () => {
  if (!currentWord.value) return ''
  if (currentLanguage.value === 'ru') return currentWord.value.wordTranslate.ru
  return currentWord.value.wordTranslate.uz
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

const checkAnswer = async () => {
  if (!currentWord.value || isChecked.value) return

  hapticImpact('medium')
  isChecked.value = true

  // Backend API ga yuborish
  if (writingId.value) {
    try {
      const res = await writingsApi.submitAnswer(writingId.value, currentWord.value.id, userInput.value.trim())
      isCorrect.value = res.data.correct
      correctCount.value = res.data.correctAnswers

      if (res.data.completed) {
        // Auto-completed by backend
        answersMap.value.set(currentIndex.value, {
          input: userInput.value.trim(),
          correct: isCorrect.value
        })

        if (isCorrect.value) {
          hapticNotification('success')
          playCorrectSound()
        } else {
          hapticNotification('error')
          playIncorrectSound()
        }

        cancelAutoAdvance()
        autoAdvanceTimer = setTimeout(() => {
          autoAdvanceTimer = null
          isComplete.value = true
          hapticNotification('success')
          const pct = res.data.totalQuestions > 0 ? (res.data.correctAnswers / res.data.totalQuestions) * 100 : 0
          writingScore.value = {
            correctAnswers: res.data.correctAnswers,
            totalQuestions: res.data.totalQuestions,
            percentage: Math.round(pct),
            score: pct >= 90 ? 1 : pct >= 50 ? 0.5 : 0
          }
        }, 1200)
        return
      }
    } catch (error) {
      // Fallback: lokal tekshirish
      const normalizedInput = userInput.value.trim().toLowerCase()
      const normalizedAnswer = currentWord.value.word.toLowerCase()
      isCorrect.value = normalizedInput === normalizedAnswer
      if (isCorrect.value) correctCount.value++
    }
  } else {
    const normalizedInput = userInput.value.trim().toLowerCase()
    const normalizedAnswer = currentWord.value.word.toLowerCase()
    isCorrect.value = normalizedInput === normalizedAnswer
    if (isCorrect.value) correctCount.value++
  }

  // Save to answersMap
  answersMap.value.set(currentIndex.value, {
    input: userInput.value.trim(),
    correct: isCorrect.value
  })

  if (isCorrect.value) {
    hapticNotification('success')
    playCorrectSound()
  } else {
    hapticNotification('error')
    playIncorrectSound()
  }

  // Auto-advance after delay
  cancelAutoAdvance()
  autoAdvanceTimer = setTimeout(() => {
    autoAdvanceTimer = null
    if (currentIndex.value < shuffledWords.value.length - 1) {
      slideDirection.value = 'left'
      isAnimating.value = true
      currentIndex.value++
      restoreQuestionState(currentIndex.value)
      setTimeout(() => { isAnimating.value = false }, 220)
    } else {
      isComplete.value = true
      hapticNotification('success')
    }
  }, 1200)
}

const nextWord = () => {
  hapticImpact('light')
  cancelAutoAdvance()

  if (currentIndex.value < shuffledWords.value.length - 1) {
    slideDirection.value = 'left'
    isAnimating.value = true
    currentIndex.value++
    restoreQuestionState(currentIndex.value)
    setTimeout(() => { isAnimating.value = false }, 220)
  } else {
    isComplete.value = true
    hapticNotification('success')
  }
}


const toggleHint = () => {
  showHint.value = !showHint.value
}

const restoreQuestionState = (index: number) => {
  const saved = answersMap.value.get(index)
  if (saved) {
    userInput.value = saved.input
    isChecked.value = true
    isCorrect.value = saved.correct
  } else {
    userInput.value = ''
    isChecked.value = false
    isCorrect.value = false
    showHint.value = false
    focusInput()
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

const completeWriting = async () => {
  showFinishConfirm.value = false
  isComplete.value = true
  hapticNotification('success')
  if (writingId.value) {
    try {
      const res = await writingsApi.complete(writingId.value)
      const pct = res.data.totalQuestions > 0 ? (res.data.correctAnswers / res.data.totalQuestions) * 100 : 0
      writingScore.value = {
        correctAnswers: res.data.correctAnswers,
        totalQuestions: res.data.totalQuestions,
        percentage: Math.round(pct),
        score: pct >= 90 ? 1 : pct >= 50 ? 0.5 : 0
      }
    } catch (error) {
      console.error('Failed to complete writing:', error)
    }
  }
}

const restart = () => {
  hapticImpact('medium')
  shuffledWords.value = shuffleArray([...vocabStore.words])
  currentIndex.value = 0
  userInput.value = ''
  isChecked.value = false
  isCorrect.value = false
  correctCount.value = 0
  isComplete.value = false
  showHint.value = false
  answersMap.value.clear()
}

const playCorrectSound = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const notes = [523.25, 659.25, 783.99]
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

onMounted(async () => {
  isLoading.value = true
  vocabStore.initVocab()
  showBackButton()
  onBackButtonClick(handleBack)

  // Backend writing session boshlash
  try {
    const res = await writingsApi.start(collectionId.value)
    writingId.value = res.data.id
    // Backend'dan kelgan savollarni VocabularyItem formatiga moslashtirish
    shuffledWords.value = res.data.questions.map(q => ({
      id: q.wordId,
      word: q.correctWord,
      wordTranslate: q.wordTranslate,
    })) as VocabularyItem[]
  } catch {
    // Fallback: lokal so'zlardan
    await vocabStore.fetchWords(collectionId.value)
    if (vocabStore.words.length > 0) {
      shuffledWords.value = shuffleArray([...vocabStore.words])
    }
  }

  isLoading.value = false
  setTimeout(() => {
    scrollToActiveBox()
    focusInput()
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
        </div>
      </div>

      <!-- Progress Boxes -->
      <div
        v-if="shuffledWords.length > 0 && !isLoading"
        ref="progressContainer"
        class="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2 py-1"
        style="overflow-y: hidden;"
      >
        <div
          v-for="i in shuffledWords.length"
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
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-gray-300 dark:bg-[#0f1a1f]" />
          <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl border border-gray-100 dark:border-[#314158] p-6 -translate-y-1.5">
            <div class="h-3 bg-gray-200 dark:bg-[#243642] rounded w-36 mb-4" />
            <div class="h-8 bg-gray-200 dark:bg-[#243642] rounded-lg w-40" />
          </div>
        </div>
      </div>
      <!-- Skeleton: Input -->
      <div class="px-4 mt-4">
        <div class="h-14 rounded-xl bg-gray-100 dark:bg-[#1a2730] border-2 border-gray-200 dark:border-[#314158]" />
      </div>
      <!-- Skeleton: Button -->
      <div class="px-4 mt-4">
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
          <div class="relative h-12 rounded-xl bg-gray-100 dark:bg-[#1a2730] -translate-y-1" />
        </div>
      </div>
    </div>

    <!-- Complete Screen -->
    <div v-else-if="isComplete" class="flex-1 flex flex-col items-center justify-center px-5">
      <!-- Circle Progress -->
      <div class="relative w-40 h-40 mb-6">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="68" fill="none" stroke-width="12" class="stroke-gray-200 dark:stroke-white/10" />
          <circle
            cx="80" cy="80" r="68" fill="none"
            stroke="#58cc02" stroke-width="12"
            stroke-linecap="round"
            :stroke-dasharray="2 * Math.PI * 68"
            :stroke-dashoffset="2 * Math.PI * 68 * (1 - (shuffledWords.length > 0 ? correctCount / shuffledWords.length : 0))"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-4xl font-black text-gray-900 dark:text-white leading-none">
            {{ shuffledWords.length > 0 ? Math.round((correctCount / shuffledWords.length) * 100) : 0 }}%
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
            {{ correctCount }}/{{ shuffledWords.length }}
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
              {{ shuffledWords.length - correctCount }}
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

        <!-- Orqaga qaytish -->
        <div class="relative" @click="router.back()">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#1899d6]" />
          <button class="relative w-full py-3.5 rounded-xl bg-[#1cb0f6] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            {{ t('vocabulary.learn.next_exercise') }}
          </button>
        </div>

        <!-- Asosiy oynaga -->
        <div class="relative" @click="router.push('/')">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
          <button class="relative w-full py-3.5 rounded-xl bg-white dark:bg-[#1a2730] text-gray-700 dark:text-gray-300 font-extrabold text-sm border-2 border-gray-200 dark:border-[#314158] -translate-y-1 active:translate-y-0 transition-transform">
            {{ t('vocabulary.learn.go_home') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Writing Exercise -->
    <div v-else-if="currentWord" class="flex-1 flex flex-col min-h-0">
      <div class="flex-1 overflow-hidden relative" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <Transition :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'">
          <div :key="currentIndex" class="absolute inset-0 overflow-y-auto px-4 py-5">
            <!-- Word Card (3D) -->
            <div class="relative mb-5">
              <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-gray-300 dark:bg-[#0f1a1f]" />
              <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl px-5 py-6 -translate-y-1.5 border border-gray-100 dark:border-[#314158] shadow-sm">
                <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">{{ t('vocabulary.writing.find_word') }}</p>
                <h2 class="text-3xl font-black text-gray-900 dark:text-white">
                  {{ getTranslation() }}
                </h2>

                <!-- Hint button -->
                <button
                  @click="toggleHint"
                  class="mt-3 flex items-center gap-1.5 text-sm font-bold transition-colors"
                  :class="showHint ? 'text-[#ff9600]' : 'text-[#1cb0f6]'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                  {{ showHint ? currentWord.word : t('vocabulary.writing.hint') }}
                </button>
              </div>
            </div>

            <!-- Input Field with icon -->
            <div class="mb-4">
              <div class="relative">
                <input
                  ref="inputRef"
                  v-model="userInput"
                  type="text"
                  :placeholder="t('vocabulary.writing.type_word')"
                  :disabled="isChecked"
                  @keyup.enter="!isChecked && userInput.trim() && checkAnswer()"
                  class="w-full px-4 py-4 pr-12 rounded-xl text-base font-bold bg-white dark:bg-[#1a2730] border-2 transition-colors outline-none"
                  :class="[
                    isChecked && isCorrect
                      ? 'border-[#58cc02] text-[#58cc02]'
                      : isChecked && !isCorrect
                        ? 'border-[#ff4b4b] text-[#ff4b4b]'
                        : 'border-gray-200 dark:border-[#314158] text-gray-900 dark:text-white focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6]'
                  ]"
                />
                <!-- Correct icon -->
                <svg
                  v-if="isChecked && isCorrect"
                  xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <!-- Incorrect icon -->
                <svg
                  v-if="isChecked && !isCorrect"
                  xmlns="http://www.w3.org/2000/svg" class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff4b4b]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
            </div>

            <!-- Buttons -->
            <div class="space-y-3">
              <!-- Check Button (3D green) -->
              <div v-if="!isChecked" class="relative" @click="userInput.trim() && checkAnswer()">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl" :class="userInput.trim() ? 'bg-[#46a302]' : 'bg-gray-200 dark:bg-[#243642]'" />
                <button
                  :disabled="!userInput.trim()"
                  class="relative w-full py-3.5 rounded-xl font-extrabold text-sm transition-all"
                  :class="userInput.trim()
                    ? 'bg-[#58cc02] text-white -translate-y-1 active:translate-y-0 dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
                    : 'bg-gray-100 dark:bg-[#243642] text-gray-400 dark:text-gray-500 -translate-y-1 cursor-not-allowed'"
                >
                  {{ t('vocabulary.writing.check') }}
                </button>
              </div>

              <!-- Next Button (3D green) -->
              <div v-if="isChecked" class="relative" @click="nextWord">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
                <button class="relative w-full py-3.5 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  {{ t('common.next') }}
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
        Avval javob yozing!
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
              Mashqni yakunlaysizmi?
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Natijalaringiz ko'rsatiladi
            </p>

            <div class="space-y-2.5">
              <div class="relative" @click="completeWriting">
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
</style>
