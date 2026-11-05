import { memo, useId, type PointerEvent } from 'react'
import { BLACK_HEIGHT, cn, type KeyGeometry } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { Glyph } from '../Glyph'
import { ROLE_BG, ROLE_WASH } from '../role-classes'
import { sameLook, type KeyFill, type KeyLook } from './key-look'

const LABEL_INK = 'text-on-role'

/** A key at rest: plain, or a mark's pale wash (the book's paint before the key is played). */
const REST: Readonly<Record<KeyFill, string>> = {
  white: 'bg-key-white text-on-key-white',
  black: 'bg-key-black text-on-key-black',
  lit: 'bg-primary text-primary-foreground',
  selected: 'bg-primary text-primary-foreground',
  wrong: 'bg-destructive text-destructive-foreground',
  root: cn(ROLE_WASH.root, LABEL_INK),
  '3rd': cn(ROLE_WASH['3rd'], LABEL_INK),
  '5th': cn(ROLE_WASH['5th'], LABEL_INK),
  '7th': cn(ROLE_WASH['7th'], LABEL_INK),
  '9th': cn(ROLE_WASH['9th'], LABEL_INK),
  '11th': cn(ROLE_WASH['11th'], LABEL_INK),
  '13th': cn(ROLE_WASH['13th'], LABEL_INK),
  rh: cn('bg-hand-rh-wash', LABEL_INK),
  lh: cn('bg-hand-lh-wash', LABEL_INK),
  staff: cn('bg-hand-staff-wash', LABEL_INK),
  tonic: 'bg-key-tonic text-on-key-tonic',
  scale: 'bg-key-scale text-on-key-scale',
}

/** A key that sounds or is held: a plain key turns Key Down, a mark its full paint. */
const DOWN: Readonly<Record<KeyFill, string>> = {
  ...REST,
  white: 'bg-key-down text-on-key-down',
  black: 'bg-key-down text-on-key-down',
  root: cn(ROLE_BG.root, LABEL_INK),
  '3rd': cn(ROLE_BG['3rd'], LABEL_INK),
  '5th': cn(ROLE_BG['5th'], LABEL_INK),
  '7th': cn(ROLE_BG['7th'], LABEL_INK),
  '9th': cn(ROLE_BG['9th'], LABEL_INK),
  '11th': cn(ROLE_BG['11th'], LABEL_INK),
  '13th': cn(ROLE_BG['13th'], LABEL_INK),
  rh: cn('bg-hand-rh', LABEL_INK),
  lh: cn('bg-hand-lh', LABEL_INK),
  staff: cn('bg-hand-staff', LABEL_INK),
  tonic: 'bg-key-tonic-down text-on-key-tonic',
  scale: 'bg-key-scale-down text-on-key-scale',
}

/**
 * A key's face as a real piano's (R33): light and shade over its fill, so every mark keeps its colour;
 * a key down sinks, darker under the felt, its shadow gone.
 */
const FACE = {
  white: { rest: 'key-face-white', down: 'key-face-white-down' },
  black: { rest: 'key-face-black', down: 'key-face-black-down' },
} as const

interface KeyProps {
  readonly geometry: KeyGeometry
  readonly name: string
  /** What it says after its note: what its mark prints, and whether it is wrong, missing or played. */
  readonly description: string
  readonly look: KeyLook
  /** aria-pressed where the keys are toggles. */
  readonly chosen: boolean | undefined
  /** The keyboard's one key in the tab order. */
  readonly tabStop: boolean
  /** A pointer went down on the key: it plays at once. */
  readonly onPointerPress: (key: Midi, event: PointerEvent<HTMLElement>) => void
  /** A click, with its click count (0 for a click no pointer made): it plays unless a pointer's press already did. */
  readonly onClickPress: (key: Midi, clickCount: number) => void
  readonly onFocusKey: (key: Midi) => void
  /**
   * All keys across the screen (R34): on a phone's narrow keys only middle C keeps its name, small
   * and on one line over its neighbours (Songscription's), and a mark's note name goes.
   */
  readonly slim: boolean
}

/** Middle C: the one key named on a phone's narrow keys. */
const MIDDLE_C = 60
/** A phone's narrow keys (a white key under 12px): the keys' container is under 39rem. */
const SLIM = {
  key: '@max-[39rem]:overflow-visible',
  label: 'z-5 @max-[39rem]:px-0 @max-[39rem]:whitespace-nowrap @max-[39rem]:wrap-normal',
  text: '@max-[39rem]:text-[0.5rem]',
  gone: '@max-[39rem]:hidden',
} as const

