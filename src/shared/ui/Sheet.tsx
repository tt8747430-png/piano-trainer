import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { createContext, use, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn, LAPTOP, useMediaQuery } from '@/shared/lib'
import { InfoTip } from './InfoTip'
import { Button } from './primitives/button'
import {
  Drawer,
  DrawerClose,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './primitives/drawer'
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover'

/**
 * A sheet from the right as the boards' laptop popover. Each class names the right edge as well as
 * the axis, so it outranks the drawer's own placing of a panel from the right.
 */
/** `floating` on a laptop: PlayerDesk's card, 440 wide, 112 above the foot, 16 round, no bleed under it. */
const FLOATING_CARD = [
  'lg:max-w-110',
  'lg:data-[swipe-direction=down]:bottom-28',
  'lg:data-[swipe-direction=down]:rounded-2xl',
  'lg:data-[swipe-direction=down]:border-0',
  'lg:data-[swipe-direction=down]:after:hidden',
  'lg:max-h-[calc(var(--app-height,100dvh)-9rem)]',
  'lg:layer-shadow',
].join(' ')

const LAPTOP_CARD = [
  'data-[swipe-axis=x]:data-[swipe-direction=right]:mx-0',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:inset-y-auto',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:h-auto',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:w-95',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:max-w-[calc(100vw-5rem)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:max-h-[calc(var(--app-height,100dvh)-6.25rem)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:rounded-[16px]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:border-0',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:pb-0',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:shadow-[0_0_0_1px_var(--color-hairline),var(--elevation-2)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:[--bleed:0px]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:[--closed-transform:translate3d(0,-0.5rem,0)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:duration-200',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:data-starting-style:opacity-0',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:data-ending-style:opacity-0',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:[&>[data-slot=drawer-swipe-handle]]:hidden',
].join(' ')

/**
 * Where the card hangs, by the bar its button is in: a page's `ScreenHeader` (the boards' POPOVER,
 * 64 under the frame's top and 40 from its right) or the full-screen Player's and editor's
 * `ScoreBar` (PlayerDesk's and EditorLaptop's, 76 under the top, on the bar's 24 edge).
 */
const HUNG_PLACE = {
  header: [
    'data-[swipe-axis=x]:data-[swipe-direction=right]:top-16',
    'data-[swipe-axis=x]:data-[swipe-direction=right]:right-10',
  ].join(' '),
  'score-bar': [
    'data-[swipe-axis=x]:data-[swipe-direction=right]:top-19',
    'data-[swipe-axis=x]:data-[swipe-direction=right]:right-6',
  ].join(' '),
} as const

/** The bar a sheet hangs from on a laptop, or none: it stays a bottom sheet. */
type Hung = keyof typeof HUNG_PLACE

const HungContext = createContext<Hung>('header')

/**
 * `rising` on a laptop: a run's Setup (the run boards' `PVSETL` popover), 620 wide, centred over the
 * floating bar it opens from beside the sidebar, its foot 250 over the window's.
 */
const RISING_CARD = [
  'data-[swipe-axis=x]:data-[swipe-direction=right]:top-auto',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:right-auto',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:bottom-62.5',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:left-[calc(50%+7.75rem-19.375rem)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:w-155',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:max-h-[calc(var(--app-height,100dvh)-16.625rem)]',
  'data-[swipe-axis=x]:data-[swipe-direction=right]:[--closed-transform:translate3d(0,0.5rem,0)]',
].join(' ')

/**
 * On a laptop, a sheet opened from a control in the page (a row, a transport's button, a chord, a
 * menu's item): the boards' POPOVER at that control, 380 wide unless it says, nothing dimmed behind
 * it, the page's own scroll and clicks kept. Its side and alignment are the trigger's to say.
 */
export interface SheetAt {
  readonly side?: 'top' | 'bottom' | 'left' | 'right'
  readonly align?: 'start' | 'center' | 'end'
  /** Its width class: 320 (`w-80`), 380 (`w-95`, the default), 420 (`w-105`), 460 (`w-115`), 520 (`w-130`). */
  readonly width?: string
}

/** A sheet opened as a popover: where it stands, and the control it stands at. */
interface Popped extends SheetAt {
  readonly anchor: Element | null
}

const PoppedContext = createContext<Popped | null>(null)

const PRESSABLE = 'button, a[href], [role=button], [role=menuitem], [role=option], [role=row]'

/**
 * The control the learner last pressed or keyed: a sheet that opens from it stands at it. A menu's
 * item goes with its menu, so a sheet from a ··· menu stands at the ··· that opened the menu.
 */
let pressed: Element | null = null
let pressedAt = 0
/** The control pressed just now, or none: a sheet a shortcut opens has no control to stand at. */
const justPressed = () => (performance.now() - pressedAt < 1000 ? pressed : null)
function notePress(target: EventTarget | null) {
  if (!(target instanceof Element)) return
  const control = target.closest(PRESSABLE)
  if (control === null) return
  const menu = control.closest('[role=menu], [role=listbox]')
  pressed =
    (menu === null
      ? null
      : document.querySelector('[aria-haspopup][aria-expanded=true], [data-popup-open]')) ?? control
  pressedAt = performance.now()
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', (event) => notePress(event.target), true)
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') notePress(document.activeElement)
    },
    true,
  )
}

