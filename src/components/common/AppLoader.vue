<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  text?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4">
      <van-loading type="spinner" size="40" color="#3b82f6" />
      <p class="text-gray-700 dark:text-gray-300 text-sm">
        {{ text || t('common.loading') }}
      </p>
    </div>
  </div>
</template>
