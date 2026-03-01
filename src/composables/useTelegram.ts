import { computed } from 'vue'

let tg: TelegramWebApp | null = null

export function useTelegram() {
  const initTelegram = () => {
    if (window.Telegram?.WebApp) {
      tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      // Request fullscreen for newer Telegram versions (v7.0+)
      try {
        if (tg.requestFullscreen) {
          tg.requestFullscreen()
        }
      } catch (e) {
        // Fullscreen not supported
      }

      // Disable vertical swipes to prevent accidental closing
      try {
        if (tg.disableVerticalSwipes) {
          tg.disableVerticalSwipes()
        }
      } catch (e) {
        // Not supported
      }
    }
  }

  const user = computed(() => tg?.initDataUnsafe?.user)
  const telegramId = computed(() => tg?.initDataUnsafe?.user?.id?.toString() || '')
  const colorScheme = computed(() => tg?.colorScheme || 'light')
  const themeParams = computed(() => tg?.themeParams)
  const isReady = computed(() => !!tg)

  const showBackButton = () => {
    tg?.BackButton.show()
  }

  const hideBackButton = () => {
    tg?.BackButton.hide()
  }

  const onBackButtonClick = (callback: () => void) => {
    tg?.BackButton.onClick(callback)
  }

  const offBackButtonClick = (callback: () => void) => {
    tg?.BackButton.offClick(callback)
  }

  const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      tg?.HapticFeedback?.impactOccurred(style)
    } catch (e) {
      // Ignore haptic errors in browser
    }
  }

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    try {
      tg?.HapticFeedback?.notificationOccurred(type)
    } catch (e) {
      // Ignore haptic errors in browser
    }
  }

  const hapticSelection = () => {
    try {
      tg?.HapticFeedback?.selectionChanged()
    } catch (e) {
      // Ignore haptic errors in browser
    }
  }

  const showAlert = (message: string, callback?: () => void) => {
    if (tg) {
      tg.showAlert(message, callback)
    } else {
      alert(message)
      callback?.()
    }
  }

  const showConfirm = (message: string, callback?: (confirmed: boolean) => void) => {
    if (tg) {
      tg.showConfirm(message, callback)
    } else {
      const confirmed = confirm(message)
      callback?.(confirmed)
    }
  }

  const close = () => {
    tg?.close()
  }

  const setHeaderColor = (color: string) => {
    try {
      tg?.setHeaderColor(color)
    } catch (e) {
      // Ignore in browser
    }
  }

  const setBackgroundColor = (color: string) => {
    try {
      tg?.setBackgroundColor(color)
    } catch (e) {
      // Ignore in browser
    }
  }

  return {
    tg: computed(() => tg),
    isReady,
    user,
    telegramId,
    colorScheme,
    themeParams,
    initTelegram,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
    offBackButtonClick,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    showAlert,
    showConfirm,
    close,
    setHeaderColor,
    setBackgroundColor
  }
}
