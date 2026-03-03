<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVocabStore } from '@/stores/useVocabStore'
import { useTelegram } from '@/composables/useTelegram'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useI18n()
const router = useRouter()
const vocabStore = useVocabStore()
const { hapticImpact } = useTelegram()
const { currentLanguage } = useLanguage()

onMounted(async () => {
  vocabStore.initVocab()
  await vocabStore.fetchCategories()

  // Birinchi category tanlanganda collectionlarni yuklash
  if (vocabStore.selectedCategoryId) {
    await vocabStore.fetchCollections(vocabStore.selectedCategoryId)
  }
})

const handleSelectCategory = async (categoryId: string) => {
  hapticImpact('light')
  await vocabStore.selectCategory(categoryId)
}

const openCollection = (collectionId: string) => {
  hapticImpact('medium')
  router.push(`/vocabulary/set/${collectionId}`)
}

const openSettings = () => {
  hapticImpact('light')
  router.push('/vocabulary/settings')
}

const getName = (name: { uz: string; ru: string }) => {
  if (currentLanguage.value === 'ru') return name.ru
  return name.uz
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#111111] border-b border-transparent dark:border-white/5 px-4 pt-4 sticky top-0 z-10">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ t('vocabulary.title') }}
        </h1>
        <button
          @click="openSettings"
          class="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <!-- Category Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <!-- Loading skeleton -->
        <template v-if="vocabStore.isLoadingCategories">
          <div v-for="i in 4" :key="i" class="h-9 w-24 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse flex-shrink-0" />
        </template>

        <!-- Loaded tabs -->
        <template v-else>
          <button
            v-for="category in vocabStore.categories"
            :key="category.id"
            @click="handleSelectCategory(category.id)"
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
            :class="[
              vocabStore.selectedCategoryId === category.id
                ? 'bg-primary-500 text-white shadow-md border-primary-500'
                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-white/10'
            ]"
          >
            {{ getName(category.name) }}
          </button>
        </template>
      </div>
    </div>

    <!-- Collections List -->
    <div class="px-4 py-4 space-y-3">
      <!-- Loading -->
      <template v-if="vocabStore.isLoadingCollections">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-[#111111] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/5 animate-pulse">
          <div class="flex items-center gap-2.5 mb-2">
            <div class="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-lg" />
            <div class="flex-1">
              <div class="h-3.5 bg-gray-200 dark:bg-white/10 rounded w-2/3 mb-1.5" />
              <div class="h-2.5 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
            </div>
          </div>
          <div class="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-2" />
        </div>
      </template>

      <!-- Collections -->
      <template v-else>
        <div
          v-for="collection in vocabStore.collections"
          :key="collection.id"
          @click="openCollection(collection.id)"
          class="bg-white dark:bg-[#111111] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/5 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-500/10 rounded-lg flex items-center justify-center">
                <span class="text-lg">📚</span>
              </div>
              <div>
                <h3 class="font-medium text-sm text-gray-900 dark:text-white">
                  {{ getName(collection.name) }}
                </h3>
                <p class="text-xs text-gray-400 dark:text-gray-600">
                  {{ collection.wordCount }} {{ t('vocabulary.words_count') }}
                </p>
              </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <!-- Progress Bar -->
          <div class="mt-2">
            <div class="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              <span>{{ t('vocabulary.progress') }}</span>
              <span>{{ vocabStore.getLearnedWordsCount(collection.id) }}/{{ collection.wordCount }}</span>
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-500 rounded-full transition-all"
                :style="{ width: `${collection.wordCount > 0 ? (vocabStore.getLearnedWordsCount(collection.id) / collection.wordCount) * 100 : 0}%` }"
              />
            </div>
          </div>
        </div>

        <div v-if="vocabStore.collections.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
          {{ t('common.noData') }}
        </div>
      </template>
    </div>
  </div>
</template>
