import type { TranslatedField } from './user'

// API dan keladigan tiplar
export interface Category {
  id: string
  name: TranslatedField
  public: boolean
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  categoryId: string
  name: TranslatedField
  wordCount: number
  createdAt: string
}

export interface VocabularyItem {
  id: string
  word: string
  wordTranslate: TranslatedField
  transcription?: string | null
  example?: string | null
  exampleTranslate?: TranslatedField | null
}

// Client category (tanlangan)
export interface ClientCategoryItem {
  id: string
  clientId: string
  categoryId: string
  order: number
  createdAt: string
  category: Category
}

// Local progress tracking (localStorage)
export interface CollectionProgress {
  collectionId: string
  wordsProgress: { wordId: string; learned: boolean; learnedAt?: string }[]
  lastAccessedAt?: string
}

// Legacy tiplar (eski komponentlar bilan moslik uchun)
export type WordCategory = 'basic' | 'intermediate' | 'advanced' | 'ielts' | 'travel' | 'business' | 'it' | 'daily'
export type WordLevel = 'easy' | 'medium' | 'hard' | 'ielts'

export interface Word {
  id: number
  word: string
  transcription: string
  translationUz: string
  translationRu: string
  exampleEn: string
  exampleUz: string
  exampleRu: string
  audioUrl?: string
  category: WordCategory
  level: WordLevel
}

export interface WordSet {
  id: number
  titleUz: string
  titleRu: string
  titleEn: string
  descriptionUz: string
  descriptionRu: string
  descriptionEn: string
  category: WordCategory
  level: WordLevel
  words: Word[]
}

export interface WordProgress {
  wordId: number
  learned: boolean
  learnedAt?: string
  testScore?: number
  writingCorrect?: boolean
  pronunciationDone?: boolean
}

export interface WordSetProgress {
  setId: number
  wordsProgress: WordProgress[]
  lastAccessedAt?: string
}
