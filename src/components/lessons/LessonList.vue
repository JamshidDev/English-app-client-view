<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/useLessonStore'
import LessonCard from '@/components/home/LessonCard.vue'

const { t } = useI18n()
const lessonStore = useLessonStore()
</script>

<template>
  <div class="space-y-3">
    <LessonCard
      v-for="lesson in lessonStore.filteredLessons"
      :key="lesson.id"
      :lesson="lesson"
    />

    <div v-if="lessonStore.filteredLessons.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ t('common.noData') }}
    </div>
  </div>
</template>
