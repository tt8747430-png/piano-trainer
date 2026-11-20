/**
 * A sheet or window keeps the tallest height it has had while it stays open, as an iOS sheet keeps
 * its detent: turning to a shorter page (Count-in under the settings, Publish back to Settings) never
 * snaps it down for a frame and up again. Set in the resize observer's callback, before paint, so no
 * frame shows the shorter one; never past `cap`, the room it may take (the phone's keyboard up).
 * Returns the ref that holds it.
 */
export const holdTallestUnder =
  (cap: string) =>
  (popup: HTMLElement | null): (() => void) | undefined => {
    if (popup === null) return
    let tallest = 0
    const observer = new ResizeObserver(() => {
      if (popup.offsetHeight <= tallest) return
      tallest = popup.offsetHeight
      popup.style.minHeight = `min(${tallest}px, ${cap})`
    })
    observer.observe(popup)
    return () => observer.disconnect()
  }
