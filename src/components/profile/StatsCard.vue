<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const authStore = useAuthStore()

const stats = [
  {
    key: 'wordsLearned',
    icon: '📚',
    label: 'profile.words_learned',
    getValue: () => authStore.userStats.wordsLearned
  },
  {
    key: 'lessonsCompleted',
    icon: '✅',
    label: 'profile.lessons_completed',
    getValue: () => authStore.userStats.lessonsCompleted
  },
  {
    key: 'quizAccuracy',
    icon: '🎯',
    label: 'profile.quiz_accuracy',
    getValue: () => `${authStore.userStats.quizAccuracy}%`
  },
  {
    key: 'streakDays',
    icon: '🔥',
    label: 'profile.streak',
    getValue: () => authStore.userStats.streakDays
  }
]
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
    <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
      {{ t('profile.stats') }}
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center"
      >
        <span class="text-2xl mb-2 block">{{ stat.icon }}</span>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
          {{ stat.getValue() }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ t(stat.label) }}
        </p>
      </div>
    </div>
  </div>
</template>
