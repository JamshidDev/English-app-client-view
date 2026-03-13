<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTelegram } from '@/composables/useTelegram'

const { t } = useI18n()
const router = useRouter()
const { hapticImpact } = useTelegram()

const goHome = () => {
  hapticImpact('light')
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f7] dark:bg-[#131f24] flex flex-col">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] px-4 pt-4 pb-3 border-b border-gray-200 dark:border-[#314158]">
      <div class="flex items-center gap-2">
        <button @click="goHome" class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-lg font-extrabold text-gray-900 dark:text-white uppercase">
          {{ t('modules.coming_soon') }}
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <!-- 3D Icon -->
      <div class="relative mb-6">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-3xl bg-[#d07a00]" />
        <div class="relative w-24 h-24 bg-[#ff9600] rounded-3xl -translate-y-[4px] flex items-center justify-center dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
        </div>
      </div>

      <h2 class="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
        {{ t('modules.coming_soon') }}
      </h2>

      <p class="text-sm text-gray-400 dark:text-gray-500 font-semibold mb-8 max-w-[260px]">
        Bu bo'lim hozircha ishlab chiqilmoqda. Tez orada tayyor bo'ladi!
      </p>

      <!-- 3D Duolingo Button -->
      <div class="w-full max-w-[280px]">
        <div class="relative" @click="goHome">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-[#46a302]" />
          <button class="relative w-full rounded-2xl bg-[#58cc02] py-3.5 -translate-y-[4px] active:translate-y-0 transition-transform text-white font-extrabold text-sm uppercase tracking-wide dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
            {{ t('nav.home') }}ga qaytish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
