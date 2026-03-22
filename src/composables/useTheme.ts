import { ref, watch } from 'vue'
import { useTelegram } from './useTelegram'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('dark')

export function useTheme() {
  const { setHeaderColor, setBackgroundColor } = useTelegram()

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null

    if (savedTheme) {
      theme.value = savedTheme
    } else {
      theme.value = (import.meta.env.VITE_DEFAULT_THEME as Theme) || 'dark'
    }

    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement

    if (theme.value === 'dark') {
      html.classList.add('dark')
      setHeaderColor('#111827')
      setBackgroundColor('#111827')
    } else {
      html.classList.remove('dark')
      setHeaderColor('#f9fafb')
      setBackgroundColor('#f9fafb')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  const isDark = () => theme.value === 'dark'

  watch(theme, applyTheme)

  return {
    theme,
    initTheme,
    toggleTheme,
    setTheme,
    isDark
  }
}
