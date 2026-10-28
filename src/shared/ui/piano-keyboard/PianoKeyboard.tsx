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
  PIANO_LAYOUT,
  spanOf,
  type KeyLength,
  type KeySize,
  type NamedKeys,
  type Swipe,
} from '@/shared/lib'
import { midi, PIANO, type KeyRange, type Midi } from '@/shared/lib/music'
import { FingerRow } from './FingerRow'
import { Key } from './Key'
import { KeyRail, type RailCaption } from './KeyRail'
import { keyDescription, keyLook, type KeyStates, type KeyStateWords } from './key-look'
import { useKeyNames } from './use-key-names'
import { useKeyPointers } from './use-key-pointers'
import { useKeyboardScroll } from './use-keyboard-scroll'
import { useSizeCaption } from './use-size-caption'

/** Fit's white keys: never narrower than this, so a finger finds them; past it the keyboard scrolls… */
const MIN_WHITE_PX = 34
/** Where the keys asked to be in sight must all fit (`fitInView`), Fit narrows them to this at most. */
const NARROWEST_FIT_PX = 22
/** …nor wider than this: a wide screen shows the neighbouring keys instead. */
const MAX_WHITE_PX = 48
/** Large keys: about an octave in view on a phone. */
const LARGE_WHITE_PX = 56
/**
 * A key is this many times as long as a white key is wide, on every screen and in a chord's diagram:
 * a piano's proportion…
 */
export const KEY_LENGTH = 4.4
/** Short keys: about two thirds as long, leaving the page more of the screen. */
const SHORT_KEY_LENGTH = 3
/** …never shorter than this, unless the screen's share for them is less… */
const MIN_KEYS_PX = 96
/** …nor taller than this share of the screen's height (`--keys-most`: less on a phone on its side). */
const MOST_KEYS = 'var(--keys-most)'
/** Short keys' share: two thirds of the keys'. */
const MOST_SHORT_KEYS = `calc(${MOST_KEYS} * 2 / 3)`
/** The keys' length between their shortest and `most`: on a short screen the share wins. */
const keysLength = (length: string, most: string) =>
  `clamp(min(${MIN_KEYS_PX}px, ${most}), ${length}, ${most})`

/** A white key's width for each key size, as CSS in the scroller's container units. */
const WHITE_WIDTH: Readonly<Record<KeySize, (whitesInRange: number) => string>> = {
  fit: (whites) => `clamp(${MIN_WHITE_PX}px, 100cqw / ${whites}, ${MAX_WHITE_PX}px)`,
  large: () => `${LARGE_WHITE_PX}px`,
  piano: () => `calc(100cqw / ${PIANO_LAYOUT.whites})`,
}

/**
 * Fit's white key where `whites` keys asked to be in sight must fit the width: its narrowest gives way
 * to them, down to `NARROWEST_FIT_PX`.
 */
const fitWidth = (whitesInRange: number, whitesAsked: number) =>
  `clamp(max(${NARROWEST_FIT_PX}px, min(${MIN_WHITE_PX}px, 100cqw / ${whitesAsked})), 100cqw / ${whitesInRange}, ${MAX_WHITE_PX}px)`

/** Where the arrow keys, Home and End take the keyboard's tab stop. */
const MOVES: Readonly<Partial<Record<string, (key: Midi) => Midi>>> = {
  ArrowLeft: (key) => midi(Math.max(PIANO.from, key - 1)),
  ArrowRight: (key) => midi(Math.min(PIANO.to, key + 1)),
  Home: () => PIANO.from,
  End: () => PIANO.to,
}

/**
 * The one keyboard: the whole piano hung from its rail, scrolling sideways, its `range`
 * filling the width at Fit. A group named "Keyboard" whose keys are buttons named by note, one of
 * them in the tab order; the arrow keys walk the rest. A key plays the instant it is touched and the
 * keys hold still under a finger (Glissando plays each key a finger slides onto); the keyboard
 * scrolls by a swipe on the keys (Scroll) or its rail, by ‹ ›, a trackpad or the wheel.
 */
