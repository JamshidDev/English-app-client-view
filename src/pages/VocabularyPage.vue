<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
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

  // Agar categorylar allaqachon yuklangan bo'lsa qayta yuklamaslik
  if (vocabStore.categories.length === 0) {
    try {
      await vocabStore.fetchCategories()
    } catch {}
  }

  // Agar tanlangan category bor va collectionlar yo'q bo'lsa yuklash
  if (vocabStore.selectedCategoryId && vocabStore.collections.length === 0) {
    try {
      await vocabStore.fetchCollections(vocabStore.selectedCategoryId)
    } catch {
      vocabStore.isLoadingCollections = false
    }
  } else if (!vocabStore.selectedCategoryId) {
    vocabStore.isLoadingCollections = false
  }
})

const handleSelectCategory = async (categoryId: string) => {
  hapticImpact('light')
  await vocabStore.selectCategory(categoryId)
  scrollActiveTabToCenter()
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

// Tab scroll to center
const tabsContainer = ref<HTMLElement | null>(null)

const scrollActiveTabToCenter = () => {
  nextTick(() => {
    if (!tabsContainer.value) return
    const activeBtn = tabsContainer.value.querySelector('.tab-active') as HTMLElement
    if (!activeBtn) return
    const container = tabsContainer.value
    const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  })
}

// Swipe logic
const touchStartX = ref(0)
const touchEndX = ref(0)

const currentCategoryIndex = computed(() => {
  return vocabStore.categories.findIndex(c => c.id === vocabStore.selectedCategoryId)
})

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX
  const diff = touchStartX.value - touchEndX.value
  const minSwipe = 50

  if (Math.abs(diff) < minSwipe) return

  const categories = vocabStore.categories
  if (!categories.length) return

  const currentIdx = currentCategoryIndex.value

  if (diff > 0 && currentIdx < categories.length - 1) {
    // Swipe left → next category
    handleSelectCategory(categories[currentIdx + 1].id)
  } else if (diff < 0 && currentIdx > 0) {
    // Swipe right → previous category
    handleSelectCategory(categories[currentIdx - 1].id)
  }
}

</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#131f24]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 pt-4 sticky top-0 z-10">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <button
            @click="router.back()"
            class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">
            {{ t('vocabulary.title') }}
          </h1>
        </div>
        <!-- Category settings button -->
        <button @click="openSettings" class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center active:scale-95 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        </button>
      </div>

      <!-- Category Tabs -->
      <div ref="tabsContainer" class="flex gap-1.5 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
        <!-- Loading skeleton -->
        <template v-if="vocabStore.isLoadingCategories">
          <div v-for="i in 4" :key="i" class="h-8 w-24 bg-gray-200 dark:bg-[#243642] rounded-full animate-pulse flex-shrink-0" />
        </template>

        <!-- Loaded tabs -->
        <template v-else>
          <button
            v-for="category in vocabStore.categories"
            :key="category.id"
            @click="handleSelectCategory(category.id)"
            class="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase whitespace-nowrap transition-all duration-200 border-2 flex-shrink-0"
            :class="[
              vocabStore.selectedCategoryId === category.id
                ? 'bg-[#58cc02]/10 text-[#58cc02] border-[#58cc02] tab-active'
                : 'bg-gray-100 dark:bg-[#243642] text-gray-500 dark:text-gray-400 border-transparent'
            ]"
          >
            {{ getName(category.name) }}
          </button>
        </template>
      </div>
    </div>

    <!-- Collections List -->
    <div class="px-4 py-3 space-y-2" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <!-- Loading -->
      <template v-if="vocabStore.isLoadingCollections">
        <div v-for="i in 8" :key="i" class="relative mb-2">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
          <div class="relative rounded-2xl bg-gray-100 dark:bg-[#1a2730] px-3.5 py-3 -translate-y-1 animate-pulse border border-gray-100 dark:border-[#314158]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-gray-200 dark:bg-[#243642] rounded-lg" />
                <div>
                  <div class="h-3.5 bg-gray-200 dark:bg-[#243642] rounded-lg w-24 mb-1.5" />
                  <div class="h-2.5 bg-gray-200 dark:bg-[#243642] rounded-lg w-14" />
                </div>
              </div>
              <div class="w-4 h-4 bg-gray-200 dark:bg-[#243642] rounded" />
            </div>
            <div class="mt-2 flex items-center gap-2.5">
              <div class="flex-1 h-2 bg-gray-200 dark:bg-[#243642] rounded-full" />
              <div class="h-2 bg-gray-200 dark:bg-[#243642] rounded w-7" />
            </div>
          </div>
        </div>
      </template>

      <!-- Collections -->
      <template v-else>
        <div
          v-for="(collection, index) in vocabStore.collections"
          :key="collection.id"
          @click="openCollection(collection.id)"
          class="collection-card relative cursor-pointer mb-2 animate-fade-in"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <!-- 3D bottom layer -->
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />

          <!-- Main card -->
          <div class="relative rounded-2xl bg-white dark:bg-[#1a2730] px-3.5 py-3 -translate-y-1 active:translate-y-0 transition-transform border border-gray-100 dark:border-[#314158] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-[#58cc02]/10 dark:bg-[#58cc02]/15 rounded-lg flex items-center justify-center">
                  <!-- Book icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-sm text-gray-900 dark:text-white">
                    {{ getName(collection.name) }}
                  </h3>
                  <div class="flex items-center gap-1.5">
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ collection.wordCount }} {{ t('vocabulary.words_count') }}
                    </p>
                    <div class="flex items-center gap-0.5">
                      <svg v-for="star in (['vocabulary', 'writing', 'quiz'] as const)" :key="star" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" :class="collection.stars?.[star] ? 'text-[#ffc800]' : 'text-gray-200 dark:text-gray-600'" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1.5">
                <span v-if="collection.isNew" class="px-1.5 py-0.5 text-[10px] font-bold bg-[#58cc02] text-white rounded-md uppercase tracking-wide">NEW</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="vocabStore.collections.length === 0" class="flex flex-col items-center justify-center py-20 px-6">
          <div class="relative mb-5">
            <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
            <div class="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#1a2730] -translate-y-[3px] flex items-center justify-center border border-gray-100 dark:border-[#314158]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-bold text-gray-400 dark:text-gray-500">{{ t('vocabulary.no_collections') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>
