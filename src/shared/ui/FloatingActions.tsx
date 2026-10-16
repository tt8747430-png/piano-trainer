import { Ellipsis, Play, Square, type LucideIcon } from 'lucide-react'
import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { ButtonLink } from './ButtonLink'
import { Button } from './primitives/button'

/** Where a screen's floating actions stand along its foot. */
export type FloatingPlace = 'left' | 'center' | 'right'

interface Floating {
  /** The column they stand in; none until the host has drawn it. */
  readonly column: HTMLElement | null
  readonly place: FloatingPlace
  /** Each says its name beside its icon; else the name is its tooltip and its screen reader's. */
  readonly labels: boolean
}

const FloatingContext = createContext<Floating>({ column: null, place: 'right', labels: true })

/**
 * How the actions line up, as the place they stand in: down an edge in a column, its main one
 * lowest; in the middle in a row along the foot, so none climbs over the page's middle.
 */
const ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'flex-col items-start',
  center: 'flex-row items-end',
  right: 'flex-col items-end',
}
/** A dial's own stack stands over its button wherever the actions are. */
const DIAL_ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

/**
 * The one column every screen's floating actions stand in, at the foot of the screen over the tab
 * bar and the keys docked there, the width of the screen beside a rail or a sidebar: down its left
 * or its right edge, or in a row in its middle, as the learner chose, each action with its name or
 * its icon alone.
 */
export function FloatingHost({
  place,
  labels,
  children,
}: {
  place: FloatingPlace
  labels: boolean
  children: ReactNode
}) {
  const [column, setColumn] = useState<HTMLElement | null>(null)
  return (
    <FloatingContext.Provider value={{ column, place, labels }}>
      {children}
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-docked z-20 mb-3 flex px-gutter print:hidden landscape-phone:left-rail landscape-phone:mb-safe-4 lg:left-sidebar lg:mb-safe-4 lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed',
          place === 'left' && 'justify-start',
          place === 'center' && 'justify-center',
          place === 'right' && 'justify-end',
        )}
      >
        <div
          ref={setColumn}
          data-slot="floating-actions"
          className={cn('vt-floating flex gap-3 [&>*]:pointer-events-auto', ALIGN[place])}
        />
      </div>
    </FloatingContext.Provider>
  )
}

/** Whether the floating actions say their names beside their icons. */
export const useFloatingLabels = (): boolean => useContext(FloatingContext).labels

/**
 * A screen's actions in the thumb's reach, floating at the foot of the screen over the page: its
 * main one a large round `Fab`, the rest folded into a `SpeedDial` beside it. Every part of a screen
 * that floats an action stands in the host's one column, the first to come highest, so none covers
 * another. The page under it pads its foot clear of them.
 */
export function FloatingActions({
  last = false,
  className,
  children,
}: {
  /**
   * Lowest in the column whenever it came, nearest the screen's foot: the folded keys, which unfold
   * from there.
   */
  last?: boolean
  /** Where it shows: `lg:hidden` for what a laptop's page keeps in sight elsewhere. */
  className?: string
  children: ReactNode
}) {
  const { column, place } = useContext(FloatingContext)
  if (!column) return null
  return createPortal(
    <div className={cn('flex gap-3', ALIGN[place], last && 'order-last', className)}>
      {children}
    </div>,
    column,
  )
}

const FAB = 'size-14 rounded-full shadow-lg shadow-foreground/15 [&_svg:not([class*=size-])]:size-6'

/** The screen's main action, a large round button named by its label: Play, New song. */
export function Fab({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon: LucideIcon } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'aria-label'
>) {
  return (
    <Button size="icon" aria-label={label} title={label} className={cn(FAB, className)} {...props}>
      <Icon aria-hidden />
    </Button>
  )
}

/**
 * A screen's one Play as its main floating button, named by what it plays, Stop while it sounds; the
 * screen's Enter plays it (`usePlayKey`).
 */
