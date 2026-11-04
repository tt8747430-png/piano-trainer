import {
  INTERVALS,
  keyParam,
  keySignature,
  LETTERS,
  noteName,
  numeralChord,
  parseNumerals,
  printedChord,
  printedNote,
  scaleIntervals,
  signatureNotes,
  spellChord,
  spellScale,
  writtenOctave,
  type Key,
  type Midi,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { cadenceNumerals } from './ladders/cadences'
import type { Question } from './round-machine'

/** What a Why line says, one sentence a kind (`quiz.why.<key>`). */
export type WhyKey =
  | 'chord'
  | 'inversion'
  | 'interval'
  | 'scale'
  | 'note'
  | 'signature'
  | 'noSignature'
  | 'degrees'
  | 'role'
  | 'progression'
  | 'cadence'

/**
 * Why a round's answer is its answer, as words to fill: its key, and the values its sentence takes.
 * Notes are printed (`F♯`); a few values are ids the words translate: `quality` a chord quality,
 * `interval` an interval, `kind` a scale kind, `cadence` a cadence, `key` a key (`F#m`), `clef` a
 * piano staff, `place` where a note sits on it, `position` an inversion (1 to 3), `steps` a scale's
 * steps in semitones (`2 2 1 2 2 2 1`).
 */
export interface LocalizedWhy {
  readonly key: WhyKey
  readonly values: Readonly<Record<string, string | number>>
}

const names = (notes: readonly SpelledNote[]) => notes.map(printedNote).join(' ')
const tones = (notes: readonly Tone[]) => names(notes.map((tone) => tone.note))

/** A chord's tones from its root, and its formula: `F A C`, `1 3 5`. */
function chordWhy(question: Extract<Question, { root: SpelledNote; quality: unknown }>) {
  const { root, quality, tones: chord, inversion } = question
  const values = {
    notes: tones(chord),
    formula: chord.map((tone) => tone.degree).join(' '),
    quality,
    root: printedNote(root),
  }
  const bass = inversion ? chord[inversion] : undefined
  return bass
    ? {
        key: 'inversion' as const,
        values: { ...values, position: inversion ?? 0, bass: printedNote(bass.note) },
      }
    : { key: 'chord' as const, values }
}

/**
 * An interval's number counts its letter names from the lower note to the upper, both counted (C up
 * to G: C D E F G, a 5th); its size, the semitones between them.
 */
function intervalWhy(question: Extract<Question, { interval: unknown; low: Midi }>): LocalizedWhy {
  const { steps } = INTERVALS[question.interval]
  const semitones = question.high - question.low
  // Past the octave the letters go round again: a 9th is an octave and a 2nd.
  const number = steps + 1 + (semitones >= 12 ? 7 : 0)
  return {
    key: 'interval',
    values: {
      low: printedNote(question.lowNote),
      high: printedNote(question.highNote),
      number,
      count: semitones,
      interval: question.interval,
    },
  }
}

/** A scale's notes and its steps between them, the octave's included. */
function scaleWhy(root: SpelledNote, kind: Parameters<typeof spellScale>[1]): LocalizedWhy {
  const semitones = scaleIntervals(kind).map((interval) => interval.semitones)
  const steps = semitones.map((at, i) => (semitones[i + 1] ?? 12) - at)
  return {
    key: 'scale',
    values: {
      root: printedNote(root),
      notes: tones(spellScale(root, kind)),
      kind,
      steps: steps.join(' '),
    },
  }
}

/** The bottom line of each of the piano's staves, as letter steps from C0. */
const BOTTOM_LINE: Readonly<Record<'treble' | 'bass', number>> = {
  treble: 4 * 7 + 2, // E4
  bass: 2 * 7 + 4, // G2
}

/**
 * Where a note sits on its staff, counted from the bottom as players count: a line or a space 1 to 5
 * (4 for a space), or past the staff, just under or over it or on or by a ledger line.
 */
export function notePlace(key: Midi, spelled: SpelledNote, clef: StaffId): string {
  const bottom = BOTTOM_LINE[clef === 'bass' ? 'bass' : 'treble']
  const at = writtenOctave(key, spelled) * 7 + LETTERS.indexOf(spelled.letter) - bottom
  if (at >= 0 && at <= 8) return at % 2 === 0 ? `line${at / 2 + 1}` : `space${(at + 1) / 2}`
  if (at === -1) return 'under'
  if (at === 9) return 'over'
  const below = at < 0
  const past = below ? -at : at - 8
  return past % 2 === 0
    ? `${below ? 'ledgerBelow' : 'ledgerAbove'}:${past / 2}`
    : `${below ? 'byLedgerBelow' : 'byLedgerAbove'}:${(past - 1) / 2}`
}

/** A numeral's triad in a key, as the trainers sound it: the chord and its notes. */
function numeralTriad(numeral: string, key: Key) {
  const [read] = parseNumerals(numeral) ?? []
  if (!read) throw new RangeError(`${numeral} is not a numeral`)
  const chord = numeralChord(read, key, 'triads')
  return { chord, notes: spellChord(chord.root, chord.quality) }
}

/**
 * Why a round's answer is what it is, from the kernel's own theory: a chord's notes and formula, an
 * interval's letters and semitones, a scale's steps, where a note sits, a key's sharps or flats, a
 * numeral's chord in its key, a cadence's chords.
 */
export function whyAnswer(question: Question): LocalizedWhy {
  switch (question.mode) {
    case 'build-chord':
      if (question.cadence) {
        const { cadence, voicing, key } = question.cadence
        return {
          key: 'cadence',
          values: { cadence, numerals: cadenceNumerals(voicing), key: keyParam(key) },
        }
      }
      return chordWhy(question)
    case 'name-chord':
    case 'chord-card':
      return chordWhy(question)
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return intervalWhy(question)
    case 'build-scale':
      return scaleWhy(question.root, question.kind)
    case 'name-scale':
      return scaleWhy(question.root, question.kind)
    case 'read-note':
      return {
        key: 'note',
        values: {
          note: `${noteName(question.spelled)}${writtenOctave(question.key, question.spelled)}`,
          clef: question.clef === 'bass' ? 'bass' : 'treble',
          place: notePlace(question.key, question.spelled, question.clef),
        },
      }
    case 'key-signature': {
      const count = keySignature(question.key)
      return count === 0
        ? { key: 'noSignature', values: { key: keyParam(question.key) } }
        : {
            key: 'signature',
            values: {
              key: keyParam(question.key),
              count: Math.abs(count),
              sign: count > 0 ? 'sharps' : 'flats',
              notes: names(signatureNotes(question.key)),
            },
          }
    }
    case 'key-degrees':
      return {
        key: 'degrees',
        values: { key: keyParam(question.key), notes: tones(question.notes) },
      }
    case 'chord-role': {
      const { chord, notes } = numeralTriad(question.numeral, question.key)
      const { root } = chord
      // The degree counted up from the tonic by letter: the root's place in the key's scale.
      const degree =
        ((LETTERS.indexOf(root.letter) - LETTERS.indexOf(question.key.tonic.letter) + 7) % 7) + 1
      return {
        key: 'role',
        values: {
          key: keyParam(question.key),
          numeral: question.numeral,
          degree,
          root: printedNote(root),
          notes: tones(notes),
        },
      }
    }
    case 'name-progression': {
      const chords = question.line
        .split(' ')
        .map((numeral) => printedChord(numeralTriad(numeral, question.key).chord))
      return {
        key: 'progression',
        values: {
          key: keyParam(question.key),
          numerals: question.line.split(' ').join('–'),
          chords: chords.join(' – '),
        },
      }
    }
    case 'name-cadence':
    case 'cadence-card':
      return {
        key: 'cadence',
        values: {
          cadence: question.cadence,
          numerals: cadenceNumerals(question.voicing),
          key: keyParam(question.key),
        },
      }
  }
}
