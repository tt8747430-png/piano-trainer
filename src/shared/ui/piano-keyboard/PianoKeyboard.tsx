import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { PIANO_LAYOUT, spanOf, type KeySize, type NamedKeys, type Swipe } from '@/shared/lib'
import { midi, PIANO, type KeyRange, type Midi } from '@/shared/lib/music'
import { Key } from './Key'
import { keyDescription, keyLook, type KeyStates, type KeyStateWords } from './key-look'
import { useKeyNames } from './use-key-names'
import { useKeyPointers } from './use-key-pointers'
import { useKeyboardScroll } from './use-keyboard-scroll'

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
/** …never shorter than this (All keys on a phone: Songscription's slim keys), unless the screen's share is less… */
export const MIN_KEYS_PX = 56
/** …nor taller than this share of the screen's height (`--keys-most`: less on a phone on its side). */
const MOST_KEYS = 'var(--keys-most)'
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
 * The one keyboard: the whole piano's keys and nothing else (R34, Songscription's): no rail, no
 * caption, no finger numbers; its controls are the screen's bar's. All keys fill the width and never
 * scroll; Fit fills it with its `range`, Large shows fewer, and both scroll sideways. A group named "Keyboard" whose keys are buttons named by note, one of
 * them in the tab order; the arrow keys walk the rest. A key plays the instant it is touched and the
 * keys hold still under a finger (Glissando plays each key a finger slides onto); the keyboard
 * scrolls by a swipe on the keys (Scroll), a trackpad or the wheel, and follows the music by itself.
 */
export function PianoKeyboard({
  range,
  inView,
  fitInView = false,
  keySize = 'fit',
  swipe = 'scroll',
  namedKeys = 'c',
  markNotes = true,
  letters,
  height,
  keyPlays,
  onKeyPress,
  onKeyRelease,
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
  /** The computer keyboard's letters on the keys it plays. */
  letters?: ReadonlyMap<Midi, string> | undefined
  /**
   * The keys' height the learner set with the divider (px); else a piano's proportion, never over the
   * screen's share.
   */
  height?: number | undefined
  /**
   * What a key plays when a hand presses it: the key alone, unless the screen makes it more (a
   * degree's key its chord). All of it is down while the key is held.
   */
  keyPlays?: ((key: Midi) => readonly Midi[]) | undefined
  /** Every key does something: a key that did nothing would be a dead end. */
  onKeyPress: (key: Midi) => void
  /** A key a hand pressed is let go: lifted, left, or (pressed with no pointer) at once. */
  onKeyRelease?: ((key: Midi) => void) | undefined
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
  const { pointerDown } = pointers
  // One handler for every key, held for good: a key whose look stays the same never renders again
  // as the music moves on (R32: a fresh handler re-rendered all 88 keys on every beat).
  const onPointerPress = useCallback(
    (at: Midi, event: PointerEvent<HTMLElement>) => {
      // A key clicked takes no focus, yet Tab comes back to it.
      setTabStop(at)
      pointerDown(at, event)
    },
    [pointerDown],
  )

  const down = useMemo(() => {
    if (pointers.pressed.size === 0) return states.down
    const pressed = keyPlays ? [...pointers.pressed].flatMap(keyPlays) : pointers.pressed
    return new Set([...(states.down ?? []), ...pressed])
  }, [states.down, pointers.pressed, keyPlays])
  const asked = useWidestAsked(fitInView ? inView : undefined, range)
  const white =
    keySize === 'fit' && asked > 0
      ? fitWidth(span.whites, asked)
      : WHITE_WIDTH[keySize](span.whites)
  useKeyboardScroll(scroller, PIANO_LAYOUT.keys, span, inView, keySize, white)

  // The 88 keys' looks, worked out again only when what they show changes: the screen around them
  // renders on every beat, the keys only as theirs change (R32).
  const { marks, lit, selected, outlined, wrong } = states
  const { click } = pointers
  const keyButtons = useMemo(
    () =>
      PIANO_LAYOUT.keys.map((key) => {
        const look = keyLook(
          key.midi,
          { marks, lit, selected, outlined, wrong, down },
          { namedKeys, letters, markNotes },
        )
        return (
          <Key
            key={key.midi}
            geometry={key}
            name={names.get(key.midi) ?? ''}
            description={keyDescription(look, words)}
            look={look}
            chosen={selected?.has(key.midi)}
            tabStop={key.midi === tabStop}
            onPointerPress={onPointerPress}
            onClickPress={click}
            onFocusKey={setTabStop}
          />
        )
      }),
    [
      marks,
      lit,
      selected,
      outlined,
      wrong,
      down,
      namedKeys,
      letters,
      markNotes,
      names,
      words,
      tabStop,
      onPointerPress,
      click,
    ],
  )

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
      className="@container flex overflow-x-auto overscroll-x-contain scrollbar-none"
    >
      <div
        ref={keys}
        role="group"
        aria-label={t('keyboard')}
        onKeyDown={onKeyDown}
        {...pointers.group}
        className="relative shrink-0 touch-none bg-key-bed select-none"
        style={{
          width: `calc(${PIANO_LAYOUT.whites} * ${white})`,
          height:
            height === undefined
              ? keysLength(`calc(${white} * ${KEY_LENGTH})`, MOST_KEYS)
              : `${height}px`,
        }}
      >
        {keyButtons}
        {/* The key slip's felt along the keys' far end, and the case's shade falling under it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1 z-20 h-2 bg-linear-to-b from-key-shade to-transparent"
        />
        <span
          aria-hidden
          data-slot="key-felt"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 key-felt"
        />
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
