<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { modules } from '@/data/modules'
import ModuleCard from '@/components/common/ModuleCard.vue'

const authStore = useAuthStore()

const isScrolled = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="bg-gray-50 dark:bg-[#0a0a0a]">
    <!-- Header Wrapper -->
    <div
      class="sticky z-50 transition-all duration-300"
      :class="isScrolled ? 'top-0' : 'top-2.5 px-3'"
    >
    <div
      class="relative px-4 flex items-center transition-all duration-300 overflow-hidden"
      :class="[
        isScrolled
          ? 'h-[62px] bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl shadow-md border-b border-white/30 dark:border-white/5'
          : 'h-[62px] bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white/40 dark:border-white/10'
      ]"
    >
      <!-- Gradient glow effect -->
      <div class="absolute -top-8 -left-8 w-28 h-28 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-8 -right-8 w-28 h-28 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-2xl"></div>
      <div class="relative z-10 flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="relative p-[2px] rounded-full bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600">
            <div class="w-9 h-9 rounded-full bg-white dark:bg-[#111111] flex items-center justify-center">
              <span class="text-sm font-bold bg-gradient-to-br from-primary-400 via-primary-500 to-indigo-600 bg-clip-text text-transparent">
                {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
              </span>
            </div>
          </div>
          <div>
            <h1 class="text-gray-900 dark:text-gray-100 text-xs font-semibold leading-tight">
              {{ authStore.fullName }}
            </h1>
            <p class="text-gray-500 dark:text-gray-500 text-[10px]">
              ID: {{ authStore.user?.id?.slice(0, 8) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1 bg-gradient-to-r from-primary-500 to-indigo-600 px-3 py-1 rounded-full">
          <span class="text-sm">🇬🇧</span>
          <span class="text-white text-xs font-bold">Pro</span>
        </div>
      </div>
    </div>
    </div>

    <!-- Modules Grid -->
    <div class="px-4 mt-16">
      <div class="grid grid-cols-2 gap-3">
        <ModuleCard
          v-for="module in modules"
          :key="module.id"
          :module="module"
        />
      </div>
    </div>

  </div>
</template>
