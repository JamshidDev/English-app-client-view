import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

type Language = 'uz' | 'ru' | 'en'

interface LanguageOption {
  code: Language
  label: string
  flag: string
}

const currentLanguage = ref<Language>('uz')

export const languages: LanguageOption[] = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
]

export function useLanguage() {
  const { locale } = useI18n()

  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language') as Language | null

    if (savedLanguage && ['uz', 'ru', 'en'].includes(savedLanguage)) {
      currentLanguage.value = savedLanguage
    } else {
      currentLanguage.value = (import.meta.env.VITE_DEFAULT_LANGUAGE as Language) || 'uz'
    }

    locale.value = currentLanguage.value
  }

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    locale.value = lang
    localStorage.setItem('language', lang)
  }

  const currentLanguageOption = computed(() => {
    return languages.find(l => l.code === currentLanguage.value) || languages[0]
  })

  return {
    currentLanguage,
    languages,
    currentLanguageOption,
    initLanguage,
    setLanguage
  }
}
