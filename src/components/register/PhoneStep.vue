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
    icon: '📚',
    title: "1000+ so'zlar",
    description: "Kundalik va professional lug'at"
  },
  {
    icon: '🎯',
    title: 'Interaktiv testlar',
    description: "Bilimingizni sinab ko'ring"
  },
  {
    icon: '📖',
    title: "50+ darsliklar",
    description: "Boshlang'ichdan yuqori darajagacha"
  },
  {
    icon: '🔥',
    title: 'Kunlik mashqlar',
    description: "Har kuni yangi so'z va test"
  }
]

const requestPhoneNumber = async () => {
  isLoading.value = true
  hapticImpact('medium')

  // Telegram WebApp orqali telefon raqamni olish
  if (tg.value) {
    try {
      // Telegram Mini App da requestContact ishlatish
      // Hozircha demo uchun Telegram user ma'lumotlaridan foydalanamiz
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
    // Browser test uchun
    emit('update:telegramId', 'demo_user')
    emit('update:modelValue', '+998901234567')
    hapticNotification('success')
    emit('next')
  }

  isLoading.value = false
}
</script>

<template>
  <div class="flex flex-col h-full bg-gradient-to-b from-primary-500 to-primary-600">
    <!-- Top Section with Logo -->
    <div class="flex-shrink-0 pt-8 pb-6 text-center text-white">
      <div class="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-lg">
        <span class="text-4xl">🇬🇧</span>
      </div>
      <h1 class="text-2xl font-bold mb-2">English Booster Pro</h1>
      <p class="text-white/80 text-sm px-8">
        Ingliz tilini tez va samarali o'rganing!
      </p>
    </div>

    <!-- Features Card -->
    <div class="flex-1 bg-white dark:bg-gray-900 rounded-t-3xl px-4 pt-6 pb-4 flex flex-col">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Ilova imkoniyatlari
      </h2>

      <!-- 2x2 Grid Features -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center"
        >
          <div class="w-10 h-10 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-2">
            <span class="text-xl">{{ feature.icon }}</span>
          </div>
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
            {{ feature.title }}
          </h3>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-base font-bold text-green-600 dark:text-green-400">10K+</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">Foydalanuvchi</p>
        </div>
        <div class="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-base font-bold text-blue-600 dark:text-blue-400">4.9</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">Reyting</p>
        </div>
        <div class="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p class="text-base font-bold text-purple-600 dark:text-purple-400">100%</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">Bepul</p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-auto">
        <van-button
          type="primary"
          block
          round
          size="large"
          :loading="isLoading"
          loading-text="Yuklanmoqda..."
          class="!bg-primary-500 !border-primary-500 shadow-lg shadow-primary-500/30"
          @click="requestPhoneNumber"
        >
          <div class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 16.59L6 14l1.41-1.41 3.18 3.17 6-6L18 11.17l-7.41 7.42z"/>
            </svg>
            <span>Boshlash</span>
          </div>
        </van-button>

        <p class="text-center text-[10px] text-gray-400 dark:text-gray-500 mt-3">
          Davom etish orqali <span class="text-primary-500">Foydalanish shartlari</span>ga rozilik bildirasiz
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
}
</style>
