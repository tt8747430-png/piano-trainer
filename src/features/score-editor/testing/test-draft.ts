import type { PieceMusic } from '@/entities/piece'
import { chordSymbol, noteName, TICKS_PER_BEAT } from '@/shared/lib/music'
import { readDraft, type Draft, type DraftNote } from '../model/draft'
import { barsOf } from '../model/timeline'

/**
 * A draft to edit in tests: G major in 4/4 unless the music says otherwise; both hands silent unless
 * the music writes them (a bar left to the pattern is written out, ADR 0114).
 */
export function draftOf(music: Partial<PieceMusic> = {}): Draft {
  const draft = readDraft({
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['G C'] }],
    ...music,
  })
  return music.hands === undefined ? { ...draft, hands: { rh: [], lh: [] } } : draft
}

/** A draft of one single staff over the piano, empty unless the music writes it (ADR 0097). */
export const oneStaff = (music: Partial<PieceMusic> = {}): Draft =>
  draftOf({ staves: [{ notes: 'r/1' }], ...music })

/** A single staff's notes, by its place: the top one's unless said (ADR 0097). */
export const staffNotes = (draft: Pick<Draft, 'staves'>, place = 0): readonly DraftNote[] =>
  draft.staves[place]?.notes ?? []

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/** Ticks as beats, as a song's text writes them: `2`, `1.5`, `.5`, `.0625`, `1:3`. */
export function beats(ticks: number): string {
  const exact = ticks / TICKS_PER_BEAT
  const short = Number(exact.toFixed(4))
  if (Math.abs(short - exact) < 1e-9) return String(short).replace(/^(-?)0\./, '$1.')
  const divisor = gcd(Math.abs(ticks), TICKS_PER_BEAT)
  return `${ticks / divisor}:${TICKS_PER_BEAT / divisor}`
}

/** Notes as `F#4@1/1`: name, octave, onset and length, in beats. */
export const shape = (notes: readonly DraftNote[]): string[] =>
  notes.map(
    (n) =>
      `${noteName(n.spelled)}${Math.floor(n.midi / 12) - 1}@${beats(n.startTick)}/${beats(n.durationTicks)}`,
  )

/** The draft's chart as lines of bars, each bar its chords `G@0` (in beats): what the form edits change. */
export const form = (draft: Draft): string[][][] =>
  draft.sections.map((section) =>
    section.lines.map((line) =>
      line.map((bar) =>
        bar.chords.map((chord) => `${chordSymbol(chord.chord)}@${beats(chord.at)}`).join(' '),
      ),
    ),
  )

/** Each bar's length in beats. */
export const lengths = (draft: Draft): number[] =>
  barsOf(draft).map(({ bar }) => bar.ticks / TICKS_PER_BEAT)
