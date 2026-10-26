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
  /**
   * The A above middle C it is tuned to, in hertz, where that is not the standard pitch (measured
   * from the file): an instrument tuned to it plays along in tune (ADR 0107).
   */
  readonly tuning?: number
}

/** The standard pitch: the A above middle C at 440 Hz. */
export const STANDARD_TUNING = 440

/** The A a piece's music is tuned to: its recording's, else the standard pitch. */
export const tuningOf = (recording: Recording | undefined): number =>
  recording?.tuning ?? STANDARD_TUNING

/** Where in a recording one pass plays from, when on the audio clock, how fast, and until when. */
export interface RecordingPlay {
  /** When it starts on the audio clock: the pass's first tick, or earlier during a count-in. */
  readonly at: number
  /** Seconds into the file. */
  readonly offset: number
  /** The pass's tempo over the recording's: 0.5 at half speed. */
  readonly rate: number
  /** When the pass is over, on the audio clock. */
  readonly until: number
}

/**
 * The recording under one pass: from the pass's first tick at its tempo, and during its count-in what
 * leads into it (a singer's pickup), though never from before the file's start.
 */
export function recordingPlay(recording: Recording, pass: Pass): RecordingPlay {
  const rate = pass.tempo / recording.tempo
  const first = recording.start + (pass.fromTick * 60) / (recording.tempo * TICKS_PER_BEAT)
  const lead = Math.min(pass.musicStart, first / rate)
  return {
    at: pass.start + pass.musicStart - lead,
    offset: first - lead * rate,
    rate,
    until: pass.start + pass.end,
  }
}
