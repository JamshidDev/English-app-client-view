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
      class="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-[#1a2730] rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98]"
      :class="isSelected(category.id)
        ? 'border-[#58cc02] bg-[#58cc02]/5 dark:bg-[#58cc02]/10'
        : 'border-gray-100 dark:border-[#314158]/50'"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="isSelected(category.id)
            ? 'bg-[#58cc02]/15 dark:bg-[#58cc02]/20'
            : 'bg-gray-100 dark:bg-[#243642]'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" :class="isSelected(category.id) ? 'text-[#58cc02]' : 'text-gray-400 dark:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        </div>
        <span class="font-bold text-sm" :class="isSelected(category.id) ? 'text-[#58cc02]' : 'text-gray-900 dark:text-white'">
          {{ getName(category.name) }}
        </span>
      </div>

      <div
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
        :class="isSelected(category.id)
          ? 'bg-[#58cc02] border-[#58cc02]'
          : 'border-gray-300 dark:border-[#314158]'"
      >
        <svg
          v-if="isSelected(category.id)"
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  </div>
</template>