export function PianoKeyboard({
  range,
  inView,
  fitInView = false,
  keySize = 'fit',
  swipe = 'scroll',
  namedKeys = 'c',
  markNotes = true,
  keyLength = 'long',
  letters,
  caption,
  railEnd,
  keyPlays,
  onKeyPress,
  onKeyRelease,
  children,
  ...states
}: KeyStates & {
  /** The keys that fill the keyboard's width at Fit; the rest of the piano scrolls in beside them. */
  range: KeyRange
  /** Keys to keep in sight: it opens centred on them (else on its range) and scrolls to them when out of sight. */
  inView?: KeyRange | undefined
  /**
   * Fit narrows its keys until the widest span `inView` has asked for fits the width (the Player's:
   * Wait mode's chord across both hands). It narrows only as a wider span is asked, never back, so
   * the keys hold still (ADR 0062).
   */
  fitInView?: boolean
  keySize?: KeySize
  swipe?: Swipe
  /** Which keys carry their note's name: every C (the default), every key, or none. */
  namedKeys?: NamedKeys
  /** A marked key names its note under its degree (the default), or shows its degree alone. */
  markNotes?: boolean
  /** A piano's proportion (the default), or short keys, at most two thirds as tall. */
  keyLength?: KeyLength
  /** The computer keyboard's letters on the keys it plays. */
  letters?: ReadonlyMap<Midi, string> | undefined
  /** What the rail says of the keys a hand holds (their chord): nothing while its `text` is empty. */
  caption?: RailCaption | undefined
  /** The rail's last control, always in sight (a page's Hide the keys). */
  railEnd?: ReactNode
  /**
   * What a key plays when a hand presses it: the key alone, unless the screen makes it more (a
   * degree's key its chord). All of it is down while the key is held.
   */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
  /** Every key does something: a key that did nothing would be a dead end. */
  onKeyPress: (key: Midi) => void
  /** A key a hand pressed is let go: lifted, left, or (pressed with no pointer) at once. */
  onKeyRelease?: ((key: Midi) => void) | undefined
  /** The rail's trailing controls: `RailGroup`s of `RailButton`s. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  const scroller = useRef<HTMLDivElement>(null)
  const keys = useRef<HTMLDivElement>(null)
  const names = useKeyNames()
  const words = useMemo<KeyStateWords>(
    () => ({
      wrong: t('keyState.wrong'),
      missing: t('keyState.missing'),
      lit: t('keyState.lit'),
      roles: {
        root: t('role.root'),
        '3rd': t('role.3rd'),
        '5th': t('role.5th'),
        '7th': t('role.7th'),
        '9th': t('role.9th'),
        '11th': t('role.11th'),
        '13th': t('role.13th'),
      },
    }),
    [t],
  )
  const [tabStop, setTabStop] = useState<Midi>(range.from)
  const { from, to } = range
  const span = useMemo(() => spanOf(PIANO_LAYOUT.keys, { from, to }), [from, to])

  // Keys hold one handler for good, so they re-render only when their own look changes.
  const latestPress = useRef(onKeyPress)
  const latestRelease = useRef(onKeyRelease)
  useLayoutEffect(() => {
    latestPress.current = onKeyPress
    latestRelease.current = onKeyRelease
  })
  const press = useCallback((key: Midi) => latestPress.current(key), [])
  const letGo = useCallback((key: Midi) => latestRelease.current?.(key), [])
  const pointers = useKeyPointers({ swipe, keys, scroller, onPress: press, onRelease: letGo })

  const down = useMemo(() => {
    if (pointers.pressed.size === 0) return states.down
    const pressed = keyPlays ? [...pointers.pressed].flatMap(keyPlays) : pointers.pressed
    return new Set([...(states.down ?? []), ...pressed])
  }, [states.down, pointers.pressed, keyPlays])
  const scrolls = keySize !== 'piano'
  const asked = useWidestAsked(fitInView ? inView : undefined, range)
  const white =
    keySize === 'fit' && asked > 0
      ? fitWidth(span.whites, asked)
      : WHITE_WIDTH[keySize](span.whites)
  useKeyboardScroll(scroller, PIANO_LAYOUT.keys, span, inView, keySize, white)
  // A key size just chosen says for a moment what it shows, over the page's own caption.
  const sizeCaption = useSizeCaption(scroller, keySize)

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
      data-slot="keys-scroller"
      className="@container flex overflow-x-auto overscroll-x-contain rounded-t-sm scrollbar-none"
    >
      <div
        className="flex shrink-0 flex-col"
        style={{ width: `calc(${PIANO_LAYOUT.whites} * ${white})` }}
      >
        <KeyRail
          scroller={scroller}
          scrolls={scrolls}
          caption={sizeCaption ?? caption}
          end={railEnd}
        >
          {children}
        </KeyRail>
        <div
          ref={keys}
          role="group"
          aria-label={t('keyboard')}
          onKeyDown={onKeyDown}
          {...pointers.group}
          className="relative shrink-0 touch-none bg-key-bed select-none"
          style={{
            height:
              keyLength === 'short'
                ? keysLength(`calc(${white} * ${SHORT_KEY_LENGTH})`, MOST_SHORT_KEYS)
                : keysLength(`calc(${white} * ${KEY_LENGTH})`, MOST_KEYS),
          }}
        >
          {PIANO_LAYOUT.keys.map((key) => {
            const look = keyLook(key.midi, { ...states, down }, { namedKeys, letters, markNotes })
            return (
              <Key
                key={key.midi}
                geometry={key}
                name={names.get(key.midi) ?? ''}
                description={keyDescription(look, words)}
                look={look}
                chosen={states.selected?.has(key.midi)}
                tabStop={key.midi === tabStop}
                onPointerPress={(at, event) => {
                  // A key clicked takes no focus, yet Tab comes back to it.
                  setTabStop(at)
                  pointers.pointerDown(at, event)
                }}
                onClickPress={pointers.click}
                onFocusKey={setTabStop}
              />
            )
          })}
          {/* The rail's shade falling on the keys. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
          />
        </div>
        {scrolls ? <FingerRow marks={states.marks} /> : null}
      </div>
    </div>
  )
}

/**
 * The most white keys `inView` has asked to see at once on these keys (`range`), 0 where none is
 * asked; a new range starts again.
 */
function useWidestAsked(inView: KeyRange | undefined, range: KeyRange): number {
  const whites = inView ? spanOf(PIANO_LAYOUT.keys, inView).whites : 0
  const of = `${range.from}-${range.to}`
  const [widest, setWidest] = useState({ of, whites })
  if (widest.of !== of || whites > widest.whites) {
    const next = { of, whites: widest.of === of ? Math.max(whites, widest.whites) : whites }
    setWidest(next)
    return next.whites
  }
  return widest.whites
}
