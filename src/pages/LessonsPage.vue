<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLessonStore } from '@/stores/useLessonStore'
import { useTelegram } from '@/composables/useTelegram'
import LessonCard from '@/components/home/LessonCard.vue'
import type { LessonLevel } from '@/types/lesson'

const { t } = useI18n()
const lessonStore = useLessonStore()
const { hapticImpact } = useTelegram()

onMounted(() => {
  lessonStore.initLessons()
})

const levels: Array<{ key: LessonLevel | 'all'; label: string }> = [
  { key: 'all', label: 'lessons.all_levels' },
  { key: 'beginner', label: 'lessons.beginner' },
  { key: 'intermediate', label: 'lessons.intermediate' },
  { key: 'advanced', label: 'lessons.advanced' }
]

const selectLevel = (level: LessonLevel | 'all') => {
  hapticImpact('light')
  lessonStore.setSelectedLevel(level)
}
</script>

<template>
  <div class="px-4 py-6">
    <!-- Level Filter -->
    <div class="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      <button
        v-for="level in levels"
        :key="level.key"
        @click="selectLevel(level.key)"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="[
          lessonStore.selectedLevel === level.key
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        ]"
      >
        {{ t(level.label) }}
      </button>
    </div>

    <!-- Lessons Grid -->
    <div class="space-y-3">
      <LessonCard
        v-for="lesson in lessonStore.filteredLessons"
        :key="lesson.id"
        :lesson="lesson"
      />
    </div>

    <div
      v-if="lessonStore.filteredLessons.length === 0"
      class="text-center py-12 text-gray-500 dark:text-gray-400"
    >
      {{ t('common.noData') }}
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
