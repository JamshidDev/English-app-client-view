<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Slide {
  title: string
  subtitle: string
  icon: string
  cardBg: string
  cardBgDark: string
  accentColor: string
  textColor: string
  subColor: string
}

const slides: Slide[] = [
  {
    title: 'Gramatika',
    subtitle: 'Tez orada',
    icon: 'book',
    cardBg: '#f3f0ff',
    cardBgDark: '#1e1535',
    accentColor: '#7c3aed',
    textColor: 'text-purple-700 dark:text-purple-300',
    subColor: 'text-purple-500 dark:text-purple-400',
  },
  {
    title: 'IELTS',
    subtitle: 'Tez orada',
    icon: 'trophy',
    cardBg: '#ecfeff',
    cardBgDark: '#0f2a30',
    accentColor: '#0891b2',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    subColor: 'text-cyan-500 dark:text-cyan-400',
  },
  {
    title: 'Speaking',
    subtitle: 'Tez orada',
    icon: 'mic',
    cardBg: '#fff7ed',
    cardBgDark: '#2a1a0f',
    accentColor: '#ea580c',
    textColor: 'text-orange-700 dark:text-orange-300',
    subColor: 'text-orange-500 dark:text-orange-400',
  },
  {
    title: 'Listening',
    subtitle: 'Tez orada',
    icon: 'headphones',
    cardBg: '#eff6ff',
    cardBgDark: '#0f1a2a',
    accentColor: '#0284c7',
    textColor: 'text-blue-700 dark:text-blue-300',
    subColor: 'text-blue-500 dark:text-blue-400',
  },
]

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const startAutoSlide = () => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length
  }, 5000)
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  if (interval) clearInterval(interval)
  startAutoSlide()
}


onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div class="relative overflow-hidden mb-5">
    <!-- Slides Container -->
    <div class="relative h-[88px]">
      <TransitionGroup name="slide">
        <div
          v-for="(slide, index) in slides"
          :key="slide.title"
          v-show="currentIndex === index"
          class="absolute inset-0"
        >
          <div
            class="rounded-2xl p-4 h-full border border-gray-100 dark:border-white/5 overflow-hidden relative bg-white dark:bg-[#1a2730] w-full"
          >
            <!-- Right side 3D decorative title -->
            <div class="absolute -right-1 top-1/2 -translate-y-1/2 select-none pointer-events-none">
              <span
                class="text-[56px] font-black tracking-tighter leading-none italic"
                :style="{
                  color: 'transparent',
                  WebkitTextStroke: `1.5px ${slide.accentColor}20`,
                  textShadow: `2px 2px 0 ${slide.accentColor}0a, 4px 4px 0 ${slide.accentColor}06`,
                  transform: 'perspective(500px) rotateY(-8deg)',
                  display: 'inline-block',
                }"
              >{{ slide.title }}</span>
            </div>

            <!-- Content -->
            <div class="flex items-center gap-4 h-full relative z-10">
              <!-- Icon -->
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                :style="{ backgroundColor: slide.accentColor + '18' }"
              >
                <!-- Book -->
                <svg v-if="slide.icon === 'book'" class="w-7 h-7" :style="{ color: slide.accentColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <!-- Trophy -->
                <svg v-else-if="slide.icon === 'trophy'" class="w-7 h-7" :style="{ color: slide.accentColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228M16.27 9.728a6.726 6.726 0 0 1-2.773 1.153M7.73 9.728a6.726 6.726 0 0 0 2.773 1.153m4.768 0a24.585 24.585 0 0 1-4.774.155m0 0a17.722 17.722 0 0 1-.228 2.115H10.5a17.722 17.722 0 0 1-.228-2.115M10.5 10.881a24.585 24.585 0 0 0 4.774-.155" />
                </svg>
                <!-- Mic -->
                <svg v-else-if="slide.icon === 'mic'" class="w-7 h-7" :style="{ color: slide.accentColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                </svg>
                <!-- Headphones -->
                <svg v-else-if="slide.icon === 'headphones'" class="w-7 h-7" :style="{ color: slide.accentColor }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              </div>
              <!-- Text -->
              <div class="flex-1 min-w-0">
                <h3 :class="['text-lg font-extrabold leading-tight', slide.textColor]">{{ slide.title }}</h3>
                <div class="flex items-center gap-1 mt-1">
                  <svg :class="['w-3.5 h-3.5', slide.subColor]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span :class="['text-xs font-bold', slide.subColor]">{{ slide.subtitle }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Dots -->
    <div class="flex items-center justify-center gap-1.5 mt-3">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'rounded-full transition-all duration-300',
          currentIndex === index
            ? 'w-5 h-1.5 bg-[#58cc02]'
            : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600'
        ]"
      />
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}
</style>
