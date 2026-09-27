import { useCallback, useState } from 'react'
import { useMidiKeyDown } from '@/features/connect-midi'
import type { Midi } from '@/shared/lib/music'

/**
 * The note: the last key a hand played while `listening` (a tap, a typed key, a MIDI key going
 * down), forgotten when `context` (the scale, the size, what keys play) changes.
 */
export function useHeardNote(
  listening: boolean,
  context: string,
): { readonly note: Midi | null; readonly hear: (key: Midi) => void } {
  const [heard, setHeard] = useState<{ readonly note: Midi; readonly context: string } | null>(null)
  const hear = useCallback((key: Midi) => setHeard({ note: key, context }), [context])
  useMidiKeyDown((key) => {
    if (listening) hear(key)
  })
  return { note: listening && heard?.context === context ? heard.note : null, hear }
}
