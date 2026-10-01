import {
  writtenOctave,
  type Accidental,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ChartPiece, KeyText, Section } from './types'

/** A song's or study's music as the content writes it: what a learner's version holds (ADR 0027). */
export type PieceMusic = Pick<
  ChartPiece,
  'key' | 'meter' | 'tempo' | 'pattern' | 'sections' | 'melody' | 'hands'
>

/** A piece's music, without what it leaves out. */
export const musicOf = (piece: ChartPiece): PieceMusic => ({
  key: piece.key,
  meter: piece.meter,
  tempo: piece.tempo,
  pattern: piece.pattern,
  sections: piece.sections,
  ...(piece.melody === undefined ? {} : { melody: piece.melody }),
  ...(piece.hands === undefined ? {} : { hands: piece.hands }),
})

/** A piece playing this music in place of its own: its melody and hands only where the music has them. */
export const withMusic = (piece: ChartPiece, music: PieceMusic): ChartPiece => ({
  ...piece,
  ...music,
  melody: music.melody,
  hands: music.hands,
})

const sameText = (a: { en: string; ru: string } | undefined, b: typeof a) =>
  a?.en === b?.en && a?.ru === b?.ru

const sameSection = (a: Section, b: Section) =>
  a.kind === b.kind &&
  a.n === b.n &&
  a.label === b.label &&
  a.last === b.last &&
  sameText(a.detail, b.detail) &&
  a.lines.length === b.lines.length &&
  a.lines.every((line, i) => line === b.lines[i])

/** Whether two pieces' music is written the same. */
export const sameMusic = (a: PieceMusic, b: PieceMusic): boolean =>
  a.key === b.key &&
  a.meter === b.meter &&
  a.tempo === b.tempo &&
  a.pattern === b.pattern &&
  a.melody === b.melody &&
  a.hands?.rh === b.hands?.rh &&
  a.hands?.lh === b.hands?.lh &&
  a.sections.length === b.sections.length &&
  a.sections.every((section, i) => {
    const other = b.sections[i]
    return other !== undefined && sameSection(section, other)
  })

const KEY_ACCIDENTALS = { [-1]: 'b', 0: '', 1: '#' } as const

/** A key as content writes it: `G`, `F#m`, `Ebm`; a tonic with two accidentals names no key. */
export function keyText(key: Key): KeyText {
  const { letter, accidental } = key.tonic
  if (accidental !== -1 && accidental !== 0 && accidental !== 1) {
    throw new RangeError(`No key is written on ${letter} with ${accidental} accidentals`)
  }
  return `${letter}${KEY_ACCIDENTALS[accidental]}${key.minor ? 'm' : ''}`
}

const ASCII_ACCIDENTALS: Readonly<Record<Accidental, string>> = {
  [-2]: 'bb',
  [-1]: 'b',
  0: '',
  1: '#',
  2: '##',
}

/** A note as the melody and the hands write it: its name in ASCII and its written octave (`C#5`, `B#3`). */
export const pitchText = (n: { readonly midi: Midi; readonly spelled: SpelledNote }): string =>
  `${n.spelled.letter}${ASCII_ACCIDENTALS[n.spelled.accidental]}${writtenOctave(n.midi, n.spelled)}`
