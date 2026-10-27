import {
  writtenOctave,
  type Accidental,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { Chart, StaffMusic } from '@/shared/lib/arrangement'
import { chartOf, stavesOf } from './chart'
import {
  defaultLyricsStaff,
  lyricsStaff,
  type ChartPiece,
  type KeyText,
  type PieceStaff,
  type Section,
  type StaffName,
} from './types'

/**
 * A song's or study's music as the content writes it: what a learner's version holds (ADR 0027),
 * under the learner's own title where they gave one (ADR 0094).
 */
export type PieceMusic = Pick<
  ChartPiece,
  | 'key'
  | 'meter'
  | 'timeSymbol'
  | 'tempoUnit'
  | 'tempo'
  | 'pattern'
  | 'sections'
  | 'staves'
  | 'leadSheet'
  | 'hands'
  | 'lyrics'
  | 'lyricsOn'
> & {
  /** The learner's own title: a version's, shown in every language in place of the catalog's. */
  readonly title?: string
}

/**
 * A piece's music, without what it leaves out: its single staves where it has any, a lead sheet only
 * with one (ADR 0083, 0097), its lyrics' staff only where they are and it is not the top single
 * staff (ADR 0093).
 */
export function musicOf(piece: ChartPiece): PieceMusic {
  const staves = piece.staves?.length ? { staves: piece.staves } : {}
  const sung = piece.lyrics?.length ? piece.lyrics : undefined
  const on = lyricsStaff(piece)
  return {
    key: piece.key,
    meter: piece.meter,
    ...(piece.timeSymbol ? { timeSymbol: true } : {}),
    ...(piece.tempoUnit ? { tempoUnit: piece.tempoUnit } : {}),
    tempo: piece.tempo,
    pattern: piece.pattern,
    sections: piece.sections,
    ...staves,
    ...(piece.leadSheet && staves.staves ? { leadSheet: true } : {}),
    ...(piece.hands === undefined ? {} : { hands: piece.hands }),
    ...(sung ? { lyrics: sung } : {}),
    ...(sung && on !== defaultLyricsStaff(piece) ? { lyricsOn: on } : {}),
  }
}

/**
 * Music read as the engine reads a piece: its chart (with the written hands) and its single staves,
 * its words on the notes of the staff they are on (ADR 0093, 0097); a mistake throws a ContentError.
 */
export function readMusic(music: PieceMusic): { chart: Chart; staves: StaffMusic[] } {
  const piece: ChartPiece = { id: 'music', kind: 'song', title: '', ...music }
  return { chart: chartOf(piece), staves: stavesOf(piece) }
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
 * A piece playing this music in place of its own: its single staves, hands and words only where the
 * music has them, under the music's own title where it has one.
 */
export const withMusic = (piece: ChartPiece, { title, ...music }: PieceMusic): ChartPiece =>
  retitled(
    {
      ...piece,
      ...music,
      staves: music.staves,
      leadSheet: music.leadSheet,
      hands: music.hands,
      lyrics: music.lyrics,
      lyricsOn: music.lyricsOn,
    },
    title,
  )

const sameText = (a: { en: string; ru: string } | undefined, b: typeof a) =>
  a?.en === b?.en && a?.ru === b?.ru

/** Whether two staves' names are one: the same text, or the same in both languages. */
const sameName = (a: StaffName | undefined, b: StaffName | undefined) =>
  typeof a === 'object' && typeof b === 'object' ? sameText(a, b) : a === b

const sameStaff = (a: PieceStaff, b: PieceStaff) =>
  sameName(a.name, b.name) && (a.clef ?? 'treble') === (b.clef ?? 'treble') && a.notes === b.notes

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
  (a.timeSymbol ?? false) === (b.timeSymbol ?? false) &&
  a.tempoUnit === b.tempoUnit &&
  a.tempo === b.tempo &&
  a.pattern === b.pattern &&
  (a.staves?.length ?? 0) === (b.staves?.length ?? 0) &&
  (a.staves ?? []).every((staff, i) => {
    const other = b.staves?.[i]
    return other !== undefined && sameStaff(staff, other)
  }) &&
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

/** A note as a single staff and the hands write it: its name in ASCII and its written octave (`C#5`, `B#3`). */
export const pitchText = (n: { readonly midi: Midi; readonly spelled: SpelledNote }): string =>
  `${n.spelled.letter}${ASCII_ACCIDENTALS[n.spelled.accidental]}${writtenOctave(n.midi, n.spelled)}`
