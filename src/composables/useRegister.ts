import { ref, computed } from 'vue'
import type { RegisterForm } from '@/types/user'
import { useTelegram } from './useTelegram'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const MAX_STEPS = 4

export function useRegister() {
  const currentStep = ref(1)
  const isSubmitting = ref(false)
  const registerError = ref('')
  const router = useRouter()
  const { hapticImpact, hapticNotification, telegramId } = useTelegram()
  const authStore = useAuthStore()

  const formData = ref<RegisterForm>({
    telegramId: '',
    phone: '',
    firstName: '',
    lastName: '',
    goals: []
  })

  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === MAX_STEPS)
  const progress = computed(() => (currentStep.value / MAX_STEPS) * 100)

  const nextStep = () => {
    if (currentStep.value < MAX_STEPS) {
      currentStep.value++
      hapticImpact('light')
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
      hapticImpact('light')
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= MAX_STEPS) {
      currentStep.value = step
      hapticImpact('light')
    }
  }

  const completeRegistration = async () => {
    isSubmitting.value = true
    registerError.value = ''

    try {
      const tgId = formData.value.telegramId || telegramId.value || 'demo_user'

      await authStore.register({
        telegramId: tgId,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName || undefined,
        phone: formData.value.phone || undefined
      })

      // Goals ni localStorage da saqlaymiz (API da yo'q)
      if (formData.value.goals.length > 0) {
        localStorage.setItem('userGoals', JSON.stringify(formData.value.goals))
      }

      hapticNotification('success')
      router.push('/home')
    } catch (error: any) {
      hapticNotification('error')
      registerError.value = error?.response?.data?.message || 'Registratsiyada xatolik yuz berdi'
      console.error('Registration failed:', error)
    } finally {
      isSubmitting.value = false
    }
  }

  const resetForm = () => {
    currentStep.value = 1
    registerError.value = ''
    formData.value = {
      telegramId: '',
      phone: '',
      firstName: '',
      lastName: '',
      goals: []
    }
  }

  return {
    currentStep,
    formData,
    isFirstStep,
    isLastStep,
    isSubmitting,
    registerError,
    progress,
    maxSteps: MAX_STEPS,
    nextStep,
    prevStep,
    goToStep,
    completeRegistration,
    resetForm
  }
}
