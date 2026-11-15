import { ChevronDown, Play, Square, type LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ButtonLink } from './ButtonLink'
import { Button } from './primitives/button'

/**
 * Floating acts with no capsule round them, as the canvas's Chords page floats them (Apple's
 * toolbars on glass, iOS 26): each its own piece of glass, 56 tall, 12 apart, centred at the foot;
 * the one primary tinted honey. Put inside `FloatingActions`.
 */
export function FloatingPieces({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      className="mx-auto flex items-center justify-center gap-3"
    >
      {/* The page fades out under the pieces alone, as the canvas's 112px edge: clear, then the page
          from 30%, so a page that fits the screen keeps its last row in sight. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-b from-transparent to-background to-30%"
      />
      {children}
    </div>
  )
}

const PIECE =
  'glass h-14 w-18 shrink-0 flex-col gap-0.5 rounded-pill px-1 text-foreground hover:bg-glass active:scale-96 [&_svg:not([class*=size-])]:size-5.5'
const CAPTION =
  'max-w-16 text-center text-[0.6875rem] leading-[1.05] font-semibold whitespace-normal'

/**
 * A piece whose word is one short one (Key, Listen, BPM): round, 56 wide, as the Scales and Exercise
 * boards; a longer word (Russian's Тональность) widens it into a pill rather than spill out.
 */
const ROUND = 'w-auto min-w-14 px-2.5 [&>span:last-child]:max-w-none'

/**
 * A glass piece with its picture over a short word (Voicing's name, Hands): 72 wide, 56 tall, the
 * picture 22, the word 11px semibold; `round`, 56 wide.
 */
export function FloatingPiece({
  label,
  caption,
  round = false,
  className,
  children,
  ...props
}: {
  label: string
  caption: string
  round?: boolean
  children: ReactNode
} & Omit<ComponentProps<typeof Button>, 'children' | 'aria-label'>) {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(PIECE, round && ROUND, className)}
      {...props}
    >
      <span className="flex h-5.5 items-center">{children}</span>
      <span className={CAPTION}>{caption}</span>
    </Button>
  )
}

/** A glass piece that goes somewhere (Practise opens the Player): `render` is the link. */
export function FloatingPieceLink({
  label,
  caption,
  round = false,
  render,
  children,
}: {
  label: string
  caption: string
  /** One short word: round, 56 wide. */
  round?: boolean
  render: ReactElement
  children: ReactNode
}) {
  return (
    <ButtonLink
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(PIECE, round && ROUND)}
      render={render}
    >
      <span className="flex h-5.5 items-center">{children}</span>
      <span className={CAPTION}>{caption}</span>
    </ButtonLink>
  )
}

/**
 * The floating primary of a tool with nothing to choose about how it plays (the Metronome's Start),
 * tinted honey glass, 176 wide: its picture and its word, Stop while it runs.
 */
export function FloatingPlayPiece({
  label,
  stopLabel,
  icon: Icon = Play,
  playing,
  disabled = false,
  onClick,
}: {
  label: string
  stopLabel?: string | undefined
  icon?: LucideIcon | undefined
  playing: boolean
  disabled?: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('common')
  return (
    <button
      type="button"
      aria-pressed={playing}
      disabled={disabled}
      onClick={onClick}
      className="glass-honey flex h-14 min-w-44 shrink-0 items-center justify-center gap-2 rounded-pill px-4 text-base font-bold whitespace-nowrap text-primary-foreground active:scale-96 disabled:opacity-50"
    >
      {playing ? (
        <Square aria-hidden className="size-4.5 fill-current" />
      ) : (
        <Icon aria-hidden className="size-4.5 fill-current" />
      )}
      <span>{playing ? (stopLabel ?? t('stop')) : label}</span>
    </button>
  )
}

/**
 * The floating primary that opens where the playing happens (an exercise's Start, the Player),
 * tinted honey glass, 176 wide as `FloatingPlayPiece`: its picture and its word.
 */
export function FloatingPlayLink({ label, render }: { label: string; render: ReactElement }) {
  return (
    <ButtonLink
      variant="ghost"
      render={render}
      className="glass-honey flex h-14 min-w-44 shrink-0 items-center justify-center gap-2 rounded-pill px-4 text-base font-bold whitespace-nowrap text-primary-foreground hover:bg-transparent active:scale-96"
    >
      <Play aria-hidden className="size-4.5 fill-current" />
      <span>{label}</span>
    </ButtonLink>
  )
}

/**
 * The floating primary that plays, tinted honey glass, 176 wide: Play with its word (Stop while it
 * sounds) and, past a hairline, its menu's chevron (how it plays).
 */
export function FloatingPlaySplit({
  label,
  playing,
  onPlay,
  menuLabel,
  menu,
}: {
  /** What Play says: "Play chord", "Play arpeggio". */
  label: string
  playing: boolean
  onPlay: () => void
  /** The chevron's name: its menu's, how it plays ("Play as"). */
  menuLabel: string
  /** The chevron's menu, rendered from a trigger it is given (`ActionMenu`'s `render`). */
  menu: (trigger: ReactElement) => ReactNode
}) {
  const { t } = useTranslation('common')
  const name = playing ? t('stop') : label
  return (
    <div
      role="group"
      aria-label={label}
      className="glass-honey flex h-14 min-w-44 shrink-0 items-center rounded-pill text-primary-foreground"
    >
      <button
        type="button"
        aria-pressed={playing}
        onClick={onPlay}
        className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-l-pill ps-4 pe-3 text-base font-bold whitespace-nowrap"
      >
        {playing ? (
          <Square aria-hidden className="size-4.5 fill-current" />
        ) : (
          <Play aria-hidden className="size-4.5 fill-current" />
        )}
        <span>{name}</span>
      </button>
      <span aria-hidden className="h-6.5 w-px shrink-0 bg-current opacity-20" />
      {menu(
        <button
          type="button"
          aria-label={menuLabel}
          title={menuLabel}
          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-r-pill"
        >
          <ChevronDown aria-hidden className="size-5" />
        </button>,
      )}
    </div>
  )
}
