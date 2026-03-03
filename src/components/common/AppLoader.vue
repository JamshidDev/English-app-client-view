<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-900">
    <div class="w-20 h-20 mb-6 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
      <span class="text-4xl">🇬🇧</span>
    </div>

    <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-2">English Booster Pro</h1>

    <div class="mt-6">
      <div class="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>

    <p v-if="text" class="text-gray-500 dark:text-gray-400 text-sm mt-4">{{ text }}</p>
  </div>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
