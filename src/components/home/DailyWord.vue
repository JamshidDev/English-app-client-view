<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useLanguage } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import type { Word } from '@/types/vocabulary'

const { t } = useI18n()
const vocabStore = useVocabStore()
const { currentLanguage } = useLanguage()
const { hapticImpact } = useTelegram()

const dailyWord = ref<Word | null>(null)
const isFlipped = ref(false)

onMounted(() => {
  dailyWord.value = vocabStore.getDailyWord() || null
})

const translation = computed(() => {
  if (!dailyWord.value) return ''
  return currentLanguage.value === 'ru'
    ? dailyWord.value.translationRu
    : dailyWord.value.translationUz
})

const toggleFlip = () => {
  hapticImpact('light')
  isFlipped.value = !isFlipped.value
}
</script>

<template>
  <div class="mb-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
      {{ t('home.daily_word') }} ✨
    </h3>

    <div
      v-if="dailyWord"
      class="flip-card h-40 cursor-pointer"
      :class="{ flipped: isFlipped }"
      @click="toggleFlip"
    >
      <div class="flip-card-inner">
        <!-- Front -->
        <div class="flip-card-front bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 flex flex-col justify-center items-center text-white shadow-lg">
          <p class="text-3xl font-bold mb-2">{{ dailyWord.word }}</p>
          <p class="text-sm opacity-80">{{ dailyWord.transcription }}</p>
          <p class="mt-4 text-xs opacity-60">{{ t('vocabulary.tap_to_flip') }}</p>
        </div>

        <!-- Back -->
        <div class="flip-card-back bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg border border-gray-200 dark:border-gray-700">
          <p class="text-2xl font-bold text-primary-500 mb-2">{{ translation }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center italic">
            "{{ dailyWord.exampleSentence }}"
          </p>
        </div>
      </div>
    </div>

    <div v-else class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 h-40 flex items-center justify-center">
      <van-loading />
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
