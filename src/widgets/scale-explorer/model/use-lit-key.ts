import { useCallback, useEffect, useRef, useState } from 'react'
import type { Midi } from '@/shared/lib/music'
import type { KeyCue } from '@/shared/lib/schedule'

/** The key sounding now in a scale run, lit in time with the audio; cleared when the run ends. */
export function useLitKey(): {
  lit: Midi | null
  light: (cues: readonly KeyCue[], startsIn: number, end: number) => void
} {
  const [lit, setLit] = useState<Midi | null>(null)
  const timers = useRef<number[]>([])
  const clear = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current = []
  }, [])
  useEffect(() => clear, [clear])
  const light = useCallback(
    (cues: readonly KeyCue[], startsIn: number, end: number) => {
      clear()
      for (const cue of cues)
        timers.current.push(window.setTimeout(() => setLit(cue.midi), (startsIn + cue.at) * 1000))
      timers.current.push(window.setTimeout(() => setLit(null), (startsIn + end) * 1000))
    },
    [clear],
  )
  return { lit, light }
}
