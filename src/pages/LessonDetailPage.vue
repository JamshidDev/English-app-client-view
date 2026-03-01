<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/useLessonStore'
import { useTelegram } from '@/composables/useTelegram'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const lessonStore = useLessonStore()
const { showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick, hapticNotification } = useTelegram()

const lessonId = computed(() => route.params.id as string)
const lesson = computed(() => lessonStore.getLessonById(lessonId.value))
const isCompleted = computed(() => lessonStore.isLessonCompleted(lessonId.value))

const handleBack = () => {
  router.back()
}

const handleComplete = () => {
  lessonStore.completeLesson(lessonId.value)
  hapticNotification('success')
}

onMounted(() => {
  showBackButton()
  onBackButtonClick(handleBack)
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})

const levelColor = computed(() => {
  if (!lesson.value) return ''
  const colors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[lesson.value.level] || colors.beginner
})

const levelText = computed(() => {
  if (!lesson.value) return ''
  const texts: Record<string, string> = {
    beginner: t('lessons.beginner'),
    intermediate: t('lessons.intermediate'),
    advanced: t('lessons.advanced')
  }
  return texts[lesson.value.level] || texts.beginner
})
</script>

<template>
  <div v-if="lesson" class="px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-2">
        <span :class="['text-xs px-2 py-1 rounded-full font-medium', levelColor]">
          {{ levelText }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
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
    <div class="sticky bottom-24">
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
  </div>

  <div v-else class="flex items-center justify-center h-64">
    <van-loading size="40" />
  </div>
</template>
