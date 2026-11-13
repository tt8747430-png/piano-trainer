import { ChevronDown, Play, Square } from 'lucide-react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
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
      {/* The page fades out under the pieces, as the canvas's 148px edge: clear, then the page from 30%. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-37 bg-linear-to-b from-transparent to-background to-30%"
      />
      {children}
    </div>
  )
}

/**
 * A glass piece with its picture over a short word (Voicing's name, Hands): 72 wide, 56 tall, the
 * picture 22, the word 11px semibold.
 */
export function FloatingPiece({
  label,
  caption,
  className,
  children,
  ...props
}: {
  label: string
  caption: string
  children: ReactNode
} & Omit<ComponentProps<typeof Button>, 'children' | 'aria-label'>) {
  return (
    <Button
      variant="ghost"
      aria-label={label}
      title={label}
      className={cn(
        'glass h-14 w-18 shrink-0 flex-col gap-0.5 rounded-pill px-1 text-foreground hover:bg-glass active:scale-96 [&_svg:not([class*=size-])]:size-5.5',
        className,
      )}
      {...props}
    >
      <span className="flex h-5.5 items-center">{children}</span>
      <span className="max-w-16 text-center text-[0.6875rem] leading-[1.05] font-semibold whitespace-normal">
        {caption}
      </span>
    </Button>
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
  menu,
}: {
  /** What Play says: "Play chord", "Play arpeggio". */
  label: string
  playing: boolean
  onPlay: () => void
  /** The chevron's menu, rendered from a trigger it is given (`ActionMenu`'s `render`). */
  menu: (trigger: ReactElement) => ReactNode
}) {
  const { t } = useTranslation('common')
  const name = playing ? t('stop') : label
  return (
    <div
      role="group"
      aria-label={label}
      className="glass-honey flex h-14 w-44 shrink-0 items-center rounded-pill"
    >
      <button
        type="button"
        aria-pressed={playing}
        onClick={onPlay}
        className="flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-l-pill ps-4 pe-0.5 text-base font-bold whitespace-nowrap text-foreground"
      >
        {playing ? (
          <Square aria-hidden className="size-4.5 fill-current" />
        ) : (
          <Play aria-hidden className="size-4.5 fill-current" />
        )}
        <span className="truncate">{name}</span>
      </button>
      <span aria-hidden className="h-6.5 w-px shrink-0 bg-foreground/20" />
      {menu(
        <button
          type="button"
          className="flex h-14 w-11 shrink-0 items-center justify-center rounded-r-pill text-foreground"
        >
          <ChevronDown aria-hidden className="size-5" />
        </button>,
      )}
    </div>
  )
}
