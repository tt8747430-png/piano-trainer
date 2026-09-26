import { useCallback, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, PIANO_LAYOUT, spanOf, type NamedKeys } from '@/shared/lib'
import {
  isBlackKey,
  midi,
  octaveOf,
  PIANO,
  pitchClass,
  plainSpelling,
  type KeyRange,
  type Midi,
} from '@/shared/lib/music'
import { Key } from './Key'
import { keyLook, type KeyStates } from './key-look'
import { useKeyboardScroll } from './use-keyboard-scroll'

/** White keys never narrower than this, so they stay tappable; past it the keyboard scrolls… */
const MIN_WHITE_PX = 28
/** …nor wider than this: a wide screen shows the neighbouring keys instead. */
const MAX_WHITE_PX = 48

/** Where the arrow keys, Home and End take the keyboard's tab stop. */
const MOVES: Readonly<Partial<Record<string, (key: Midi) => Midi>>> = {
  ArrowLeft: (key) => midi(Math.max(PIANO.from, key - 1)),
  ArrowRight: (key) => midi(Math.min(PIANO.to, key + 1)),
  Home: () => PIANO.from,
  End: () => PIANO.to,
}

/**
 * The one keyboard (spec §8): the whole piano, scrolling sideways, its `range` filling the width.
 * A group named "Keyboard" whose keys are buttons named by note, one of them in the tab order; the
 * arrow keys walk the rest.
 */
export function PianoKeyboard({
  range,
  inView,
  selectable = false,
  namedKeys = 'c',
  letters,
  onKeyPress,
  className,
  ...states
}: KeyStates & {
  /** The keys that fill the keyboard's width; the rest of the piano scrolls in beside them. */
  range: KeyRange
  /**
   * Keys to keep in sight: the keyboard opens centred on them (else on its range) and scrolls to
   * them whenever one is out of sight.
   */
  inView?: KeyRange
  /** The keys are toggles (a quiz's keys to choose), and say whether they are chosen. */
  selectable?: boolean
  /** Which keys carry their note's name: every C (the default), every key, or none. */
  namedKeys?: NamedKeys
  /** The computer keyboard's letters on the keys it plays. */
  letters?: ReadonlyMap<Midi, string> | undefined
  /** Every key does something: a key that did nothing would be a dead end. */
  onKeyPress: (key: Midi) => void
  className?: string
}) {
  const { t } = useTranslation('common')
  const scroller = useRef<HTMLDivElement>(null)
  const [tabStop, setTabStop] = useState<Midi>(range.from)
  const { from, to } = range
  const span = useMemo(() => spanOf(PIANO_LAYOUT.keys, { from, to }), [from, to])
  useKeyboardScroll(scroller, PIANO_LAYOUT.keys, span, inView)

  // Keys hold one handler for good, so they re-render only when their own look changes.
  const latestPress = useRef(onKeyPress)
  useLayoutEffect(() => {
    latestPress.current = onKeyPress
  })
  const press = useCallback((key: Midi) => latestPress.current(key), [])

  const nameOf = (key: Midi) => {
    const spelled = plainSpelling(pitchClass(key), true)
    return t(isBlackKey(key) ? 'note.sharp' : 'note.natural', {
      letter: spelled.letter,
      octave: octaveOf(key),
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = MOVES[event.key]?.(tabStop)
    if (next === undefined) return
    event.preventDefault()
    setTabStop(next)
    scroller.current?.querySelector<HTMLButtonElement>(`[data-midi="${next}"]`)?.focus()
  }

  return (
    <div
      ref={scroller}
      className={cn(
        '@container flex overflow-x-auto overscroll-x-contain scrollbar-none',
        className,
      )}
    >
      {/* A flex item, so the keys take the keyboard's height however that height is set. */}
      <div
        role="group"
        aria-label={t('keyboard')}
        onKeyDown={onKeyDown}
        className="relative shrink-0 bg-key-bed"
        style={{
          width: `calc(${PIANO_LAYOUT.whites} * clamp(${MIN_WHITE_PX}px, 100cqw / ${span.whites}, ${MAX_WHITE_PX}px))`,
        }}
      >
        {PIANO_LAYOUT.keys.map((key) => (
          <Key
            key={key.midi}
            geometry={key}
            name={nameOf(key.midi)}
            look={keyLook(key.midi, states, { namedKeys, letters })}
            chosen={selectable ? (states.selected?.has(key.midi) ?? false) : undefined}
            tabStop={key.midi === tabStop}
            onPress={press}
            onFocusKey={setTabStop}
          />
        ))}
        {/* The rail's shade falling on the keys. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
        />
      </div>
    </div>
  )
}
