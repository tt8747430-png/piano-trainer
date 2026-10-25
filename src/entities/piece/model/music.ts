import {
  writtenOctave,
  type Accidental,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { Chart, Melody } from '@/shared/lib/arrangement'
import { chartOf, melodyOf } from './chart'
import { lyricsStaff, type ChartPiece, type KeyText, type Section } from './types'

/**
 * A song's or study's music as the content writes it: what a learner's version holds (ADR 0027),
 * under the learner's own title where they gave one (ADR 0094).
 */
export type PieceMusic = Pick<
  ChartPiece,
  | 'key'
  | 'meter'
  | 'tempo'
  | 'pattern'
  | 'sections'
  | 'melody'
  | 'leadSheet'
  | 'hands'
  | 'lyrics'
  | 'lyricsOn'
> & {
  /** The learner's own title: a version's, shown in every language in place of the catalog's. */
  readonly title?: string
}

/**
 * A piece's music, without what it leaves out: its lyrics' staff only where they are, and it is not
 * the melody's (ADR 0093).
 */
export const musicOf = (piece: ChartPiece): PieceMusic => ({
  key: piece.key,
  meter: piece.meter,
  tempo: piece.tempo,
  pattern: piece.pattern,
  sections: piece.sections,
  ...(piece.melody === undefined ? {} : { melody: piece.melody }),
  ...(piece.leadSheet ? { leadSheet: true } : {}),
  ...(piece.hands === undefined ? {} : { hands: piece.hands }),
  ...(piece.lyrics?.length ? { lyrics: piece.lyrics } : {}),
  ...(piece.lyrics?.length && piece.melody !== undefined && lyricsStaff(piece) === 'rh'
    ? { lyricsOn: 'rh' }
    : {}),
})

/**
 * Music read as the engine reads a piece: its chart (with the written hands) and its tune, its words
 * on the tune's notes (ADR 0093); a mistake throws a ContentError.
 */
export function readMusic(music: PieceMusic): { chart: Chart; melody: Melody | undefined } {
  const piece: ChartPiece = { id: 'music', kind: 'song', title: '', ...music }
  return { chart: chartOf(piece), melody: melodyOf(piece) }
}

/**
 * An entry under the learner's own title (ADR 0094), the same in every language: the printed title's
 * translations go with it.
 */
function retitled(entry: ChartPiece, title: string | undefined): ChartPiece {
  if (title === undefined) return entry
  const { titleEn: _en, titleRu: _ru, ...untranslated } = entry
  return { ...untranslated, title }
}

/**
 * A piece playing this music in place of its own: its melody, hands and words only where the music
 * has them, under the music's own title where it has one.
 */
export const withMusic = (piece: ChartPiece, { title, ...music }: PieceMusic): ChartPiece =>
  retitled(
    {
      ...piece,
      ...music,
      melody: music.melody,
      leadSheet: music.leadSheet,
      hands: music.hands,
      lyrics: music.lyrics,
      lyricsOn: music.lyricsOn,
    },
    title,
  )

const sameText = (a: { en: string; ru: string } | undefined, b: typeof a) =>
  a?.en === b?.en && a?.ru === b?.ru

const sameSection = (a: Section, b: Section) =>
  a.kind === b.kind &&
  a.n === b.n &&
  a.label === b.label &&
  a.last === b.last &&
  sameText(a.detail, b.detail) &&
  a.key === b.key &&
  a.meter === b.meter &&
  a.pattern === b.pattern &&
  a.lines.length === b.lines.length &&
  a.lines.every((line, i) => line === b.lines[i])

/** Whether two pieces' music is written the same. */
export const sameMusic = (a: PieceMusic, b: PieceMusic): boolean =>
  a.title === b.title &&
  a.key === b.key &&
  a.meter === b.meter &&
  a.tempo === b.tempo &&
  a.pattern === b.pattern &&
  a.melody === b.melody &&
  (a.leadSheet ?? false) === (b.leadSheet ?? false) &&
  a.hands?.rh === b.hands?.rh &&
  a.hands?.lh === b.hands?.lh &&
  (a.lyrics ?? []).join('\n') === (b.lyrics ?? []).join('\n') &&
  a.lyricsOn === b.lyricsOn &&
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
