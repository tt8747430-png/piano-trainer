import { useEffect, useRef, type FocusEvent, type KeyboardEvent, type RefObject } from 'react'

/** The keys of a row the focus moves along: its buttons that can be pressed. */
const keysOf = (row: HTMLElement): HTMLElement[] =>
  [...row.querySelectorAll<HTMLElement>('button')].filter(
    (key) => !key.hasAttribute('disabled') && !key.closest('[inert]'),
  )

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
 * End to its ends. Its handlers go on the row; keys coming and going, greyed or not, keep one stop.
 */
export function useRovingFocus(row: RefObject<HTMLElement | null>) {
  const last = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const box = row.current
    if (!box) return
    const place = () => {
      const stop = stopOf(box, last.current)
      for (const key of box.querySelectorAll<HTMLElement>('button'))
        key.tabIndex = key === stop ? 0 : -1
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
    const key = (event.target as Element).closest('button')
    const box = row.current
    if (!key || !box || !keysOf(box).includes(key)) return
    last.current = key
    for (const each of box.querySelectorAll<HTMLElement>('button'))
      each.tabIndex = each === key ? 0 : -1
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const box = row.current
    if (!box || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return
    const keys = keysOf(box)
    const at = keys.indexOf(document.activeElement as HTMLElement)
    if (at < 0) return
    const to = {
      ArrowRight: Math.min(keys.length - 1, at + 1),
      ArrowLeft: Math.max(0, at - 1),
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
