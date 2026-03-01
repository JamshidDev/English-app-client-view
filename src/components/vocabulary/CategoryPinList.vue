<script setup lang="ts">
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'
import type { Category } from '@/types/vocabulary'

const props = defineProps<{
  categories: Category[]
  selectedIds: Set<string>
}>()

const emit = defineEmits<{
  toggle: [categoryId: string]
}>()

const { hapticImpact } = useTelegram()
const { currentLanguage } = useLanguage()

const getName = (name: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return name.ru
  return name.uz
}

const isSelected = (categoryId: string) => props.selectedIds.has(categoryId)

const handleToggle = (categoryId: string) => {
  hapticImpact('light')
  emit('toggle', categoryId)
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="category in categories"
      :key="category.id"
      @click="handleToggle(category.id)"
      class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer transition-all active:scale-[0.98]"
      :class="{ 'border-primary-500 dark:border-primary-500': isSelected(category.id) }"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :class="isSelected(category.id)
            ? 'bg-primary-100 dark:bg-primary-900/30'
            : 'bg-gray-100 dark:bg-gray-700'"
        >
          <span class="text-lg">📚</span>
        </div>
        <span class="font-medium text-gray-900 dark:text-white">
          {{ getName(category.name) }}
        </span>
      </div>

      <div
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        :class="isSelected(category.id)
          ? 'bg-primary-500 border-primary-500'
          : 'border-gray-300 dark:border-gray-600'"
      >
        <svg
          v-if="isSelected(category.id)"
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
