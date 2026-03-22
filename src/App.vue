<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTelegram } from '@/composables/useTelegram'
import { useTheme } from '@/composables/useTheme'
import { useLanguage } from '@/composables/useLanguage'
import { useAuthStore } from '@/stores/useAuthStore'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AppLoader from '@/components/common/AppLoader.vue'
import UIToast from '@/components/common/UIToast.vue'

const route = useRoute()
const authStore = useAuthStore()
const { isAuthChecked } = storeToRefs(authStore)
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
  <!-- Loading while auth is being checked -->
  <AppLoader v-if="!isAuthChecked" />

  <!-- Main app content -->
  <template v-else>
    <AuthLayout v-if="route.meta.layout === 'auth'">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </AuthLayout>
    <DefaultLayout v-else>
      <router-view />
    </DefaultLayout>
  </template>

  <UIToast />
</template>

