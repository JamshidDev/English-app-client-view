interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  isExpanded: boolean
  isFullscreen?: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void

  // Fullscreen methods (v7.0+)
  requestFullscreen?: () => void
  exitFullscreen?: () => void

  // Vertical swipes (v7.7+)
  isVerticalSwipesEnabled?: boolean
  enableVerticalSwipes?: () => void
  disableVerticalSwipes?: () => void

  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }

  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }

  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }

  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }

  colorScheme: 'light' | 'dark'

  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: {
      id: number
      is_bot: boolean
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
      is_premium?: boolean
      photo_url?: string
    }
    auth_date: number
    hash: string
  }

  sendData: (data: string) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
      text?: string
    }>
  }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void

  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}

declare const Telegram: {
  WebApp: TelegramWebApp
}
