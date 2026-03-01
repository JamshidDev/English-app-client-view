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
    const myIds = myRes.data.map(item => item.categoryId)
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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <button @click="handleBack" class="p-2 -ml-2 text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ t('vocabulary.settings.title') }}
        </h1>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Info Card -->
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
        <div class="flex gap-3">
          <div class="text-2xl">💡</div>
          <div>
            <p class="text-sm text-blue-800 dark:text-blue-200">
              {{ t('vocabulary.settings.info') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Selected Count -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('vocabulary.settings.select_categories') }}
        </span>
        <span
          v-if="hasSelected"
          class="text-sm font-medium text-primary-500"
        >
          {{ selectedCount }} {{ t('vocabulary.settings.pinned') }}
        </span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="space-y-2">
        <div v-for="i in 4" :key="i" class="h-16 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>

      <!-- Category List -->
      <CategoryPinList
        v-else
        :categories="allCategories"
        :selected-ids="selectedIds"
        @toggle="toggleCategory"
      />

      <!-- Save Button -->
      <button
        v-if="!isLoading"
        @click="saveCategories"
        :disabled="isSaving"
        class="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all"
        :class="isSaving
          ? 'bg-primary-300 dark:bg-primary-800 cursor-not-allowed'
          : 'bg-primary-500 hover:bg-primary-600 active:scale-[0.98]'"
      >
        {{ isSaving ? t('common.loading') : t('common.save') }}
      </button>

      <!-- Reset Hint -->
      <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
        {{ t('vocabulary.settings.reset_hint') }}
      </p>
    </div>
  </div>
</template>
