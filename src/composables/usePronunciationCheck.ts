import { ref } from 'vue'

interface PronunciationResult {
  isCorrect: boolean
  recognizedText: string
  expectedWord: string
  similarity: number
}

interface PronunciationStats {
  total: number
  correct: number
  incorrect: number
  accuracy: number
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

export function usePronunciationCheck() {
  const stats = ref<PronunciationStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0
  })

  const check = (expected: string, recognized: string): PronunciationResult => {
    const expectedNorm = expected.toLowerCase().trim()
    const recognizedNorm = recognized.toLowerCase().trim()

    let isCorrect = false
    let similarity = 0

    // Exact match
    if (expectedNorm === recognizedNorm) {
      isCorrect = true
      similarity = 100
    }
    // Recognized text contains expected word (said in a sentence)
    else if (recognizedNorm.includes(expectedNorm)) {
      isCorrect = true
      similarity = 100
    }
    // Expected word contains recognized (partial match)
    else if (expectedNorm.includes(recognizedNorm) && recognizedNorm.length >= expectedNorm.length - 2) {
      isCorrect = true
      similarity = 90
    }
    else {
      const distance = levenshtein(expectedNorm, recognizedNorm)
      const maxLength = Math.max(expectedNorm.length, recognizedNorm.length)
      similarity = Math.round((1 - distance / maxLength) * 100)

      // Tolerance based on word length
      if (distance <= 1) {
        isCorrect = true
      } else if (distance <= 2 && expectedNorm.length >= 6) {
        isCorrect = true
      } else if (similarity >= 75) {
        isCorrect = true
      }
    }

    // Update stats
    stats.value.total++
    if (isCorrect) {
      stats.value.correct++
    } else {
      stats.value.incorrect++
    }
    stats.value.accuracy = Math.round((stats.value.correct / stats.value.total) * 100)

    return {
      isCorrect,
      recognizedText: recognized,
      expectedWord: expected,
      similarity
    }
  }

  const resetStats = () => {
    stats.value = {
      total: 0,
      correct: 0,
      incorrect: 0,
      accuracy: 0
    }
  }

  return {
    check,
    stats,
    resetStats
  }
}
