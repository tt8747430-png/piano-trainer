import type { useRender } from '@base-ui/react/use-render'
import { Play, Square } from 'lucide-react'
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
  along: 'flex-row min-h-14 px-1',
  column: 'flex-col min-w-14 py-1',
  aside: 'flex-row min-h-14 px-1 aside:min-h-0 aside:min-w-14 aside:flex-col aside:px-0 aside:py-1',
  'landscape-phone':
    'flex-row min-h-14 px-1 landscape-phone:min-h-0 landscape-phone:min-w-14 landscape-phone:flex-col landscape-phone:px-0 landscape-phone:py-1',
} as const satisfies Record<string, string>

type Orientation = keyof typeof ORIENTATION

/**
 * A run of controls used again and again (a lesson's ‹ n/m ›, the Player's ‹ ▶ ›) as one floating
 * pill: a toolbar named by its label. It renders where it is put: inside `FloatingActions`, or in a
 * layout's own grid area where a full-screen screen has no floating host.
 */
export function FloatingBar({
  label,
  orientation = 'along',
  className,
  children,
}: {
  label: string
  orientation?: Orientation
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation={orientation === 'column' ? 'vertical' : 'horizontal'}
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-border bg-raised elevation-2',
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
  'size-12 rounded-full transition-[scale,background-color] duration-150 ease-out active:scale-96 active:not-aria-[haspopup]:translate-y-0'
/** The bar's honey Play: the main floating button's size, lifted a little off the pill. */
const BAR_PLAY =
  'size-14 rounded-full elevation-1 hover:brightness-95 [&_svg:not([class*=size-])]:size-6 transition-[scale,filter] duration-150 ease-out active:scale-96 active:not-aria-[haspopup]:translate-y-0'

/**
 * One of a bar's controls: a round icon button named by its label (its `title` too, unless a hint
 * of its own says more), or a link looking the same where `render` makes it one. Its children are
 * its icons, which may change with the bar's orientation.
 */
export function FloatingBarButton({
  label,
  title,
  render,
  className,
  children,
  ...props
}: {
  label: string
  title?: string
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
        aria-label={label}
        title={title ?? label}
        className={cn(BAR_BUTTON, className)}
        render={render}
      >
        {children}
      </ButtonLink>
    )
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      title={title ?? label}
      className={cn(BAR_BUTTON, className)}
      {...props}
    >
      {children}
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
  disabled = false,
  onClick,
}: {
  label: string
  title?: string
  playing: boolean
  /** Waiting on something else first (the editor's Play while a take records). */
  disabled?: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('common')
  const name = playing ? t('stop') : label
  const Icon = playing ? Square : Play
  return (
    <Button
      size="icon"
      aria-label={name}
      title={title ?? name}
      aria-pressed={playing}
      disabled={disabled}
      onClick={onClick}
      className={BAR_PLAY}
    >
      <Icon aria-hidden />
    </Button>
  )
}
