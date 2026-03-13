import { ref } from 'vue'

export function useAudio() {
  const isSpeaking = ref(false)
  let currentAudio: HTMLAudioElement | null = null

  const speak = (text: string, lang: string = 'en') => {
    stop()
    isSpeaking.value = true

    // Try SpeechSynthesis first (most reliable in browsers)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === 'en' ? 'en-US' : lang === 'uz' ? 'uz-UZ' : lang
      utterance.rate = 0.9
      utterance.onend = () => { isSpeaking.value = false }
      utterance.onerror = () => {
        // Fallback to Google TTS if SpeechSynthesis fails
        playGoogleTTS(text, lang)
      }
      window.speechSynthesis.speak(utterance)
    } else {
      // Fallback to Google TTS
      playGoogleTTS(text, lang)
    }
  }

  const playGoogleTTS = (text: string, lang: string) => {
    const encodedText = encodeURIComponent(text)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`

    currentAudio = new Audio(url)
    currentAudio.onended = () => {
      isSpeaking.value = false
      currentAudio = null
    }
    currentAudio.onerror = () => {
      isSpeaking.value = false
      currentAudio = null
    }
    currentAudio.play().catch(() => {
      isSpeaking.value = false
    })
  }

  const speakEnglish = (text: string) => speak(text, 'en')
  const speakUzbek = (text: string) => speak(text, 'uz')
  const speakRussian = (text: string) => speak(text, 'ru')

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    isSpeaking.value = false
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
