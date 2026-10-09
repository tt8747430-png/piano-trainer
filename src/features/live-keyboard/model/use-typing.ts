import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import {
  moveTypingOctave,
  OCTAVE_DOWN,
  OCTAVE_UP,
  TYPING_START,
  typedKey,
  typingLetters,
  usePresses,
} from '@/shared/lib'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'

/** Where a key typed goes into a field: nothing plays there. */
const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])'

const sameRange = (a: KeyRange | undefined, b: KeyRange | undefined) =>
  a?.from === b?.from && a?.to === b?.to

const NONE: ReadonlySet<Midi> = new Set()

/**
 * The computer keyboard as a piano, read by physical key (GarageBand's Musical Typing). A typed key
 * calls `onKey`, as a tap does, and is held down until it is let go (or the window loses the focus),
 * for at least the shortest press; Z and X move the typing octave, and the keyboard shows it until the screen's own keys in view
 * change. Nothing plays from a text field, with a modifier held, or on auto-repeat; a key that
 * plays is not also the browser's. Letting go of Cmd lets go of every typed key: macOS sends no
 * key-up for a letter released while Cmd is held. Each key let go calls `onKeyUp` with the key it
 * played; typing switched off, or the screen gone, lets go of every key held.
 */
export function useTyping({
  enabled,
  onKey,
  onKeyUp,
  inView,
}: {
  enabled: boolean
  onKey: (key: Midi) => void
  onKeyUp?: ((key: Midi) => void) | undefined
  inView: KeyRange | undefined
}): {
  letters: ReadonlyMap<Midi, string> | undefined
  inView: KeyRange | undefined
  /** The piano keys the typed keys hold down. */
  held: ReadonlySet<Midi>
} {
  const [typingC, setTypingC] = useState(TYPING_START)
  /** Each physical key held down, under its code, with the piano key it played (the octave may move meanwhile). */
  const { keys: held, press, release, releaseAll } = usePresses<string>()
  /** The screen's keys in view when Z or X last moved the octave: the octave shows until they change. */
  const [movedOver, setMovedOver] = useState<{ readonly view: KeyRange | undefined } | null>(null)
  /** Each physical key held, under its code, with the piano key it played: what its key-up lets go. */
  const playing = useRef(new Map<string, Midi>())
  const letGo = useEffectEvent((code: string) => {
    const key = playing.current.get(code)
    if (key === undefined) return
    playing.current.delete(code)
    release(code)
    onKeyUp?.(key)
  })
  const letAllGo = useEffectEvent(() => {
    for (const code of [...playing.current.keys()]) letGo(code)
    releaseAll()
  })
  const typed = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return
    if (event.target instanceof Element && event.target.closest(EDITABLE)) return
    if (event.code === OCTAVE_DOWN || event.code === OCTAVE_UP) {
      event.preventDefault()
      const by = event.code === OCTAVE_UP ? 1 : -1
      setTypingC((c) => moveTypingOctave(c, by))
      setMovedOver({ view: inView })
      return
    }
    const key = typedKey(event.code, typingC)
    if (key === null) return
    event.preventDefault()
    letGo(event.code)
    playing.current.set(event.code, key)
    press(event.code, key)
    onKey(key)
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => typed(event)
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Meta') letAllGo()
      else letGo(event.code)
    }
    const onBlur = () => letAllGo()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      letAllGo()
    }
  }, [enabled])

  const letters = useMemo(() => typingLetters(typingC), [typingC])
  const followsTyping = enabled && movedOver !== null && sameRange(movedOver.view, inView)
  return {
    letters: enabled ? letters : undefined,
    inView: followsTyping ? rangeOf([...letters.keys()]) : inView,
    held: enabled ? held : NONE,
  }
}
