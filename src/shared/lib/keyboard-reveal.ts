import {
  expectKeyboard,
  keyboardOpen,
  REVEAL_GAP,
  subscribeKeyboard,
  visibleBottom,
} from './keyboard-viewport'

/**
 * A field focused over the phone's keyboard is lifted clear of it by the page itself (Mindscape's
 * `useKeyboardReveal`, its ADR 0002): as it takes the focus the keyboard last measured is reserved
 * (`expectKeyboard`), and the box that scrolls round it (the page, or a screen's own scroller)
 * scrolls the field, with its label and the error under it, into the room above the keyboard and
 * under the screen's bar, by a gap. Done before the keyboard comes, it leaves iOS nothing to pan, so
 * the screen's bar never leaves the top. A field in a sheet or a popover (a dialog) is the sheet's:
 * it stands on the keyboard itself. A laptop, which never measured a keyboard, moves nothing.
 */

/** A band of the screen, top to bottom, in `getBoundingClientRect`'s coordinates. */
export interface RevealBand {
  readonly top: number
  readonly bottom: number
}

/**
 * How far to scroll (down, positive) so `field` stands in `view` a gap off its edges: nothing where
 * it does; else its foot a gap over the view's, but never its top above the view's.
 */
export function revealOffset(view: RevealBand, field: RevealBand, gap = REVEAL_GAP): number {
  if (field.top < view.top + gap) return field.top - gap - view.top
  if (field.bottom > view.bottom - gap) {
    return Math.min(field.bottom + gap - view.bottom, field.top - gap - view.top)
  }
  return 0
}

const NOT_TYPED = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
])

/** What the phone's keyboard opens for: a text field or area that can be typed in, or editable text. */
export function isTextField(node: EventTarget | null): node is HTMLElement {
  if (node instanceof HTMLTextAreaElement) return !node.readOnly && !node.disabled
  if (node instanceof HTMLInputElement) {
    return !node.readOnly && !node.disabled && !NOT_TYPED.has(node.type)
  }
  return node instanceof HTMLElement && node.isContentEditable === true
}

/** What stays over the page's top while it scrolls: the screen's bar, the keyboard pinned under it. */
const TOP_CHROME = '[data-slot="screen-bar"]:not([data-hidden]), [data-slot="pinned"]'

/** The box that scrolls the field into sight: none where the field is a sheet's, or stands fixed. */
function scrollerOf(field: HTMLElement): Element | null {
  if (field.closest('[role="dialog"], [role="alertdialog"]')) return null
  for (let node = field.parentElement; node; node = node.parentElement) {
    if (node === document.body || node === document.documentElement) break
    const style = getComputedStyle(node)
    if (style.position === 'fixed') return null
    if (/auto|scroll/.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node
  }
  // The page itself (the app is a standards-mode document: its root scrolls it).
  return document.documentElement
}

/** The room the field must stand in: the scroller's, under what stays at the top, above the keyboard. */
function roomIn(scroller: Element): RevealBand {
  if (scroller !== document.documentElement) {
    const box = scroller.getBoundingClientRect()
    return { top: box.top, bottom: Math.min(box.bottom, visibleBottom()) }
  }
  let top = 0
  for (const chrome of document.querySelectorAll(TOP_CHROME)) {
    const box = chrome.getBoundingClientRect()
    if (box.height > 0) top = Math.max(top, box.bottom)
  }
  return { top, bottom: visibleBottom() }
}

function reveal(field: HTMLElement) {
  if (!keyboardOpen()) return
  const scroller = scrollerOf(field)
  if (!scroller) return
  const room = roomIn(scroller)
  if (room.bottom - room.top <= 2 * REVEAL_GAP) return
  // The field with its label over it and its error under it, where the label holds them.
  const shown = field.closest('label') ?? field
  const delta = revealOffset(room, shown.getBoundingClientRect())
  if (delta !== 0) scroller.scrollTop += delta
}

/** Starts lifting focused fields clear of the keyboard (once, from the app's root); returns what stops it. */
export function startKeyboardReveal(): () => void {
  let focusing = false
  const onFocusIn = (event: FocusEvent) => {
    if (!isTextField(event.target)) return
    focusing = true
    expectKeyboard(true)
    focusing = false
    reveal(event.target)
  }
  const onFocusOut = (event: FocusEvent) => {
    if (!isTextField(event.relatedTarget)) expectKeyboard(false)
  }
  // The keyboard measured anew (it came, it grew a strip): the field focused lifted again.
  const unsubscribe = subscribeKeyboard(() => {
    if (focusing) return
    const active = document.activeElement
    if (isTextField(active)) reveal(active)
  })
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  return () => {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    unsubscribe()
    expectKeyboard(false)
  }
}
