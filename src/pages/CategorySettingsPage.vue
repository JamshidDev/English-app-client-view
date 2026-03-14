<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTelegram } from '@/composables/useTelegram'
import { categoriesApi, clientCategoriesApi } from '@/api/endpoints/vocabulary'
import type { Category } from '@/types/vocabulary'
import CategoryPinList from '@/components/vocabulary/CategoryPinList.vue'

const { t } = useI18n()
const router = useRouter()
const { showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick, hapticImpact } = useTelegram()

const allCategories = ref<Category[]>([])
const selectedIds = ref<Set<string>>(new Set())
const isLoading = ref(false)
const isSaving = ref(false)

const selectedCount = computed(() => selectedIds.value.size)
const hasSelected = computed(() => selectedIds.value.size > 0)

const handleBack = () => {
  router.back()
}

const toggleCategory = (categoryId: string) => {
  const newSet = new Set(selectedIds.value)
  if (newSet.has(categoryId)) {
    newSet.delete(categoryId)
  } else {
    newSet.add(categoryId)
  }
  selectedIds.value = newSet
}

const saveCategories = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const categoryIds = Array.from(selectedIds.value)
    await clientCategoriesApi.save(categoryIds)
    hapticImpact('medium')
    router.back()
  } catch (error) {
    console.error('Failed to save categories:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  showBackButton()
  onBackButtonClick(handleBack)

  isLoading.value = true
  try {
    const [allRes, myRes] = await Promise.all([
      categoriesApi.getAll({ page: 1, pageSize: 50 }),
      clientCategoriesApi.getMy({ page: 1, pageSize: 50 })
    ])

    allCategories.value = allRes.data.data
    const myData = Array.isArray(myRes.data) ? myRes.data : (myRes.data as any)?.data || []
    const myIds = myData.map((item: any) => item.categoryId)
    selectedIds.value = new Set(myIds)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="min-h-screen bg-[#f7f7f7] dark:bg-[#131f24]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] px-4 pt-4 pb-3 border-b border-gray-200 dark:border-[#314158]">
      <div class="flex items-center gap-2">
        <button @click="handleBack" class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">
          {{ t('vocabulary.settings.title') }}
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Info Card -->
      <div class="bg-[#1cb0f6]/10 dark:bg-[#1cb0f6]/10 rounded-xl px-3 py-2.5 mb-3 border border-[#1cb0f6]/20">
        <div class="flex gap-2.5 items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#1cb0f6] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          <p class="text-xs font-semibold text-[#1cb0f6] dark:text-[#1cb0f6] leading-relaxed">
            {{ t('vocabulary.settings.info') }}
          </p>
        </div>
      </div>

      <!-- Selected Count -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-extrabold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          {{ t('vocabulary.settings.select_categories') }}
        </span>
        <span
          v-if="hasSelected"
          class="text-xs font-extrabold text-[#58cc02]"
        >
          {{ selectedCount }} {{ t('vocabulary.settings.pinned') }}
        </span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-2">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between px-3 py-2.5 bg-white dark:bg-[#1a2730] rounded-xl border-2 border-gray-100 dark:border-[#314158]/50 animate-pulse">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 bg-gray-100 dark:bg-[#243642] rounded-lg" />
            <div class="h-3.5 bg-gray-100 dark:bg-[#243642] rounded-lg w-24" />
          </div>
          <div class="w-6 h-6 bg-gray-100 dark:bg-[#243642] rounded-full" />
        </div>
      </div>

      <!-- Category List -->
      <CategoryPinList
        v-else
        :categories="allCategories"
        :selected-ids="selectedIds"
        @toggle="toggleCategory"
      />

      <!-- Save Button -->
      <div v-if="!isLoading" class="relative mt-6">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#46a302]" />
        <button
          @click="saveCategories"
          :disabled="isSaving"
          class="relative w-full py-3.5 rounded-2xl font-extrabold text-white transition-all -translate-y-1 active:translate-y-0"
          :class="isSaving
            ? 'bg-[#58cc02]/60 cursor-not-allowed'
            : 'bg-[#58cc02]'"
        >
          {{ isSaving ? t('common.loading') : t('common.save') }}
        </button>
      </div>

      <!-- Reset Hint -->
      <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 font-semibold">
        {{ t('vocabulary.settings.reset_hint') }}
      </p>
    </div>
  </div>
</template>
