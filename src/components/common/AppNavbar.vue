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
  { name: 'board', path: '/board', icon: 'board', label: t('nav.board') },
  { name: 'profile', path: '/profile', icon: 'profile', label: t('nav.profile') }
])

const activeTab = computed(() => {
  const path = route.path
  if (path.startsWith('/profile')) return 'profile'
  if (path.startsWith('/board')) return 'board'
  return 'home'
})

const navigateTo = (path: string) => {
  hapticImpact('light')
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-3 left-3 right-3 z-50 safe-area-bottom">
    <div class="flex items-center justify-around py-2.5 bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 dark:border-white/10">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="navigateTo(tab.path)"
        class="flex flex-col items-center justify-center px-6 py-1 min-w-[80px] transition-colors"
        :class="[
          activeTab === tab.name
            ? 'text-primary-500'
            : 'text-gray-500 dark:text-gray-600'
        ]"
      >
        <div class="w-6 h-6 mb-1">
          <!-- Home Icon -->
          <svg v-if="tab.icon === 'home'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>

          <!-- Board Icon -->
          <svg v-else-if="tab.icon === 'board'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
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
