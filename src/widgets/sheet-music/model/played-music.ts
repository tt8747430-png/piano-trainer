import type { Performance } from '@/shared/lib/arrangement'
import { midi } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'

/**
 * The music the Player's sheet writes: the tune on its own staff where it is heard (`ownStaff`; the
 * Player doubles it an octave up to stand out, its staff writes it as the song does); else the
 * performance itself.
 */
export function playedMusic(performance: Performance, ownStaff: boolean): TimedMusic {
  if (!ownStaff) return performance
  return {
    ...performance,
    notes: performance.notes.map((n) =>
      n.hand === 'melody' ? { ...n, midi: midi(n.midi - 12) } : n,
    ),
    melodyStaff: true,
  }
}
