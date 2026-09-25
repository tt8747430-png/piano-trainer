import { memo } from 'react'
import { cn, type KeyGeometry } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { ROLE_BG } from '../role-classes'
import { sameLook, type KeyFill, type KeyLook } from './key-look'

const FILL: Readonly<Record<KeyFill, string>> = {
  white: 'bg-key-white',
  black: 'bg-key-black',
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
}

interface KeyProps {
  readonly geometry: KeyGeometry
  readonly name: string
  readonly look: KeyLook
  /** aria-pressed where the keys are toggles. */
  readonly chosen: boolean | undefined
  /** The keyboard's one key in the tab order. */
  readonly tabStop: boolean
  readonly onPress: (key: Midi) => void
  readonly onFocusKey: (key: Midi) => void
}

function KeyButton({ geometry, name, look, chosen, tabStop, onPress, onFocusKey }: KeyProps) {
  const plain = look.fill === 'white' || look.fill === 'black'
  return (
    <button
      type="button"
      data-midi={geometry.midi}
      data-down={look.down ? '' : undefined}
      aria-label={name}
      aria-pressed={chosen}
      tabIndex={tabStop ? 0 : -1}
      onClick={() => onPress(geometry.midi)}
      onFocus={() => onFocusKey(geometry.midi)}
      className={cn(
        'absolute top-0 flex items-end justify-center overflow-hidden transition-colors duration-80 ease-out outline-none hover:brightness-95 active:brightness-90 focus-visible:z-20 focus-visible:ring-3 focus-visible:ring-ring',
        geometry.black
          ? 'z-10 rounded-b-xs pb-1.5'
          : 'rounded-b-sm border border-t-0 border-key-white-edge pb-2.5',
        look.down && plain ? 'bg-key-down' : FILL[look.fill],
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
      {look.band ? (
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-0 bottom-0 grid h-2/5 place-items-center text-sm font-bold tabular-nums',
            geometry.black
              ? 'rounded-b-xs bg-key-mark-black text-on-key-mark-black'
              : 'rounded-b-sm bg-key-mark text-on-key-mark',
          )}
        >
          {look.label}
        </span>
      ) : look.label ? (
        <span aria-hidden className="relative text-sm font-bold tabular-nums">
          {look.label}
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
    a.onPress === b.onPress &&
    a.onFocusKey === b.onFocusKey &&
    sameLook(a.look, b.look),
)
