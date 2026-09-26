import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  cn,
  PIANO_LAYOUT,
  scrollByOctave,
  spanOf,
  useMediaQuery,
  type KeySize,
  type NamedKeys,
  type Swipe,
} from '@/shared/lib'
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
import { FingerRow } from './FingerRow'
import { Key } from './Key'
import { KeyboardMap } from './KeyboardMap'
import { keyLook, type KeyStates } from './key-look'
import { RailButton } from './RailButton'
import { useKeyPointers } from './use-key-pointers'
import { useKeyboardScroll } from './use-keyboard-scroll'

/** Fit's white keys: never narrower than this, so they stay tappable; past it the keyboard scrolls… */
const MIN_WHITE_PX = 28
/** …nor wider than this: a wide screen shows the neighbouring keys instead. */
const MAX_WHITE_PX = 48
/** Large keys: about an octave in view on a phone. */
const LARGE_WHITE_PX = 56
/** A key is this many times as long as a white key is wide (a piano's proportion)… */
const KEY_LENGTH = 4.2
/** …never shorter than this… */
const MIN_KEYS_PX = 96
/** …nor taller than this share of the screen's height. */
const MAX_KEYS_DVH = 40

/** A white key's width for each key size, as CSS in the scroller's container units. */
const WHITE_WIDTH: Readonly<Record<KeySize, (whitesInRange: number) => string>> = {
  fit: (whites) => `clamp(${MIN_WHITE_PX}px, 100cqw / ${whites}, ${MAX_WHITE_PX}px)`,
  large: () => `${LARGE_WHITE_PX}px`,
  piano: () => `calc(100cqw / ${PIANO_LAYOUT.whites})`,
}

/** Where the arrow keys, Home and End take the keyboard's tab stop. */
const MOVES: Readonly<Partial<Record<string, (key: Midi) => Midi>>> = {
  ArrowLeft: (key) => midi(Math.max(PIANO.from, key - 1)),
  ArrowRight: (key) => midi(Math.min(PIANO.to, key + 1)),
  Home: () => PIANO.from,
  End: () => PIANO.to,
}

/**
 * The one keyboard (spec §8): the whole piano hung from its rail, scrolling sideways, its `range`
 * filling the width at Fit. A group named "Keyboard" whose keys are buttons named by note, one of
 * them in the tab order; the arrow keys walk the rest. A key plays the instant it is touched; a
 * swipe scrolls or plays a glissando.
 */
