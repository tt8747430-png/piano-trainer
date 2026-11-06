import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { PedalKind } from '@/shared/lib/schedule'
import { usePedal, useServices } from '@/shared/lib/services'

/** A press shorter than this is a tap: it latches the pedal down (or lifts it, latched). */
const TAP_MS = 300

/** A pedal's button as a finger, a mouse or the keyboard works it. */
export interface PedalPress {
  /** Down, whoever holds it: this press or latch, Space, a MIDI foot, or the music (`music`). */
  readonly down: boolean
  /** Latched by a tap: down until the next. */
  readonly latched: boolean
  readonly onPointerDown: (event: PointerEvent<HTMLElement>) => void
  readonly onPointerUp: () => void
  readonly onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

/**
 * One pedal worked from a button (R31-P, R34): held, it holds; a tap latches it and the next lifts it,
 * Enter and Space doing the same as a tap. Whatever this press holds lets up as the page hides or the
 * button goes: no screen keeps a pedal it cannot lift. `music`: the music playing holds it (its
 * score's pedal), shown down with it.
 */
export function usePedalPress(pedal: PedalKind, music = false): PedalPress {
  const { audio } = useServices()
  const down = usePedal(pedal) || music
  const held = useRef(false)
  // Set while a press has lasted past a tap: its lift lets the pedal up.
  const long = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [latched, setLatched] = useState(false)
  const latchedNow = useRef(false)
  const set = (on: boolean) => {
    if (held.current === on) return
    held.current = on
    audio.pedal(pedal, on)
  }
  useEffect(() => {
    const lift = () => {
      if (held.current) audio.pedal(pedal, false)
      held.current = false
      latchedNow.current = false
      setLatched(false)
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') lift()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      clearTimeout(timer.current)
      lift()
    }
  }, [audio, pedal])
  const latch = (on: boolean) => {
    latchedNow.current = on
    setLatched(on)
    set(on)
  }
  return {
    down,
    latched,
    onPointerDown: (event) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      long.current = false
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        long.current = true
      }, TAP_MS)
      if (!latchedNow.current) set(true)
    },
    onPointerUp: () => {
      clearTimeout(timer.current)
      if (latchedNow.current) latch(false)
      else if (!long.current) latch(true)
      else set(false)
    },
    onKeyDown: (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      latch(!latchedNow.current)
    },
  }
}
