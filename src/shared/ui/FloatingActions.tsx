import { Ellipsis, Play, Square, type LucideIcon } from 'lucide-react'
import {
  createContext,
  useContext,
  useEffect,
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
import { FloatingContext, useFloatingLabels, type FloatingPlace } from './floating-context'
import { Button } from './primitives/button'

/** The actions stand in a row along the foot wherever they are, so none climbs over the page. */
const ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'flex-row items-end',
  center: 'flex-row items-end',
  right: 'flex-row items-end',
}
/** A dial's own stack stands over its button wherever the actions are. */
const DIAL_ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
}

/** What a tap may land on and still be the page's own, not a tap on the page: a control or the keys. */
const CONTROLS =
  'a,button,input,select,textarea,label,summary,[role=button],[role=link],[role=radio],[role=switch],[role=slider],[role=tab],[role=option],[role=checkbox],[role=dialog],[contenteditable],[data-slot=docked],[data-slot=pinned]'

/**
 * The one row every screen's floating actions stand in, at the foot of the screen over the tab bar
 * and the keys docked there, the width of the screen beside a rail or a sidebar: at its left, its
 * middle or its right, as the learner chose, each action with its name or its icon alone. A tap on
 * the page (on no control and on no key) folds them away out of the reading's way, and the next
 * brings them back; a new `screen` brings them back too.
 */
export function FloatingHost({
  place,
  labels,
  screen,
  children,
}: {
  place: FloatingPlace
  labels: boolean
  /** The screen shown: its actions show whenever it changes. */
  screen: string
  children: ReactNode
}) {
  const [column, setColumn] = useState<HTMLElement | null>(null)
  const [hiddenOn, setHiddenOn] = useState<string | null>(null)
  const hidden = hiddenOn === screen
  // A tap on the screen's page, heard at the document: the page's own markup stays as it is.
  useEffect(() => {
    const tap = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element) || !target.closest('main') || target.closest(CONTROLS))
        return
      // A word chosen to read is no tap.
      if (window.getSelection()?.toString()) return
      setHiddenOn((was) => (was === screen ? null : screen))
    }
    document.addEventListener('click', tap)
    return () => document.removeEventListener('click', tap)
  }, [screen])
  return (
    <FloatingContext.Provider value={{ column, place, labels }}>
      {children}
      <div
        data-hidden={hidden || undefined}
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-docked z-20 mb-3 flex px-gutter transition-[translate,opacity] duration-200 ease-out print:hidden data-hidden:translate-y-4 data-hidden:opacity-0 motion-reduce:transition-none landscape-phone:left-rail landscape-phone:mb-safe-4 lg:left-sidebar lg:mb-safe-4 lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed',
          place === 'left' && 'justify-start',
          place === 'center' && 'justify-center',
          place === 'right' && 'justify-end',
        )}
      >
        <div
          ref={setColumn}
          data-slot="floating-actions"
          inert={hidden}
          className={cn(
            'vt-floating flex gap-3',
            !hidden && '[&>*]:pointer-events-auto',
            ALIGN[place],
          )}
        />
      </div>
    </FloatingContext.Provider>
  )
}

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

/** The screen's main action as a link (a page of its own: the Player), round and named by its label. */
export function FabLink({
  label,
  icon: Icon,
  render,
}: {
  label: string
  icon: LucideIcon
  /** The link it is: a router `Link`. */
  render: ReactElement
}) {
  return (
    <ButtonLink size="icon" aria-label={label} title={label} className={FAB} render={render}>
      <Icon aria-hidden />
    </ButtonLink>
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
        size="icon"
        aria-label={label}
        title={label}
        className={cn(FAB, className)}
        {...props}
      >
        <Icon aria-hidden />
      </Button>
    )
  return (
    <Button
      variant="surface"
      size="lg"
      className={cn('h-14 rounded-full px-5 shadow-md shadow-foreground/10', className)}
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
          className={FAB}
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
