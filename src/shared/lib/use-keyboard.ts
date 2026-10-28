import { useSyncExternalStore } from 'react'
import { keyboardHeight, keyboardOpen, subscribeKeyboard } from './keyboard-viewport'

/**
 * Whether the phone's keyboard is up (or reserved for a field just focused), and nothing else: its
 * height changes several times while it is up (a predictive strip, the dismissal), and a caller that
 * needs only whether renders once each time it comes and goes.
 */
export function useKeyboardOpen(): boolean {
  return useSyncExternalStore(subscribeKeyboard, keyboardOpen, () => false)
}

/** How much of the screen the phone's keyboard covers: 0 while none is up. */
export function useKeyboardHeight(): number {
  return useSyncExternalStore(subscribeKeyboard, keyboardHeight, () => 0)
}
