import {
  keyboardRange,
  keyScale,
  MIDDLE_C,
  midi,
  noteName,
  pitchClass,
  placeChord,
  placeScale,
  type KeyRange,
  type Midi,
  type PlacedTone,
} from '@/shared/lib/music'
import { chordSounds, intervalSounds, walkSounds, type NoteSound } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { Asks } from './draw'
import type { Question } from './round-machine'

/** Middle C to the E above the next C: room to build most chords and scales, any octave counting. */
export const QUIZ_RANGE: KeyRange = { from: MIDDLE_C, to: midi(76) }

/** A line of single notes, a beat each at this tempo: a scale or a key's degrees heard. */
const LINE_TEMPO = 200
/** The tonic, then the chord: a chord's role heard. */
const ROLE_TEMPO = 76

/** A chord in its inversion from middle C, a scale up from its root, a key's degrees I to VII. */
function placed(question: Question): readonly PlacedTone[] {
  switch (question.mode) {
    case 'build-chord':
    case 'name-chord':
    case 'chord-card':
      return placeChord(question.tones, { inversion: question.inversion ?? 0, bothHands: false }).rh
    case 'build-scale':
      return placeScale(question.root, question.kind)
    case 'key-degrees':
      return placeScale(question.key.tonic, keyScale(question.key)).slice(0, -1)
    default:
      return []
  }
}

/** The round's answer, or what it plays, on the keyboard. */
export function targetKeys(question: Question): Midi[] {
  switch (question.mode) {
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return [question.low, question.high]
    case 'name-scale':
      return [...question.keys]
    case 'chord-role':
      return [...question.chordKeys]
    case 'name-progression':
      return [...new Set(question.chordKeys.flat())]
    case 'read-note':
      return [question.key]
    case 'key-signature':
      return []
    default:
      return placed(question).map((tone) => tone.midi)
  }
}

/**
 * The answer's keys, each marked with its note's name: a card turned over, an answer shown. A chord's
 * tones by their roles, an interval's lower note as the tonic, its upper as a note of the scale.
 */
export function answerMarks(question: Question): Map<Midi, KeyMark> {
  if (
    question.mode === 'name-interval' ||
    question.mode === 'build-interval' ||
    question.mode === 'interval-card'
  ) {
    return new Map<Midi, KeyMark>([
      [question.low, { tone: 'tonic', label: noteName(question.lowNote) }],
      [question.high, { tone: 'scale', label: noteName(question.highNote) }],
    ])
  }
  const keys = placed(question)
  if (keys.length > 0)
    return new Map(
      keys.map((key) => [key.midi, { tone: key.tone.role, label: noteName(key.tone.note) }]),
    )
  return new Map(targetKeys(question).map((key) => [key, { tone: 'scale', label: '' }]))
}

/** Two octaves around middle C: the least a note-reading keyboard shows. */
const READING_LEAST: KeyRange = { from: midi(48), to: midi(71) }

/**
 * The keyboard a round is answered on: for Reading notes every note its run asks, the same for each
 * round so the keys never point at the answer; else the quiz range grown to hold the answer.
 */
export function roundRange(asks: Asks, question: Question): KeyRange {
  if (asks.kind === 'notes')
    return keyboardRange(
      asks.notes.map((n) => n.key),
      READING_LEAST,
    )
  return keyboardRange(targetKeys(question), QUIZ_RANGE)
}

/** Ear rounds sound as they are shown; the others once answered. */
export const heardFirst = (question: Question): boolean =>
  ((question.mode === 'name-chord' || question.mode === 'name-interval') && question.heard) ||
  question.mode === 'name-scale' ||
  question.mode === 'chord-role' ||
  question.mode === 'name-progression'

const line = (keys: readonly Midi[]) =>
  walkSounds(
    keys.map((key) => [key]),
    { arpeggio: false, tempo: LINE_TEMPO },
  )

