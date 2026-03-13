<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useI18n } from 'vue-i18n'
import { modules } from '@/data/modules'
import ModuleCard from '@/components/common/ModuleCard.vue'

const { t } = useI18n()
const authStore = useAuthStore()

const streakDays = computed(() => authStore.userStats.streakDays)
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
            <div class="w-11 h-11 rounded-full bg-[#58cc02] flex items-center justify-center shadow-sm">
              <span class="text-sm font-extrabold text-white">
                {{ authStore.user?.firstName?.charAt(0) }}
              </span>
            </div>
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
        <div class="flex items-center gap-2">
          <!-- Streak Badge -->
          <div class="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1.5 rounded-xl">
            <svg class="w-4 h-4 text-[#ff9600]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            <span class="text-[#ff9600] text-xs font-extrabold">{{ streakDays }}</span>
          </div>
          <!-- Words Badge -->
          <div class="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1.5 rounded-xl">
            <svg class="w-4 h-4 text-[#1cb0f6]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <span class="text-[#1cb0f6] text-xs font-extrabold">{{ wordsLearned }}</span>
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
