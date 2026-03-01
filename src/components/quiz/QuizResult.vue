<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  score: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'tryAgain'): void
  (e: 'goHome'): void
}>()

const { t } = useI18n()

const percentage = computed(() => {
  return Math.round((props.score / props.total) * 100)
})

const resultMessage = computed(() => {
  if (percentage.value >= 80) return t('quiz.excellent')
  if (percentage.value >= 60) return t('quiz.good')
  return t('quiz.needs_practice')
})

const resultEmoji = computed(() => {
  if (percentage.value >= 80) return '🎉'
  if (percentage.value >= 60) return '👍'
  return '💪'
})

const resultColor = computed(() => {
  if (percentage.value >= 80) return 'text-green-500'
  if (percentage.value >= 60) return 'text-yellow-500'
  return 'text-orange-500'
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
    <div class="text-6xl mb-4">{{ resultEmoji }}</div>

    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ t('quiz.result') }}
    </h2>

    <p :class="['text-xl font-semibold mb-6', resultColor]">
      {{ resultMessage }}
    </p>

    <div class="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 mb-6">
      <p class="text-4xl font-bold text-gray-900 dark:text-white mb-1">
        {{ score }}/{{ total }}
      </p>
      <p class="text-gray-500 dark:text-gray-400">
        {{ t('quiz.correct') }}: {{ percentage }}%
      </p>
    </div>

    <van-progress
      :percentage="percentage"
      :stroke-width="12"
      :color="percentage >= 80 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#f97316'"
      class="mb-8"
    />

    <div class="flex gap-3">
      <van-button
        plain
        round
        size="large"
        class="flex-1"
        @click="$emit('goHome')"
      >
        {{ t('nav.home') }}
      </van-button>

      <van-button
        type="primary"
        round
        size="large"
        class="flex-1"
        @click="$emit('tryAgain')"
      >
        {{ t('quiz.try_again') }}
      </van-button>
    </div>
  </div>
</template>
