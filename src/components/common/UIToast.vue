<script setup lang="ts">
import { computed } from 'vue'
import { useUIToast } from '@/composables/useUIToast'

const { isVisible, toastMessage, toastType } = useUIToast()

const bgClass = computed(() => {
  switch (toastType.value) {
    case 'success': return 'bg-[#58cc02]'
    case 'error': return 'bg-[#ff4b4b]'
    case 'warning': return 'bg-[#ffc800]'
    case 'info': return 'bg-[#1cb0f6]'
    default: return 'bg-[#58cc02]'
  }
})

const icon = computed(() => {
  switch (toastType.value) {
    case 'success': return 'M4.5 12.75l6 6 9-13.5'
    case 'error': return 'M6 18L18 6M6 6l12 12'
    case 'warning': return 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
    case 'info': return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    default: return 'M4.5 12.75l6 6 9-13.5'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="isVisible"
        class="fixed bottom-24 left-4 right-4 z-[9999] flex justify-center pointer-events-none"
      >
        <div
          class="pointer-events-auto px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2.5 max-w-xs"
          :class="bgClass"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
          </svg>
          <span class="text-white font-bold text-sm">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: toast-out 0.25s ease-in;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}
</style>
