import type { ReactNode } from 'react'

/**
 * The drawings of Settings' picture choices (R21), as iOS's Light/Dark and macOS's Dock position
 * show theirs: each option a small picture of what it looks like, in the current ink, 64 × 40.
 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 40"
      aria-hidden
      className="h-10 w-16 shrink-0"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

/** Where a white key's black neighbours sit within an octave of seven. */
const BLACK = [0, 1, 3, 4, 5] as const

/** A row of keys: `whites` white keys from `x` over `width`, `height` tall, the black keys over them. */
function Keys({
  x,
  y,
  width,
  height,
  whites,
  names = 'none',
}: {
  x: number
  y: number
  width: number
  height: number
  whites: number
  names?: 'c' | 'all' | 'none'
}) {
  const step = width / whites
  return (
    <g>
      {Array.from({ length: whites }, (_, i) => (
        <rect
          key={`w${i}`}
          x={x + i * step}
          y={y}
          width={step}
          height={height}
          strokeWidth={0.6}
          className="fill-background stroke-current"
        />
      ))}
      {Array.from({ length: whites - 1 }, (_, i) =>
        BLACK.includes((i % 7) as (typeof BLACK)[number]) ? (
          <rect
            key={`b${i}`}
            x={x + (i + 1) * step - step * 0.3}
            y={y}
            width={step * 0.6}
            height={height * 0.6}
            className="fill-current"
          />
        ) : null,
      )}
      {names === 'none'
        ? null
        : Array.from({ length: whites }, (_, i) =>
            names === 'all' || i % 7 === 0 ? (
              <circle
                key={`n${i}`}
                cx={x + i * step + step / 2}
                cy={y + height - Math.min(3, height / 5)}
                r={Math.min(1.4, step / 3)}
                className="fill-primary"
              />
            ) : null,
          )}
    </g>
  )
}

/** Key size: the whole piano small, the page's keys fitted, or a few large. */
export function KeySizePicture({ size }: { size: 'piano' | 'fit' | 'large' }) {
  const whites = size === 'piano' ? 26 : size === 'fit' ? 14 : 7
  return (
    <Frame>
      <Keys x={4} y={12} width={56} height={18} whites={whites} />
    </Frame>
  )
}

/** Key length: a tall key or a short one. */
export function KeyLengthPicture({ length }: { length: 'long' | 'short' }) {
  const height = length === 'long' ? 32 : 16
  return (
    <Frame>
      <Keys x={14} y={4} width={36} height={height} whites={5} />
    </Frame>
  )
}

/** Note names: a dot on every C, on every key, or on none. */
export function NoteNamesPicture({ names }: { names: 'c' | 'all' | 'none' }) {
  return (
    <Frame>
      <Keys x={4} y={8} width={56} height={24} whites={10} names={names} />
    </Frame>
  )
}

/** A page's outline, its lines of text, and the keys at its foot or under its title. */
function Page({ keys }: { keys: 'top' | 'bottom' | 'none' }) {
  return (
    <>
      <rect
        x={14}
        y={1}
        width={36}
        height={38}
        rx={3}
        strokeWidth={0.9}
        className="fill-none stroke-current"
      />
      <rect x={18} y={4.5} width={14} height={2.4} rx={1} className="fill-current" />
      {(keys === 'top'
        ? [22, 26, 30]
        : keys === 'bottom'
          ? [11, 15, 19]
          : [11, 16, 21, 26, 31]
      ).map((y) => (
        <line
          key={y}
          x1={18}
          x2={46}
          y1={y}
          y2={y}
          strokeWidth={1}
          className="stroke-current opacity-40"
        />
      ))}
      {keys === 'none' ? null : (
        <Keys x={16} y={keys === 'top' ? 9 : 25} width={32} height={10} whites={8} />
      )}
    </>
  )
}

/** Keyboard position: the keys at the page's foot, or at its top. */
export function DockPicture({ dock }: { dock: 'top' | 'bottom' }) {
  return (
    <Frame>
      <Page keys={dock} />
    </Frame>
  )
}

/** A phone on its side. */
function SidePhone({ keys }: { keys: boolean }) {
  return (
    <>
      <rect
        x={6}
        y={8}
        width={52}
        height={26}
        rx={4}
        strokeWidth={0.9}
        className="fill-none stroke-current"
      />
      {keys ? (
        <Keys x={10} y={22} width={44} height={9} whites={12} />
      ) : (
        [14, 19, 24, 29].map((y) => (
          <line
            key={y}
            x1={11}
            x2={53}
            y1={y}
            y2={y}
            strokeWidth={1}
            className="stroke-current opacity-40"
          />
        ))
      )}
    </>
  )
}

/** Fold the keyboard: never (the keys in sight), on a phone on its side, or always. */
export function FoldPicture({ fold }: { fold: 'never' | 'side' | 'always' }) {
  return (
    <Frame>
      {fold === 'side' ? (
        <SidePhone keys={false} />
      ) : (
        <Page keys={fold === 'never' ? 'bottom' : 'none'} />
      )}
    </Frame>
  )
}

/** A swipe on the keys: the keys scroll under a hand, or a glissando sweeps over them. */
export function SwipePicture({ swipe }: { swipe: 'scroll' | 'glissando' }) {
  return (
    <Frame>
      <Keys x={4} y={14} width={56} height={22} whites={12} />
      {swipe === 'scroll' ? (
        <path
          d="M20 7 H44 M24 3.5 L20 7 L24 10.5 M40 3.5 L44 7 L40 10.5"
          strokeWidth={1.4}
          className="fill-none stroke-current"
        />
      ) : (
        <path
          d="M10 30 C22 22 34 22 54 18 M50 15 L54 18 L50 21.5"
          strokeWidth={1.6}
          className="fill-none stroke-primary"
        />
      )}
    </Frame>
  )
}

/** A screen in miniature, light or dark, or split for the system's. */
function Screen({ x, dark }: { x: number; dark: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={4}
        width={24}
        height={32}
        rx={3}
        strokeWidth={0.9}
        className={dark ? 'fill-neutral-800 stroke-current' : 'fill-white stroke-current'}
      />
      <rect
        x={x + 3}
        y={8}
        width={10}
        height={2.4}
        rx={1}
        className={dark ? 'fill-neutral-200' : 'fill-neutral-700'}
      />
      {[14, 19, 24].map((y) => (
        <line
          key={y}
          x1={x + 3}
          x2={x + 21}
          y1={y}
          y2={y}
          strokeWidth={1}
          className={dark ? 'stroke-neutral-500' : 'stroke-neutral-300'}
        />
      ))}
    </g>
  )
}

/** Theme: the system's (light and dark side by side), light, or dark. */
export function ThemePicture({ theme }: { theme: 'system' | 'light' | 'dark' }) {
  return (
    <Frame>
      {theme === 'system' ? (
        <>
          <Screen x={7} dark={false} />
          <Screen x={33} dark />
        </>
      ) : (
        <Screen x={20} dark={theme === 'dark'} />
      )}
    </Frame>
  )
}
