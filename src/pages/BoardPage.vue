<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import BoardHeader from '@/components/board/BoardHeader.vue'

const authStore = useAuthStore()

const activeTab = ref<'weekly' | 'daily' | 'monthly'>('daily')

// Mock leaderboard data
const weeklyData = [
  { id: 1, name: 'Sardor', score: 342, level: 'Advanced', avatar: 'S' },
  { id: 2, name: 'Madina', score: 298, level: 'Advanced', avatar: 'M' },
  { id: 3, name: 'Bobur', score: 256, level: 'Intermediate', avatar: 'B' },
  { id: 4, name: 'Nilufar', score: 215, level: 'Intermediate', avatar: 'N' },
  { id: 5, name: 'Jasur', score: 189, level: 'Intermediate', avatar: 'J' },
  { id: 6, name: 'Dilfuza', score: 167, level: 'Intermediate', avatar: 'D' },
  { id: 7, name: 'Otabek', score: 145, level: 'Pre-Intermediate', avatar: 'O' },
  { id: 8, name: 'Zarina', score: 132, level: 'Pre-Intermediate', avatar: 'Z' },
  { id: 9, name: 'Bekzod', score: 118, level: 'Pre-Intermediate', avatar: 'B' },
  { id: 10, name: 'Sevara', score: 98, level: 'Elementary', avatar: 'S' },
  { id: 11, name: 'Aziz', score: 87, level: 'Elementary', avatar: 'A' },
  { id: 12, name: 'Gulnora', score: 76, level: 'Elementary', avatar: 'G' },
  { id: 13, name: 'Rustam', score: 65, level: 'Beginner', avatar: 'R' },
  { id: 14, name: 'Kamola', score: 58, level: 'Beginner', avatar: 'K' },
  { id: 15, name: 'Sherzod', score: 52, level: 'Beginner', avatar: 'S' },
  { id: 16, name: 'Fotima', score: 45, level: 'Beginner', avatar: 'F' },
  { id: 17, name: 'Alisher', score: 38, level: 'Beginner', avatar: 'A' },
  { id: 18, name: 'Dilnoza', score: 32, level: 'Beginner', avatar: 'D' },
  { id: 19, name: 'Mansur', score: 25, level: 'Beginner', avatar: 'M' },
  { id: 20, name: 'Sabohat', score: 18, level: 'Beginner', avatar: 'S' },
]

const dailyData = [
  { id: 1, name: 'Madina', score: 48, level: 'Advanced', avatar: 'M' },
  { id: 2, name: 'Sardor', score: 42, level: 'Advanced', avatar: 'S' },
  { id: 3, name: 'Jasur', score: 35, level: 'Intermediate', avatar: 'J' },
  { id: 4, name: 'Nilufar', score: 28, level: 'Intermediate', avatar: 'N' },
  { id: 5, name: 'Bobur', score: 24, level: 'Intermediate', avatar: 'B' },
  { id: 6, name: 'Zarina', score: 20, level: 'Pre-Intermediate', avatar: 'Z' },
  { id: 7, name: 'Otabek', score: 18, level: 'Pre-Intermediate', avatar: 'O' },
  { id: 8, name: 'Dilfuza', score: 15, level: 'Intermediate', avatar: 'D' },
  { id: 9, name: 'Sevara', score: 12, level: 'Elementary', avatar: 'S' },
  { id: 10, name: 'Bekzod', score: 8, level: 'Elementary', avatar: 'B' },
  { id: 11, name: 'Aziz', score: 7, level: 'Elementary', avatar: 'A' },
  { id: 12, name: 'Gulnora', score: 6, level: 'Elementary', avatar: 'G' },
  { id: 13, name: 'Rustam', score: 5, level: 'Beginner', avatar: 'R' },
  { id: 14, name: 'Kamola', score: 5, level: 'Beginner', avatar: 'K' },
  { id: 15, name: 'Sherzod', score: 4, level: 'Beginner', avatar: 'S' },
  { id: 16, name: 'Fotima', score: 3, level: 'Beginner', avatar: 'F' },
  { id: 17, name: 'Alisher', score: 3, level: 'Beginner', avatar: 'A' },
  { id: 18, name: 'Dilnoza', score: 2, level: 'Beginner', avatar: 'D' },
  { id: 19, name: 'Mansur', score: 2, level: 'Beginner', avatar: 'M' },
  { id: 20, name: 'Sabohat', score: 1, level: 'Beginner', avatar: 'S' },
]

