import { useEffect, useEffectEvent } from 'react'

/** What the Player does when told (R29 B8, Voice commands). */
export const VOICE_COMMANDS = ['play', 'stop', 'again', 'slower', 'faster', 'next', 'back'] as const
export type VoiceCommand = (typeof VOICE_COMMANDS)[number]

/** The words each command answers to, in English and Russian. */
const WORDS: Readonly<Record<VoiceCommand, readonly string[]>> = {
  play: ['play', 'start', 'играй', 'играть', 'старт', 'пуск'],
  stop: ['stop', 'pause', 'стоп', 'пауза', 'хватит'],
  again: ['again', 'restart', 'снова', 'заново', 'ещё раз', 'еще раз'],
  slower: ['slower', 'slow down', 'медленнее'],
  faster: ['faster', 'speed up', 'быстрее'],
  next: ['next', 'forward', 'дальше', 'вперёд', 'вперед', 'следующий'],
  back: ['back', 'previous', 'назад', 'предыдущий'],
}

/** The command a heard phrase says: its last word that is one wins (“no, stop”); null for none. */
export function voiceCommand(heard: string): VoiceCommand | null {
  const phrase = heard.toLowerCase().replace(/[.,!?]/g, ' ')
  let found: { readonly command: VoiceCommand; readonly at: number } | null = null
  for (const command of VOICE_COMMANDS)
    for (const word of WORDS[command]) {
      const at = phrase.lastIndexOf(word)
      if (at >= 0 && (found === null || at > found.at)) found = { command, at }
    }
  return found?.command ?? null
}

/** The browser's speech recognition, where it has one. */
interface Recognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}
type RecognitionConstructor = new () => Recognition

const recognitionClass = (): RecognitionConstructor | null => {
  const scope = globalThis as unknown as {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null
}

/** Whether this browser hears speech. */
export const hasVoiceCommands = (): boolean => recognitionClass() !== null

/**
 * Listens for the Player's commands while `on` (R29 B8), in the app's language, and hands each one
 * heard on; it listens again after each pause until turned off.
 */
export function useVoiceCommands(
  on: boolean,
  locale: string,
  onCommand: (command: VoiceCommand) => void,
): void {
  const heard = useEffectEvent(onCommand)
  useEffect(() => {
    const Speech = recognitionClass()
    if (!on || !Speech) return
    let listening = true
    const recognition = new Speech()
    recognition.lang = locale === 'ru' ? 'ru-RU' : 'en-GB'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const command = last?.[0] ? voiceCommand(last[0].transcript) : null
      if (command) heard(command)
    }
    recognition.onend = () => {
      if (listening) recognition.start()
    }
    recognition.start()
    return () => {
      listening = false
      recognition.onend = null
      recognition.stop()
    }
  }, [on, locale])
}
