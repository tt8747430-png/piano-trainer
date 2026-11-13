import type { useRender } from '@base-ui/react/use-render'
import { Play, Square, type LucideIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ButtonLink } from './ButtonLink'
import { Button } from './primitives/button'

/**
 * How the bar stands: along the screen; upright (`column`); upright only where the floating actions
 * stand beside the page (`aside`, a lesson's bar among them); or upright only on a phone on its side
 * (`landscape-phone`, a full-screen layout's, which has no floating host).
 */
const ORIENTATION = {
  along: 'flex-row w-full max-w-xl p-1.5',
  column: 'flex-col p-1.5',
  aside: 'flex-row w-full max-w-xl p-1.5 aside:w-auto aside:flex-col',
  'landscape-phone':
    'flex-row w-full max-w-xl p-1.5 landscape-phone:w-auto landscape-phone:flex-col',
} as const satisfies Record<string, string>

type Orientation = keyof typeof ORIENTATION

/**
 * The screen's floating bar (the design's dock): one white capsule across the screen's foot, a gutter
 * each side, its controls in a row, the honey primary last, at its right end; a toolbar named by its
 * label. It renders where it is put: inside `FloatingActions`, or in a
 * layout's own grid area where a full-screen screen has no floating host.
 */
export function FloatingBar({
  label,
  orientation = 'along',
  docked = false,
  className,
  children,
}: {
  label: string
  orientation?: Orientation
  /** Docked in its screen's own row (the Player's transport, R31-P): flat, its row's width. */
  docked?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation={orientation === 'column' ? 'vertical' : 'horizontal'}
      className={cn(
        'flex items-center gap-1.5',
        docked
          ? 'w-full justify-between'
          : 'rounded-pill border border-border bg-raised elevation-2',
        ORIENTATION[orientation],
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A bar's control gives under the finger as a floating button does. */
const BAR_BUTTON =
  'size-12 shrink-0 rounded-pill transition-[scale,background-color] duration-150 ease-out active:scale-96'
/** A control that says its name (Practise this scale, Tap tempo): a grey pill taking the room left. */
const WITH_NAME =
  'w-auto min-w-0 flex-1 gap-2 bg-muted px-5 text-base font-semibold hover:brightness-95'
/** A control with a short caption under its picture (the Player's transport, its canvas). */
const WITH_CAPTION =
  'w-auto min-w-12 flex-col gap-0.5 px-2 max-sm:min-w-11 max-sm:px-1 text-[0.6875rem] leading-none font-semibold [&_svg]:size-5'
/** The bar's honey primary: a 48px circle at its right end, its name a wide pill (Start). */
const BAR_PLAY =
  'order-last size-12 shrink-0 rounded-pill hover:brightness-95 [&_svg:not([class*=size-])]:size-5 transition-[scale,filter] duration-150 ease-out active:scale-96'
const PLAY_NAMED = 'w-auto min-w-0 flex-1 gap-2 px-5 text-base font-semibold'

/**
 * One of a bar's controls: a round icon button named by its label (its `title` too, unless a hint
 * of its own says more), or a link looking the same where `render` makes it one. Its children are
 * its icons, which may change with the bar's orientation.
 */
export function FloatingBarButton({
  label,
  title,
  render,
  named = false,
  caption,
  className,
  children,
  ...props
}: {
  label: string
  title?: string
  /** Its name shown beside its icon, where an icon alone was not understood. */
  named?: boolean
  /** A word under its picture: what it is set to (Wait, Both) or what it is (Loop). */
  caption?: string | undefined
  /** A link in place of a button. */
  render?: useRender.RenderProp
  children: ReactNode
} & Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'variant' | 'aria-label' | 'render'
>) {
  if (render)
    return (
      <ButtonLink
        variant="ghost"
        size="icon"
        aria-label={named ? undefined : label}
        title={title ?? label}
        className={cn(BAR_BUTTON, named && WITH_NAME, className)}
        render={render}
      >
        {children}
        {named ? label : null}
      </ButtonLink>
    )
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={named ? undefined : label}
      title={title ?? label}
      className={cn(BAR_BUTTON, named && WITH_NAME, caption && WITH_CAPTION, className)}
      {...props}
    >
      {children}
      {named ? label : null}
      {caption ? <span aria-hidden>{caption}</span> : null}
    </Button>
  )
}

/**
 * The bar's Play, its largest control: the main floating button's honey look, named by what it plays,
 * Stop while it sounds.
 */
export function FloatingBarPlay({
  label,
  title,
  playing,
  icon = Play,
  stopLabel,
  named = false,
  disabled = false,
  className,
  onClick,
}: {
  label: string
  title?: string
  playing: boolean
  /** Its picture while stopped: Play's triangle, or the Recorder's circle. */
  icon?: LucideIcon
  /** What it says while running; Stop by default. */
  stopLabel?: string | undefined
  /** Its name ("Play", "Stop") shown beside its icon. */
  named?: boolean
  /** Its size where a screen needs it smaller: the transport's 48px under 360px. */
  className?: string
  /** Waiting on something else first (the editor's Play while a take records). */
  disabled?: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('common')
  const name = playing ? (stopLabel ?? t('stop')) : label
  const Icon = playing ? Square : icon
  return (
    <Button
      size="icon"
      aria-label={named ? undefined : name}
      title={title ?? name}
      aria-pressed={playing}
      disabled={disabled}
      onClick={onClick}
      className={cn(BAR_PLAY, named && PLAY_NAMED, className)}
    >
      <Icon aria-hidden />
      {named ? name : null}
    </Button>
  )
}
