export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 9) {
    return /^[0-9]{9}$/.test(cleaned)
  }

  if (cleaned.length === 12) {
    return /^998[0-9]{9}$/.test(cleaned)
  }

  return false
}

export const validateName = (name: string): boolean => {
  if (!name || name.trim().length < 2) {
    return false
  }

  return /^[a-zA-Zа-яА-ЯёЁўЎқҚғҒҳҲ\s'-]+$/.test(name.trim())
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength
}

export const validateRequired = (value: string | number | boolean | null | undefined): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

export const validateArrayMinLength = (arr: unknown[], minLength: number): boolean => {
  return arr.length >= minLength
}

export interface ValidationResult {
  valid: boolean
  message?: string
}

export const validatePhoneWithMessage = (phone: string): ValidationResult => {
  if (!phone) {
    return { valid: false, message: 'register.phone_error' }
  }

  if (!validatePhone(phone)) {
    return { valid: false, message: 'register.phone_error' }
  }

  return { valid: true }
}

export const validateNameWithMessage = (name: string, field: 'first' | 'last'): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      message: field === 'first' ? 'register.first_name_error' : 'register.last_name_error'
    }
  }

  if (!validateName(name)) {
    return {
      valid: false,
      message: field === 'first' ? 'register.first_name_error' : 'register.last_name_error'
    }
  }

  return { valid: true }
}
