<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'
import { notificationsApi } from '@/api/endpoints/notifications'

const router = useRouter()
const { showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()

const items = ref<any[]>([])
const isLoading = ref(false)

const handleBack = () => router.back()

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Hozir'
  if (mins < 60) return `${mins} daqiqa oldin`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} kun oldin`
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const typeIcon = (type: string) => {
  if (type === 'success') return 'M4.5 12.75l6 6 9-13.5'
  if (type === 'warning') return 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
  return 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
}

const typeColor = (type: string) => {
  if (type === 'success') return 'text-[#58cc02] bg-[#58cc02]/10'
  if (type === 'warning') return 'text-[#ffc800] bg-[#ffc800]/10'
  return 'text-[#1cb0f6] bg-[#1cb0f6]/10'
}

const markRead = async (id: string, index: number) => {
  if (items.value[index].readAt) return
  try {
    await notificationsApi.markRead(id)
    items.value[index].readAt = new Date().toISOString()
  } catch {}
}

const markAllRead = async () => {
  try {
    await notificationsApi.markAllRead()
    items.value.forEach(i => { if (!i.readAt) i.readAt = new Date().toISOString() })
  } catch {}
}

onMounted(async () => {
  showBackButton()
  onBackButtonClick(handleBack)
  isLoading.value = true
  try {
    const res = await notificationsApi.getAll(1, 50)
    items.value = res.data.data || []
  } catch {
    items.value = []
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
  <div class="min-h-screen bg-white dark:bg-[#131f24]">
    <div class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 pt-4 pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button @click="handleBack" class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">Xabarnomalar</h1>
        </div>
        <button
          v-if="items.some(i => !i.readAt)"
          @click="markAllRead"
          class="text-xs font-bold text-[#1cb0f6]"
        >
          Barchasini o'qish
        </button>
      </div>
    </div>

    <div class="px-4 py-3 space-y-2">
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="h-16 bg-gray-100 dark:bg-[#243642] rounded-2xl animate-pulse" />
      </template>

      <template v-else-if="items.length > 0">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          @click="markRead(item.id, index)"
          class="relative cursor-pointer"
        >
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
          <div
            class="relative rounded-2xl px-4 py-3 -translate-y-1 border border-gray-100 dark:border-[#314158] flex gap-3"
            :class="item.readAt ? 'bg-white dark:bg-[#1a2730]' : 'bg-[#f0f9ff] dark:bg-[#1a2730]'"
          >
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" :class="typeColor(item.type)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" :d="typeIcon(item.type)" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate">{{ item.title }}</h3>
                <div v-if="!item.readAt" class="w-2 h-2 rounded-full bg-[#1cb0f6] flex-shrink-0" />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{{ item.message }}</p>
              <p class="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center py-20 px-6">
        <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#243642] flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
        <p class="text-sm font-bold text-gray-400 dark:text-gray-500">Xabarnomalar yo'q</p>
      </div>
    </div>
  </div>
</template>
