import type { SoundGain } from '@/shared/api/audio'
import type { NoteHand } from '@/shared/lib/arrangement'
import type { Audible } from '@/shared/lib/schedule'

/**
 * How loud each part of the music plays (ADR 0105): each hand, the staves over the piano, a piece's
 * recording and the click, each a gain from 0 (not played at all) to 1 (as loud as it is).
 */
export type Mix = Readonly<Record<NoteHand | 'recording' | 'click', number>>

/** Every part as loud as it is. */
export const FULL_MIX: Mix = { rh: 1, lh: 1, staff: 1, recording: 1, click: 1 }

/** Of the hands asked for, the ones heard: a part turned right down is not played at all. */
export const heardIn = (hands: Audible, mix: Mix): Audible => ({
  rh: hands.rh && mix.rh > 0,
  lh: hands.lh && mix.lh > 0,
  staff: hands.staff && mix.staff > 0,
})

/**
 * How loud the mix plays a sound, asked as it sounds: its part's gain, a click's the click's; a
 * sound of no part (no piece's) as it is.
 */
export const mixGain =
  (mix: () => Mix): SoundGain =>
  (sound) =>
    sound.kind === 'click' ? mix().click : sound.part ? mix()[sound.part] : 1
