import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { wholeBar } from '@/entities/piece'
import { arrange, type Chart, type EventFigure, type Figure } from '@/shared/lib/arrangement'
import { C_MAJOR, note } from '@/shared/lib/music'

/** A note of a hand's figure in a bar: where it starts and how long, as shares of the bar, and how high. */
export interface RollNote {
  readonly start: number
  readonly length: number
  /** From 0, the hand's lowest note in the bar, to 1, its highest. */
  readonly height: number
}

/** A bar of C major in 4/4: what a figure is drawn over, as the pattern's page plays it. */
const C_BAR: Chart = {
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [[wholeBar({ root: note('C'), quality: 'maj' })]] }],
}

/** A pattern whose hands every figure replaces: chords on every beat over a whole-note octave. */
const BASE = BUILT_IN_PATTERNS.require('M1').pattern

/**
 * A hand's figure over a bar of C as a piano roll (ADR 0115), the picture on its row in the Setup:
 * its notes in time order, each as a share of the bar, and its height between the hand's lowest and
 * highest note there. A figure that plays the tune plays what it plays with no tune.
 */
export function figureRoll(hand: 'rh' | 'lh', figure: Figure): RollNote[] {
  const performance = arrange(C_BAR, {
    tonic: note('C'),
    pattern: BASE,
    ...(hand === 'rh' ? { rh: figure } : { lh: figure as EventFigure }),
  })
  const bar = performance.totalTicks
  const notes = performance.notes.filter((n) => n.hand === hand && !n.silent)
  const pitches = notes.map((n) => n.midi)
  const low = Math.min(...pitches)
  const span = Math.max(...pitches) - low
  return notes.map((n) => ({
    start: n.startTick / bar,
    length: Math.min(n.durationTicks, bar - n.startTick) / bar,
    height: span === 0 ? 0.5 : (n.midi - low) / span,
  }))
}
