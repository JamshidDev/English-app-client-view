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
    class="relative rounded-2xl p-5 transition-all duration-200 cursor-pointer"
    :class="[
      module.active
        ? `bg-gradient-to-br ${module.gradient} shadow-lg hover:shadow-xl active:scale-[0.97]`
        : 'bg-gray-100 dark:bg-gray-800'
    ]"
  >
    <!-- Coming Soon Badge -->
    <div
      v-if="!module.active"
      class="absolute top-2 right-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full"
    >
      <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">
        {{ t('modules.coming_soon') }}
      </span>
    </div>

    <!-- Icon -->
    <div
      class="text-4xl mb-3"
      :class="module.active ? '' : 'opacity-50 grayscale'"
    >
      {{ module.icon }}
    </div>

    <!-- Title -->
    <h3
      class="font-bold text-lg mb-1"
      :class="module.active ? 'text-white' : 'text-gray-400 dark:text-gray-500'"
    >
      {{ t(module.titleKey) }}
    </h3>

    <!-- Description -->
    <p
      class="text-sm"
      :class="module.active ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'"
    >
      {{ t(module.descriptionKey) }}
    </p>

    <!-- Arrow for active -->
    <div
      v-if="module.active"
      class="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>
