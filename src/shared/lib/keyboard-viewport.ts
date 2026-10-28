import { isRecord } from './saved'
import { createSavedStore } from './saved-store'

/**
 * The phone's on-screen keyboard, measured (Mindscape's `keyboard-viewport`, its ADR 0002): the one
 * subscriber to the visual viewport, publishing on the document's root
 *
 * - `--app-height`: the layout viewport's height sampled while no field is focused, re-anchored only
 *   when the width changes or the room grows, so a keyboard can never shrink it;
 * - `--kb-inset`: how much of the layout viewport the keyboard covers (its height less iOS's pan);
 * - `--kb-range`: the room a page adds at its foot while typing, so its last field can be lifted
 *   clear of the keyboard by a gap (`REVEAL_GAP`): short of it, iOS lifts it by panning the screen;
 * - `data-keyboard`: present while a keyboard is up, so what floats at the screen's foot (the tab
 *   bar, the floating actions, the toasts) steps aside rather than ride on top of it.
 *
 * As a field takes the focus (`expectKeyboard`), the keyboard last measured on this phone is
 * reserved at once (`pt-keyboard`), before the keyboard reports itself: the field is lifted, and the
 * foot steps aside, before it comes, so nothing jumps and iOS has nothing to pan. A laptop never
 * measured one, so it reserves nothing. A pinch-zoom shrinks the visual viewport as a keyboard does;
 * its scale is the only tell, so the measure holds still while the page is zoomed. A strip under
 * 120px is an accessory bar, no keyboard.
 */

/** The least a keyboard measures: anything shorter is an accessory bar or a predictive strip. */
export const KEYBOARD_MIN = 120

/** The room left between a field lifted clear of the keyboard and the keyboard. */
export const REVEAL_GAP = 24

/** Where the tallest keyboard measured on this phone is saved. */
export const KEYBOARD_STORAGE_KEY = 'pt-keyboard'

interface Remembered {
  readonly height: number
}

const NOTHING_REMEMBERED: Remembered = { height: 0 }

const rememberedKeyboard = (signal: AbortSignal) =>
  createSavedStore<Remembered>(
    {
      key: KEYBOARD_STORAGE_KEY,
      version: 1,
      initial: NOTHING_REMEMBERED,
      read: (saved, current) =>
        isRecord(saved) &&
        typeof saved.height === 'number' &&
        Number.isFinite(saved.height) &&
        saved.height >= KEYBOARD_MIN
          ? { height: Math.round(saved.height) }
          : current,
    },
    { signal },
  )

/** What the keyboard covers, measured; whether one is up by its own height. */
let covered = 0
let present = false
/** The tallest keyboard measured, reserved while one is expected and none has reported itself. */
let expected = 0
let expecting = false
let reserving = false
let remember: (height: number) => void = () => {}
let published = -1
let publishedOpen = false
let appHeight = 0
let appWidth = 0

const listeners = new Set<() => void>()

function publish(): boolean {
  const open = present || (reserving && expected > 0)
  const next = present ? covered : open ? expected : 0
  if (next === published && open === publishedOpen) return false
  published = next
  publishedOpen = open
  const root = document.documentElement
  root.style.setProperty('--kb-inset', `${next}px`)
  root.style.setProperty('--kb-range', open ? `${next + REVEAL_GAP}px` : '0px')
  root.toggleAttribute('data-keyboard', open)
  return true
}

function notify() {
  for (const listener of listeners) listener()
}

function anchor() {
  const root = document.documentElement
  const width = root.clientWidth
  // A turn of the phone is a new room; else the room only grows, and not while a field is focused
  // (a keyboard never shrinks it, and a layout that grows back under a field reflows nothing).
  const grown = !expecting && root.clientHeight > appHeight
  if (width === appWidth && !grown) return
  appWidth = width
  appHeight = root.clientHeight
  root.style.setProperty('--app-height', `${appHeight}px`)
}

/** How much of the screen the keyboard covers (or is reserved for): 0 while none is up. */
export function keyboardHeight(): number {
  return Math.max(0, published)
}

/** Whether a keyboard is up, or reserved for a field just focused. */
export function keyboardOpen(): boolean {
  return publishedOpen
}

/** The layout viewport's foot, in the coordinates `getBoundingClientRect` gives. */
export function layoutBottom(): number {
  const root = document.documentElement
  return root.getBoundingClientRect().top + (appHeight || root.clientHeight)
}

/** Where the room seen above the keyboard ends, in `getBoundingClientRect`'s coordinates. */
export function visibleBottom(): number {
  return layoutBottom() - keyboardHeight()
}

/** Hears every change of the keyboard's height or of whether it is up; returns what stops it. */
export function subscribeKeyboard(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** A field took the focus (`true`) or none holds it (`false`): the keyboard is reserved meanwhile. */
export function expectKeyboard(on: boolean) {
  if (expecting === on) return
  expecting = on
  reserving = on && !present
  if (publish()) notify()
}

/** Starts measuring the keyboard (once, from the app's root); returns what stops it and clears all it set. */
export function startKeyboardViewport(): () => void {
  const root = document.documentElement
  const viewport = window.visualViewport
  const stopped = new AbortController()
  const store = rememberedKeyboard(stopped.signal)
  expected = store.getState().height
  remember = (height) => store.setState({ height })
  let frame = 0
  const measure = () => {
    frame = 0
    anchor()
    if (!viewport) {
      publish()
      return
    }
    if (viewport.scale !== 1) return
    // The keyboard's own height decides whether one is up; less iOS's pan, how much it covers.
    const keyboard = Math.max(0, Math.round(appHeight - viewport.height))
    present = keyboard >= KEYBOARD_MIN
    covered = present ? Math.max(0, keyboard - Math.max(0, Math.round(viewport.offsetTop))) : 0
    if (present) {
      reserving = false
      if (keyboard > expected) {
        expected = keyboard
        remember(keyboard)
      }
    }
    publish()
    notify()
  }
  const onResize = () => {
    if (!frame) frame = window.requestAnimationFrame(measure)
  }
  measure()
  viewport?.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  return () => {
    window.cancelAnimationFrame(frame)
    viewport?.removeEventListener('resize', onResize)
    window.removeEventListener('orientationchange', onResize)
    stopped.abort()
    covered = 0
    present = false
    expected = 0
    expecting = false
    reserving = false
    remember = () => {}
    published = -1
    publishedOpen = false
    appHeight = 0
    appWidth = 0
    root.style.removeProperty('--kb-inset')
    root.style.removeProperty('--kb-range')
    root.style.removeProperty('--app-height')
    root.removeAttribute('data-keyboard')
  }
}
