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

const NONE: ReadonlySet<Midi> = new Set()
const NOTHING_HELD: ReadonlyMap<string, Midi> = new Map()

/**
 * The computer keyboard as a piano, read by physical key (GarageBand's Musical Typing). A typed key
 * calls `onKey`, as a tap does, and is held down until it is let go (or the window loses the focus);
 * Z and X move the typing octave, and the keyboard shows it until the screen's own keys in view
 * change. Nothing plays from a text field, with Ctrl, Cmd or Alt held, or on auto-repeat; a key
 * that plays is not also the browser's.
 */
export function useTyping({
  enabled,
  onKey,
  inView,
}: {
  enabled: boolean
  onKey: (key: Midi) => void
  inView: KeyRange | undefined
}): {
  letters: ReadonlyMap<Midi, string> | undefined
  inView: KeyRange | undefined
  /** The piano keys the typed keys hold down. */
  held: ReadonlySet<Midi>
} {
  const [typingC, setTypingC] = useState(TYPING_START)
  /** Each physical key held down, and the piano key it played (the octave may move meanwhile). */
  const [holding, setHolding] = useState(NOTHING_HELD)
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
      setHolding((held) => new Map(held).set(event.code, key))
      latest.current.onKey(key)
    }
    const onKeyUp = (event: KeyboardEvent) =>
      setHolding((held) => {
        if (!held.has(event.code)) return held
        const rest = new Map(held)
        rest.delete(event.code)
        return rest
      })
    const letGo = () => setHolding(NOTHING_HELD)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', letGo)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', letGo)
    }
  }, [enabled])

  const letters = useMemo(() => typingLetters(typingC), [typingC])
  const held = useMemo(() => (holding.size === 0 ? NONE : new Set(holding.values())), [holding])
  const followsTyping = enabled && movedOver !== null && sameRange(movedOver.view, inView)
  return {
    letters: enabled ? letters : undefined,
    inView: followsTyping ? rangeOf([...letters.keys()]) : inView,
    held: enabled ? held : NONE,
  }
}
