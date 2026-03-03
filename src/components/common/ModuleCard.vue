<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'
import type { AppModule } from '@/types/module'

const props = defineProps<{
  module: AppModule
}>()

const { t } = useI18n()
const router = useRouter()
const { hapticImpact } = useTelegram()

const handleClick = () => {
  if (props.module.active) {
    hapticImpact('medium')
    router.push(props.module.route)
  } else {
    hapticImpact('light')
  }
}
</script>

<template>
  <div
    @click="handleClick"
    class="relative rounded-lg p-3 transition-all duration-200 cursor-pointer overflow-hidden"
    :style="module.active ? { '--module-color': module.color } : {}"
    :class="[
      module.active
        ? `module-active bg-gradient-to-br ${module.gradient} shadow-md hover:shadow-lg active:scale-[0.97]`
        : 'bg-gray-100 dark:bg-[#111111] shadow-sm dark:border dark:border-white/5'
    ]"
  >
    <!-- Coming Soon Badge -->
    <div
      v-if="!module.active"
      class="absolute top-1.5 right-1.5 px-1.5 py-px bg-gray-200 dark:bg-white/10 rounded-full"
    >
      <span class="text-[9px] font-medium text-gray-500 dark:text-gray-400">
        {{ t('modules.coming_soon') }}
      </span>
    </div>

    <!-- Icon Container -->
    <div
      class="w-8 h-8 rounded-md flex items-center justify-center mb-2"
      :class="module.active ? `${module.iconBg} dark:bg-white/10` : 'bg-gray-200 dark:bg-white/10'"
    >
      <!-- Vocabulary: book-open -->
      <svg v-if="module.id === 'vocabulary'" class="w-4 h-4" :class="module.active ? 'text-white dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>

      <!-- Grammar: pencil-square -->
      <svg v-else-if="module.id === 'grammar'" class="w-4 h-4" :class="module.active ? 'text-white dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>

      <!-- Listening: speaker -->
      <svg v-else-if="module.id === 'listening'" class="w-4 h-4" :class="module.active ? 'text-white dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
      </svg>

      <!-- Speaking: microphone -->
      <svg v-else-if="module.id === 'speaking'" class="w-4 h-4" :class="module.active ? 'text-white dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    </div>

    <!-- Title -->
    <h3
      class="font-bold text-sm mb-0.5"
      :class="module.active ? 'text-white dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'"
    >
      {{ t(module.titleKey) }}
    </h3>

    <!-- Description -->
    <p
      class="text-[10px] leading-tight"
      :class="module.active ? 'text-white/70 dark:text-gray-500' : 'text-gray-400 dark:text-gray-600'"
    >
      {{ t(module.descriptionKey) }}
    </p>

    <!-- Arrow for active -->
    <div
      v-if="module.active"
      class="absolute bottom-2.5 right-2.5 w-6 h-6 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center"
    >
      <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  </div>
</template>

<style>
.dark .module-active {
  background-image: radial-gradient(circle at bottom right, color-mix(in srgb, var(--module-color) 15%, transparent), transparent 70%) !important;
  background-color: #111111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
</style>
