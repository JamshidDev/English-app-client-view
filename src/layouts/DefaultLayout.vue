<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import { useAppStore } from '@/stores/useAppStore'

const route = useRoute()
const appStore = useAppStore()

const showNavbar = computed(() => !route.meta.hideNavbar)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#131f24]">
    <main class="flex-1" :class="showNavbar ? 'pb-16' : ''">
      <slot />
    </main>

    <AppNavbar v-if="showNavbar" />

    <AppLoader v-if="appStore.isLoading" :text="appStore.loadingText" />
  </div>
</template>
