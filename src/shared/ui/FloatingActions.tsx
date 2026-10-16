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

/** The one column every screen's floating actions stand in, made once, at the end of the page. */
function floatingColumn(): HTMLElement {
  const made = document.getElementById(COLUMN_ID)
  if (made) return made
  const column = document.createElement('div')
  column.id = COLUMN_ID
  column.dataset['slot'] = 'floating-actions'
  column.className =
    'pointer-events-none fixed right-gutter bottom-docked z-20 mb-3 flex flex-col items-end gap-3 print:hidden landscape-phone:mb-safe-4 lg:mb-safe-4 [&>*]:pointer-events-auto'
  document.body.append(column)
  return column
}
const COLUMN_ID = 'floating-actions'

/**
 * A screen's actions in the thumb's reach, floating at the foot of the screen over the page, the tab
 * bar and the keys docked there: its main one a large round `Fab`, the rest folded into a
 * `SpeedDial` beside it. Every part of a screen that floats an action stands in one column, the
 * first to come highest, so none covers another. The page under it pads its foot clear of them.
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
  return createPortal(
    <div className={cn('flex flex-col items-end gap-3', last && 'order-last', className)}>
      {children}
    </div>,
    floatingColumn(),
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

/** A second action beside the main one, always in sight: its words and its icon on a floating pill. */
export function FabPill({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon?: LucideIcon } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'variant'
>) {
  return (
    <Button
      variant="surface"
      size="lg"
      className={cn('rounded-full shadow-md shadow-foreground/10', className)}
      {...props}
    >
      {label}
      {Icon ? <Icon data-icon="inline-end" aria-hidden /> : null}
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
        className="flex flex-col items-end gap-3"
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !open) return
          event.stopPropagation()
          setOpen(false)
        }}
      >
        {open ? (
          <ul id={id} aria-label={name} className="flex flex-col items-end gap-2">
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
 * One of a dial's actions: its words beside its icon. A button, or what `render` makes it (a link,
 * which may do something on the way, `onClick`); either folds the dial once chosen.
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
  const look = 'rounded-full shadow-md shadow-foreground/10'
  const words = (
    <>
      {label}
      <Icon data-icon="inline-end" aria-hidden />
    </>
  )
  return (
    <li>
      {render ? (
        <ButtonLink
          variant="surface"
          size="lg"
          render={render}
          onClick={() => {
            onClick?.()
            close()
          }}
          className={look}
        >
          {words}
        </ButtonLink>
      ) : (
        <Button
          variant="surface"
          size="lg"
          disabled={disabled}
          onClick={() => {
            onClick?.()
            close()
          }}
          className={look}
        >
          {words}
        </Button>
      )}
    </li>
  )
}
