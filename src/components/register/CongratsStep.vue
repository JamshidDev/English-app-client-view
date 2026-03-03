<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTelegram } from '@/composables/useTelegram'

const props = defineProps<{
  isSubmitting?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const { t } = useI18n()
const { hapticNotification } = useTelegram()

const showConfetti = ref(false)
const confettiItems = ref<Array<{ id: number; left: string; delay: string; color: string }>>([])

const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

onMounted(() => {
  hapticNotification('success')

  confettiItems.value = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  showConfetti.value = true

  setTimeout(() => {
    showConfetti.value = false
  }, 3000)
})

const handleComplete = () => {
  hapticNotification('success')
  emit('complete')
}
</script>

<template>
  <div class="flex flex-col h-full px-6 py-8 relative overflow-hidden">
    <!-- Confetti -->
    <div v-if="showConfetti" class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        v-for="item in confettiItems"
        :key="item.id"
        class="confetti absolute w-3 h-3 rounded-sm"
        :style="{
          left: item.left,
          animationDelay: item.delay,
          backgroundColor: item.color
        }"
      />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center text-center min-h-0">
      <div
        class="transition-opacity duration-300"
        :class="{ 'opacity-50': props.isSubmitting }"
      >
        <div class="text-7xl mb-6 animate-bounce">
          🎉
        </div>

        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('register.congrats_title') }}
        </h2>

        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {{ t('register.congrats_message') }}
        </p>

        <p class="text-gray-500 dark:text-gray-500">
          {{ t('register.congrats_subtitle') }}
        </p>
      </div>
    </div>

    <div class="mt-auto space-y-3">
      <!-- Error Alert -->
      <div
        v-if="props.error"
        class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">Xatolik yuz berdi</p>
          <p class="text-xs text-red-600 dark:text-red-300 mt-0.5">{{ props.error }}</p>
        </div>
      </div>

      <van-button
        type="primary"
        block
        round
        size="large"
        :loading="props.isSubmitting"
        loading-text="Yuklanmoqda..."
        :disabled="props.isSubmitting"
        class="shine-button"
        @click="handleComplete"
      >
        <span class="flex items-center justify-center">
          <span class="font-bold uppercase tracking-wide">O'rganishni boshlash</span>
          <svg class="w-5 h-5 ml-3 arrow-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </van-button>
    </div>
  </div>
</template>

<style scoped>
@keyframes confetti-fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti {
  animation: confetti-fall 3s ease-in-out forwards;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

:deep(.shine-button) {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
  transition: all 0.3s ease !important;
}

:deep(.shine-button:active) {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3) !important;
}

:deep(.shine-button)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

@keyframes arrow-bounce {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

.arrow-bounce {
  animation: arrow-bounce 1s ease-in-out infinite;
}
</style>
