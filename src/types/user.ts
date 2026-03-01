export interface User {
  id: string
  firstName: string
  lastName: string | null
  telegramId: string
}

export interface RegisterForm {
  telegramId: string
  firstName: string
  lastName: string
  phone: string
  goals: string[]
}

export interface UserStats {
  wordsLearned: number
  lessonsCompleted: number
  quizAccuracy: number
  streakDays: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  pageCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedData<T> {
  data: T[]
  meta: PaginationMeta
}

export interface TranslatedField {
  uz: string
  ru: string
}

export interface ClientCheckData {
  registered: boolean
  accessToken?: string
  client?: User
}

export interface ClientLoginData {
  accessToken: string
  client: User
}