const monthlyData = [
  { id: 1, name: 'Sardor', score: 1420, level: 'Advanced', avatar: 'S' },
  { id: 2, name: 'Madina', score: 1180, level: 'Advanced', avatar: 'M' },
  { id: 3, name: 'Nilufar', score: 980, level: 'Intermediate', avatar: 'N' },
  { id: 4, name: 'Bobur', score: 890, level: 'Intermediate', avatar: 'B' },
  { id: 5, name: 'Jasur', score: 756, level: 'Intermediate', avatar: 'J' },
  { id: 6, name: 'Dilfuza', score: 645, level: 'Intermediate', avatar: 'D' },
  { id: 7, name: 'Otabek', score: 534, level: 'Pre-Intermediate', avatar: 'O' },
  { id: 8, name: 'Zarina', score: 487, level: 'Pre-Intermediate', avatar: 'Z' },
  { id: 9, name: 'Bekzod', score: 398, level: 'Elementary', avatar: 'B' },
  { id: 10, name: 'Sevara', score: 312, level: 'Elementary', avatar: 'S' },
  { id: 11, name: 'Aziz', score: 278, level: 'Elementary', avatar: 'A' },
  { id: 12, name: 'Gulnora', score: 245, level: 'Elementary', avatar: 'G' },
  { id: 13, name: 'Rustam', score: 210, level: 'Beginner', avatar: 'R' },
  { id: 14, name: 'Kamola', score: 186, level: 'Beginner', avatar: 'K' },
  { id: 15, name: 'Sherzod', score: 164, level: 'Beginner', avatar: 'S' },
  { id: 16, name: 'Fotima', score: 142, level: 'Beginner', avatar: 'F' },
  { id: 17, name: 'Alisher', score: 118, level: 'Beginner', avatar: 'A' },
  { id: 18, name: 'Dilnoza', score: 95, level: 'Beginner', avatar: 'D' },
  { id: 19, name: 'Mansur', score: 72, level: 'Beginner', avatar: 'M' },
  { id: 20, name: 'Sabohat', score: 48, level: 'Beginner', avatar: 'S' },
]

const leaderboard = computed(() => {
  if (activeTab.value === 'daily') return dailyData
  if (activeTab.value === 'monthly') return monthlyData
  return weeklyData
})

const top3 = computed(() => leaderboard.value.slice(0, 3))
const rest = computed(() => leaderboard.value.slice(3))

// Current user mock
const currentUserId = 4
const currentUserRank = computed(() => {
  const idx = leaderboard.value.findIndex(p => p.id === currentUserId)
  return idx >= 0 ? idx + 1 : 11
})
</script>

