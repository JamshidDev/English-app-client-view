<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTheme } from '@/composables/useTheme'
import { useLanguage, languages } from '@/composables/useLanguage'
import { useTelegram } from '@/composables/useTelegram'
import { APP_VERSION } from '@/utils/constants'
import StatsCard from '@/components/profile/StatsCard.vue'
import AchievementBadge from '@/components/profile/AchievementBadge.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { theme, toggleTheme } = useTheme()
const { currentLanguage, setLanguage } = useLanguage()
const { hapticImpact } = useTelegram()

const isDark = computed(() => theme.value === 'dark')

const achievements = [
  { icon: '📚', key: 'first_word', unlocked: authStore.userStats.wordsLearned >= 1 },
  { icon: '📖', key: 'first_lesson', unlocked: authStore.userStats.lessonsCompleted >= 1 },
  { icon: '🎯', key: 'quiz_master', unlocked: authStore.userStats.quizAccuracy >= 80 },
  { icon: '🔥', key: 'week_streak', unlocked: authStore.userStats.streakDays >= 7 },
  { icon: '🏆', key: 'vocabulary_pro', unlocked: authStore.userStats.wordsLearned >= 20 }
]

const handleThemeToggle = () => {
  hapticImpact('light')
  toggleTheme()
}

const handleLanguageChange = (lang: 'uz' | 'ru' | 'en') => {
  hapticImpact('light')
  setLanguage(lang)
}

const showLogoutDialog = ref(false)

const handleLogout = () => {
  hapticImpact('light')
  showLogoutDialog.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutDialog.value = false
  router.push('/register')
}
</script>

<template>
  <div class="px-4 py-6 pb-24">
    <!-- User Info -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
          </span>
        </div>

        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ authStore.fullName }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ID: {{ authStore.user?.telegramId }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <StatsCard class="mb-6" />

    <!-- Achievements -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-6">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('profile.achievements') }}
      </h3>

      <div class="grid grid-cols-5 gap-2">
        <AchievementBadge
          v-for="achievement in achievements"
          :key="achievement.key"
          :icon="achievement.icon"
          :title="t(`achievements.${achievement.key}`)"
          :unlocked="achievement.unlocked"
        />
      </div>
    </div>

    <!-- Settings -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <h3 class="font-semibold text-gray-900 dark:text-white px-5 pt-5 pb-2">
        {{ t('profile.settings') }}
      </h3>

      <van-cell-group :border="false">
        <!-- Theme -->
        <van-cell :title="t('profile.theme')">
          <template #value>
            <van-switch
              :model-value="isDark"
              size="24"
              @update:model-value="handleThemeToggle"
            />
          </template>
        </van-cell>

        <!-- Language -->
        <van-cell :title="t('profile.language')" is-link @click="null">
          <template #value>
            <van-dropdown-menu>
              <van-dropdown-item
                :model-value="currentLanguage"
                :options="languages.map(l => ({ text: `${l.flag} ${l.label}`, value: l.code }))"
                @change="handleLanguageChange"
              />
            </van-dropdown-menu>
          </template>
        </van-cell>

        <!-- About -->
        <van-cell :title="t('profile.about')">
          <template #value>
            <span class="text-gray-500">{{ t('profile.version') }} {{ APP_VERSION }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- Logout -->
    <div class="mt-6">
      <van-button
        plain
        type="danger"
        block
        round
        @click="handleLogout"
      >
        {{ t('profile.logout') }}
      </van-button>
    </div>

    <!-- Logout Confirmation Dialog -->
    <van-dialog
      v-model:show="showLogoutDialog"
      :title="t('profile.logout')"
      show-cancel-button
      :confirm-button-text="t('common.confirm')"
      :cancel-button-text="t('common.cancel')"
      @confirm="confirmLogout"
    >
      <div class="py-4 text-center text-gray-600 dark:text-gray-400">
        Haqiqatan ham chiqmoqchimisiz?
      </div>
    </van-dialog>
  </div>
</template>
