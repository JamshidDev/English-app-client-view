<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-6 text-center">
    <div class="text-7xl mb-6">🚧</div>

    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      {{ t('modules.coming_soon') }}
    </h1>

    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Bu bo'lim hozircha ishlab chiqilmoqda. Tez orada tayyor bo'ladi!
    </p>

    <van-button
      type="primary"
      round
      size="large"
      @click="router.push('/home')"
    >
      {{ t('nav.home') }}ga qaytish
    </van-button>
  </div>
</template>
