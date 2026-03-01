<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ThemeSwitcher from './ThemeSwitcher.vue'

const { t } = useI18n()
const route = useRoute()

const pageTitle = computed(() => {
  const routeName = route.name as string

  const titles: Record<string, string> = {
    Home: t('nav.home'),
    Lessons: t('lessons.title'),
    LessonDetail: t('lessons.title'),
    Vocabulary: t('vocabulary.title'),
    Quiz: t('quiz.title'),
    Profile: t('profile.title')
  }

  return titles[routeName] || t('nav.home')
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between px-4 py-3">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ pageTitle }}
      </h1>

      <ThemeSwitcher />
    </div>
  </header>
</template>
