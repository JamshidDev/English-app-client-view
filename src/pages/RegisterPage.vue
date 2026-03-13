<script setup lang="ts">
import { ref, watch } from 'vue'
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
  nextStep,
  prevStep,
  completeRegistration
} = useRegister()

const transitionName = ref('slide-left')

watch(currentStep, (newVal, oldVal) => {
  transitionName.value = newVal > oldVal ? 'slide-left' : 'slide-right'
})

</script>

<template>
  <div class="flex flex-col h-screen bg-white dark:bg-[#131f24]">
    <!-- Step Content -->
    <div class="flex-1 overflow-hidden relative">
      <!-- Steps 1-3 with transition -->
      <Transition :name="transitionName" mode="out-in">
        <PhoneStep
          v-if="currentStep === 1"
          key="phone"
          v-model="formData.phone"
          v-model:telegramId="formData.telegramId"
          @next="nextStep"
        />

        <NameStep
          v-else-if="currentStep === 2"
          key="name"
          v-model:firstName="formData.firstName"
          v-model:lastName="formData.lastName"
          @next="nextStep"
          @back="prevStep"
        />

        <GoalStep
          v-else-if="currentStep === 3"
          key="goal"
          v-model="formData.goals"
          @next="nextStep"
          @back="prevStep"
        />
      </Transition>

      <!-- CongratsStep without transition wrapper -->
      <Transition name="fade" appear>
        <CongratsStep
          v-if="currentStep === 4"
          :is-submitting="isSubmitting"
          :error="registerError"
          @complete="completeRegistration"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
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

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
