import { useEffect, useRef, type FocusEvent, type KeyboardEvent, type RefObject } from 'react'

/**
 * What keeps its own arrows inside a row: a radio group (a segmented choice), a field, a slider. Its
 * buttons are one stop of their own, and the arrows pressed in it are its.
 */
const OWN_ARROWS =
  '[role=radiogroup], input, textarea, select, [role=slider], [contenteditable=true]'

/** The keys of a row the focus moves along: its buttons that can be pressed, outside an inner group. */
const keysOf = (row: HTMLElement): HTMLElement[] =>
  [...row.querySelectorAll<HTMLElement>('button')].filter((key) => {
    const own = key.closest(OWN_ARROWS)
    return (
      !key.hasAttribute('disabled') &&
      !key.closest('[inert]') &&
      (own === null || !row.contains(own) || own === row)
    )
  })

/** The key a row's one stop starts at: the one last focused, else one pressed or current, else the first. */
function stopOf(row: HTMLElement, last: HTMLElement | null): HTMLElement | undefined {
  const keys = keysOf(row)
  if (last && keys.includes(last)) return last
  return (
    keys.find(
      (key) =>
        key.getAttribute('aria-pressed') === 'true' || key.getAttribute('aria-current') === 'true',
    ) ?? keys[0]
  )
}

/**
 * A row of keys as one stop of the Tab key (ADR 0114, WAI-ARIA's toolbar): the key last focused takes
 * the stop (else the one pressed, else the first), ← → move along the keys, past a greyed one, Home and
 * End to its ends (↑ ↓ too, a row standing upright: `vertical`). Its handlers go on the row; keys
 * coming and going, greyed or not, keep one stop. A radio group or a field inside it keeps its own
 * stop and its own arrows.
 */
export function useRovingFocus(row: RefObject<HTMLElement | null>, vertical = false) {
  const last = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const box = row.current
    if (!box) return
    const place = () => {
      const stop = stopOf(box, last.current)
      for (const key of keysOf(box)) key.tabIndex = key === stop ? 0 : -1
    }
    place()
    const watch = new MutationObserver(place)
    watch.observe(box, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['disabled', 'aria-pressed', 'aria-current'],
    })
    return () => watch.disconnect()
  }, [row])

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const box = row.current
    if (!box) return
    const keys = keysOf(box)
    const target = event.target
    const key = target instanceof Node ? keys.find((each) => each.contains(target)) : undefined
    if (!key) return
    last.current = key
    for (const each of keys) each.tabIndex = each === key ? 0 : -1
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const box = row.current
    if (!box || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return
    const keys = keysOf(box)
    const at = keys.findIndex((key) => key === document.activeElement)
    if (at < 0) return
    const next = Math.min(keys.length - 1, at + 1)
    const before = Math.max(0, at - 1)
    const to = {
      ArrowRight: next,
      ArrowLeft: before,
      ...(vertical ? { ArrowDown: next, ArrowUp: before } : {}),
      Home: 0,
      End: keys.length - 1,
    }[event.key]
    if (to === undefined) return
    // The editor's caret keys wait: the arrows are the row's while it has the focus.
    event.preventDefault()
    keys[to]?.focus()
  }

  return { onFocus, onKeyDown }
}
