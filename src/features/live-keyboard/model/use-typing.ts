import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  moveTypingOctave,
  OCTAVE_DOWN,
  OCTAVE_UP,
  TYPING_START,
  typedKey,
  typingLetters,
} from '@/shared/lib'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'

/** Where a key typed goes into a field: nothing plays there. */
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

const sameRange = (a: KeyRange | undefined, b: KeyRange | undefined) =>
  a?.from === b?.from && a?.to === b?.to

/**
 * The computer keyboard as a piano, read by physical key (GarageBand's Musical Typing). A typed key
 * calls `onKey`, as a tap does; Z and X move the typing octave, and the keyboard shows it until the
 * screen's own keys in view change. Nothing plays from a text field, with Ctrl, Cmd or Alt held, or
 * on auto-repeat; a key that plays is not also the browser's.
 */
export function useTyping({
  enabled,
  onKey,
  inView,
}: {
  enabled: boolean
  onKey: (key: Midi) => void
  inView: KeyRange | undefined
}): { letters: ReadonlyMap<Midi, string> | undefined; inView: KeyRange | undefined } {
  const [typingC, setTypingC] = useState(TYPING_START)
  /** The screen's keys in view when Z or X last moved the octave: the octave shows until they change. */
  const [movedOver, setMovedOver] = useState<{ readonly view: KeyRange | undefined } | null>(null)
  const latest = useRef({ onKey, inView, typingC })
  useLayoutEffect(() => {
    latest.current = { onKey, inView, typingC }
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return
      if (event.code === OCTAVE_DOWN || event.code === OCTAVE_UP) {
        event.preventDefault()
        const by = event.code === OCTAVE_UP ? 1 : -1
        setTypingC((c) => moveTypingOctave(c, by))
        setMovedOver({ view: latest.current.inView })
        return
      }
      const key = typedKey(event.code, latest.current.typingC)
      if (key === null) return
      event.preventDefault()
      latest.current.onKey(key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])

  const letters = useMemo(() => typingLetters(typingC), [typingC])
  const followsTyping = enabled && movedOver !== null && sameRange(movedOver.view, inView)
  return {
    letters: enabled ? letters : undefined,
    inView: followsTyping ? rangeOf([...letters.keys()]) : inView,
  }
}
