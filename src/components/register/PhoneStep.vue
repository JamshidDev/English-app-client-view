<script setup lang="ts">
import { ref } from 'vue'
import { useTelegram } from '@/composables/useTelegram'

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:telegramId', value: string): void
  (e: 'next'): void
}>()

const { tg, telegramId, hapticImpact, hapticNotification } = useTelegram()

const isLoading = ref(false)

const features = [
  {
    icon: 'book',
    title: "1000+ so'zlar",
    description: "Kundalik va professional lug'at",
    color: '#58cc02',
    shadow: '#3ea000'
  },
  {
    icon: 'target',
    title: 'Interaktiv testlar',
    description: "Bilimingizni sinab ko'ring",
    color: '#1cb0f6',
    shadow: '#1290d0'
  },
  {
    icon: 'lesson',
    title: "50+ darsliklar",
    description: "Boshlang'ichdan yuqori darajagacha",
    color: '#ce82ff',
    shadow: '#9b50e0'
  },
  {
    icon: 'fire',
    title: 'Kunlik mashqlar',
    description: "Har kuni yangi so'z va test",
    color: '#ff9600',
    shadow: '#d07a00'
  }
]

const requestPhoneNumber = async () => {
  isLoading.value = true
  hapticImpact('medium')

  if (tg.value) {
    try {
      const user = tg.value.initDataUnsafe?.user

      if (user) {
        emit('update:telegramId', user.id.toString())
        emit('update:modelValue', `+998${user.id.toString().slice(-9).padStart(9, '0')}`)
        hapticNotification('success')
        emit('next')
      } else {
        emit('update:telegramId', telegramId.value || 'demo_user')
        emit('update:modelValue', '+998901234567')
        emit('next')
      }
    } catch (error) {
      console.error('Error getting phone:', error)
      emit('update:telegramId', telegramId.value || 'demo_user')
      emit('update:modelValue', '+998901234567')
      emit('next')
    }
  } else {
    emit('update:telegramId', 'demo_user')
    emit('update:modelValue', '+998901234567')
    hapticNotification('success')
    emit('next')
  }

  isLoading.value = false
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Top Section with Logo -->
    <div class="flex-shrink-0 pt-8 pb-6 text-center px-6">
      <div class="w-20 h-20 mx-auto mb-4 bg-[#58cc02] rounded-2xl flex items-center justify-center shadow-lg">
        <span class="text-4xl">🇬🇧</span>
      </div>
      <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">English Booster Pro</h1>
      <p class="text-gray-400 dark:text-gray-500 text-sm font-semibold">
        Ingliz tilini tez va samarali o'rganing!
      </p>
    </div>

    <!-- Features -->
    <div class="flex-1 px-4">
      <div class="grid grid-cols-2 gap-2.5">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="relative"
        >
          <div
            class="absolute inset-x-0 bottom-0 h-[calc(100%-2px)] rounded-2xl"
            :style="{ backgroundColor: feature.shadow }"
          />
          <div
            class="relative rounded-2xl p-3.5 -translate-y-[3px] text-center dark:shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            :style="{ backgroundColor: feature.color }"
          >
            <div class="w-10 h-10 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-2">
              <!-- Book -->
              <svg v-if="feature.icon === 'book'" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              <!-- Target -->
              <svg v-else-if="feature.icon === 'target'" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <!-- Lesson -->
              <svg v-else-if="feature.icon === 'lesson'" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
              <!-- Fire -->
              <svg v-else-if="feature.icon === 'fire'" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
            </div>
            <h3 class="text-xs font-bold text-white leading-tight">
              {{ feature.title }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-2 mt-4">
        <div class="text-center p-2.5 bg-gray-50 dark:bg-[#1a2730] rounded-xl">
          <p class="text-base font-extrabold text-[#58cc02]">10K+</p>
          <p class="text-[10px] font-semibold text-gray-400">Foydalanuvchi</p>
        </div>
        <div class="text-center p-2.5 bg-gray-50 dark:bg-[#1a2730] rounded-xl">
          <p class="text-base font-extrabold text-[#1cb0f6]">4.9</p>
          <p class="text-[10px] font-semibold text-gray-400">Reyting</p>
        </div>
        <div class="text-center p-2.5 bg-gray-50 dark:bg-[#1a2730] rounded-xl">
          <p class="text-base font-extrabold text-[#ce82ff]">100%</p>
          <p class="text-[10px] font-semibold text-gray-400">Bepul</p>
        </div>
      </div>
    </div>

    <!-- Action Button (3D Duolingo) -->
    <div class="px-4 pb-6 pt-4">
      <div class="relative" @click="requestPhoneNumber">
        <div class="absolute inset-x-0 bottom-0 h-[calc(100%-3px)] rounded-2xl bg-[#3ea000]" />
        <button
          :disabled="isLoading"
          class="relative w-full rounded-2xl bg-[#58cc02] py-4 -translate-y-[5px] active:translate-y-0 transition-transform text-white font-extrabold text-base flex items-center justify-center gap-2 dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
        >
          <svg v-if="!isLoading" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.59L6 14l1.41-1.41 3.18 3.17 6-6L18 11.17l-7.41 7.42z"/>
          </svg>
          <span v-if="isLoading">Yuklanmoqda...</span>
          <span v-else>Boshlash</span>
        </button>
      </div>

      <p class="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-3">
        Davom etish orqali <span class="text-[#58cc02] font-semibold">Foydalanish shartlari</span>ga rozilik bildirasiz
      </p>
    </div>
  </div>
</template>