/** What a round sounds: its chord, interval, scale or key, as the learner hears it. */
export function roundSounds(question: Question): NoteSound[] {
  switch (question.mode) {
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return intervalSounds(question.low, question.high, question.way)
    case 'name-chord':
      return chordSounds(targetKeys(question), { arpeggio: question.arpeggio })
    case 'name-scale':
      return line(question.keys)
    case 'chord-role':
      return walkSounds([question.tonicKeys, question.chordKeys], {
        arpeggio: false,
        tempo: ROLE_TEMPO,
      })
    case 'name-progression':
      return walkSounds([question.tonicKeys, ...question.chordKeys], {
        arpeggio: false,
        tempo: ROLE_TEMPO,
      })
    case 'key-degrees':
      return line(targetKeys(question))
    case 'key-signature':
      return []
    default:
      return chordSounds(targetKeys(question), { arpeggio: question.mode === 'build-scale' })
  }
}

/** An answer on the keys: its keys, each marked. */
interface AnswerKeys {
  readonly keys: readonly Midi[]
  readonly marks: ReadonlyMap<Midi, KeyMark>
}

/** A round's verdict on the keys chosen, once answered. */
interface CheckedKeys {
  readonly marks: Map<Midi, KeyMark>
  readonly wrong: Set<Midi>
  readonly outlined: Set<Midi>
}

/**
 * After Check: each chosen key of one of the answer's notes marked as the answer marks that note, the
 * other keys wrong, and the answer's keys whose notes were not chosen, in any octave, ringed.
 */
export function checkedKeys(chosen: readonly Midi[], answer: AnswerKeys): CheckedKeys {
  const byNote = new Map(answer.keys.map((key) => [pitchClass(key), answer.marks.get(key)]))
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  for (const key of chosen) {
    const mark = byNote.get(pitchClass(key))
    if (mark) marks.set(key, mark)
    else wrong.add(key)
  }
  const played = new Set(chosen.map((key) => pitchClass(key)))
  return {
    marks,
    wrong,
    outlined: new Set(answer.keys.filter((key) => !played.has(pitchClass(key)))),
  }
}

/**
 * A key's degrees, pressed in order: each key against the degree it was pressed for, so a key of the
 * scale pressed out of turn is wrong, and only the degree it stood in for is ringed.
 */
function degreeKeys(degrees: readonly PlacedTone[], selected: readonly Midi[]): CheckedKeys {
  const marks = new Map<Midi, KeyMark>()
  const wrong = new Set<Midi>()
  const outlined = new Set<Midi>()
  selected.forEach((key, i) => {
    const degree = degrees[i]
    if (degree && pitchClass(key) === pitchClass(degree.midi)) {
      marks.set(key, { tone: degree.tone.role, label: degree.tone.degree })
      return
    }
    marks.delete(key)
    wrong.add(key)
    if (degree) outlined.add(degree.midi)
  })
  return { marks, wrong, outlined }
}

/**
 * After an answer on the keys: a build round's keys against its answer, each tone by role; a note
 * read or an interval's upper note, the key pressed against the note's; a key's degrees, each
 * pressed against its degree.
 */
export function answerKeys(question: Question, selected: readonly Midi[]): CheckedKeys {
  if (question.mode === 'read-note' || question.mode === 'build-interval') {
    const wanted = question.mode === 'read-note' ? question.key : question.high
    const right = selected.includes(wanted)
    const marks = new Map<Midi, KeyMark>(right ? [[wanted, { tone: 'root', label: '✓' }]] : [])
    // An interval's lower note was given: it stays marked.
    if (question.mode === 'build-interval') marks.set(question.low, { tone: 'root', label: '1' })
    return {
      marks,
      wrong: new Set(selected.filter((key) => key !== wanted)),
      outlined: right ? new Set() : new Set([wanted]),
    }
  }
  const keys = placed(question)
  if (question.mode === 'key-degrees') return degreeKeys(keys, selected)
  return checkedKeys(selected, {
    keys: keys.map((key) => key.midi),
    marks: new Map(keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }])),
  })
}
