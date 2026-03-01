<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/useAuthStore'
import { modules } from '@/data/modules'
import ModuleCard from '@/components/common/ModuleCard.vue'

const { t } = useI18n()
const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-primary-500 px-4 pt-[100px] pb-14 rounded-b-3xl">
      <div class="flex items-center justify-between mt-[10px]">
        <div class="flex items-center gap-3">
          <img
            :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${authStore.user?.id}`"
            :alt="authStore.fullName"
            class="w-9 h-9 rounded-full bg-white/20 ring-2 ring-white/30"
          />
          <div>
            <h1 class="text-white text-sm font-semibold leading-tight">{{ authStore.fullName }}</h1>
            <p class="text-white/60 text-[9px]">ID: {{ authStore.user?.id?.slice(0, 8) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
          <span class="text-sm">🇬🇧</span>
          <span class="text-white text-xs font-bold">Pro</span>
        </div>
      </div>
    </div>

    <!-- Modules Grid -->
    <div class="px-4 mt-[20px]">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t('home.select_module') }}
        </h2>

        <div class="grid grid-cols-2 gap-3">
          <ModuleCard
            v-for="module in modules"
            :key="module.id"
            :module="module"
          />
        </div>
      </div>
    </div>

  </div>
</template>
