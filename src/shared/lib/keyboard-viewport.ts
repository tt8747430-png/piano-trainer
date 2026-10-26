/**
 * The phone's on-screen keyboard, measured (Mindscape's `keyboard-viewport`, its ADR 0002): the one
 * subscriber to the visual viewport, publishing on the document's root
 *
 * - `--app-height`: the layout viewport's height sampled while no keyboard is up, re-anchored only
 *   when the width changes or the room grows, so a keyboard can never shrink it;
 * - `--kb-inset`: how much of the layout viewport the keyboard covers (its height less iOS's pan);
 * - `data-keyboard`: present while a keyboard is up, so what floats at the screen's foot (the tab
 *   bar, the floating actions, the toasts) steps aside rather than ride on top of it.
 *
 * A pinch-zoom shrinks the visual viewport as a keyboard does; its scale is the only tell, so the
 * measure holds still while the page is zoomed. A strip under 120px is an accessory bar, no keyboard.
 * The sheets' own fields are Base UI's (`VirtualKeyboardProvider`): nothing here moves a sheet.
 */

/** The least a keyboard measures: anything shorter is an accessory bar or a predictive strip. */
export const KEYBOARD_MIN = 120

let inset = -1
let open = false
let appHeight = 0
let appWidth = 0

function publish(next: number, up: boolean) {
  if (next === inset && up === open) return
  inset = next
  open = up
  const root = document.documentElement
  root.style.setProperty('--kb-inset', `${next}px`)
  root.toggleAttribute('data-keyboard', up)
}

function anchor() {
  const root = document.documentElement
  const width = root.clientWidth
  // A turn of the phone is a new room; else the room only grows (a keyboard never shrinks it).
  if (width === appWidth && root.clientHeight <= appHeight) return
  appWidth = width
  appHeight = root.clientHeight
  root.style.setProperty('--app-height', `${appHeight}px`)
}

/** Starts measuring the keyboard (once, from the app's root); returns what stops it and clears all it set. */
export function startKeyboardViewport(): () => void {
  const root = document.documentElement
  const viewport = window.visualViewport
  let frame = 0
  const measure = () => {
    frame = 0
    anchor()
    if (!viewport || viewport.scale !== 1) {
      if (!viewport) publish(0, false)
      return
    }
    // The keyboard's own height decides whether one is up; less iOS's pan, how much it covers.
    const keyboard = Math.max(0, Math.round(appHeight - viewport.height))
    const up = keyboard >= KEYBOARD_MIN
    publish(up ? Math.max(0, keyboard - Math.max(0, Math.round(viewport.offsetTop))) : 0, up)
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
    inset = -1
    open = false
    appHeight = 0
    appWidth = 0
    root.style.removeProperty('--kb-inset')
    root.style.removeProperty('--app-height')
    root.removeAttribute('data-keyboard')
  }
}
