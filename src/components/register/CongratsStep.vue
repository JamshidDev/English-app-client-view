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

    <div class="flex-1 flex flex-col items-center justify-center text-center">
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

    <div class="mt-auto">
      <p v-if="props.error" class="text-red-500 text-sm text-center mb-3">
        {{ props.error }}
      </p>

      <van-button
        type="primary"
        block
        round
        size="large"
        :loading="props.isSubmitting"
        loading-text="Yuklanmoqda..."
        :disabled="props.isSubmitting"
        @click="handleComplete"
      >
        {{ t('common.start') }} 🚀
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
</style>
