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
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a2730] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] safe-area-bottom">
    <div class="flex items-center justify-around py-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="navigateTo(tab.path)"
        class="flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all"
        :class="[
          activeTab === tab.name
            ? 'bg-[#e5f8d4] dark:bg-[#58cc02]/15'
            : ''
        ]"
      >
        <div class="w-7 h-7 mb-0.5" :class="activeTab === tab.name ? 'text-[#58cc02]' : 'text-gray-400 dark:text-gray-600'">
          <!-- Home Icon -->
          <template v-if="tab.icon === 'home'">
            <svg v-if="activeTab === 'home'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </template>

          <!-- Board Icon -->
          <template v-else-if="tab.icon === 'board'">
            <svg v-if="activeTab === 'board'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </template>

          <!-- Profile Icon -->
          <template v-else-if="tab.icon === 'profile'">
            <svg v-if="activeTab === 'profile'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </template>
        </div>

        <span class="text-[11px]"
          :class="[
            activeTab === tab.name
              ? 'text-[#58cc02] font-extrabold'
              : 'text-gray-400 dark:text-gray-600 font-semibold'
          ]"
        >{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
