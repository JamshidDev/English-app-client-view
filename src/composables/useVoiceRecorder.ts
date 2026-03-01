import { ref, onUnmounted } from 'vue'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useVoiceRecorder(lang: string = 'en-US') {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const recognizedText = ref('')
  const error = ref<string | null>(null)

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
  const isSupported = ref(!!SpeechRecognitionAPI)

  let recognition: SpeechRecognition | null = null

  const initRecognition = () => {
    if (!SpeechRecognitionAPI) return null

    const rec = new SpeechRecognitionAPI()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 3

    rec.onstart = () => {
      isRecording.value = true
      isProcessing.value = false
      error.value = null
    }

    rec.onresult = (event: SpeechRecognitionEvent) => {
      isProcessing.value = true
      const results = event.results[event.resultIndex]
      if (results && results[0]) {
        recognizedText.value = results[0].transcript.toLowerCase().trim()
      }
    }

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      isRecording.value = false
      isProcessing.value = false

      switch (event.error) {
        case 'no-speech':
          error.value = 'no_speech'
          break
        case 'audio-capture':
          error.value = 'no_microphone'
          break
        case 'not-allowed':
          error.value = 'permission_denied'
          break
        default:
          error.value = event.error
      }
    }

    rec.onend = () => {
      isRecording.value = false
      isProcessing.value = false
    }

    return rec
  }

  const startRecording = () => {
    if (!isSupported.value) {
      error.value = 'not_supported'
      return
    }

    reset()
    recognition = initRecognition()

    if (recognition) {
      try {
        recognition.start()
      } catch (e) {
        error.value = 'start_error'
      }
    }
  }

  const stopRecording = () => {
    if (recognition && isRecording.value) {
      isProcessing.value = true
      recognition.stop()
    }
  }

  const toggleRecording = () => {
    if (isRecording.value) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const reset = () => {
    recognizedText.value = ''
    error.value = null
    isRecording.value = false
    isProcessing.value = false
  }

  onUnmounted(() => {
    if (recognition) {
      recognition.abort()
      recognition = null
    }
  })

  return {
    isRecording,
    isProcessing,
    recognizedText,
    error,
    isSupported,
    startRecording,
    stopRecording,
    toggleRecording,
    reset
  }
}