function KeyButton({
  geometry,
  name,
  description,
  look,
  chosen,
  tabStop,
  onPointerPress,
  onClickPress,
  onFocusKey,
  slim,
}: KeyProps) {
  const { black } = geometry
  const descriptionId = useId()
  return (
    <button
      type="button"
      data-midi={geometry.midi}
      data-down={look.down ? '' : undefined}
      aria-label={name}
      aria-describedby={description ? descriptionId : undefined}
      aria-pressed={chosen}
      tabIndex={tabStop ? 0 : -1}
      onPointerDown={(event) => onPointerPress(geometry.midi, event)}
      // A key clicked takes no focus, so Space after it is the sustain pedal's, not a press of the
      // key; a key reached by Tab is pressed by Space and Enter as any button.
      onMouseDown={(event) => event.preventDefault()}
      onClick={(event) => onClickPress(geometry.midi, event.detail)}
      onFocus={() => onFocusKey(geometry.midi)}
      className={cn(
        'group absolute top-0 flex flex-col items-center justify-end overflow-hidden pb-2.5 transition duration-80 ease-out outline-none hover:brightness-95',
        black ? 'z-10 rounded-b-key-black' : 'rounded-b-key-white border-r border-key-bed',
        FACE[black ? 'black' : 'white'][look.down ? 'down' : 'rest'],
        (look.down ? DOWN : REST)[look.fill],
        look.down ? 'translate-y-0.5' : null,
        look.outlined ? 'ring-3 ring-ring ring-inset' : null,
        slim && !black ? SLIM.key : null,
      )}
      style={{
        left: `${geometry.left}%`,
        width: `${geometry.width}%`,
        height: `${geometry.height}%`,
      }}
    >
      {/* The key's front: a white key's lip, a black key's slope, shortened while the key is down. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 origin-bottom transition duration-80 ease-out',
          black ? 'h-2 key-front-black' : 'h-1.5 key-lip-white',
          look.down ? 'scale-y-33' : null,
        )}
      />
      {/*
        The focus ring, on the face a finger touches (a black key whole, a white key below the black
        keys), so the key keeps its place under its neighbours.
      */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-1 bottom-2 hidden rounded-key-black border-2 border-key-focus-halo ring-2 ring-key-focus group-focus-visible:block',
          black ? 'top-1' : null,
        )}
        style={black ? undefined : { top: `calc(${BLACK_HEIGHT}% + 0.25rem)` }}
      />
      {description ? (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      ) : null}
      {look.letter ? (
        <Glyph text={look.letter} className="relative key-cap rounded-key-black font-semibold" />
      ) : null}
      {look.label ? (
        <span
          aria-hidden
          className={cn(
            'relative flex w-full flex-col items-center px-0.5 text-center leading-tight wrap-anywhere transition-opacity duration-200 ease-out',
            look.label.ghost && 'opacity-40',
            slim && SLIM.label,
            slim && look.label.kind === 'name' && geometry.midi !== MIDDLE_C && SLIM.gone,
          )}
        >
          {look.label.caption ? (
            <Glyph text={look.label.caption} className="text-xs font-semibold" />
          ) : null}
          <Glyph
            text={look.label.text}
            className={cn(
              'font-bold tabular-nums',
              look.label.kind === 'name' || look.label.caption ? 'text-xs' : 'text-sm',
              slim && SLIM.text,
            )}
          />
          {look.label.note ? (
            <Glyph
              text={look.label.note}
              className={cn('text-xs font-semibold opacity-80', slim && SLIM.gone)}
            />
          ) : null}
        </span>
      ) : null}
    </button>
  )
}

/** One key of the keyboard: re-renders only when its own look, name or place in the tab order change. */
export const Key = memo(
  KeyButton,
  (a, b) =>
    a.geometry === b.geometry &&
    a.name === b.name &&
    a.description === b.description &&
    a.chosen === b.chosen &&
    a.tabStop === b.tabStop &&
    a.onPointerPress === b.onPointerPress &&
    a.onClickPress === b.onClickPress &&
    a.onFocusKey === b.onFocusKey &&
    a.slim === b.slim &&
    sameLook(a.look, b.look),
)
