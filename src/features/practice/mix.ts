import type { SoundGain } from '@/shared/api/audio'
import type { StaffId } from '@/shared/lib/notation'
import type { Audible } from '@/shared/lib/schedule'
import { noteStaff } from './staves'

/** What the Player's mix turns up or down (ADR 0105): each staff, a piece's recording, the click. */
export type MixPart = StaffId | 'recording' | 'click'

/**
 * How loud each part of the music plays (ADR 0105, A35), each a gain from 0 (not played at all) to 1
 * (as loud as it is); a part it does not name as loud as it is.
 */
export type Mix = Readonly<Partial<Record<MixPart, number>>>

/** Every part as loud as it is. */
export const FULL_MIX: Mix = {}

/** How loud the mix plays a part. */
export const partGain = (mix: Mix, part: MixPart): number => mix[part] ?? 1

/**
 * Of the hands asked for, the ones heard: a hand whose staff is turned right down is not played at
 * all; the single staves each by their gain.
 */
export const heardIn = (hands: Audible, mix: Mix): Audible => ({
  rh: hands.rh && partGain(mix, 'treble') > 0,
  lh: hands.lh && partGain(mix, 'bass') > 0,
  staff: hands.staff,
})

/**
 * How loud the mix plays a sound, asked as it sounds: its staff's gain, a click's the click's; a
 * sound of no part (no piece's, the pedal) as it is.
 */
export const mixGain =
  (mix: () => Mix): SoundGain =>
  (sound) =>
    sound.kind === 'click'
      ? partGain(mix(), 'click')
      : sound.kind === 'note' && sound.part
        ? partGain(mix(), noteStaff({ hand: sound.part, staff: sound.staff }))
        : 1
