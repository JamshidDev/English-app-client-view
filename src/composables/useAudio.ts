import { ref } from 'vue'

// Voices ni oldindan yuklash
let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices() {
  if (!window.speechSynthesis) return
  cachedVoices = window.speechSynthesis.getVoices()
  if (cachedVoices.length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = window.speechSynthesis.getVoices()
    }, { once: true })
  }
}

if (typeof window !== 'undefined') {
  loadVoices()
}

// TTS URL variantlari — biri ishlamasa keyingisi
function getTTSUrls(text: string, lang: string): string[] {
  const encoded = encodeURIComponent(text)
  return [
    `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=gtx&ttsspeed=1`,
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`,
  ]
}

export function useAudio() {
  const isSpeaking = ref(false)
  let currentAudio: HTMLAudioElement | null = null
  let speechTimeout: ReturnType<typeof setTimeout> | null = null

  const speak = (text: string, lang: string = 'en') => {
    stop()
    isSpeaking.value = true

    if (window.speechSynthesis) {
      speakWithSynthesis(text, lang)
    } else {
      // Android Telegram WebView — fetch → blob → play
      speakWithFetchTTS(text, lang)
    }
  }

  const speakWithSynthesis = (text: string, lang: string) => {
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === 'en' ? 'en-US' : lang === 'uz' ? 'uz-UZ' : lang
    utterance.rate = 0.9

    if (lang === 'en' && cachedVoices.length > 0) {
      const enVoice = cachedVoices.find(v => v.lang.startsWith('en') && v.localService)
        || cachedVoices.find(v => v.lang.startsWith('en'))
      if (enVoice) {
        utterance.voice = enVoice
      }
    }

    utterance.onend = () => {
      clearSpeechTimeout()
      isSpeaking.value = false
    }

    utterance.onerror = () => {
      clearSpeechTimeout()
      isSpeaking.value = false
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.resume()
    window.speechSynthesis.speak(utterance)

    speechTimeout = setTimeout(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 10000)
  }

  const speakWithFetchTTS = async (text: string, lang: string) => {
    const ttsLang = lang === 'en' ? 'en' : lang === 'uz' ? 'uz' : lang
    const urls = getTTSUrls(text, ttsLang)

    for (const url of urls) {
      try {
        const res = await fetch(url)
        if (!res.ok) continue

        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)

        currentAudio = new Audio(blobUrl)
        currentAudio.onended = () => {
          URL.revokeObjectURL(blobUrl)
          isSpeaking.value = false
          currentAudio = null
        }
        currentAudio.onerror = () => {
          URL.revokeObjectURL(blobUrl)
          isSpeaking.value = false
          currentAudio = null
        }

        await currentAudio.play()
        return // muvaffaqiyatli — chiqamiz
      } catch {
        // keyingi URL ni sinab ko'ramiz
        continue
      }
    }

    // Hech biri ishlamadi
    isSpeaking.value = false
  }

  const playFromUrl = (audioUrl: string) => {
    stop()
    isSpeaking.value = true

    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
    const fullUrl = audioUrl.startsWith('http') ? audioUrl : `${baseUrl}${audioUrl}`

    currentAudio = new Audio(fullUrl)
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
      currentAudio = null
    })
  }

  const speakWord = (text: string, audioUrl?: string | null) => {
    if (audioUrl) {
      playFromUrl(audioUrl)
    } else {
      speak(text, 'en')
    }
  }

  const speakEnglish = (text: string) => speak(text, 'en')
  const speakUzbek = (text: string) => speak(text, 'uz')
  const speakRussian = (text: string) => speak(text, 'ru')

  const clearSpeechTimeout = () => {
    if (speechTimeout) {
      clearTimeout(speechTimeout)
      speechTimeout = null
    }
  }

  const stop = () => {
    clearSpeechTimeout()
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
    speakWord,
    playFromUrl,
    speakEnglish,
    speakUzbek,
    speakRussian,
    stop
  }
}
