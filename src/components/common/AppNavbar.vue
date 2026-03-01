<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTelegram } from '@/composables/useTelegram'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { hapticImpact } = useTelegram()

const tabs = computed(() => [
  { name: 'home', path: '/home', icon: 'home', label: t('nav.home') },
  { name: 'vocabulary', path: '/vocabulary', icon: 'vocabulary', label: t('nav.vocabulary') },
  { name: 'profile', path: '/profile', icon: 'profile', label: t('nav.profile') }
])

const activeTab = computed(() => {
  const path = route.path
  if (path.startsWith('/vocabulary')) return 'vocabulary'
  if (path.startsWith('/profile')) return 'profile'
  return 'home'
})

const navigateTo = (path: string) => {
  hapticImpact('light')
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
    <div class="flex items-center justify-around py-2">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="navigateTo(tab.path)"
        class="flex flex-col items-center justify-center px-6 py-1 min-w-[80px] transition-colors"
        :class="[
          activeTab === tab.name
            ? 'text-primary-500'
            : 'text-gray-500 dark:text-gray-400'
        ]"
      >
        <div class="w-6 h-6 mb-1">
          <!-- Home Icon -->
          <svg v-if="tab.icon === 'home'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>

          <!-- Vocabulary Icon -->
          <svg v-else-if="tab.icon === 'vocabulary'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>

          <!-- Profile Icon -->
          <svg v-else-if="tab.icon === 'profile'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>

        <span class="text-xs font-medium">{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
