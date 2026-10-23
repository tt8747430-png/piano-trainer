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

/**
 * The actions stand in a row along the foot, so none climbs over the page; beside the page (`aside`:
 * keys docked at the foot of a phone on its side or of a laptop) in a column at its left, or at its
 * right for the middle, over the keys.
 */
const ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'flex-row items-center aside:flex-col',
  center: 'flex-row items-center aside:flex-col',
  right: 'flex-row items-center aside:flex-col',
}
/**
 * A dial opens as a card over its button at the foot, growing from it: at the left its left edge
 * on the button's, in the middle centred on it, at the right its right edge on the button's. Beside
 * the page, where the height is short, it opens beside its button towards the page, from its top down.
 */
const DIAL_ALIGN: Readonly<Record<FloatingPlace, string>> = {
  left: 'left-0 origin-bottom-left aside:left-full aside:ml-3 aside:origin-top-left',
  center:
    'left-1/2 -translate-x-1/2 origin-bottom aside:right-full aside:left-auto aside:mr-3 aside:translate-x-0 aside:origin-top-right',
  right: 'right-0 origin-bottom-right aside:right-full aside:mr-3 aside:origin-top-right',
}
const DIAL_ASIDE = 'aside:top-0 aside:bottom-auto aside:mb-0'
/** The page keeps this far clear of the actions: their row's margin over the foot. */
const FLOATING_GAP_PX = 12
/** The room the actions take along one side, their gap included; none while there are none. */
const room = (px: number | undefined) => `${px ? px + FLOATING_GAP_PX : 0}px`

/** What a tap may land on and still be the page's own, not a tap on the page: a control or the keys. */
const CONTROLS =
  'a,button,input,select,textarea,label,summary,[role=button],[role=link],[role=radio],[role=switch],[role=slider],[role=tab],[role=option],[role=checkbox],[role=menuitem],[role=combobox],[role=listbox],[role=toolbar],[role=dialog],[tabindex]:not([tabindex="-1"]),[contenteditable],[data-slot=docked],[data-slot=pinned]'

/**
 * The one row every screen's floating actions stand in, at the foot of the screen over the tab bar
 * and the keys docked there, the width of the screen beside a rail or a sidebar: at its left, its
 * middle or its right, as the learner chose, each action with its name or its icon alone. Where keys
 * are docked on a screen wide for its height (`aside`), they stand in a column at its side instead,
 * so the little height left stays the page's. The page pads clear of them by the room they take,
 * which the host measures (`--floating-block`, `--floating-inline`; `theme.css` says which counts).
 * A tap on the page (on no control and on no key) folds them away out of the reading's way, and the
 * next brings them back; a new `screen` brings them back too.
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
  const [hidden, setHidden] = useState(false)
  // Another screen shows them, and so does coming back to one they were folded on.
  const [shownScreen, setShownScreen] = useState(screen)
  if (shownScreen !== screen) {
    setShownScreen(screen)
    setHidden(false)
  }
  // A tap on the screen's page, heard at the document: the page's own markup stays as it is.
  useEffect(() => {
    const tap = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element) || !target.closest('main') || target.closest(CONTROLS))
        return
      // A word chosen to read is no tap.
      if (window.getSelection()?.toString()) return
      setHidden((was) => !was)
    }
    document.addEventListener('click', tap)
    return () => document.removeEventListener('click', tap)
  }, [])
  useEffect(() => {
    if (!column) return
    const root = document.documentElement.style
    const observer = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]
      root.setProperty('--floating-block', room(size?.blockSize))
      root.setProperty('--floating-inline', room(size?.inlineSize))
    })
    observer.observe(column)
    return () => {
      observer.disconnect()
      root.removeProperty('--floating-block')
      root.removeProperty('--floating-inline')
    }
  }, [column])
  return (
    <FloatingContext.Provider value={{ column, place, labels }}>
      {children}
      <div
        data-slot="floating-host"
        data-place={place}
        data-hidden={hidden || undefined}
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-docked z-20 mb-3 flex px-gutter transition-[translate,opacity] duration-200 ease-out print:hidden data-hidden:translate-y-4 data-hidden:opacity-0 motion-reduce:transition-none landscape-phone:left-rail landscape-phone:pr-gutter-safe landscape-phone:mb-safe-4 lg:left-sidebar lg:mb-safe-4 lg:group-data-[sidebar=collapsed]/main:left-sidebar-collapsed',
          place === 'left' && 'justify-start',
          place === 'center' && 'justify-center aside:justify-end',
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

/**
 * A floating control gives under the finger (96%) and its shade settles; a pointer over it lifts it
 * a step. Reduced motion keeps the change and drops the movement (`theme.css`).
 */
const PRESS =
  'transition-[scale,box-shadow,background-color,filter] duration-150 ease-out active:scale-96 active:not-aria-[haspopup]:translate-y-0'
/** The main floating action: 56px, honey, the highest shade. */
const FAB = `size-14 rounded-full elevation-2 hover:elevation-3 active:elevation-1 [&_svg:not([class*=size-])]:size-6 ${PRESS}`
/** The main action with its name beside its icon (an extended FAB). */
const FAB_EXTENDED = `h-14 gap-2 rounded-full px-5 pl-4 elevation-2 hover:elevation-3 active:elevation-1 [&_svg:not([class*=size-])]:size-6 ${PRESS}`
/** A second action: 48px, the raised paper with its soft line, a lower shade. */
export const MINI_FAB = `size-12 rounded-full border-border bg-raised elevation-1 hover:bg-muted hover:elevation-2 [&_svg:not([class*=size-])]:size-5 ${PRESS}`
/** A second action with its words: a 48px pill of the same paper. */
const MINI_PILL = `h-12 gap-2 rounded-full border-border bg-raised px-4 elevation-1 hover:bg-muted hover:elevation-2 ${PRESS}`