/** What opens a sheet: the drawer's own trigger, or the popover's on a laptop, named for the sheet. */
export function SheetTrigger(props: Parameters<typeof DrawerTrigger>[0]) {
  return use(PoppedContext) ? (
    <PopoverTrigger render={props.render}>{props.children}</PopoverTrigger>
  ) : (
    <DrawerTrigger {...props} />
  )
}

/**
 * A sheet keeps the tallest height it has had while it stays open, as an iOS sheet keeps its detent:
 * turning to a shorter page (Count-in under the settings) or back never snaps it down for a frame and
 * up again. Set in the resize observer's callback, before paint, so no frame shows the shorter sheet;
 * never past the room the sheet may take (the phone's keyboard up).
 */
function holdTallest(popup: HTMLElement | null) {
  if (popup === null) return
  let tallest = 0
  const observer = new ResizeObserver(() => {
    if (popup.offsetHeight <= tallest) return
    tallest = popup.offsetHeight
    popup.style.minHeight = `min(${tallest}px, var(--drawer-content-max-height, 100dvh))`
  })
  observer.observe(popup)
  return () => observer.disconnect()
}

/**
 * The app's bottom sheet: a drawer from the bottom that always shows its swipe handle. Every sheet
 * minds the phone's keyboard (Mindscape's, Base UI's `VirtualKeyboardProvider`): a field in it is
 * focused without the page scrolling to it, so the app behind never lifts, and the sheet rises
 * over the keyboard by the room it covers (`--drawer-keyboard-inset`).
 */
export function Sheet({
  children,
  hung,
  at,
  open,
  onOpenChange,
}: {
  children?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * On a laptop, a screen's settings hung under the bar's button that opens them (the boards'
   * POPOVER), with nothing dimmed behind it, placed by that bar; a phone keeps the bottom sheet. The
   * sheet decides which by the screen's width, so no screen asks.
   */
  hung?: Hung
  /** On a laptop, a popover at the control that opened it (`SheetAt`); a phone keeps the bottom sheet. */
  at?: SheetAt
}) {
  const laptop = useMediaQuery(LAPTOP)
  // The control it opened from, taken as it opens (a sheet opened by its own trigger stands at that).
  const [anchor, setAnchor] = useState<Element | null>(null)
  const now = open === true && anchor === null ? justPressed() : null
  if (now !== null) setAnchor(now)
  if (open === false && anchor !== null) setAnchor(null)
  if (at !== undefined && laptop)
    return (
      <Popover
        {...(open === undefined ? {} : { open })}
        onOpenChange={(next) => onOpenChange?.(next)}
      >
        <PoppedContext value={{ ...at, anchor: open === undefined ? null : anchor }}>
          {children}
        </PoppedContext>
      </Popover>
    )
  const card = hung !== undefined && laptop
  return (
    <Drawer
      showSwipeHandle
      swipeDirection={card ? 'right' : 'down'}
      modal={!card}
      {...(open === undefined ? {} : { open })}
      onOpenChange={(next) => onOpenChange?.(next)}
    >
      <HungContext value={hung ?? 'header'}>
        <DrawerPrimitive.VirtualKeyboardProvider>
          {children}
        </DrawerPrimitive.VirtualKeyboardProvider>
      </HungContext>
    </Drawer>
  )
}

