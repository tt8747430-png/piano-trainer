import type { KeyParam } from '@/shared/lib/music'
import type { MetronomeBeats } from '@/shared/lib/schedule'

/**
 * Free play's three ways with the keys (ADR 0052): play them under a live score, find the chord the
 * keys tapped or held make, or mark a teaching diagram on them.
 */
export const FREE_PLAY_MODES = ['play', 'find', 'mark'] as const
export type FreePlayMode = (typeof FREE_PLAY_MODES)[number]

/** What Free play shows, as its URL holds it. */
export interface FreePlayView {
  readonly mode: FreePlayMode
  /** The key the live score spells in. */
  readonly key: KeyParam
  /** Find's keys, written `60-64-67`, lowest first. */
  readonly keys: string
  /** Mark's marks (`diagramMarksParam`): a diagram is a link to send. */
  readonly marks: string
  /** The metronome's tempo and beats a bar. */
  readonly tempo: number
  readonly beats: MetronomeBeats
}
