import type {
  Articulation,
  Dynamic,
  Expression,
  GraceNote,
  Hairpin,
  NoteMarks,
  OctaveLine,
  Ornament,
  Pedal,
} from '@/shared/lib/music'
import { pitchText } from './music'
import { readPitch } from './note-text'

/** Each mark's word in a song's text (docs/CONTENT.md, ADR 0097). */
const ARTICULATION_WORDS: Readonly<Record<Articulation, string>> = {
  accent: 'acc',
  staccato: 'stacc',
  staccatissimo: 'staccatiss',
  tenuto: 'ten',
  marcato: 'marc',
  fermata: 'ferm',
}
const ORNAMENT_WORDS: Readonly<Record<Ornament, string>> = {
  trill: 'tr',
  mordent: 'mord',
  'lower-mordent': 'lmord',
  turn: 'turn',
  tremolo: 'trem',
}
const HAIRPIN_WORDS: Readonly<Record<Hairpin, string>> = {
  cresc: 'cresc',
  dim: 'dim',
  end: '/hairpin',
}
const EXPRESSION_WORDS: Readonly<Record<Expression, string>> = {
  dolce: 'dolce',
  cantabile: 'cantabile',
  espressivo: 'espress',
  legato: 'legato',
  leggiero: 'leggiero',
  rit: 'rit',
  rall: 'rall',
  accel: 'accel',
  'a-tempo': 'atempo',
}
const PEDAL_WORDS: Readonly<Record<Pedal, string>> = { down: 'ped', up: 'pedup', change: 'pedch' }
const OCTAVE_WORDS: readonly OctaveLine[] = ['8va', '8vb']
const DYNAMIC_WORDS: readonly Dynamic[] = ['pp', 'p', 'mp', 'mf', 'f', 'ff']

const lookup = <K extends string>(words: Readonly<Record<K, string>>) =>
  new Map(Object.entries(words).map(([kind, word]) => [word as string, kind as K]))
const ARTICULATION_BY_WORD = lookup(ARTICULATION_WORDS)
const ORNAMENT_BY_WORD = lookup(ORNAMENT_WORDS)
const HAIRPIN_BY_WORD = lookup(HAIRPIN_WORDS)
const EXPRESSION_BY_WORD = lookup(EXPRESSION_WORDS)
const PEDAL_BY_WORD = lookup(PEDAL_WORDS)

const GRACE = 'gr:'
/** An appoggiatura's: its grace notes unslashed. */
const APPOGGIATURA = 'app:'

/** `D5+E5`: grace notes' pitches as written, or null. */
function readGrace(text: string): GraceNote[] | null {
  if (text === '') return null
  const notes = text.split('+').map(readPitch)
  return notes.every((n) => n !== null) ? notes : null
}

/**
 * A token's marks, `acc,stacc,tr,(,8va,p,cresc,gr:D5`, or null where one is unknown, empty, or a kind
 * that holds one comes twice (two ornaments, two dynamics).
 */
export function readMarks(text: string): NoteMarks | null {
  const words = text.split(',').map((word) => word.trim())
  if (words.some((word) => word === '')) return null
  const articulations: Articulation[] = []
  const marks: {
    -readonly [K in keyof NoteMarks]: NoteMarks[K]
  } = {}
  const once = <K extends keyof NoteMarks>(key: K, value: NoteMarks[K]): boolean => {
    if (marks[key] !== undefined) return false
    marks[key] = value
    return true
  }
  for (const word of words) {
    const articulation = ARTICULATION_BY_WORD.get(word)
    const ornament = ORNAMENT_BY_WORD.get(word)
    const hairpin = HAIRPIN_BY_WORD.get(word)
    const octave = OCTAVE_WORDS.find((line) => line === word)
    const dynamic = DYNAMIC_WORDS.find((level) => level === word)
    const expression = EXPRESSION_BY_WORD.get(word)
    const pedal = PEDAL_BY_WORD.get(word)
    let read: boolean
    if (articulation) {
      read = !articulations.includes(articulation)
      articulations.push(articulation)
    } else if (ornament) read = once('ornament', ornament)
    else if (hairpin) read = once('hairpin', hairpin)
    else if (octave) read = once('octave', octave)
    else if (dynamic) read = once('dynamic', dynamic)
    else if (expression) read = once('expression', expression)
    else if (pedal) read = once('pedal', pedal)
    else if (word === 'arp') read = once('arpeggio', true)
    else if (word === '(') read = once('slurStart', true)
    else if (word === ')') read = once('slurEnd', true)
    else if (word.startsWith(GRACE)) {
      const grace = readGrace(word.slice(GRACE.length))
      read = grace !== null && once('grace', grace)
    } else if (word.startsWith(APPOGGIATURA)) {
      const grace = readGrace(word.slice(APPOGGIATURA.length))
      read =
        grace !== null &&
        once(
          'grace',
          grace.map((g) => ({ ...g, appoggiatura: true as const })),
        )
    } else read = false
    if (!read) return null
  }
  return articulations.length > 0 ? { articulations, ...marks } : marks
}

/**
 * Marks as a token writes them, in one order: articulations, ornament, roll, slurs, octave, dynamic,
 * hairpin, expression, pedal, grace.
 */
export function writeMarks(marks: NoteMarks): string {
  const graceText = (grace: readonly GraceNote[]) =>
    (grace[0]?.appoggiatura ? APPOGGIATURA : GRACE) + grace.map(pitchText).join('+')
  return [
    ...(marks.articulations ?? []).map((articulation) => ARTICULATION_WORDS[articulation]),
    marks.ornament && ORNAMENT_WORDS[marks.ornament],
    marks.arpeggio && 'arp',
    marks.slurStart && '(',
    marks.slurEnd && ')',
    marks.octave,
    marks.dynamic,
    marks.hairpin && HAIRPIN_WORDS[marks.hairpin],
    marks.expression && EXPRESSION_WORDS[marks.expression],
    marks.pedal && PEDAL_WORDS[marks.pedal],
    marks.grace && graceText(marks.grace),
  ]
    .filter((word): word is string => typeof word === 'string')
    .join(',')
}
