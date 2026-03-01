<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'
import { useTheme } from '@/composables/useTheme'
import { useLanguage } from '@/composables/useLanguage'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const { initTelegram } = useTelegram()
const { initTheme } = useTheme()
const { initLanguage } = useLanguage()

onMounted(() => {
  initTelegram()
  initTheme()
  initLanguage()
})
</script>

<template>
  <AuthLayout v-if="route.meta.layout === 'auth'">
    <router-view />
  </AuthLayout>
  <DefaultLayout v-else>
    <router-view />
  </DefaultLayout>
</template>
