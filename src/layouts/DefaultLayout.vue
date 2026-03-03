<script setup lang="ts">
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
    <main class="flex-1 pb-20">
      <slot />
    </main>

    <AppNavbar />

    <AppLoader v-if="appStore.isLoading" :text="appStore.loadingText" />
  </div>
</template>
