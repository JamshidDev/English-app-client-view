<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useAudio } from '@/composables/useAudio'
import { useLanguage } from '@/composables/useLanguage'
import { showSuccessToast } from 'vant'

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
const slideDirection = ref<'left' | 'right'>('left')
const isAnimating = ref(false)

// Touch swipe
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = true
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value) return
  isSwiping.value = false

  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const deltaY = e.changedTouches[0].clientY - touchStartY.value

  // Faqat horizontal swipe (vertical scroll bo'lmasa)
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    if (deltaX < 0) {
      nextWord()
    } else {
      prevWord()
    }
  }
}
const showExitConfirm = ref(false)
const showCelebration = ref(false)
const showFinishConfirm = ref(false)

const confirmFinish = () => {
  showFinishConfirm.value = false
  isComplete.value = true
  hapticNotification('success')
}
const learnedBtnRef = ref<HTMLElement | null>(null)
const isSaved = ref(false)
const skipLearned = ref(false)

const toggleSaved = () => {
  isSaved.value = !isSaved.value
  hapticImpact('light')
}

const showSettings = ref(false)

const openSettings = () => {
  hapticImpact('light')
  showSettings.value = true
}

const showReportError = ref(false)
const reportText = ref('')

const onSettingsSelect = (action: { value: string }) => {
  showSettings.value = false
  hapticImpact('light')
  if (action.value === 'font-size') {
    // TODO: font size picker
  } else if (action.value === 'report-error') {
    setTimeout(() => {
      showReportError.value = true
    }, 300)
  }
}

const submitReport = () => {
  showReportError.value = false
  reportText.value = ''
  hapticNotification('success')
  showSuccessToast({
    message: 'Feedback uchun rahmat!\nBiz buni tuzatamiz',
    duration: 2500,
    className: 'report-success-toast',
  })
}

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
  showExitConfirm.value = true
}

const confirmExit = () => {
  showExitConfirm.value = false
  router.back()
}

const cancelExit = () => {
  showExitConfirm.value = false
}

const playAudio = () => {
  if (currentWord.value) {
    hapticImpact('light')
    speakEnglish(currentWord.value.word)
  }
}

const nextWord = () => {
  if (isAnimating.value) return
  hapticImpact('light')

  if (currentIndex.value < vocabStore.words.length - 1) {
    slideDirection.value = 'left'
    isAnimating.value = true
    currentIndex.value++
    setTimeout(() => { isAnimating.value = false }, 220)
  } else {
    isComplete.value = true
    hapticNotification('success')
  }
}

const prevWord = () => {
  if (isAnimating.value) return
  hapticImpact('light')
  if (currentIndex.value > 0) {
    slideDirection.value = 'right'
    isAnimating.value = true
    currentIndex.value--
    setTimeout(() => { isAnimating.value = false }, 220)
  }
}

const playCelebrateSound = () => {
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

const spawnParticles = () => {
  if (!learnedBtnRef.value) return
  const rect = learnedBtnRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const topY = rect.top

  const emojis = ['🎉', '⭐', '✨', '🌟', '💚', '🎊']
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div')
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    el.style.cssText = `
      position:fixed;z-index:9999;font-size:${16 + Math.random() * 12}px;
      left:${centerX + (Math.random() - 0.5) * 120}px;top:${topY}px;
      pointer-events:none;transition:all 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
      opacity:1;
    `
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      el.style.top = `${topY - 80 - Math.random() * 100}px`
      el.style.opacity = '0'
      el.style.transform = `scale(${0.5 + Math.random()}) rotate(${(Math.random() - 0.5) * 60}deg)`
    })
    setTimeout(() => el.remove(), 900)
  }
}

