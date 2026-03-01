import type { TranslatedField } from './user'

export interface QuizOption {
  wordId: string
  wordTranslate: TranslatedField
}

export interface QuizQuestion {
  wordId: string
  word: string
  transcription: string | null
  options: QuizOption[]
  correctIndex: number
  selectedIndex?: number | null
}

export interface QuizData {
  id: string
  clientId: string
  collectionId: string
  questions: QuizQuestion[]
  totalQuestions: number
  correctAnswers: number | null
  completedAt: string | null
  createdAt: string
}

export interface AnswerResult {
  correct: boolean
  correctIndex: number
  selectedIndex: number
  completed: boolean
  totalQuestions: number
  answeredQuestions: number
  correctAnswers: number | null
}
