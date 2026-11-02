import { useSyncExternalStore } from 'react'
import {
  keyboardHeight,
  keyboardOpen,
  keyboardTop,
  subscribeKeyboard,
  subscribeKeyboardTop,
} from './keyboard-viewport'

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

/**
 * Where the phone's keyboard begins, in a fixed element's coordinates, followed as iOS pans the page
 * under it; `null` while none is up. For a bar that rides on the keyboard alone: it renders on every
 * pan, so it belongs in the bar's own small component.
 */
export function useKeyboardTop(): number | null {
  return useSyncExternalStore(subscribeKeyboardTop, keyboardTop, () => null)
}
