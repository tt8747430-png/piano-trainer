import type { Combo } from '@/shared/lib/shortcuts'

/** The Player's keys: bound by `usePlayerShortcuts`, named on its buttons. */
export const PLAYER_KEYS = {
  play: { key: ' ' },
  back: { key: 'ArrowLeft' },
  next: { key: 'ArrowRight' },
  faster: { key: 'ArrowUp' },
  slower: { key: 'ArrowDown' },
  loop: { code: 'KeyR' },
  start: { key: 'Home' },
  /** The loop's far end a bar back or on, to the first or last bar (ADR 0096). */
  reachBack: { key: 'ArrowLeft', shift: true },
  reachNext: { key: 'ArrowRight', shift: true },
  reachStart: { key: 'Home', shift: true },
  reachEnd: { key: 'End', shift: true },
  /** The loop let go of; with none, the Player closed. */
  close: { key: 'Escape' },
} as const satisfies Record<string, Combo>
