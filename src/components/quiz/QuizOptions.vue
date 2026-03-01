<script setup lang="ts">
import { computed } from 'vue'
import { useTelegram } from '@/composables/useTelegram'
import type { QuizOption } from '@/types/quiz'

const props = defineProps<{
  options: QuizOption[]
  selectedIndex: number | null
  correctIndex: number
  isAnswered: boolean
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

const { hapticImpact, hapticNotification } = useTelegram()

const optionLabels = ['A', 'B', 'C', 'D']

const getOptionClass = (index: number) => {
  if (!props.isAnswered) {
    return props.selectedIndex === index
      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
  }

  if (index === props.correctIndex) {
    return 'border-green-500 bg-green-50 dark:bg-green-900/20'
  }

  if (index === props.selectedIndex && index !== props.correctIndex) {
    return 'border-red-500 bg-red-50 dark:bg-red-900/20'
  }

  return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-50'
}

const getLabelClass = (index: number) => {
  if (!props.isAnswered) {
    return props.selectedIndex === index
      ? 'bg-primary-500 text-white'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }

  if (index === props.correctIndex) {
    return 'bg-green-500 text-white'
  }

  if (index === props.selectedIndex && index !== props.correctIndex) {
    return 'bg-red-500 text-white'
  }

  return 'bg-gray-100 dark:bg-gray-700 text-gray-400'
}

const handleSelect = (index: number) => {
  if (props.isAnswered) return

  hapticImpact('medium')

  if (index === props.correctIndex) {
    setTimeout(() => hapticNotification('success'), 100)
  } else {
    setTimeout(() => hapticNotification('error'), 100)
  }

  emit('select', index)
}
</script>

<template>
  <div class="space-y-3 mt-6">
    <button
      v-for="(option, index) in options"
      :key="option.id"
      @click="handleSelect(index)"
      :disabled="isAnswered"
      class="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all"
      :class="getOptionClass(index)"
    >
      <span
        class="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm"
        :class="getLabelClass(index)"
      >
        {{ optionLabels[index] }}
      </span>

      <span
        class="flex-1 text-left font-medium"
        :class="[
          isAnswered && index === correctIndex ? 'text-green-700 dark:text-green-400' :
          isAnswered && index === selectedIndex ? 'text-red-700 dark:text-red-400' :
          'text-gray-700 dark:text-gray-300'
        ]"
      >
        {{ option.text }}
      </span>

      <div v-if="isAnswered && index === correctIndex" class="text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div v-else-if="isAnswered && index === selectedIndex && index !== correctIndex" class="text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </button>
  </div>
</template>
