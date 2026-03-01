<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useLanguage } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import type { Word } from '@/types/vocabulary'

const props = defineProps<{
  word: Word
}>()

const { t } = useI18n()
const vocabStore = useVocabStore()
const { currentLanguage } = useLanguage()
const { hapticImpact, hapticSelection } = useTelegram()

const isFlipped = ref(false)

const translation = computed(() => {
  return currentLanguage.value === 'ru'
    ? props.word.translationRu
    : props.word.translationUz
})

const isFavorite = computed(() => vocabStore.isFavorite(props.word.id))

const toggleFlip = () => {
  hapticImpact('light')
  isFlipped.value = !isFlipped.value
}

const toggleFavorite = (e: Event) => {
  e.stopPropagation()
  hapticSelection()
  vocabStore.toggleFavorite(props.word.id)
}

const markLearned = () => {
  hapticImpact('medium')
  vocabStore.markAsLearned(props.word.id)
}
</script>

<template>
  <div
    class="flip-card h-64 cursor-pointer"
    :class="{ flipped: isFlipped }"
    @click="toggleFlip"
  >
    <div class="flip-card-inner">
      <!-- Front -->
      <div class="flip-card-front bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
        <div class="flex justify-end mb-4">
          <button
            @click="toggleFavorite"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 transition-colors"
              :class="isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ word.word }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ word.transcription }}
          </p>
        </div>

        <p class="text-center text-xs text-gray-400 dark:text-gray-500">
          {{ t('vocabulary.tap_to_flip') }}
        </p>
      </div>

      <!-- Back -->
      <div class="flip-card-back bg-primary-500 rounded-2xl p-6 flex flex-col text-white shadow-lg">
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <p class="text-2xl font-bold mb-3">{{ translation }}</p>

          <div class="bg-white/20 rounded-xl p-3 w-full">
            <p class="text-sm font-medium mb-1">{{ t('vocabulary.example') }}:</p>
            <p class="text-sm opacity-90 italic">"{{ word.exampleSentence }}"</p>
          </div>
        </div>

        <button
          @click.stop="markLearned"
          class="mt-4 w-full py-2 bg-white text-primary-600 rounded-xl font-medium text-sm transition-colors hover:bg-white/90"
        >
          {{ t('vocabulary.learned') }} ✓
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flip-card {
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
