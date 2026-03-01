<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/useLessonStore'
import { useTelegram } from '@/composables/useTelegram'
import type { Lesson } from '@/types/lesson'

const props = defineProps<{
  lesson: Lesson
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const { t } = useI18n()
const lessonStore = useLessonStore()
const { hapticNotification } = useTelegram()

const isCompleted = computed(() => lessonStore.isLessonCompleted(props.lesson.id))

const handleComplete = () => {
  lessonStore.completeLesson(props.lesson.id)
  hapticNotification('success')
  emit('complete')
}

const levelColor = computed(() => {
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[props.lesson.level] || colors.beginner
})

const levelText = computed(() => {
  const texts: Record<string, string> = {
    beginner: t('lessons.beginner'),
    intermediate: t('lessons.intermediate'),
    advanced: t('lessons.advanced')
  }
  return texts[props.lesson.level] || texts.beginner
})
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <span :class="['text-xs px-2 py-1 rounded-full font-medium', levelColor]">
          {{ levelText }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ lesson.durationMinutes }} {{ t('lessons.minutes') }}
        </span>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ lesson.title }}
      </h1>

      <p class="text-gray-600 dark:text-gray-400">
        {{ lesson.description }}
      </p>
    </div>

    <!-- Content -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-6">
      <div class="space-y-4">
        <p
          v-for="(paragraph, index) in lesson.content"
          :key="index"
          class="text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>

    <!-- Complete Button -->
    <van-button
      v-if="!isCompleted"
      type="primary"
      block
      round
      size="large"
      @click="handleComplete"
    >
      {{ t('lessons.complete') }} ✓
    </van-button>

    <div
      v-else
      class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl p-4 text-center font-medium"
    >
      ✓ {{ t('lessons.completed') }}
    </div>
  </div>
</template>
