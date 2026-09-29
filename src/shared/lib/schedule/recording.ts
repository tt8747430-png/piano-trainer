import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { Pass } from './loop'

/** A performance of a piece (a singer's) that the Player plays along: in the piece's own key and form. */
export interface Recording {
  /** The audio file's URL: imported with `?url`, so the build fingerprints and precaches it. */
  readonly src: string
  /** Seconds into the file where bar 1 begins. */
  readonly start: number
  /** Its steady tempo in beats per minute, counted as the piece's chart counts them. */
  readonly tempo: number
}

/** Where in a recording one pass plays from, when on the audio clock, how fast, and until when. */
export interface RecordingPlay {
  /** When the pass's first tick sounds, on the audio clock. */
  readonly at: number
  /** Seconds into the file. */
  readonly offset: number
  /** The pass's tempo over the recording's: 0.5 at half speed. */
  readonly rate: number
  /** When the pass is over, on the audio clock. */
  readonly until: number
}

/** The recording under one pass: from the pass's first tick, as its music starts, at its tempo. */
export function recordingPlay(recording: Recording, pass: Pass): RecordingPlay {
  return {
    at: pass.start + pass.musicStart,
    offset: recording.start + (pass.fromTick * 60) / (recording.tempo * TICKS_PER_BEAT),
    rate: pass.tempo / recording.tempo,
    until: pass.start + pass.end,
  }
}
