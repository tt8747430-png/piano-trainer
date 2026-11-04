import { noteStaff, trackOf, type PlayerStaves } from '@/features/practice'
import type { Sound } from '@/shared/lib/schedule'

/**
 * What Play sounds in the editor (A40): every sound but the notes of a staff whose Play is off (the
 * Instruments' All and S, the Player's `staves`, A35). A sound of no staff's (a click) plays.
 */
export const heardSounds = (sounds: readonly Sound[], staves: PlayerStaves): Sound[] =>
  sounds.filter(
    (sound) =>
      sound.kind !== 'note' ||
      sound.part === undefined ||
      trackOf(
        staves,
        noteStaff(
          sound.staff === undefined
            ? { hand: sound.part }
            : { hand: sound.part, staff: sound.staff },
        ),
      ).play,
  )
