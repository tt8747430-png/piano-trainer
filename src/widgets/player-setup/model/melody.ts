import type { MelodySource } from '@/entities/settings'

/** Why a source of the melody cannot be chosen for a song, a key of `player:melody.why`. */
export type MelodyWhy = 'noStaff' | 'noRecording' | 'ownKey' | 'leadSheet'

/** What a song has to play its melody with. */
export interface MelodyHas {
  /** A single staff over the piano: its top one is the melody. */
  readonly staff: boolean
  readonly recording: boolean
  /** Whether it is played in its own key: its recording plays in no other. */
  readonly inOwnKey: boolean
  /** Its staves alone in sight: the melody is what its sheet shows, always heard (ADR 0114). */
  readonly leadSheet: boolean
}

/** The melody a song plays, and how its choice reads. */
export interface Melody {
  /** The choice as the Setup shows it. */
  readonly shown: MelodySource
  /** Whether the top single staff is heard. */
  readonly tune: boolean
  /** Whether the recording plays along. */
  readonly recording: boolean
  /** The choices greyed, each with why. */
  readonly greyed: Partial<Record<MelodySource, MelodyWhy>>
}

/**
 * The melody heard with the hands (ADR 0115), from the source the learner saved (for every song) and
 * what this song has: its top single staff, its recording (in its own key alone), or none. A source
 * the song has not shows as None and plays nothing; a lead sheet always plays its staff, its None
 * greyed.
 */
export function melodyOf(saved: MelodySource, has: MelodyHas): Melody {
  const greyed: Partial<Record<MelodySource, MelodyWhy>> = {
    ...(has.leadSheet ? { none: 'leadSheet' as const } : {}),
    ...(has.staff ? {} : { staff: 'noStaff' as const }),
    ...(!has.recording
      ? { recording: 'noRecording' as const }
      : has.inOwnKey
        ? {}
        : { recording: 'ownKey' as const }),
  }
  const open = greyed[saved] === undefined
  const shown = open ? saved : has.leadSheet ? 'staff' : 'none'
  return {
    shown,
    tune: shown === 'staff' || has.leadSheet,
    recording: shown === 'recording',
    greyed,
  }
}
