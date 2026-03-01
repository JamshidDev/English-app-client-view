<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'

const { t } = useI18n()
const authStore = useAuthStore()
</script>

<template>
  <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 mb-6 text-white">
    <h3 class="font-semibold mb-4">{{ t('home.progress') }}</h3>

    <div class="grid grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold">{{ authStore.userStats.wordsLearned }}</p>
        <p class="text-xs opacity-80">{{ t('home.words_learned') }}</p>
      </div>

      <div class="text-center border-x border-white/20">
        <p class="text-2xl font-bold">{{ authStore.userStats.lessonsCompleted }}</p>
        <p class="text-xs opacity-80">{{ t('home.lessons_done') }}</p>
      </div>

      <div class="text-center">
        <p class="text-2xl font-bold">{{ authStore.userStats.quizAccuracy }}%</p>
        <p class="text-xs opacity-80">{{ t('home.quiz_score') }}</p>
      </div>
    </div>
  </div>
</template>
