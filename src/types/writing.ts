import type { TranslatedField } from './user'

export interface WritingQuestion {
  wordId: string
  wordTranslate: TranslatedField
  correctWord: string
  answer?: string | null
  isCorrect?: boolean | null
}

export interface WritingData {
  id: string
  clientId: string
  collectionId: string
  questions: WritingQuestion[]
  totalQuestions: number
  correctAnswers: number | null
  completedAt: string | null
  createdAt: string
}

export interface WritingAnswerResult {
  correct: boolean
  correctWord: string
  answer: string
  completed: boolean
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
}

export interface WritingCompleteResult {
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number
}
