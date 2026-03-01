<script setup lang="ts">
import AppLoader from '@/components/common/AppLoader.vue'
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <AppLoader v-if="appStore.isLoading" :text="appStore.loadingText" />
  </div>
</template>
