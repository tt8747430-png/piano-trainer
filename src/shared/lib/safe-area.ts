import { useMemo, useSyncExternalStore } from 'react'

/** Room on each side of the screen, in CSS pixels. */
export interface Edges {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

/** The gap a layer keeps from the edge it would cross: Base UI's own, 5px. */
const GAP = 5

/** The safe area's insets as last read, as "top right bottom left"; read again once the screen turns. */
let known: string | undefined
let watching = false

/** The insets as the browser resolves `env(safe-area-inset-*)` now: zero on a screen with none. */
function readInsets(): string {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)'
  document.body.append(probe)
  const style = getComputedStyle(probe)
  const sides = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]
  probe.remove()
  return sides.map((side) => parseFloat(side) || 0).join(' ')
}

function insets(): string {
  // Forgotten on every resize, a turn of the phone included, even while no layer is open to hear it.
  if (!watching) {
    watching = true
    window.addEventListener('resize', () => {
      known = undefined
    })
  }
  known ??= readInsets()
  return known
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/**
 * The room a positioned layer (a popover, a menu, a select's list, a tooltip) keeps from the screen's
 * edges: the safe area's insets and Base UI's 5px, so on a phone on its side nothing lands in the home
 * indicator's strip or under the notch, and on an installed iPhone nothing under the status bar.
 */
export function useLayerPadding(): Edges {
  const read = useSyncExternalStore(subscribe, insets)
  return useMemo(() => {
    const [top = 0, right = 0, bottom = 0, left = 0] = read.split(' ').map(Number)
    return { top: top + GAP, right: right + GAP, bottom: bottom + GAP, left: left + GAP }
  }, [read])
}
