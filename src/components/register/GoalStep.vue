<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { goals } from '@/data/goals'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'

const goalIcons: Record<string, string> = {
  travel: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  career: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  education: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
  daily: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z',
  ielts: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  other: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
}

const goalColors: Record<string, string> = {
  travel: '#1cb0f6',
  career: '#ff9600',
  education: '#ce82ff',
  daily: '#58cc02',
  ielts: '#ff4b4b',
  other: '#1cb0f6'
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
</script>

<template>
  <div class="flex flex-col h-full px-5 py-6">
    <div class="flex-1">
      <!-- Icon + Title -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 bg-[#ff9600] rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
          </svg>
        </div>
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">
          {{ t('register.goal_title') }}
        </h2>
        <p class="text-sm text-gray-400 dark:text-gray-500 font-semibold mt-1">
          Bir yoki bir nechta tanlang
        </p>
      </div>

      <!-- Goals Grid -->
      <div class="grid grid-cols-2 gap-2.5">
        <button
          v-for="goal in goals"
          :key="goal.id"
          @click="toggleGoal(goal.key)"
          class="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]"
          :class="[
            isSelected(goal.key)
              ? 'border-[#58cc02] bg-[#e5f8d4] dark:bg-[#58cc02]/15'
              : 'border-gray-100 dark:border-[#314158] bg-white dark:bg-[#1a2730]'
          ]"
        >
          <!-- Check badge -->
          <div
            v-if="isSelected(goal.key)"
            class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#58cc02] rounded-full flex items-center justify-center"
          >
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            :style="{
              backgroundColor: isSelected(goal.key) ? goalColors[goal.key] : '',
            }"
            :class="!isSelected(goal.key) ? 'bg-gray-100 dark:bg-[#243642]' : ''"
          >
            <svg
              class="w-5 h-5"
              :class="isSelected(goal.key) ? 'text-white' : 'text-gray-500 dark:text-gray-400'"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path :d="goalIcons[goal.key]" />
            </svg>
          </div>

          <span
            class="text-xs font-bold text-center leading-tight"
            :class="isSelected(goal.key) ? 'text-[#58cc02]' : 'text-gray-700 dark:text-gray-300'"
          >
            {{ getGoalLabel(goal) }}
          </span>
        </button>
      </div>

      <!-- Selected count -->
      <div v-if="selectedGoals.length > 0" class="mt-4 text-center">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e5f8d4] dark:bg-[#58cc02]/15 text-[#58cc02] rounded-full text-xs font-bold">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ selectedGoals.length }} ta tanlandi
        </span>
      </div>

      <p v-if="error" class="mt-3 text-sm text-red-500 text-center font-semibold">{{ error }}</p>
    </div>

    <!-- 3D Duolingo Button -->
    <div class="mt-auto pt-4">
      <div class="relative" @click="handleNext">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl" :class="isValid ? 'bg-[#3ea000]' : 'bg-gray-200 dark:bg-[#243642]'" />
        <button
          :disabled="!isValid"
          class="relative w-full rounded-2xl py-4 -translate-y-[5px] active:translate-y-0 transition-transform font-extrabold text-base"
          :class="[
            isValid ? 'bg-[#58cc02] text-white dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]' : 'bg-gray-100 dark:bg-[#1a2730] text-gray-300 dark:text-white/20'
          ]"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>