const markLearned = () => {
  if (currentWord.value) {
    hapticNotification('success')
    playCelebrateSound()
    spawnParticles()
    showCelebration.value = true
    vocabStore.markWordAsLearned(collectionId.value, currentWord.value.id)
    setTimeout(() => {
      showCelebration.value = false
      slideDirection.value = 'left'
      nextWord()
    }, 600)
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
  <div class="h-screen overflow-hidden bg-white dark:bg-[#131f24] flex flex-col">
    <!-- Header -->
    <div v-if="!isComplete" class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 py-3">
      <div class="flex items-center justify-between mb-3">
        <button
          @click="handleBack"
          class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div class="flex items-center gap-1.5">
          <!-- Saved button (3D) -->
          <div class="relative" @click="toggleSaved">
            <div class="absolute inset-0 bottom-0 h-[calc(100%-1px)] rounded-xl" :class="isSaved ? 'bg-[#e0a800]' : 'bg-gray-200 dark:bg-[#243642]'" />
            <button
              class="relative w-9 h-9 rounded-xl flex items-center justify-center -translate-y-[2px] active:translate-y-0 transition-all"
              :class="isSaved ? 'bg-[#ffc800] text-white' : 'bg-white dark:bg-[#1a2730] text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-[#314158]'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :fill="isSaved ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          </div>
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

      <!-- Progress Bar -->
      <div class="flex items-center gap-3">
        <div class="flex-1 h-3 bg-gray-100 dark:bg-[#243642] rounded-full overflow-hidden">
          <div
            class="h-full bg-[#58cc02] rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <span class="text-xs font-extrabold text-gray-500 dark:text-gray-400 tabular-nums">
          {{ currentIndex + 1 }}/{{ vocabStore.words.length }}
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="vocabStore.isLoadingWords" class="px-4 py-8">
      <div class="bg-white dark:bg-[#1a2730] rounded-2xl border border-gray-100 dark:border-[#314158] p-6 animate-pulse">
        <div class="flex flex-col items-center mb-6">
          <div class="h-8 bg-gray-200 dark:bg-[#243642] rounded-lg w-40 mb-3" />
          <div class="h-4 bg-gray-200 dark:bg-[#243642] rounded w-24 mb-4" />
          <div class="w-14 h-14 bg-gray-200 dark:bg-[#243642] rounded-full" />
        </div>
        <div class="h-20 bg-gray-100 dark:bg-[#1a2730] rounded-xl mb-4" />
        <div class="h-6 bg-gray-200 dark:bg-[#243642] rounded w-32" />
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
            :stroke-dashoffset="2 * Math.PI * 68 * (1 - vocabStore.getLearnedWordsCount(collectionId) / vocabStore.words.length)"
            class="transition-all duration-1000 ease-out"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-4xl font-black text-gray-900 dark:text-white leading-none">
            {{ Math.round((vocabStore.getLearnedWordsCount(collectionId) / vocabStore.words.length) * 100) }}%
          </span>
          <span class="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1">
            {{ vocabStore.getLearnedWordsCount(collectionId) }}/{{ vocabStore.words.length }}
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
              {{ vocabStore.getLearnedWordsCount(collectionId) }}
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
              {{ vocabStore.words.length - vocabStore.getLearnedWordsCount(collectionId) }}
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
            {{ t('vocabulary.learn.restart') }}
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

    <!-- Word Card -->
    <div v-else-if="currentWord" class="flex-1 flex flex-col min-h-0">
      <!-- Scrollable Content -->
      <div class="flex-1 overflow-hidden relative" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <Transition :name="slideDirection === 'left' ? 'slide-left' : 'slide-right'">
          <div :key="currentIndex" class="absolute inset-0 overflow-y-auto px-4 py-5">
            <!-- Main Word Card -->
            <div class="relative">
              <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#1a2730]" />
              <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl p-5 -translate-y-1 border border-gray-100 dark:border-[#314158]">
                <!-- English Word -->
                <div class="text-center mb-5">
                  <h2 class="text-5xl font-black text-gray-900 dark:text-white mb-1">
                    {{ currentWord.word }}
                  </h2>
                  <div class="flex items-center justify-center gap-1.5">
                    <p v-if="currentWord.transcription" class="text-gray-400 dark:text-gray-500 text-sm font-semibold">
                      {{ currentWord.transcription }}
                    </p>
                    <button
                      @click="playAudio"
                      class="w-7 h-7 bg-[#1cb0f6] rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                      :class="{ 'animate-pulse': isSpeaking }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Translation -->
                <div class="mb-5">
                  <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1.5">{{ t('vocabulary.learn.translation') }}</p>
                  <p class="text-xl font-extrabold text-[#58cc02]">{{ getTranslation(currentWord.wordTranslate) }}</p>
                </div>

                <!-- Examples -->
                <div v-if="currentWord.example" class="bg-gray-50 dark:bg-[#243642]/50 rounded-xl p-4 space-y-3">
                  <div class="flex gap-2.5 items-start">
                    <div class="w-5 h-5 rounded bg-[#1cb0f6]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-[10px] font-black text-[#1cb0f6]">EN</span>
                    </div>
                    <p class="text-gray-800 dark:text-gray-200 text-sm font-semibold leading-relaxed">"{{ currentWord.example }}"</p>
                  </div>
                  <div v-if="currentWord.exampleTranslate" class="border-t border-gray-200 dark:border-[#314158] pt-3 flex gap-2.5 items-start">
                    <div class="w-5 h-5 rounded bg-[#58cc02]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-[10px] font-black text-[#58cc02]">{{ currentLanguage === 'ru' ? 'RU' : 'UZ' }}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold leading-relaxed">"{{ getExampleTranslation() }}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Fixed Bottom Buttons -->
      <div class="flex-shrink-0 px-4 pb-4 pt-2 bg-white dark:bg-[#131f24]">
        <div class="flex items-center gap-3">
          <!-- Previous (icon) -->
          <div class="relative" @click="prevWord">
            <div class="absolute inset-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-gray-200 dark:bg-[#243642]" />
            <button
              :disabled="currentIndex === 0"
              class="relative w-16 h-14 rounded-xl bg-white dark:bg-[#1a2730] flex items-center justify-center border-2 border-gray-200 dark:border-[#314158] -translate-y-1 active:translate-y-0 transition-transform"
              :class="currentIndex === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          <!-- Mark as Learned (center) -->
          <div
            ref="learnedBtnRef"
            class="flex-1 relative"
            @click="!vocabStore.isWordLearned(collectionId, currentWord.id) && markLearned()"
          >
            <div
              class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl"
              :class="vocabStore.isWordLearned(collectionId, currentWord.id) ? 'bg-[#46a302]' : 'bg-[#46a302]'"
            />
            <button
              class="relative w-full h-14 rounded-xl text-white font-extrabold text-sm transition-transform flex items-center justify-center"
              :class="[
                showCelebration ? 'celebrate-pulse' : '',
                vocabStore.isWordLearned(collectionId, currentWord.id)
                  ? 'bg-[#58cc02] translate-y-0 cursor-default opacity-80 dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                  : 'bg-[#58cc02] -translate-y-1 active:translate-y-0 dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
              ]"
            >
              {{ vocabStore.isWordLearned(collectionId, currentWord.id) ? '✓ ' + t('vocabulary.learned') : t('vocabulary.learn.mark_learned') }}
            </button>
          </div>

          <!-- Next (icon) -->
          <div class="relative" @click="nextWord">
            <div class="absolute inset-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#1899d6]" />
            <button class="relative w-16 h-14 rounded-xl bg-[#1cb0f6] flex items-center justify-center -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

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
              <!-- Yes, exit -->
              <div class="relative" @click="confirmExit">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-red-600" />
                <button class="relative w-full py-3 rounded-xl bg-red-500 text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  {{ t('vocabulary.learn.exit_yes') }}
                </button>
              </div>

              <!-- No, continue -->
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
              <!-- Ha, yakunlash -->
              <div class="relative" @click="confirmFinish">
                <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
                <button class="relative w-full py-3 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
                  Ha, yakunlash
                </button>
              </div>

              <!-- Yo'q, davom etish -->
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
        <!-- Font Size -->
        <button @click="onSettingsSelect({ value: 'font-size' })" class="w-full flex items-center gap-4 py-3 px-1 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
          <div class="w-11 h-11 rounded-full bg-[#1cb0f6] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.243 4.493v7.5m0 0v7.5m0-7.5h10.5m-10.5 0H.743m12 7.5V4.493m0 0v15m0-15h2.25a2.25 2.25 0 0 1 0 4.5h-2.25m0-4.5h3.75a2.25 2.25 0 0 1 0 4.5H14.993" />
            </svg>
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-[15px]">Shrift o'lchami</span>
        </button>

        <!-- Report Error -->
        <button @click="onSettingsSelect({ value: 'report-error' })" class="w-full flex items-center gap-4 py-3 px-1 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
          <div class="w-11 h-11 rounded-full bg-[#ff4b4b] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <span class="font-bold text-gray-900 dark:text-white text-[15px]">Xatolik haqida xabar berish</span>
        </button>

        <!-- Skip Learned -->
        <div class="w-full flex items-center gap-4 py-3 px-1">
          <div class="w-11 h-11 rounded-full bg-[#58cc02] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
            </svg>
          </div>
          <span class="flex-1 font-bold text-gray-900 dark:text-white text-[15px]">O'rganilgan so'zlarni o'tkazib yuborish</span>
          <van-switch v-model="skipLearned" size="24px" />
        </div>
      </div>

      <!-- Saqlash button -->
      <div class="px-4 pb-5 pt-2">
        <div class="relative" @click="showSettings = false">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#46a302]" />
          <button class="relative w-full py-3.5 rounded-xl bg-[#58cc02] text-white font-extrabold text-sm -translate-y-1 active:translate-y-0 transition-transform dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            Saqlash
          </button>
        </div>
      </div>
    </van-action-sheet>

    <!-- Report Error Action Sheet -->
    <van-action-sheet v-model:show="showReportError">
      <div class="px-5 pt-5 pb-6">
        <!-- Header -->
        <div class="text-center mb-4">
          <div class="flex items-center justify-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#ff4b4b]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span class="font-extrabold text-[#ff4b4b] text-base">Xatolik haqida xabar berish</span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">So'zda xatolik bormi? Bizga yozing, tuzatamiz</div>
        </div>

        <!-- Textarea -->
        <van-field
          v-model="reportText"
          type="textarea"
          rows="3"
          placeholder="Xatolikni batafsil yozing"
          class="!rounded-xl !bg-gray-50 dark:!bg-white/5 mb-4"
        />

        <!-- Yuborish button -->
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

/* Slide Left (next word) */
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

/* Slide Right (prev word) */
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

.celebrate-pulse {
  animation: celebratePulse 0.5s ease;
}
@keyframes celebratePulse {
  0% { transform: translateY(-4px) scale(1); }
  30% { transform: translateY(-4px) scale(1.08); }
  60% { transform: translateY(-4px) scale(0.95); }
  100% { transform: translateY(-4px) scale(1); }
}
</style>