/**
 * The screen's main action, a large round button named by its label: Play, New song. `extended`, its
 * name stands beside its icon, for an action no icon says alone (New song's +).
 */
export function Fab({
  label,
  icon: Icon,
  extended = false,
  className,
  ...props
}: { label: string; icon: LucideIcon; extended?: boolean } & Omit<
  ComponentProps<typeof Button>,
  'children' | 'size' | 'aria-label'
>) {
  if (extended)
    return (
      <Button size="lg" className={cn(FAB_EXTENDED, className)} {...props}>
        <Icon data-icon="inline-start" aria-hidden />
        {label}
      </Button>
    )
  return (
    <Button size="icon" aria-label={label} title={label} className={cn(FAB, className)} {...props}>
      <Icon aria-hidden />
    </Button>
  )
}

/**
 * The screen's main action where it opens a page (Practise, Write the chart): the `Fab` as a link,
 * `render` the link (a router `Link`).
 */
export function FabLink({
  label,
  icon: Icon,
  className,
  ...props
}: { label: string; icon: LucideIcon } & Omit<
  ComponentProps<typeof ButtonLink>,
  'children' | 'size' | 'aria-label'
>) {
  return (
    <ButtonLink
      size="icon"
      aria-label={label}
      title={label}
      className={cn(FAB, className)}
      {...props}
    >
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
        className={cn(MINI_FAB, className)}
        {...props}
      >
        <Icon aria-hidden />
      </Button>
    )
  return (
    <Button variant="surface" size="lg" className={cn(MINI_PILL, className)} {...props}>
      {label}
      <Icon data-icon="inline-end" aria-hidden />
    </Button>
  )
}

/** Closes the dial once one of its actions is chosen. */
const CloseDial = createContext<() => void>(() => {})

/** How long a dial's actions take to leave (`theme.css`' `dial-out`). */
const DIAL_OUT_MS = 120

/**
 * The screen's other actions, folded into one round button: open, each comes up over it named in
 * words, the nearest first; one chosen, or Escape, or a tap elsewhere folds them again, and they
 * leave together.
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
  const [shown, setShown] = useState<'open' | 'closing' | 'closed'>('closed')
  const open = shown === 'open'
  const close = () => setShown((was) => (was === 'open' ? 'closing' : was))
  useEffect(() => {
    if (shown !== 'closing') return
    const done = setTimeout(() => setShown('closed'), DIAL_OUT_MS)
    return () => clearTimeout(done)
  }, [shown])
  const id = useId()
  const name = label ?? t('moreActions')
  return (
    <CloseDial.Provider value={close}>
      {open ? (
        // A tap anywhere else folds the dial, and does nothing else.
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-background/55 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
          onClick={close}
        />
      ) : null}
      <div
        className="relative flex"
        onKeyDown={(event) => {
          if (event.key !== 'Escape' || !open) return
          event.stopPropagation()
          close()
        }}
      >
        <Button
          variant="surface"
          size="icon"
          aria-label={name}
          title={name}
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => (open ? close() : setShown('open'))}
          className={cn(MINI_FAB, open && 'bg-muted elevation-2')}
        >
          <Icon
            aria-hidden
            className="transition-[rotate] duration-200 ease-out"
            style={open ? { rotate: '90deg' } : undefined}
          />
        </Button>
        {shown !== 'closed' ? (
          // Over the button, out of the column's flow: opened, it moves neither the actions nor the page.
          // After it in the document, so the button is the first thing in the dial (a dialog's way back).
          <ul
            id={id}
            aria-label={name}
            aria-hidden={!open || undefined}
            inert={!open}
            data-closing={!open || undefined}
            className={cn(
              'dial-card absolute bottom-full mb-3 flex w-max max-w-[calc(100vw-2*var(--gutter))] flex-col rounded-3xl border border-border bg-raised p-1.5 elevation-3',
              DIAL_ASIDE,
              DIAL_ALIGN[place],
            )}
          >
            {children}
          </ul>
        ) : null}
      </div>
    </CloseDial.Provider>
  )
}

/**
 * One of a dial's actions: a row of its card, its icon and its name, the two one 48px target. The
 * name is always in sight: an open dial is where the learner looks for words. A button, or what `render` makes it (a link, which may do something on the way,
 * `onClick`); either folds the dial once chosen. One that opens a dialog (Delete, Reset) sets the
 * page's own `open` state in `onClick`: the dialog is the page's, controlled and with no trigger, so
 * it stays open once the dial has folded.
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
  const look =
    'h-12 w-full justify-start gap-3 rounded-2xl px-3 pr-5 text-base font-semibold text-foreground transition-colors active:not-aria-[haspopup]:translate-y-0 active:bg-muted'
  const choose = () => {
    onClick?.()
    close()
  }
  const face = (
    <>
      <Icon aria-hidden className="size-5 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </>
  )
  return (
    <li>
      {render ? (
        <ButtonLink variant="ghost" render={render} onClick={choose} className={look}>
          {face}
        </ButtonLink>
      ) : (
        <Button variant="ghost" disabled={disabled} onClick={choose} className={look}>
          {face}
        </Button>
      )}
    </li>
  )
}
