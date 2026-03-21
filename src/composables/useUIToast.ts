import { ref } from 'vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const isVisible = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning' | 'info'>('success')
let timer: ReturnType<typeof setTimeout> | null = null

const show = (options: ToastOptions | string) => {
  if (timer) clearTimeout(timer)

  if (typeof options === 'string') {
    toastMessage.value = options
    toastType.value = 'success'
  } else {
    toastMessage.value = options.message
    toastType.value = options.type || 'success'
  }

  isVisible.value = true

  const duration = typeof options === 'string' ? 2000 : (options.duration || 2000)
  timer = setTimeout(() => {
    isVisible.value = false
    timer = null
  }, duration)
}

const success = (message: string, duration?: number) => show({ message, type: 'success', duration })
const error = (message: string, duration?: number) => show({ message, type: 'error', duration })
const warning = (message: string, duration?: number) => show({ message, type: 'warning', duration })
const info = (message: string, duration?: number) => show({ message, type: 'info', duration })

export function useUIToast() {
  return {
    isVisible,
    toastMessage,
    toastType,
    show,
    success,
    error,
    warning,
    info,
  }
}
