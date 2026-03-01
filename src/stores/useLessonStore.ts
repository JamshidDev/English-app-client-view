import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Lesson, LessonLevel, LessonProgress } from '@/types/lesson'
import { lessons as lessonsData } from '@/data/lessons'
import { useAuthStore } from './useAuthStore'

export const useLessonStore = defineStore('lesson', () => {
  const lessons = ref<Lesson[]>(lessonsData)
  const currentLesson = ref<Lesson | null>(null)
  const lessonProgress = ref<LessonProgress[]>([])
  const selectedLevel = ref<LessonLevel | 'all'>('all')

  const initLessons = () => {
    const savedProgress = localStorage.getItem('lessonProgress')
    if (savedProgress) {
      lessonProgress.value = JSON.parse(savedProgress)
    }
  }

  const filteredLessons = computed(() => {
    if (selectedLevel.value === 'all') {
      return lessons.value
    }
    return lessons.value.filter(l => l.level === selectedLevel.value)
  })

  const completedLessons = computed(() => {
    return lessonProgress.value.filter(p => p.completed)
  })

  const getLessonById = (id: string) => {
    return lessons.value.find(l => l.id === id)
  }

  const setCurrentLesson = (lesson: Lesson) => {
    currentLesson.value = lesson
  }

  const isLessonCompleted = (lessonId: string) => {
    return lessonProgress.value.some(p => p.lessonId === lessonId && p.completed)
  }

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.value.find(p => p.lessonId === lessonId)
  }

  const completeLesson = (lessonId: string) => {
    const authStore = useAuthStore()
    const existingProgress = lessonProgress.value.find(p => p.lessonId === lessonId)

    if (existingProgress) {
      existingProgress.completed = true
      existingProgress.completedAt = new Date().toISOString()
      existingProgress.progress = 100
    } else {
      lessonProgress.value.push({
        lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
        progress: 100
      })
      authStore.incrementLessonsCompleted()
    }

    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress.value))
  }

  const updateLessonProgress = (lessonId: string, progress: number) => {
    const existingProgress = lessonProgress.value.find(p => p.lessonId === lessonId)

    if (existingProgress) {
      existingProgress.progress = progress
    } else {
      lessonProgress.value.push({
        lessonId,
        completed: false,
        progress
      })
    }

    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress.value))
  }

  const getLastIncompleteLesson = () => {
    const inProgress = lessonProgress.value
      .filter(p => !p.completed && p.progress > 0)
      .sort((a, b) => b.progress - a.progress)[0]

    if (inProgress) {
      return getLessonById(inProgress.lessonId)
    }

    const completedIds = lessonProgress.value
      .filter(p => p.completed)
      .map(p => p.lessonId)

    return lessons.value.find(l => !completedIds.includes(l.id))
  }

  const setSelectedLevel = (level: LessonLevel | 'all') => {
    selectedLevel.value = level
  }

  return {
    lessons,
    currentLesson,
    lessonProgress,
    selectedLevel,
    filteredLessons,
    completedLessons,
    initLessons,
    getLessonById,
    setCurrentLesson,
    isLessonCompleted,
    getLessonProgress,
    completeLesson,
    updateLessonProgress,
    getLastIncompleteLesson,
    setSelectedLevel
  }
})
