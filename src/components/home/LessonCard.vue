<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/useLessonStore'
import { useTelegram } from '@/composables/useTelegram'
import type { Lesson } from '@/types/lesson'

const props = defineProps<{
  lesson: Lesson
}>()

const { t } = useI18n()
const router = useRouter()
const lessonStore = useLessonStore()
const { hapticImpact } = useTelegram()

const isCompleted = computed(() => lessonStore.isLessonCompleted(props.lesson.id))

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

const handleClick = () => {
  hapticImpact('light')
  router.push(`/lessons/${props.lesson.id}`)
}
</script>

<template>
  <div
    @click="handleClick"
    class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
  >
    <div class="flex items-start justify-between mb-2">
      <span :class="['text-xs px-2 py-1 rounded-full font-medium', levelColor]">
        {{ levelText }}
      </span>

      <div v-if="isCompleted" class="text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <h4 class="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
      {{ lesson.title }}
    </h4>

    <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
      {{ lesson.description }}
    </p>

    <div class="flex items-center text-xs text-gray-400 dark:text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ lesson.durationMinutes }} {{ t('lessons.minutes') }}
    </div>
  </div>
</template>
