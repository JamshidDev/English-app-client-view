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

const getCardStyle = () => {
  const isDark = document.documentElement.classList.contains('dark')
  const base = isDark ? '#1a2730' : '#ffffff'
  return { background: `linear-gradient(135deg, ${base} 60%, ${props.module.color}${isDark ? '25' : '18'} 100%)` }
}

const handleClick = () => {
  hapticImpact('medium')
  router.push(props.module.route)
}
</script>

<template>
  <div
    @click="handleClick"
    class="relative cursor-pointer active:scale-[0.97] transition-transform"
  >
    <!-- 3D bottom layer -->
    <div
      class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl dark:!bg-[#2a3440]"
      :style="{ backgroundColor: '#d1d5db' }"
    />

    <!-- Main card -->
    <div
      class="relative rounded-2xl p-4 pb-3 -translate-y-[5px] active:translate-y-0 transition-transform border border-gray-100 dark:border-white/5 overflow-hidden"
      :style="getCardStyle()"
    >
      <div class="flex items-start justify-between mb-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center"
          :style="{ backgroundColor: module.color + '15' }"
        >
          <!-- Book icon -->
          <svg v-if="module.emoji === 'book'" class="w-5 h-5" :style="{ color: module.color }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <!-- Pencil icon -->
          <svg v-else-if="module.emoji === 'pencil'" class="w-5 h-5" :style="{ color: module.color }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          <!-- Headphones icon -->
          <svg v-else-if="module.emoji === 'headphones'" class="w-5 h-5" :style="{ color: module.color }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
          <!-- Mic icon -->
          <svg v-else-if="module.emoji === 'mic'" class="w-5 h-5" :style="{ color: module.color }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        </div>
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10">
          <svg
            class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
            fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>

      <h3 class="font-bold text-[15px] leading-tight text-gray-900 dark:text-white">
        {{ t(module.titleKey) }}
      </h3>
      <p class="text-[11px] mt-0.5 text-gray-400 dark:text-gray-500">
        {{ t(module.descriptionKey) }}
      </p>
    </div>
  </div>
</template>
