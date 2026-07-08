import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechRecognition(lang: string) {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const RecognitionCtor =
    typeof window !== 'undefined'
      ? window.SpeechRecognition ?? window.webkitSpeechRecognition
      : undefined

  const isSupported = !!RecognitionCtor

  const start = useCallback(
    (onFinalResult: (transcript: string) => void) => {
      if (!RecognitionCtor) {
        setError('not-supported')
        return
      }

      const recognition = new RecognitionCtor()
      recognition.lang = lang
      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        setInterimText('')
      }

      recognition.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            final += transcript
          } else {
            interim += transcript
          }
        }
        if (interim) setInterimText(interim)
        if (final.trim()) {
          setInterimText('')
          onFinalResult(final.trim())
        }
      }

      recognition.onerror = (event) => {
        setError(event.error || 'unknown-error')
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    },
    [RecognitionCtor, lang],
  )

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  return { isListening, interimText, error, isSupported, start, stop }
}
