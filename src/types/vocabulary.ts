import type { TranslatedField } from './user'

// API dan keladigan tiplar
export interface Category {
  id: string
  name: TranslatedField
  public: boolean
  createdAt: string
  updatedAt: string
}

export interface CollectionStars {
  vocabulary: boolean
  writing: boolean
  quiz: boolean
}

export interface Collection {
  id: string
  categoryId: string
  name: TranslatedField
  wordCount: number
  isNew: boolean
  createdAt: string
  stars?: CollectionStars
  totalStars?: number
}

export interface VocabularyItem {
  id: string
  word: string
  wordTranslate: TranslatedField
  transcription?: string | null
  example?: string | null
  exampleTranslate?: TranslatedField | null
  audioUrl?: string | null
  learned?: boolean
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

