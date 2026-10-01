import type { PieceMusic } from '@/entities/piece'
import { chordSymbol, noteName } from '@/shared/lib/music'
import { readDraft, type Draft, type DraftNote } from '../model/draft'
import { barsOf } from '../model/timeline'

/** A draft to edit in tests: G major in 4/4 unless the music says otherwise. */
export const draftOf = (music: Partial<PieceMusic> = {}): Draft =>
  readDraft({
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['G C'] }],
    ...music,
  })

/** Notes as `F#4@12/12`: name, octave, onset and length. */
export const shape = (notes: readonly DraftNote[]): string[] =>
  notes.map(
    (n) => `${noteName(n.spelled)}${Math.floor(n.midi / 12) - 1}@${n.startTick}/${n.durationTicks}`,
  )

/** The draft's chart as lines of bars, each bar its chords `G@0`: what the form edits change. */
export const form = (draft: Draft): string[][][] =>
  draft.sections.map((section) =>
    section.lines.map((line) =>
      line.map((bar) =>
        bar.chords.map((chord) => `${chordSymbol(chord.chord)}@${chord.at}`).join(' '),
      ),
    ),
  )

export const lengths = (draft: Draft): number[] => barsOf(draft).map(({ bar }) => bar.ticks)