export function PlayFab({
  label,
  playing,
  onClick,
}: {
  label: string
  playing: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('common')
  return (
    <Fab
      label={playing ? t('stop') : label}
      icon={playing ? Square : Play}
      aria-pressed={playing}
      onClick={onClick}
    />
  )
}

/**
 * A second action beside the main one, always in sight: its words and its icon on a floating pill,
 * or its icon alone on a round button where the floating actions say no names.
 */
export function FabPill({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon: LucideIcon } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'variant'
>) {
  const labels = useFloatingLabels()
  if (!labels)
    return (
      <Button
        variant="surface"
        size="icon-lg"
        aria-label={label}
        title={label}
        className={cn('rounded-full shadow-md shadow-foreground/10', className)}
        {...props}
      >
        <Icon aria-hidden />
      </Button>
    )
  return (
    <Button
      variant="surface"
      size="lg"
      className={cn('rounded-full shadow-md shadow-foreground/10', className)}
      {...props}
    >
      {label}
      <Icon data-icon="inline-end" aria-hidden />
    </Button>
  )
}

/** Closes the dial once one of its actions is chosen. */
const CloseDial = createContext<() => void>(() => {})

/**
 * The screen's other actions, folded into one round button: open, each stands over it named in
 * words, the nearest first; one chosen, or Escape, or a tap elsewhere folds them again.
 */
export function SpeedDial({
  label,
  icon: Icon = Ellipsis,
  children,
}: {
  /** What the folded button says: More, or what its actions are about. */
  label?: string
  icon?: LucideIcon
  /** Its `SpeedDialAction`s, the nearest last. */
  children: ReactNode
}) {
  const { t } = useTranslation('common')
  const { place } = useContext(FloatingContext)
  const [open, setOpen] = useState(false)
  const id = useId()
  const name = label ?? t('moreActions')
  return (
    <CloseDial.Provider value={() => setOpen(false)}>
      {open ? (
        // A tap anywhere else folds the dial, and does nothing else.
        <div aria-hidden className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
      ) : null}
      <div
        className={cn('flex flex-col gap-3', DIAL_ALIGN[place])}
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !open) return
          event.stopPropagation()
          setOpen(false)
        }}
      >
        {open ? (
          <ul id={id} aria-label={name} className={cn('flex flex-col gap-1.5', DIAL_ALIGN[place])}>
            {children}
          </ul>
        ) : null}
        <Button
          variant="surface"
          size="icon"
          aria-label={name}
          title={name}
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => setOpen((was) => !was)}
          className="size-12 rounded-full shadow-md shadow-foreground/10"
        >
          <Icon aria-hidden className={cn('transition-transform', open && 'rotate-90')} />
        </Button>
      </div>
    </CloseDial.Provider>
  )
}

/**
 * One of a dial's actions: a small round icon with its name in a quiet chip beside it, the two one
 * target; the icon alone where the floating actions say no names. A button, or what `render` makes it (a link, which may do something on the way,
 * `onClick`); either folds the dial once chosen.
 */
export function SpeedDialAction({
  label,
  icon: Icon,
  onClick,
  render,
  disabled,
}: {
  label: string
  icon: LucideIcon
  onClick?: () => void
  /** A link in place of a button. */
  render?: ReactElement
  disabled?: boolean
}) {
  const close = useContext(CloseDial)
  const { place, labels } = useContext(FloatingContext)
  const look =
    'group/action h-12 gap-2 rounded-full border-0 bg-transparent p-0 shadow-none hover:bg-transparent motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-150'
  const choose = () => {
    onClick?.()
    close()
  }
  const face = (
    <>
      <span
        className={cn(
          'rounded-full border border-border bg-card px-2.5 py-1 text-sm font-medium shadow-sm shadow-foreground/10',
          !labels && 'sr-only',
        )}
      >
        {label}
      </span>
      <span className="grid size-12 place-items-center rounded-full border border-input bg-card shadow-md shadow-foreground/10 transition-colors group-hover/action:bg-muted">
        <Icon aria-hidden className="size-5" />
      </span>
    </>
  )
  return (
    <li>
      {render ? (
        <ButtonLink
          variant="ghost"
          render={render}
          onClick={choose}
          title={labels ? undefined : label}
          className={cn(look, place === 'left' && 'flex-row-reverse')}
        >
          {face}
        </ButtonLink>
      ) : (
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={choose}
          title={labels ? undefined : label}
          className={cn(look, place === 'left' && 'flex-row-reverse')}
        >
          {face}
        </Button>
      )}
    </li>
  )
}
