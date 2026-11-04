import { useRef, useState } from 'react'
import { tapTempo } from '@/shared/lib'

/**
 * Tap tempo (ADR 0052, R29 B11): taps in time read as a tempo from the second on, a pause starting
 * them again. The one tap code the Metronome's Tap button and the Tap tempo page share.
 */
export function useTapTempo(): { readonly bpm: number | null; tap(): number | null } {
  const taps = useRef<readonly number[]>([])
  const [bpm, setBpm] = useState<number | null>(null)
  return {
    bpm,
    tap() {
      const read = tapTempo(taps.current, performance.now())
      taps.current = read.taps
      if (read.bpm !== null) setBpm(read.bpm)
      return read.bpm
    },
  }
}
