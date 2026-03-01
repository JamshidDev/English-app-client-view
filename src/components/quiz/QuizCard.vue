<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Quiz } from '@/types/quiz'

const props = defineProps<{
  quiz: Quiz
  questionNumber: number
  totalQuestions: number
}>()

const { t } = useI18n()

const progress = computed(() => {
  return (props.questionNumber / props.totalQuestions) * 100
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ t('quiz.question') }} {{ questionNumber }}/{{ totalQuestions }}
      </span>
    </div>

    <van-progress
      :percentage="progress"
      :show-pivot="false"
      color="#3b82f6"
      track-color="#e5e7eb"
      class="mb-6"
    />

    <h3 class="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
      {{ quiz.question }}
    </h3>
  </div>
</template>
