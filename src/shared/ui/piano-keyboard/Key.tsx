import { memo, type PointerEvent } from 'react'
import { BLACK_HEIGHT, cn, type KeyGeometry } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
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
  melody: cn('bg-hand-melody-wash', LABEL_INK),
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
  melody: cn('bg-hand-melody', LABEL_INK),
  tonic: 'bg-key-tonic-down text-on-key-tonic',
  scale: 'bg-key-scale-down text-on-key-scale',
}

interface KeyProps {
  readonly geometry: KeyGeometry
  readonly name: string
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
}

function KeyButton({
  geometry,
  name,
  look,
  chosen,
  tabStop,
  onPointerPress,
  onClickPress,
  onFocusKey,
}: KeyProps) {
  const { black } = geometry
  return (
    <button
      type="button"
      data-midi={geometry.midi}
      data-down={look.down ? '' : undefined}
      aria-label={name}
      aria-pressed={chosen}
      tabIndex={tabStop ? 0 : -1}
      onPointerDown={(event) => onPointerPress(geometry.midi, event)}
      onClick={(event) => onClickPress(geometry.midi, event.detail)}
      onFocus={() => onFocusKey(geometry.midi)}
      className={cn(
        'group absolute top-0 flex flex-col items-center justify-end overflow-hidden pb-2.5 transition duration-80 ease-out outline-none hover:brightness-95',
        black ? 'z-10 rounded-b-xs' : 'rounded-b-sm border-r border-key-bed',
        (look.down ? DOWN : REST)[look.fill],
        look.down ? 'translate-y-0.5' : null,
        look.outlined ? 'ring-3 ring-ring ring-inset' : null,
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
          black ? 'h-2 bg-key-sheen' : 'h-1.5 bg-key-lip',
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
          'absolute inset-x-1 bottom-2 hidden rounded-xs border-2 border-key-focus-halo ring-2 ring-key-focus group-focus-visible:block',
          black ? 'top-1' : null,
        )}
        style={black ? undefined : { top: `calc(${BLACK_HEIGHT}% + 0.25rem)` }}
      />
      {look.letter ? (
        <span aria-hidden className="relative text-xs font-semibold opacity-70">
          {look.letter}
        </span>
      ) : null}
      {look.label ? (
        <span aria-hidden className="relative flex flex-col items-center leading-tight">
          {look.label.caption ? (
            <span className="text-xs font-semibold">{look.label.caption}</span>
          ) : null}
          <span
            className={cn(
              'font-bold tabular-nums',
              look.label.kind === 'name' || look.label.caption ? 'text-xs' : 'text-sm',
            )}
          >
            {look.label.text}
          </span>
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
    a.chosen === b.chosen &&
    a.tabStop === b.tabStop &&
    a.onPointerPress === b.onPointerPress &&
    a.onClickPress === b.onClickPress &&
    a.onFocusKey === b.onFocusKey &&
    sameLook(a.look, b.look),
)
