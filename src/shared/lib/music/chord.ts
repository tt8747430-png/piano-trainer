import { builderParts, builtIntervals, partsOf, partsSuffix, type ChordParts } from './chord-parts'
import {
  chordRootSpelling,
  qualityWithIntervals,
  tableIntervals,
  tableSuffix,
  type ChordQuality,
} from './chord-quality'
import type { LabelledInterval } from './interval'
import { noteName, pitchClassOf, plainRoot, type SpelledNote } from './note'
import type { PitchClass } from './pitch'
import { toneAbove, type Tone } from './tone'

/**
 * What a chord is over its root: a quality of the table where the table has the chord (`m7`, `7♭9`),
 * else the builder's parts (`9#11`, `7sus2`, `m7(add11)`), so every chord the builder makes can be
 * written, read and played. A chord the table has is never held as parts.
 */
export type ChordKind = ChordQuality | ChordParts

/** A chord: its root, its kind (a table quality for a chord drawn from the table: `Chord<ChordQuality>`), its bass. */
export interface Chord<Kind extends ChordKind = ChordKind> {
  readonly root: SpelledNote
  readonly quality: Kind
  /** The lowest note when it is not the root: the part after the slash. */
  readonly bass?: SpelledNote
}

/** The kind parts build: the table's quality where the table has the chord, else the builder's own parts. */
export const kindOfParts = (parts: ChordParts): ChordKind =>
  qualityWithIntervals(builtIntervals(parts)) ?? builderParts(parts)

/** Whether a chord's kind is one of the table's qualities. */
export const isTableQuality = (kind: ChordKind): kind is ChordQuality => typeof kind === 'string'

/** The parts that build a chord of this kind: how the Chords builder opens on it. */
export const partsOfKind = (kind: ChordKind): ChordParts =>
  isTableQuality(kind) ? partsOf(kind) : kind

/** Written after the root in a chord symbol: `m7♭5`, `9#11`, '' for major. */
export const qualitySuffix = (kind: ChordKind): string =>
  isTableQuality(kind) ? tableSuffix(kind) : partsSuffix(kind)

/** A chord's intervals from the root up. */
export const qualityIntervals = (kind: ChordKind): readonly LabelledInterval[] =>
  isTableQuality(kind) ? tableIntervals(kind) : builtIntervals(kind)

/** The chord's tones from the root up, each spelled by letter steps from the root. */
export function spellChord(root: SpelledNote, kind: ChordKind): Tone[] {
  return qualityIntervals(kind).map((interval) => toneAbove(root, interval))
}

/** The root a chord of this kind on this pitch class is named from (`chordRootSpelling` over its intervals). */
export const qualityRootSpelling = (pc: PitchClass, kind: ChordKind): SpelledNote =>
  chordRootSpelling(pc, qualityIntervals(kind))

/**
 * A chord written from its root and suffix, over its bass when that is not the root: `Dm7`, `C/E`. A
 * 6/9 over a bass writes its 9th in brackets, so the slashes cannot be confused: `C6(9)/E`.
 */
export const writtenSymbol = (
  chord: { readonly root: SpelledNote; readonly suffix: string },
  bass?: SpelledNote,
): string =>
  noteName(chord.root) +
  (bass ? `${chord.suffix.replace('6/9', '6(9)')}/${noteName(bass)}` : chord.suffix)

export const chordSymbol = (chord: Chord): string =>
  writtenSymbol({ root: chord.root, suffix: qualitySuffix(chord.quality) }, chord.bass)

/**
 * A bass that is a chord tone is spelled as that tone (`E/Ab` is `E/G#`), unless that writes it
 * oddly, a double accidental or a B♯ for a C, as no lead sheet does (`Gbm6/A`, not `G♭m6/B𝄫`); then,
 * and for any other bass, as written.
 */
export function chordBass(root: SpelledNote, kind: ChordKind, bass: SpelledNote): SpelledNote {
  const pc = pitchClassOf(bass)
  const tone = spellChord(root, kind).find((each) => each.pitchClass === pc)?.note
  return tone && plainRoot(tone) === tone ? tone : bass
}
