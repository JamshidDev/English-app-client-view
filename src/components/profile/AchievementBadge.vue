<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  unlocked: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center p-4 rounded-xl transition-all"
    :class="[
      unlocked
        ? 'bg-primary-50 dark:bg-primary-900/20'
        : 'bg-gray-100 dark:bg-gray-700 opacity-50'
    ]"
  >
    <span class="text-3xl mb-2" :class="{ 'grayscale': !unlocked }">
      {{ icon }}
    </span>
    <p
      class="text-xs font-medium text-center"
      :class="[
        unlocked
          ? 'text-primary-700 dark:text-primary-300'
          : 'text-gray-500 dark:text-gray-400'
      ]"
    >
      {{ title }}
    </p>
  </div>
</template>
