import { useState } from 'react'
import { reconcileHeldOrder } from './order'

/** An order a drop asked for, kept on screen until the list it was dropped on says the same. */
export interface HeldOrder<T> {
  /** The order to draw: the one dropped, until the list says the same. */
  readonly order: readonly T[]
  /** Holds the order a drop made. */
  readonly hold: (next: readonly T[]) => void
}

/**
 * Keeps a dropped order on screen until the list catches up (Mindscape's, its first cause of a drop's
 * flicker): a list that has not yet taken the new order would snap the rows back under the finger.
 * Worked out as it renders, never mirrored by an effect, which would draw one frame of the old order
 * first; once the list says what was asked, the hold lets go, so a change from anywhere else (another
 * tab) comes straight through.
 */
export function useHeldOrder<T>(ids: readonly T[]): HeldOrder<T> {
  const [held, hold] = useState<readonly T[] | null>(null)
  if (held === null) return { order: ids, hold }
  const { order, settled } = reconcileHeldOrder(held, ids)
  if (settled) {
    // Set as it renders: React draws it again at once, so no frame shows a hold no longer true.
    hold(null)
    return { order: ids, hold }
  }
  return { order, hold }
}
