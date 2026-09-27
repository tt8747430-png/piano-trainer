import { useState } from 'react'
import { useMidiKeyDown } from '@/features/connect-midi'
import type { Midi } from '@/shared/lib/music'

/**
 * The note: the last key a hand played while `listening` (a tap, a typed key, a MIDI key going
 * down), forgotten for good when `context` (the scale, the size, what keys play) changes.
 */
export function useHeardNote(
  listening: boolean,
  context: string,
): { readonly note: Midi | null; readonly hear: (key: Midi) => void } {
  const [note, setNote] = useState<Midi | null>(null)
  const [heardIn, setHeardIn] = useState(context)
  // A new context forgets the note while rendering, so no frame shows it under the wrong chords.
  if (heardIn !== context) {
    setHeardIn(context)
    setNote(null)
  }
  useMidiKeyDown((key) => {
    if (listening) setNote(key)
  })
  return { note: listening ? note : null, hear: setNote }
}
