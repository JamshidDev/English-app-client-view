<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useI18n } from 'vue-i18n'
import { modules } from '@/data/modules'
import ModuleCard from '@/components/common/ModuleCard.vue'
import { savedApi } from '@/api/endpoints/saved'
import { scoresApi } from '@/api/endpoints/scores'
import { notificationsApi } from '@/api/endpoints/notifications'
import { activityApi } from '@/api/endpoints/activity'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const savedCounts = ref({ words: 0 })
const totalStars = ref(0)
const unreadCount = ref(0)
const activeDaysCount = ref(0)

onMounted(async () => {
  try {
    const [savedRes, scoresRes, notifRes, activityRes] = await Promise.all([
      savedApi.getCounts(),
      scoresApi.getSummary(),
      notificationsApi.getUnreadCount(),
      activityApi.getActiveDays(new Date().getFullYear(), new Date().getMonth() + 1),
    ])
    savedCounts.value = savedRes.data
    totalStars.value = scoresRes.data.totalStars
    unreadCount.value = notifRes.data.count
    activeDaysCount.value = activityRes.data.total
  } catch {}
})

const wordsLearned = computed(() => authStore.userStats.wordsLearned)

// Kundalik maqsad — 10 ta so'z
const dailyGoal = 10
const dailyProgress = computed(() => Math.min(wordsLearned.value, dailyGoal))
const dailyPercent = computed(() => Math.round((dailyProgress.value / dailyGoal) * 100))
</script>

<template>
  <div class="bg-[#f7f7f7] dark:bg-[#131f24] min-h-screen">

    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] px-4 pt-3 pb-4 border-b border-gray-200 dark:border-[#314158]">
      <div class="flex items-center justify-between">
        <!-- Avatar + Greeting -->
        <div class="flex items-center gap-3">
          <div class="relative">
            <img
              v-if="authStore.user?.avatarUrl"
              :src="authStore.user.avatarUrl"
              class="w-11 h-11 rounded-full object-cover border-2 border-[#58cc02]"
            />
            <img v-else src="@/assets/images/default-avatar.svg" class="w-11 h-11 rounded-full" />
            <!-- Online badge -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#58cc02] rounded-full border-2 border-white dark:border-[#1a2730]" />
          </div>
          <div>
            <h1 class="text-gray-900 dark:text-white text-[15px] font-extrabold leading-tight">
              {{ authStore.user?.firstName }}
            </h1>
            <div class="flex items-center gap-1 mt-0.5">
              <svg class="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span class="text-gray-400 dark:text-gray-500 text-[10px] font-extrabold uppercase">Beginner</span>
              <svg class="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Stat Badges -->
        <div class="flex items-center gap-1.5">
          <!-- Activity Badge -->
          <div class="flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 px-2 py-1.5 rounded-lg cursor-pointer" @click="router.push('/activity')">
            <svg class="w-[18px] h-[18px] text-[#ff9600]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            <span class="text-[#ff9600] text-xs font-extrabold">{{ activeDaysCount }}</span>
          </div>
          <!-- Stars Badge -->
          <div class="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1.5 rounded-lg">
            <svg class="w-[18px] h-[18px] text-[#ffc800]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="text-[#ffc800] text-xs font-extrabold">{{ totalStars }}</span>
          </div>
          <!-- Notification Bell -->
          <div class="relative cursor-pointer" @click="router.push('/notifications')">
            <div class="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-white/5 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </div>
            <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 min-w-[16px] h-4 bg-[#ff4b4b] rounded-full flex items-center justify-center px-1">
              <span class="text-white text-[9px] font-extrabold leading-none">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 pt-4 pb-6">

      <!-- Daily Progress Banner (3D Card) -->
      <div class="relative mb-5">
        <!-- Shadow layer -->
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#46a302]" />
        <!-- Main card -->
        <div class="relative bg-[#58cc02] rounded-2xl p-4 -translate-y-1 dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-white/70 text-xs font-bold">{{ t('home.daily_goal') }}</p>
              <p class="text-white text-lg font-extrabold">{{ dailyProgress }}/{{ dailyGoal }} {{ t('home.words_count').toLowerCase() }}</p>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span class="text-2xl">🎯</span>
            </div>
          </div>
          <!-- Progress Bar -->
          <div class="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-500"
              :style="{ width: dailyPercent + '%' }"
            />
          </div>
          <p class="text-white/70 text-[11px] font-bold mt-1.5 text-right">{{ dailyPercent }}%</p>
        </div>
      </div>

      <!-- Saved Section -->
      <div v-if="savedCounts.words > 0" class="mb-5">
        <h2 class="text-gray-900 dark:text-white text-[15px] font-extrabold mb-3">Saqlangan</h2>
        <div @click="router.push('/saved/words')" class="relative cursor-pointer">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#e0a800]" />
          <div class="relative rounded-2xl bg-[#ffc800] px-4 py-3 -translate-y-1 active:translate-y-0 transition-transform">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
              <div>
                <p class="text-white font-extrabold text-sm">Saqlangan so'zlar</p>
                <p class="text-white/80 text-xs font-bold">{{ savedCounts.words }} ta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Title -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-gray-900 dark:text-white text-[15px] font-extrabold">{{ t('home.sections') }}</h2>
      </div>

      <!-- Modules Grid -->
      <div class="grid grid-cols-2 gap-3.5">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
        />
      </div>
    </div>

  </div>
</template>
