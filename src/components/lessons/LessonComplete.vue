<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineEmits<{
  (e: 'next'): void
  (e: 'home'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="text-center py-12">
    <div class="text-6xl mb-6">🎉</div>

    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      {{ t('lessons.completed') }}!
    </h2>

    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Darsni muvaffaqiyatli tugatdingiz!
    </p>

    <div class="flex gap-3">
      <van-button
        plain
        round
        size="large"
        class="flex-1"
        @click="$emit('home')"
      >
        {{ t('nav.home') }}
      </van-button>

      <van-button
        type="primary"
        round
        size="large"
        class="flex-1"
        @click="$emit('next')"
      >
        Keyingi dars
      </van-button>
    </div>
  </div>
</template>
