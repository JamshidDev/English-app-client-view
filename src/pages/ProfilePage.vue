<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTheme } from '@/composables/useTheme'
import { useLanguage, languages } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import { useUIToast } from '@/composables/useUIToast'
import { authApi } from '@/api/endpoints/auth'
import { APP_VERSION } from '@/utils/constants'

const { t } = useI18n()
const authStore = useAuthStore()
const { theme, toggleTheme } = useTheme()
const { currentLanguage, setLanguage } = useLanguage()
const { hapticImpact } = useTelegram()
const toast = useUIToast()

const avatarUrl = computed(() => {
  const url = authStore.user?.avatarUrl
  if (!url) return null
  // Agar relative URL bo'lsa, backend URL qo'shish
  if (url.startsWith('/')) return url
  return url
})

const isRefreshing = ref(false)

const refreshAvatar = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  hapticImpact('light')

  try {
    // Avval Telegram SDK'dan photo_url olishga harakat qilamiz
    const photoUrl = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url
    const res = await authApi.refreshAvatar(photoUrl || '')

    if (res.data.avatarUrl && authStore.user) {
      authStore.user.avatarUrl = res.data.avatarUrl
      localStorage.setItem('user', JSON.stringify(authStore.user))
      toast.success('Avatar yangilandi')
    } else {
      toast.warning('Avatar topilmadi')
    }
  } catch {
    toast.error('Xatolik yuz berdi')
  } finally {
    isRefreshing.value = false
  }
}

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
  <div class="bg-[#f7f7f7] dark:bg-[#131f24] min-h-screen pb-24">

    <!-- Profile Header -->
    <div class="bg-white dark:bg-[#1a2730] px-4 pt-4 pb-5">
      <div class="flex items-center gap-3">
        <div class="relative cursor-pointer" @click="refreshAvatar">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            class="w-14 h-14 rounded-full object-cover border-2 border-[#58cc02]"
          />
          <img v-else src="@/assets/images/default-avatar.svg" class="w-14 h-14 rounded-full" />
          <!-- Refresh badge -->
          <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#1cb0f6] rounded-full border-2 border-white dark:border-[#1a2730] flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-base font-extrabold text-gray-900 dark:text-white">
            {{ authStore.fullName }}
          </h1>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-gray-400 dark:text-gray-500 text-[11px] font-semibold">ID: {{ authStore.user?.telegramId }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-3 gap-2.5 mt-4">
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#3ea000]" />
          <div class="relative bg-[#58cc02] rounded-xl p-3 -translate-y-[3px] text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <p class="text-white text-lg font-extrabold">{{ authStore.userStats.wordsLearned }}</p>
            <p class="text-white/70 text-[10px] font-bold">{{ t('home.words_count') }}</p>
          </div>
        </div>
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#d07a00]" />
          <div class="relative bg-[#ff9600] rounded-xl p-3 -translate-y-[3px] text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <p class="text-white text-lg font-extrabold">{{ authStore.userStats.streakDays }}</p>
            <p class="text-white/70 text-[10px] font-bold">{{ t('home.streak') }}</p>
          </div>
        </div>
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-xl bg-[#1290d0]" />
          <div class="relative bg-[#1cb0f6] rounded-xl p-3 -translate-y-[3px] text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
            <p class="text-white text-lg font-extrabold">{{ authStore.userStats.quizAccuracy }}%</p>
            <p class="text-white/70 text-[10px] font-bold">{{ t('profile.quiz_accuracy') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="px-4 mt-4">
      <p class="text-xs font-extrabold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-1">
        {{ t('profile.settings') }}
      </p>
      <div class="bg-white dark:bg-[#1a2730] rounded-2xl overflow-hidden">
        <!-- Theme Toggle -->
        <div class="flex items-center justify-between px-4 py-3.5">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
              <svg v-if="isDark" class="w-[18px] h-[18px] text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
              <svg v-else class="w-[18px] h-[18px] text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.theme') }}</span>
          </div>
          <button
            @click="handleThemeToggle"
            class="relative w-12 h-7 rounded-full transition-colors duration-200"
            :class="isDark ? 'bg-[#58cc02]' : 'bg-gray-200 dark:bg-[#243642]'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
              :class="isDark ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>

        <div class="h-px bg-gray-100 dark:bg-[#243642] mx-4" />

        <!-- Language -->
        <button
          @click="showLangSheet = true"
          class="flex items-center justify-between w-full px-4 py-3.5 active:bg-gray-50 dark:active:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <svg class="w-[18px] h-[18px] text-[#1cb0f6]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.language') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-400">{{ currentLang.flag }} {{ currentLang.label }}</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Share & Rate Section -->
    <div class="px-4 mt-4">
      <div class="bg-white dark:bg-[#1a2730] rounded-2xl overflow-hidden">
        <!-- Share -->
        <button @click="handleShare" class="flex items-center gap-3 w-full px-4 py-3.5 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
          <div class="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <svg class="w-[18px] h-[18px] text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.share') }}</span>
        </button>

        <div class="h-px bg-gray-100 dark:bg-[#243642] mx-4" />

        <!-- Rate -->
        <button @click="handleRate" class="flex items-center gap-3 w-full px-4 py-3.5 active:bg-gray-50 dark:active:bg-white/5 transition-colors">
          <div class="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
            <svg class="w-[18px] h-[18px] text-[#ff9600]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.rate') }}</span>
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="px-4 mt-4">
      <div class="bg-white dark:bg-[#1a2730] rounded-2xl px-4 py-3.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <svg class="w-[18px] h-[18px] text-[#ce82ff]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('profile.about') }}</span>
          </div>
          <span class="text-xs font-bold text-gray-400">v{{ APP_VERSION }}</span>
        </div>
      </div>
    </div>

    <!-- Language Bottom Sheet -->
    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="showLangSheet" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showLangSheet = false" />
          <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1a2730] rounded-t-2xl pb-safe">
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-10 h-1 bg-gray-300 dark:bg-[#314158] rounded-full" />
            </div>
            <h3 class="text-base font-extrabold text-gray-900 dark:text-white text-center mb-3">
              {{ t('profile.language') }}
            </h3>
            <div class="px-4 pb-6 space-y-1.5">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="handleLanguageChange(lang.code)"
                class="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors active:scale-[0.98]"
                :class="currentLanguage === lang.code
                  ? 'bg-[#e5f8d4] dark:bg-[#58cc02]/15 text-[#58cc02]'
                  : 'text-gray-700 dark:text-gray-300 active:bg-gray-50 dark:active:bg-white/5'"
              >
                <span class="text-base">{{ lang.flag }} {{ lang.label }}</span>
                <svg v-if="currentLanguage === lang.code" class="w-5 h-5 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
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
