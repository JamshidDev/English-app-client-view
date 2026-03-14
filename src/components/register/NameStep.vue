<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { validateName } from '@/utils/validators'
import { useTelegram } from '@/composables/useTelegram'

const props = defineProps<{
  firstName: string
  lastName: string
}>()

const emit = defineEmits<{
  (e: 'update:firstName', value: string): void
  (e: 'update:lastName', value: string): void
  (e: 'next'): void
  (e: 'back'): void
}>()

const { t } = useI18n()
const { hapticImpact, hapticNotification } = useTelegram()

const firstNameLocal = computed({
  get: () => props.firstName,
  set: (value) => emit('update:firstName', value)
})

const lastNameLocal = computed({
  get: () => props.lastName,
  set: (value) => emit('update:lastName', value)
})

const firstNameError = ref('')
const lastNameError = ref('')

const isValid = computed(() => {
  return validateName(firstNameLocal.value) && validateName(lastNameLocal.value)
})

const handleNext = () => {
  let hasError = false

  if (!validateName(firstNameLocal.value)) {
    firstNameError.value = t('register.first_name_error')
    hasError = true
  } else {
    firstNameError.value = ''
  }

  if (!validateName(lastNameLocal.value)) {
    lastNameError.value = t('register.last_name_error')
    hasError = true
  } else {
    lastNameError.value = ''
  }

  if (hasError) {
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
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-[#1cb0f6] rounded-2xl flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">
          {{ t('register.name_title') }}
        </h2>
      </div>

      <div class="space-y-4">
        <!-- First Name -->
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {{ t('register.first_name') }}
          </label>
          <van-field
            v-model="firstNameLocal"
            placeholder="Ismingizni kiriting"
            :error="!!firstNameError"
            :error-message="firstNameError"
            maxlength="50"
            class="custom-input"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            {{ t('register.last_name') }}
          </label>
          <van-field
            v-model="lastNameLocal"
            placeholder="Familiyangizni kiriting"
            :error="!!lastNameError"
            :error-message="lastNameError"
            maxlength="50"
            class="custom-input"
          />
        </div>
      </div>
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

<style scoped>
:deep(.custom-input.van-field) {
  @apply rounded-2xl border-2 border-gray-200 dark:border-[#314158] bg-white dark:bg-[#1a2730];
  padding: 14px 16px;
}

:deep(.custom-input .van-field__label) {
  display: none;
}

:deep(.custom-input .van-field__control) {
  @apply text-gray-900 dark:text-white text-base font-semibold;
}

:deep(.custom-input .van-field__control::placeholder) {
  @apply text-gray-300 dark:text-white/20 font-normal;
}

:deep(.van-field__error-message) {
  @apply text-red-500 text-xs mt-1 font-semibold;
}
</style>
