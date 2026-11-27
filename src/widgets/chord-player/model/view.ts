import type { KeyParam } from '@/shared/lib/music'

/** The rail's places (R77): the panel open beside it, or none (`«` folded it). */
export const CHORD_PANELS = ['chords', 'styles', 'genos', 'audio', 'chart', 'none'] as const
export type ChordPanel = (typeof CHORD_PANELS)[number]

/**
 * What the Chord player shows, in its URL (R29 CP1, CP5; R77): the sheet open, on arrival a
 * progression or a shared sheet's link, the rail's panel (Chords when none is named) and the keys
 * hidden. The panel and the keys are remembered (`pt-views`).
 */
export interface ChordPlayerView {
  readonly sheet?: string | undefined
  readonly p?: string | undefined
  readonly key?: KeyParam | undefined
  /** A shared sheet's link (R39-10): opened among My chord sheets on arrival. */
  readonly link?: string | undefined
  /** The rail's panel open on a laptop; Chords when absent. */
  readonly panel?: Exclude<ChordPanel, 'chords'> | undefined
  /** The keys docked under the chart hidden by the band's keys button. */
  readonly keys?: 'off' | undefined
}