export function PianoKeyboard({
  range,
  inView,
  selectable = false,
  keySize = 'fit',
  swipe = 'scroll',
  spotlight = false,
  namedKeys = 'c',
  map = false,
  letters,
  height = 'proportional',
  onKeyPress,
  className,
  children,
  ...states
}: KeyStates & {
  /** The keys that fill the keyboard's width at Fit; the rest of the piano scrolls in beside them. */
  range: KeyRange
  /** Keys to keep in sight: it opens centred on them (else on its range) and scrolls to them when out of sight. */
  inView?: KeyRange | undefined
  /** The keys are toggles (a quiz's keys to choose), and say whether they are chosen. */
  selectable?: boolean
  keySize?: KeySize
  swipe?: Swipe
  /**
   * While any key is down, only the keys down show their marks: an arpeggio's or a run's key
   * alone, a chord's keys together, a finger's key while it holds it. With nothing down, every
   * mark shows.
   */
  spotlight?: boolean
  /** Which keys carry their note's name: every C (the default), every key, or none. */
  namedKeys?: NamedKeys
  /** The keyboard map in the rail. */
  map?: boolean
  /** The computer keyboard's letters on the keys it plays. */
  letters?: ReadonlyMap<Midi, string> | undefined
  /** 'proportional': the keys a piano's length for their width; 'fill': the height it is given (the Player). */
  height?: 'proportional' | 'fill'
  /** Every key does something: a key that did nothing would be a dead end. */
  onKeyPress: (key: Midi) => void
  className?: string
  /** The rail's trailing controls: `RailButton`s. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  const scroller = useRef<HTMLDivElement>(null)
  const keys = useRef<HTMLDivElement>(null)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [tabStop, setTabStop] = useState<Midi>(range.from)
  const { from, to } = range
  const span = useMemo(() => spanOf(PIANO_LAYOUT.keys, { from, to }), [from, to])
  useKeyboardScroll(scroller, PIANO_LAYOUT.keys, span, inView, keySize)

  // Keys hold one handler for good, so they re-render only when their own look changes.
  const latestPress = useRef(onKeyPress)
  useLayoutEffect(() => {
    latestPress.current = onKeyPress
  })
  const press = useCallback((key: Midi) => latestPress.current(key), [])
  const pointers = useKeyPointers({ swipe, keys, onPress: press })

  const down = useMemo(
    () =>
      pointers.pressed.size === 0
        ? states.down
        : new Set([...(states.down ?? []), ...pointers.pressed]),
    [states.down, pointers.pressed],
  )
  const shown = useMemo(
    () =>
      spotlight && states.marks && down && down.size > 0
        ? new Map([...states.marks].filter(([key]) => down.has(key)))
        : states.marks,
    [spotlight, states.marks, down],
  )
  const dots = useMemo(
    () => new Set([...(states.marks?.keys() ?? []), ...(down ?? [])]),
    [states.marks, down],
  )
  const scrolls = keySize !== 'piano'
  const white = WHITE_WIDTH[keySize](span.whites)

  const step = (by: -1 | 1) => {
    const element = scroller.current
    if (!element || element.scrollWidth <= element.clientWidth) return
    element.scrollTo({
      left: scrollByOctave(element, PIANO_LAYOUT.whites, by),
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

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
    <div className={cn('flex flex-col', className)}>
      <div className="relative flex h-11 shrink-0 items-end">
        {/* The rail itself, drawn along the strip's foot: the buttons' targets reach above it. */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-7 rounded-t-sm bg-key-rail" />
        {scrolls ? (
          <RailButton label={t('rail.octaveDown')} icon={ChevronLeft} onClick={() => step(-1)} />
        ) : null}
        <div className="relative flex min-w-0 flex-1">
          {map && scrolls ? <KeyboardMap scroller={scroller} dots={dots} /> : null}
        </div>
        {scrolls ? (
          <RailButton label={t('rail.octaveUp')} icon={ChevronRight} onClick={() => step(1)} />
        ) : null}
        {children}
      </div>
      <div
        ref={scroller}
        className={cn(
          '@container flex overflow-x-auto overscroll-x-contain scrollbar-none',
          height === 'fill' ? 'min-h-0 flex-1' : null,
        )}
      >
        <div
          className="flex shrink-0 flex-col"
          style={{ width: `calc(${PIANO_LAYOUT.whites} * ${white})` }}
        >
          <div
            ref={keys}
            role="group"
            aria-label={t('keyboard')}
            onKeyDown={onKeyDown}
            {...pointers.group}
            className={cn(
              'relative bg-key-bed select-none',
              swipe === 'glissando' ? 'touch-none' : 'touch-manipulation',
              height === 'fill' ? 'min-h-0 flex-1' : 'shrink-0',
            )}
            style={
              height === 'proportional'
                ? {
                    height: `clamp(${MIN_KEYS_PX}px, calc(${white} * ${KEY_LENGTH}), ${MAX_KEYS_DVH}dvh)`,
                  }
                : undefined
            }
          >
            {PIANO_LAYOUT.keys.map((key) => (
              <Key
                key={key.midi}
                geometry={key}
                name={nameOf(key.midi)}
                look={keyLook(key.midi, { ...states, marks: shown, down }, { namedKeys, letters })}
                chosen={selectable ? (states.selected?.has(key.midi) ?? false) : undefined}
                tabStop={key.midi === tabStop}
                onPointerPress={pointers.pointerDown}
                onClickPress={pointers.click}
                onFocusKey={setTabStop}
              />
            ))}
            {/* The rail's shade falling on the keys. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
            />
          </div>
          {scrolls ? <FingerRow marks={states.marks} /> : null}
        </div>
      </div>
    </div>
  )
}
