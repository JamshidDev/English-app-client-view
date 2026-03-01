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

const handleBack = () => {
  hapticImpact('light')
  emit('back')
}
</script>

<template>
  <div class="flex flex-col h-full px-6 py-8 relative overflow-hidden">
    <!-- Background Icons -->
    <div class="absolute -right-10 -bottom-10 opacity-5 dark:opacity-[0.03] pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-64 h-64 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
      </svg>
    </div>
    <div class="absolute -left-8 -top-8 opacity-5 dark:opacity-[0.03] pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-48 h-48 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    </div>

    <div class="flex-1 relative z-10">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('register.name_title') }}
      </h2>

      <p class="text-gray-500 dark:text-gray-400 mb-8">
        Ism va familiyangizni kiriting
      </p>

      <div class="space-y-5">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

<style scoped>
:deep(.custom-input.van-field) {
  @apply rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800;
  padding: 12px 16px;
}

:deep(.custom-input .van-field__label) {
  display: none;
}

:deep(.custom-input .van-field__control) {
  @apply text-gray-900 dark:text-white text-base;
}

:deep(.custom-input .van-field__control::placeholder) {
  @apply text-gray-400 dark:text-gray-500;
}

:deep(.van-field__error-message) {
  @apply text-red-500 text-xs mt-1;
}
</style>