/**
 * The sheet's panel (R42, the canvas's one sheet): its title centred, Done at its right, under it what it acts on (`description`, whole,
 * wrapping), a body that scrolls with room round it, and an optional footer parted from it by a
 * hairline, clear of the home indicator. What the body holds keeps its height, scrolling rather than
 * squeezed. Over the phone's keyboard the panel stands on it. On a phone on its side it takes nearly
 * the whole height, or its body would be a sliver; `full`, it takes it at every size (a preview
 * opened full screen) and its body's room passes to what it holds.
 */
export function SheetContent({
  title,
  description,
  info,
  status,
  back,
  children,
  footer,
  full = false,
  tall = false,
  floating = false,
  wide = false,
  rising = false,
  initialFocus,
  dismiss = 'done',
}: {
  title: string
  description?: ReactNode
  /** What the sheet's tools do, where their names alone do not say: an ⓘ after the title (ADR 0096). */
  info?: ReactNode
  /** Where what the sheet acts on stands, beside its title (a draft's saved state, R31-E). */
  status?: ReactNode
  /** A page under the sheet's first: its Back, at the header's start, across from Done. */
  back?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** The whole screen's height at every size: a preview opened full screen (ADR 0115). */
  full?: boolean
  /** As tall as a sheet stands, whatever it holds: a sheet that is a screen (the library's filters). */
  tall?: boolean
  /**
   * On a laptop, a card floating over the screen's foot rather than a sheet across it: the Player's
   * Played through (PlayerDesk's, 440 wide, 112 above the window's foot, clear of the transport).
   */
  floating?: boolean
  /** On a laptop, the card 420 wide, as the board's POPOVER draws a list of kinds (Insert). */
  wide?: boolean
  /** On a laptop, the card rising over the floating bar it opens from: a run's Setup. */
  rising?: boolean
  /** What takes the focus as it opens, in place of the panel: a picker's value. */
  initialFocus?: () => HTMLElement | true
  /** Its header's way out: Done; Cancel on a sheet that makes something (the canvas's NEWNAME); Close once it reports what was made (Import). */
  dismiss?: 'done' | 'cancel' | 'close'
}) {
  const { t } = useTranslation('common')
  const hung = use(HungContext)
  const popped = use(PoppedContext)
  if (popped)
    return (
      <PopoverContent
        ref={holdTallest}
        side={popped.side ?? 'bottom'}
        align={popped.align ?? 'start'}
        sideOffset={8}
        // It keeps the side it was given and grows no taller than the room there, scrolling inside.
        collisionAvoidance={{ side: 'none', align: 'shift' }}
        {...(popped.anchor ? { anchor: popped.anchor } : {})}
        {...(initialFocus ? { initialFocus } : {})}
        aria-label={title}
        className={cn(
          'max-h-[min(var(--available-height),calc(var(--app-height,100dvh)-10rem))] gap-3 overflow-y-auto rounded-menu p-4 text-base',
          popped.width ?? 'w-95',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {back}
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
              <h2 className="font-sans text-lg/[normal] font-semibold text-balance break-words">
                {title}
              </h2>
              {info ? <InfoTip name={title}>{info}</InfoTip> : null}
              {status}
            </div>
            {description ? (
              <div className="text-sm leading-snug text-pretty break-words text-muted-foreground">
                {description}
              </div>
            ) : null}
          </div>
        </div>
        {children}
        {footer ? <div className="border-t border-hairline pt-3">{footer}</div> : null}
      </PopoverContent>
    )
  return (
    <DrawerContent
      ref={holdTallest}
      {...(initialFocus ? { initialFocus } : {})}
      className={cn(
        'page-column rounded-t-sheet bg-background pb-sheet-keyboard text-base landscape-phone:max-h-[calc(100dvh-1rem)]',
        // From the right, a laptop's settings (the boards' POPOVER, EditorLaptop's and PlayerDesk's
        // gear): a card hung under the bar's buttons, 380 wide (420 `wide`), as tall as it holds, 16
        // round with the hairline and the second shade; it fades in place.
        LAPTOP_CARD,
        HUNG_PLACE[hung],
        // At most 86% of the screen's height, as the boards' BSHEET: the bar stays in sight above it.
        'data-[swipe-axis=y]:[--drawer-content-max-height:calc(var(--app-height,100dvh)*0.86)]',
        // The room anchored while no keyboard is up: the phone's keyboard never squeezes it. A tall
        // sheet stands at that whole 86% (BSHEET's `tall`).
        tall &&
          'h-[calc(var(--app-height,100dvh)*0.86)] landscape-phone:h-[calc(var(--app-height,100dvh)-1rem)]',
        full &&
          'h-[calc(var(--app-height,100dvh)-1rem)] max-h-[calc(var(--app-height,100dvh)-1rem)] max-w-5xl',
        floating && FLOATING_CARD,
        wide && 'data-[swipe-axis=x]:data-[swipe-direction=right]:w-105',
        rising && RISING_CARD,
      )}
    >
      {/* On a laptop the card is the boards' POPOVER: its title at the start, 16 in, and no Done (a
          click outside or Esc closes it); a page under the first keeps its Back and its title centred. */}
      <DrawerHeader
        className={cn(
          'grid grid-cols-[minmax(3.5rem,1fr)_auto_minmax(3.5rem,1fr)] items-start gap-2 px-4 pt-2.5 pb-2 text-center landscape-phone:pb-1 group-data-[swipe-axis=y]/drawer-popup:text-center',
          !back &&
            'group-data-[swipe-axis=x]/drawer-popup:grid-cols-1 group-data-[swipe-axis=x]/drawer-popup:pt-4 group-data-[swipe-axis=x]/drawer-popup:text-start',
        )}
      >
        {back ? <div className="col-start-1 row-start-1 justify-self-start">{back}</div> : null}
        <div
          className={cn(
            'col-start-2 row-start-1 flex min-w-0 flex-col items-center gap-0.5 pt-2.5',
            !back &&
              'group-data-[swipe-axis=x]/drawer-popup:col-start-1 group-data-[swipe-axis=x]/drawer-popup:items-start group-data-[swipe-axis=x]/drawer-popup:pt-0',
          )}
        >
          <div
            className={cn(
              'flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 gap-y-1',
              !back && 'group-data-[swipe-axis=x]/drawer-popup:justify-start',
            )}
          >
            <DrawerTitle className="font-sans text-lg leading-snug font-semibold text-balance break-words">
              {title}
            </DrawerTitle>
            {info ? <InfoTip name={title}>{info}</InfoTip> : null}
            {status}
          </div>
          {description ? (
            <DrawerDescription className="text-sm leading-snug text-pretty break-words text-muted-foreground">
              {description}
            </DrawerDescription>
          ) : null}
        </div>
        <DrawerClose
          render={
            <Button
              variant="ghost"
              className="col-start-3 row-start-1 justify-self-end px-1 text-[1.0625rem] font-semibold text-link group-data-[swipe-axis=x]/drawer-popup:sr-only hover:bg-transparent hover:underline"
            />
          }
        >
          {dismiss === 'cancel'
            ? t('confirm.cancel')
            : dismiss === 'close'
              ? t('close')
              : t('done')}
        </DrawerClose>
      </DrawerHeader>
      <div className="flex min-h-0 flex-1 flex-col gap-4 scroll-pt-9 group-data-[swipe-axis=x]/drawer-popup:gap-3 overflow-y-auto px-4 pt-1 pb-6 group-data-[swipe-axis=y]/drawer-popup:pb-10 *:shrink-0">
        {children}
      </div>
      {footer ? (
        <DrawerFooter className="border-t border-hairline px-4 pt-4 pb-sheet-foot">
          {footer}
        </DrawerFooter>
      ) : null}
    </DrawerContent>
  )
}
