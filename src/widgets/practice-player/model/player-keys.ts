import type { Combo } from '@/shared/lib/shortcuts'

/** The Player's keys (spec 2026-10-09 §3): bound by `usePlayerShortcuts`, named on its buttons. */
export const PLAYER_KEYS = {
  play: { key: ' ' },
  back: { key: 'ArrowLeft' },
  next: { key: 'ArrowRight' },
  faster: { key: 'ArrowUp' },
  slower: { key: 'ArrowDown' },
  loop: { code: 'KeyR' },
  start: { key: 'Home' },
  close: { key: 'Escape' },
} as const satisfies Record<string, Combo>
