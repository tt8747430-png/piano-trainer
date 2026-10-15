import { chordSymbol, type Chord } from '@/shared/lib/music'

/** The places in a row where one chord moves to another: each chord with a different one after it. */
export const changesOf = (chords: readonly Chord[]): number[] =>
  chords.flatMap((chord, at) => {
    const next = chords[at + 1]
    return next && chordSymbol(next) !== chordSymbol(chord) ? [at] : []
  })
