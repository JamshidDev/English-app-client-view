<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#131f24]">
    <h1 class="text-xl font-bold text-white mb-1">EasyEnglish</h1>
    <p class="text-sm text-gray-500">Ingliz tilini o'rganish ilovasi</p>

    <div class="mt-8">
      <div class="w-8 h-8 border-3 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
    </div>

    <p v-if="text" class="text-gray-400 text-sm mt-4">{{ text }}</p>
  </div>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
