<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRegister } from '@/composables/useRegister'
import PhoneStep from '@/components/register/PhoneStep.vue'
import NameStep from '@/components/register/NameStep.vue'
import GoalStep from '@/components/register/GoalStep.vue'
import CongratsStep from '@/components/register/CongratsStep.vue'

const {
  currentStep,
  formData,
  isSubmitting,
  registerError,
  maxSteps,
  nextStep,
  prevStep,
  completeRegistration
} = useRegister()

const transitionName = ref('slide-left')

watch(currentStep, (newVal, oldVal) => {
  transitionName.value = newVal > oldVal ? 'slide-left' : 'slide-right'
})

const progressDots = computed(() => {
  return Array.from({ length: maxSteps }, (_, i) => ({
    index: i + 1,
    isActive: i + 1 === currentStep.value,
    isCompleted: i + 1 < currentStep.value
  }))
})
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Progress Dots -->
    <div class="flex justify-center gap-2 pt-6 pb-4">
      <div
        v-for="dot in progressDots"
        :key="dot.index"
        class="progress-dot"
        :class="{
          'active': dot.isActive,
          'completed': dot.isCompleted,
          'pending': !dot.isActive && !dot.isCompleted
        }"
      />
    </div>

    <!-- Step Content -->
    <div class="flex-1 overflow-hidden relative">
      <Transition :name="transitionName" mode="out-in">
        <PhoneStep
          v-if="currentStep === 1"
          v-model="formData.phone"
          v-model:telegramId="formData.telegramId"
          @next="nextStep"
        />

        <NameStep
          v-else-if="currentStep === 2"
          v-model:firstName="formData.firstName"
          v-model:lastName="formData.lastName"
          @next="nextStep"
          @back="prevStep"
        />

        <GoalStep
          v-else-if="currentStep === 3"
          v-model="formData.goals"
          @next="nextStep"
          @back="prevStep"
        />

        <CongratsStep
          v-else-if="currentStep === 4"
          :is-submitting="isSubmitting"
          :error="registerError"
          @complete="completeRegistration"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.progress-dot {
  @apply w-2.5 h-2.5 rounded-full transition-all duration-300;
}

.progress-dot.active {
  @apply bg-primary-500 w-6;
}

.progress-dot.completed {
  @apply bg-primary-500;
}

.progress-dot.pending {
  @apply bg-gray-300 dark:bg-gray-600;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
