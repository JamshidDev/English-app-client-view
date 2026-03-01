import { ref } from 'vue'

export function useAudio() {
  const isSpeaking = ref(false)

  const speak = (text: string, lang: string = 'en-US') => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => {
      isSpeaking.value = true
    }

    utterance.onend = () => {
      isSpeaking.value = false
    }

    utterance.onerror = () => {
      isSpeaking.value = false
    }

    window.speechSynthesis.speak(utterance)
  }

  const speakEnglish = (text: string) => {
    speak(text, 'en-US')
  }

  const speakUzbek = (text: string) => {
    speak(text, 'uz-UZ')
  }

  const speakRussian = (text: string) => {
    speak(text, 'ru-RU')
  }

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    }
  }

  return {
    isSpeaking,
    speak,
    speakEnglish,
    speakUzbek,
    speakRussian,
    stop
  }
}
