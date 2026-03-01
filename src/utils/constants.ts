export const MAX_STEPS = 4

export const LEVELS = ['beginner', 'intermediate', 'advanced'] as const
export type Level = typeof LEVELS[number]

export const CATEGORIES = {
  LESSON: ['grammar', 'vocabulary', 'speaking', 'listening', 'reading', 'writing'] as const,
  WORD: ['basic', 'food', 'travel', 'business', 'education', 'health', 'technology', 'nature'] as const
}

export const STORAGE_KEYS = {
  USER: 'user',
  IS_REGISTERED: 'isRegistered',
  THEME: 'theme',
  LANGUAGE: 'language',
  LESSON_PROGRESS: 'lessonProgress',
  FAVORITE_WORDS: 'favoriteWords',
  LEARNED_WORDS: 'learnedWords',
  QUIZ_HISTORY: 'quizHistory',
  USER_STATS: 'userStats',
  DAILY_WORD: 'dailyWord'
} as const

export const ROUTES = {
  HOME: '/home',
  REGISTER: '/register',
  LESSONS: '/lessons',
  LESSON_DETAIL: '/lessons/:id',
  VOCABULARY: '/vocabulary',
  QUIZ: '/quiz',
  PROFILE: '/profile'
} as const

export const PHONE_PREFIX = '+998'
export const PHONE_MASK = '## ### ## ##'

export const QUIZ_QUESTION_COUNT = 10
export const QUIZ_TIME_PER_QUESTION = 30 // seconds

export const APP_VERSION = '1.0.0'