<template>
  <div class="bg-[#f7f7f7] dark:bg-[#131f24] min-h-screen pb-20">

    <!-- Fixed Header -->
    <BoardHeader v-model:active-tab="activeTab" />

    <!-- Top 3 Podium -->
    <div class="px-4 pt-6">
      <div class="flex items-end justify-center gap-2">
        <!-- 2nd Place -->
        <div class="flex flex-col items-center w-[80px]">
          <!-- Avatar -->
          <div class="w-14 h-14 rounded-full bg-[#1cb0f6] flex items-center justify-center border-[3px] border-white/40 ring-3 ring-[#1cb0f6]/30 shadow-[0_4px_12px_rgba(28,176,246,0.3)] mb-2">
            <span class="text-sm font-extrabold text-white">{{ top3[1]?.avatar }}</span>
          </div>
          <p class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-full">{{ top3[1]?.name }}</p>
          <p class="text-xs font-extrabold text-[#1cb0f6] mt-0.5">{{ top3[1]?.score }}</p>
          <!-- Podium bar -->
          <div class="relative w-[80px] mt-2">
            <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-t-xl bg-[#1290d0]" />
            <div class="relative bg-[#1cb0f6] rounded-t-xl h-16 flex items-center justify-center -translate-y-[3px] dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
              <span class="text-white font-extrabold text-3xl">2</span>
            </div>
          </div>
        </div>

        <!-- 1st Place -->
        <div class="flex flex-col items-center w-[80px]">
          <!-- Crown + Avatar -->
          <div class="relative mb-2">
            <!-- Crown SVG -->
            <svg class="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-10 drop-shadow-lg" viewBox="0 0 64 64" fill="none">
              <path d="M8 48L4 20L18 32L32 12L46 32L60 20L56 48H8Z" fill="#FFD700" stroke="#E6B800" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="4" cy="18" r="4" fill="#FFD700" stroke="#E6B800" stroke-width="1.5"/>
              <circle cx="32" cy="10" r="4" fill="#FFD700" stroke="#E6B800" stroke-width="1.5"/>
              <circle cx="60" cy="18" r="4" fill="#FFD700" stroke="#E6B800" stroke-width="1.5"/>
              <rect x="8" y="46" width="48" height="6" rx="2" fill="#E6B800"/>
              <circle cx="20" cy="49" r="2" fill="#FF6B6B"/>
              <circle cx="32" cy="49" r="2" fill="#58cc02"/>
              <circle cx="44" cy="49" r="2" fill="#1cb0f6"/>
            </svg>
            <div class="w-16 h-16 rounded-full bg-[#ff9600] flex items-center justify-center border-4 border-white/40 ring-4 ring-[#ff9600]/30 shadow-[0_4px_16px_rgba(255,150,0,0.4)]">
              <span class="text-base font-extrabold text-white">{{ top3[0]?.avatar }}</span>
            </div>
          </div>
          <p class="text-sm font-extrabold text-gray-900 dark:text-white truncate max-w-full">{{ top3[0]?.name }}</p>
          <p class="text-xs font-extrabold text-[#ff9600] mt-0.5">{{ top3[0]?.score }}</p>
          <!-- Podium bar -->
          <div class="relative w-[80px] mt-2">
            <div class="absolute inset-x-0 bottom-0 h-[calc(100%-4px)] rounded-t-xl bg-[#d07a00]" />
            <div class="relative bg-[#ff9600] rounded-t-xl h-24 flex items-center justify-center -translate-y-[4px] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <span class="text-white font-extrabold text-4xl">1</span>
            </div>
          </div>
        </div>

        <!-- 3rd Place -->
        <div class="flex flex-col items-center w-[80px]">
          <!-- Avatar -->
          <div class="w-14 h-14 rounded-full bg-[#58cc02] flex items-center justify-center border-[3px] border-white/40 ring-3 ring-[#58cc02]/30 shadow-[0_4px_12px_rgba(88,204,2,0.3)] mb-2">
            <span class="text-sm font-extrabold text-white">{{ top3[2]?.avatar }}</span>
          </div>
          <p class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-full">{{ top3[2]?.name }}</p>
          <p class="text-xs font-extrabold text-[#58cc02] mt-0.5">{{ top3[2]?.score }}</p>
          <!-- Podium bar -->
          <div class="relative w-[80px] mt-2">
            <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-t-xl bg-[#3ea000]" />
            <div class="relative bg-[#58cc02] rounded-t-xl h-12 flex items-center justify-center -translate-y-[3px] dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
              <span class="text-white font-extrabold text-3xl">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rest of Leaderboard -->
    <div class="px-4 space-y-3">
        <div
          v-for="(player, index) in rest"
          :key="player.id"
          class="flex items-center gap-3 px-4 py-2 rounded-2xl border"
          :class="[
            player.id === currentUserId
              ? 'bg-[#e5f8d4] dark:bg-[#58cc02]/10 border-[#58cc02]/30'
              : 'bg-white dark:bg-[#1a2730] border-gray-100 dark:border-[#314158]/50'
          ]"
        >
          <!-- Rank -->
          <div class="w-8 text-center">
            <span class="text-base font-extrabold" :class="player.id === currentUserId ? 'text-[#58cc02]' : 'text-gray-900 dark:text-white'">
              {{ index + 4 }}
            </span>
          </div>

          <!-- Avatar -->
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-2"
            :class="player.id === currentUserId ? 'bg-[#58cc02] border-[#58cc02]' : 'bg-gray-200 dark:bg-[#243642] border-gray-300 dark:border-[#314158]'"
          >
            <span
              class="text-xs font-extrabold"
              :class="player.id === currentUserId ? 'text-white' : 'text-gray-500 dark:text-gray-400'"
            >
              {{ player.avatar }}
            </span>
          </div>

          <!-- Name & Level -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold truncate" :class="player.id === currentUserId ? 'text-[#58cc02]' : 'text-gray-900 dark:text-white'">
              {{ player.name }}
              <span v-if="player.id === currentUserId" class="text-[10px] font-semibold ml-1">(Siz)</span>
            </p>
            <p class="text-[11px] font-semibold text-gray-400 dark:text-gray-500">{{ player.level }}</p>
          </div>

          <!-- Score -->
          <div class="text-right">
            <p class="text-base font-extrabold text-[#58cc02] leading-none">{{ player.score }}</p>
            <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">Ball</p>
          </div>
        </div>
    </div>

    <!-- Your Position Card -->
    <div class="px-4 mt-4">
      <div class="relative">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl bg-[#3ea000]" />
        <div class="relative bg-[#58cc02] rounded-2xl p-4 -translate-y-1 dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span class="text-xs font-extrabold text-white">
                  {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                </span>
              </div>
              <div>
                <p class="text-white text-sm font-extrabold">Sizning o'rningiz</p>
                <p class="text-white/70 text-xs font-bold">{{ authStore.userStats.wordsLearned }} so'z o'rganilgan</p>
              </div>
            </div>
            <div class="bg-white/20 rounded-xl px-3 py-2 text-center">
              <p class="text-white text-xl font-extrabold leading-none">#{{ currentUserRank }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
