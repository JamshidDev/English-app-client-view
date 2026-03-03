<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { goals } from '@/data/goals'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'

// SVG icon paths for each goal
const goalIcons: Record<string, string> = {
  travel: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  career: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  education: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
  daily: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  ielts: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  other: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
}

const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'next'): void
  (e: 'back'): void
}>()

const { t } = useI18n()
const { hapticImpact, hapticNotification, hapticSelection } = useTelegram()
const { currentLanguage } = useLanguage()

const selectedGoals = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const error = ref('')

const getGoalLabel = (goal: typeof goals[0]) => {
  const labelMap: Record<string, string> = {
    uz: goal.labelUz,
    ru: goal.labelRu,
    en: goal.labelEn
  }
  return labelMap[currentLanguage.value] || goal.labelUz
}

const toggleGoal = (goalKey: string) => {
  hapticSelection()
  const index = selectedGoals.value.indexOf(goalKey)

  if (index > -1) {
    selectedGoals.value = selectedGoals.value.filter(g => g !== goalKey)
  } else {
    selectedGoals.value = [...selectedGoals.value, goalKey]
  }

  error.value = ''
}

const isSelected = (goalKey: string) => {
  return selectedGoals.value.includes(goalKey)
}

const isValid = computed(() => selectedGoals.value.length > 0)

const handleNext = () => {
  if (!isValid.value) {
    error.value = t('register.goal_error')
    hapticNotification('error')
    return
  }

  hapticImpact('medium')
  emit('next')
}

const handleBack = () => {
  hapticImpact('light')
  emit('back')
}
</script>

<template>
  <div class="flex flex-col h-full px-5 py-6 relative overflow-hidden">
    <!-- Background Decorations -->
    <div class="absolute -right-16 top-20 opacity-[0.04] dark:opacity-[0.02] pointer-events-none rotate-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-56 h-56 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23c-.25-.44-.79-.62-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41c-.02.22-.03.44-.03.67s.01.45.03.68l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.02-.23.03-.45.03-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
      </svg>
    </div>
    <div class="absolute -left-12 -bottom-12 opacity-[0.04] dark:opacity-[0.02] pointer-events-none -rotate-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-48 h-48 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
    <div class="absolute right-4 bottom-32 opacity-[0.06] dark:opacity-[0.03] pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    </div>

    <div class="flex-1 relative z-10">
      <!-- Header -->
      <div class="w-full mb-4 relative">
        <!-- Scattered Icons Background -->
        <div class="absolute -inset-x-8 -inset-y-16 overflow-visible pointer-events-none">
          <!-- Top left area -->
          <svg class="absolute -top-8 -left-4 w-7 h-7 text-cyan-400/20 rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <svg class="absolute top-12 -left-6 w-4 h-4 text-blue-500/15 -rotate-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>

          <!-- Top right area -->
          <svg class="absolute -top-10 right-0 w-6 h-6 text-blue-400/25 -rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
          <svg class="absolute -top-4 -right-6 w-5 h-5 text-indigo-400/20 rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>

          <!-- Middle sides -->
          <svg class="absolute top-6 -left-8 w-5 h-5 text-indigo-500/25 rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <svg class="absolute top-8 -right-4 w-5 h-5 text-cyan-500/20 rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>

          <!-- Bottom area -->
          <svg class="absolute top-16 left-8 w-4 h-4 text-blue-400/15 -rotate-45" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
          <svg class="absolute top-14 right-12 w-3 h-3 text-cyan-400/25 rotate-180" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>

        <h2 class="text-[36px] font-bold mb-2 leading-none text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent relative z-10">
          {{ t('register.goal_title') }}
        </h2>
        <p class="text-sm text-gray-400 dark:text-gray-500 text-center relative z-10">
          Bir yoki bir nechta tanlang
        </p>
      </div>

      <!-- Goals Grid -->
      <div class="grid grid-cols-2 gap-2.5 mt-[60px]">
        <button
          v-for="goal in goals"
          :key="goal.id"
          @click="toggleGoal(goal.key)"
          class="relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-200 active:scale-95"
          :class="[
            isSelected(goal.key)
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md shadow-primary-500/10'
              : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
          ]"
        >
          <!-- Check badge -->
          <div
            v-if="isSelected(goal.key)"
            class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            :class="[
              isSelected(goal.key)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path :d="goalIcons[goal.key]" />
            </svg>
          </div>

          <span
            class="text-xs font-medium text-center leading-tight"
            :class="[
              isSelected(goal.key)
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ getGoalLabel(goal) }}
          </span>
        </button>
      </div>

      <!-- Selected count -->
      <div v-if="selectedGoals.length > 0" class="mt-4 text-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ selectedGoals.length }} ta tanlandi
        </span>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-500 text-center">{{ error }}</p>
    </div>

    <div class="mt-auto flex gap-3 relative z-10">
      <van-button
        plain
        round
        size="large"
        class="flex-1"
        @click="handleBack"
      >
        {{ t('common.back') }}
      </van-button>

      <van-button
        type="primary"
        round
        size="large"
        :disabled="!isValid"
        class="flex-1"
        @click="handleNext"
      >
        {{ t('common.next') }}
      </van-button>
    </div>
  </div>
</template>
