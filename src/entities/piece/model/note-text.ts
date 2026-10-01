import { midiOf, parseNoteName, type Midi, type SpelledNote } from '@/shared/lib/music'

/** `C#5`: a note name and a one-digit octave, or null when that is no key on the keyboard. */
export function readPitch(pitch: string): { midi: Midi; spelled: SpelledNote } | null {
  const written = /^(.+?)(\d)$/.exec(pitch)
  const spelled = written?.[1] ? parseNoteName(written[1]) : null
  if (!written || !spelled) return null
  try {
    return { midi: midiOf(spelled, Number(written[2])), spelled }
  } catch (error) {
    if (error instanceof RangeError) return null
    throw error
  }
}
