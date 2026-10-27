import { keySignature } from '@/shared/lib/music'
import type { StaffLabels } from './mei'
import type { Score } from './types'

/**
 * How much each measure's notes take across, packed as tight as they read, in the engraving's units
 * (ADR 0087): estimated from what it writes, before anything is engraved, so a sheet can break its
 * lines by width as LilyPond and abcjs do rather than by a count of bars. Fitted to Verovio's natural
 * widths over the songs (ADR 0087): a measure's barline and margins take `MEASURE_BASE`, each column
 * of notes or rests about `PER_ONSET`, more with an accidental; a measure of many chord names, the
 * names side by side.
 */
const MEASURE_BASE = 60
const PER_ONSET = 21
const PER_ACCIDENTAL_COLUMN = 8
/** The least a measure takes, a whole note's. */
const LEAST_MEASURE = 95
/** A chord symbol's character, and the gap after each symbol, in CSS px at its own size. */
const CHORD_CHAR = 10
const CHORD_GAP = 8
/** A measure's names never sit evenly over its notes: they need this much more than their sum. */
const CHORD_SLACK = 1.4
/** What every line starts with: its clef and margins, the brace; then each sharp or flat of the key. */
const LINE_LEAD = 70
const PER_KEY_ACCIDENTAL = 14

/**
 * Each measure's width at `scale`: its columns of notes, or its chord names where they are shown
 * (`chordNames`) and take more (the names keep their own size, so they take more of a smaller
 * staff's units); the first with the staves' names printed before it at the score's head (`labels`,
 * ADR 0114), so the first line holds as much less.
 */
export function measureWidths(
  score: Score,
  scale = 1,
  chordNames = true,
  labels: StaffLabels = {},
): number[] {
  return score.measures.map((measure, index) => {
    const columns = new Map<number, boolean>()
    for (const staff of score.staves) {
      for (const voice of measure.staves[staff] ?? []) {
        for (const event of voice.events) {
          if (event.kind === 'rest' && event.hidden) continue
          const accidental =
            event.kind === 'notes' && event.notes.some((note) => note.accidental !== null)
          columns.set(event.tick, (columns.get(event.tick) ?? false) || accidental)
        }
      }
    }
    const notes = [...columns.values()].reduce(
      (sum, accidental) => sum + PER_ONSET + (accidental ? PER_ACCIDENTAL_COLUMN : 0),
      MEASURE_BASE,
    )
    const names = !chordNames
      ? 0
      : measure.chords.reduce(
          (sum, chord) => sum + chord.symbol.length * CHORD_CHAR + CHORD_GAP,
          0,
        ) * CHORD_SLACK
    return Math.max(LEAST_MEASURE, notes, names / scale) + (index === 0 ? labelLead(labels) : 0)
  })
}

/** What a line's clef and key signature take before its first measure's notes, in the engraving's units. */
export const lineLead = (score: Pick<Score, 'key'>): number =>
  LINE_LEAD + Math.abs(keySignature(score.key)) * PER_KEY_ACCIDENTAL

/**
 * A staff name's character as Verovio prints it (small), and the room after a name before its staff:
 * the piano's takes its brace's too.
 */
const LABEL_CHAR = 10.5
const LABEL_GAP = { single: 10, piano: 22 } as const

/**
 * What the staves' names take before a line's clef (ADR 0114), in the engraving's units: the longest
 * name's, as Verovio indents a score's first line to print them.
 */
export const labelLead = (labels: StaffLabels): number =>
  Math.max(
    0,
    ...Object.entries(labels).map(([staff, name]) =>
      name === undefined
        ? 0
        : name.text.length * LABEL_CHAR + LABEL_GAP[staff === 'piano' ? 'piano' : 'single'],
    ),
  )
