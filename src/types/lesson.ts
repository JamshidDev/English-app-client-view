export type LessonLevel = 'beginner' | 'intermediate' | 'advanced'
export type LessonCategory = 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'reading' | 'writing'

export interface Lesson {
  id: string
  title: string
  titleEn: string
  description: string
  level: LessonLevel
  category: LessonCategory
  durationMinutes: number
  content: string[]
  vocabularyIds: string[]
  quizIds: string[]
  imageUrl?: string
  order: number
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  completedAt?: string
  progress: number
}
