<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'
import { activityApi } from '@/api/endpoints/activity'

const router = useRouter()
const { showBackButton, hideBackButton, onBackButtonClick, offBackButtonClick } = useTelegram()

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const activeDays = ref<Set<string>>(new Set())
const totalDays = ref(0)
const isLoading = ref(false)

const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']
const weekDays = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']

const monthLabel = computed(() => `${monthNames[currentMonth.value - 1]} ${currentYear.value}`)

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  let startWeekDay = firstDay.getDay() - 1
  if (startWeekDay < 0) startWeekDay = 6

  const days: { day: number | null; date: string; isActive: boolean; isToday: boolean }[] = []

  for (let i = 0; i < startWeekDay; i++) {
    days.push({ day: null, date: '', isActive: false, isToday: false })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && d === today.getDate()
    days.push({
      day: d,
      date: dateStr,
      isActive: activeDays.value.has(dateStr),
      isToday,
    })
  }

  return days
})

const fetchActivity = async () => {
  isLoading.value = true
  try {
    const res = await activityApi.getActiveDays(currentYear.value, currentMonth.value)
    activeDays.value = new Set(res.data.days)
    totalDays.value = res.data.total
  } catch {
    activeDays.value = new Set()
  } finally {
    isLoading.value = false
  }
}

const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

watch([currentYear, currentMonth], () => fetchActivity())

const handleBack = () => router.back()

onMounted(() => {
  showBackButton()
  onBackButtonClick(handleBack)
  fetchActivity()
})

onUnmounted(() => {
  hideBackButton()
  offBackButtonClick(handleBack)
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#131f24]">
    <!-- Header -->
    <div class="bg-white dark:bg-[#1a2730] border-b border-gray-200 dark:border-[#314158] px-4 pt-4 pb-3">
      <div class="flex items-center gap-2">
        <button @click="handleBack" class="p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 class="text-sm font-extrabold text-gray-900 dark:text-white uppercase">Faollik</h1>
      </div>
    </div>

    <div class="px-4 py-5">
      <!-- Total stat -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="relative">
          <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#e65100]" />
          <div class="relative bg-[#ff9600] rounded-2xl px-6 py-4 -translate-y-1 flex items-center gap-3">
            <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            <div>
              <span class="text-white text-3xl font-black">{{ totalDays }}</span>
              <p class="text-white/80 text-xs font-bold">active kun</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Month navigation -->
      <div class="flex items-center justify-between mb-4">
        <button @click="prevMonth" class="p-2 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 class="text-base font-extrabold text-gray-900 dark:text-white">{{ monthLabel }}</h2>
        <button @click="nextMonth" class="p-2 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <!-- Calendar -->
      <div class="relative">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-gray-200 dark:bg-[#243642]" />
        <div class="relative bg-white dark:bg-[#1a2730] rounded-2xl p-4 -translate-y-1 border border-gray-100 dark:border-[#314158]">
          <!-- Week days header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="wd in weekDays" :key="wd" class="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase py-1">
              {{ wd }}
            </div>
          </div>

          <!-- Days grid -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(cell, i) in calendarDays"
              :key="i"
              class="aspect-square flex items-center justify-center rounded-xl text-sm font-bold relative"
              :class="[
                !cell.day ? '' :
                cell.isActive ? 'bg-[#ff9600]/15 text-[#ff9600]' :
                cell.isToday ? 'bg-[#58cc02]/10 text-[#58cc02]' :
                'text-gray-600 dark:text-gray-400'
              ]"
            >
              <span v-if="cell.day">{{ cell.day }}</span>
              <!-- Fire icon for active days -->
              <svg
                v-if="cell.isActive"
                class="absolute -top-0.5 -right-0.5 w-3 h-3 text-[#ff9600]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center justify-center gap-4 mt-4">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-[#ff9600]/15 flex items-center justify-center">
            <svg class="w-2 h-2 text-[#ff9600]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            </svg>
          </div>
          <span class="text-[10px] font-bold text-gray-400">Active kun</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-[#58cc02]/10"></div>
          <span class="text-[10px] font-bold text-gray-400">Bugun</span>
        </div>
      </div>
    </div>
  </div>
</template>
