<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTheme } from '@/composables/useTheme'
import { useLanguage, languages } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import { APP_VERSION } from '@/utils/constants'

const { t } = useI18n()
const authStore = useAuthStore()
const { theme, toggleTheme } = useTheme()
const { currentLanguage, setLanguage } = useLanguage()
const { hapticImpact } = useTelegram()

const isDark = computed(() => theme.value === 'dark')

const showLangSheet = ref(false)
const currentLang = computed(() => languages.find(l => l.code === currentLanguage.value) || languages[0])

const handleThemeToggle = () => {
  hapticImpact('light')
  toggleTheme()
}

const handleLanguageChange = (lang: 'uz' | 'ru' | 'en') => {
  hapticImpact('light')
  setLanguage(lang)
  showLangSheet.value = false
}

const handleShare = () => {
  hapticImpact('light')
  if (navigator.share) {
    navigator.share({
      title: 'English Booster Pro',
      text: "English Booster Pro — ingliz tilini o'rganish uchun eng yaxshi ilova!",
      url: 'https://t.me/EnglishBoosterPro_bot'
    })
  }
}

const handleRate = () => {
  hapticImpact('light')
  window.open('https://t.me/EnglishBoosterPro_bot', '_blank')
}


</script>

<template>
  <div class="bg-gray-50 dark:bg-[#0a0a0a] pb-24">
    <!-- Header -->
    <div class="bg-white dark:bg-[#111111] border-b border-transparent dark:border-white/5 px-4 pt-4 pb-5">
      <div class="flex items-center gap-3">
        <div class="relative p-[2px] rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600">
          <div class="w-14 h-14 rounded-full bg-white dark:bg-[#111111] flex items-center justify-center">
            <span class="text-lg font-bold bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600 bg-clip-text text-transparent">
              {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
            </span>
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-base font-bold text-gray-900 dark:text-white">
            {{ authStore.fullName }}
          </h1>
          <p class="text-xs text-gray-400 dark:text-gray-600">
            ID: {{ authStore.user?.telegramId }}
          </p>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="px-4 mt-4">
      <p class="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-1">
        {{ t('profile.settings') }}
      </p>
      <div class="bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <!-- Theme Toggle -->
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <svg v-if="isDark" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <svg v-else class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm text-gray-900 dark:text-white">{{ t('profile.theme') }}</span>
          </div>
          <button
            @click="handleThemeToggle"
            class="relative w-11 h-6 rounded-full transition-colors duration-200"
            :class="isDark ? 'bg-primary-500' : 'bg-gray-200 dark:bg-white/10'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
              :class="isDark ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>

        <div class="h-px bg-gray-100 dark:bg-white/5 mx-4" />

        <!-- Language -->
        <button
          @click="showLangSheet = true"
          class="flex items-center justify-between w-full px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <span class="text-sm text-gray-900 dark:text-white">{{ t('profile.language') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">{{ currentLang.flag }} {{ currentLang.label }}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Share & Rate Section -->
    <div class="px-4 mt-4">
      <div class="bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <!-- Share -->
        <button @click="handleShare" class="flex items-center gap-3 w-full px-4 py-3">
          <div class="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </div>
          <span class="text-sm text-gray-900 dark:text-white">{{ t('profile.share') }}</span>
        </button>

        <div class="h-px bg-gray-100 dark:bg-white/5 mx-4" />

        <!-- Rate -->
        <button @click="handleRate" class="flex items-center gap-3 w-full px-4 py-3">
          <div class="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <span class="text-sm text-gray-900 dark:text-white">{{ t('profile.rate') }}</span>
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="px-4 mt-4">
      <div class="bg-white dark:bg-[#111111] rounded-xl border border-gray-100 dark:border-white/5 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <span class="text-sm text-gray-900 dark:text-white">{{ t('profile.about') }}</span>
          </div>
          <span class="text-xs text-gray-400">v{{ APP_VERSION }}</span>
        </div>
      </div>
    </div>

    <!-- Language Bottom Sheet -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showLangSheet" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showLangSheet = false" />
          <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] rounded-t-2xl pb-safe">
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
            </div>
            <h3 class="text-base font-bold text-gray-900 dark:text-white text-center mb-3">
              {{ t('profile.language') }}
            </h3>
            <div class="px-4 pb-6 space-y-1">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="handleLanguageChange(lang.code)"
                class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm transition-colors"
                :class="currentLanguage === lang.code
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'"
              >
                <span class="text-base">{{ lang.flag }} {{ lang.label }}</span>
                <svg v-if="currentLanguage === lang.code" class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active > :last-child,
.sheet-leave-active > :last-child {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from > :last-child,
.sheet-leave-to > :last-child {
  transform: translateY(100%);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
</style>
