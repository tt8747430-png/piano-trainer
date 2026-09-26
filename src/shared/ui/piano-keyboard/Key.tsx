import { memo, type PointerEvent } from 'react'
import { cn, type KeyGeometry } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { ROLE_BG } from '../role-classes'
import { sameLook, type KeyFill, type KeyLook } from './key-look'

const FILL: Readonly<Record<KeyFill, string>> = {
  white: 'bg-key-white text-on-key-white',
  black: 'bg-key-black text-on-key-black',
  lit: 'bg-primary text-primary-foreground',
  selected: 'bg-primary text-primary-foreground',
  wrong: 'bg-destructive text-on-role',
  root: cn(ROLE_BG.root, 'text-on-role'),
  '3rd': cn(ROLE_BG['3rd'], 'text-on-role'),
  '5th': cn(ROLE_BG['5th'], 'text-on-role'),
  '7th': cn(ROLE_BG['7th'], 'text-on-role'),
  '9th': cn(ROLE_BG['9th'], 'text-on-role'),
  '11th': cn(ROLE_BG['11th'], 'text-on-role'),
  '13th': cn(ROLE_BG['13th'], 'text-on-role'),
  rh: 'bg-hand-rh text-on-role',
  lh: 'bg-hand-lh text-on-role',
  melody: 'bg-hand-melody text-on-role',
  tonic: 'bg-key-tonic text-on-key-tonic',
  scale: 'bg-key-scale text-on-key-scale',
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
  const plain = look.fill === 'white' || look.fill === 'black'
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
        'absolute top-0 flex flex-col items-center justify-end overflow-hidden pb-2.5 transition duration-80 ease-out outline-none hover:brightness-95 focus-visible:z-30 focus-visible:ring-3 focus-visible:ring-ring',
        black ? 'z-10 rounded-b-xs' : 'rounded-b-sm border-r border-key-bed',
        look.down && plain ? 'bg-key-down text-on-key-down' : FILL[look.fill],
        look.down ? 'translate-y-0.5' : null,
        look.outlined ? 'ring-3 ring-primary ring-inset' : null,
      )}
      style={{
        left: `${geometry.left}%`,
        width: `${geometry.width}%`,
        height: `${geometry.height}%`,
      }}
    >
      {/* A coloured key going down keeps its colour under a tint. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 bg-key-down-tint opacity-0 transition-opacity duration-80 ease-out',
          look.down && !plain ? 'opacity-100' : null,
        )}
      />
      {/* The key's front: a white key's lip, a black key's slope, shortened while the key is down. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 origin-bottom transition duration-80 ease-out',
          black ? 'h-2 bg-key-sheen' : 'h-1.5 bg-key-lip',
          look.down ? 'scale-y-33' : null,
        )}
      />
      {look.letter ? (
        <span aria-hidden className="relative text-xs font-semibold opacity-70">
          {look.letter}
        </span>
      ) : null}
      {look.label ? (
        <span
          aria-hidden
          className={cn(
            'relative font-bold tabular-nums',
            look.label.kind === 'name' ? 'text-xs' : 'text-sm',
          )}
        >
          {look.label.text}
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
