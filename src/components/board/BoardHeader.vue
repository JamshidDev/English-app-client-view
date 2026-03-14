<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type TabKey = 'weekly' | 'daily' | 'monthly'

const activeTab = defineModel<TabKey>('activeTab', { required: true })

const tabs = [
  { key: 'weekly' as const, label: 'Haftalik' },
  { key: 'daily' as const, label: 'Kunlik' },
  { key: 'monthly' as const, label: 'Oylik' },
]
</script>

<template>
  <div class="sticky top-0 z-10">
    <!-- Title Row -->
    <div class="bg-white dark:bg-[#1a2730] px-4 pt-4 pb-3 border-b border-gray-200 dark:border-[#314158]">
      <h1 class="text-lg font-extrabold text-gray-900 dark:text-white text-center uppercase">
        {{ t('nav.board_title') }}
      </h1>
    </div>

    <!-- Tab Buttons -->
    <div class="flex justify-center px-4 pb-3 mt-2.5">
      <div class="inline-flex bg-gray-100 dark:bg-[#243642] rounded-full p-1 border border-gray-200 dark:border-[#314158] shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase transition-all duration-200"
          :class="activeTab === tab.key
            ? 'bg-[#58cc02]/10 text-[#58cc02] border-2 border-[#58cc02]'
            : 'text-gray-500 dark:text-gray-400 border-2 border-transparent'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>
