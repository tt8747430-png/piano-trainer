import {
  keyboardRange,
  keyScale,
  MIDDLE_C,
  midi,
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
      return [question.low, question.high]
    case 'name-quality':
    case 'name-scale':
      return [...question.keys]
    case 'chord-role':
      return [...question.chordKeys]
    case 'read-note':
      return [question.key]
    case 'key-signature':
      return []
    default:
      return placed(question).map((tone) => tone.midi)
  }
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
  question.mode === 'name-chord' ||
  question.mode === 'name-interval' ||
  question.mode === 'name-quality' ||
  question.mode === 'name-scale' ||
  question.mode === 'chord-role'

const line = (keys: readonly Midi[]) =>
  walkSounds(
    keys.map((key) => [key]),
    { arpeggio: false, tempo: LINE_TEMPO },
  )

/** What a round sounds: its chord, interval, scale or key, as the learner hears it. */
export function roundSounds(question: Question): NoteSound[] {
  switch (question.mode) {
    case 'name-interval':
      return intervalSounds(question.low, question.high, question.way)
    case 'name-quality':
      return chordSounds(question.keys, { arpeggio: question.arpeggio })
    case 'name-scale':
      return line(question.keys)
    case 'chord-role':
      return walkSounds([question.tonicKeys, question.chordKeys], {
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
export interface CheckedKeys {
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
 * After an answer on the keys: a build round's keys against its answer, each tone by role; a note
 * read, the key pressed against the note's; a key's degrees, each pressed against its degree.
 */
export function answerKeys(question: Question, selected: readonly Midi[]): CheckedKeys {
  if (question.mode === 'read-note') {
    const right = selected.includes(question.key)
    return {
      marks: right ? new Map([[question.key, { tone: 'root', label: '✓' }]]) : new Map(),
      wrong: new Set(selected.filter((key) => key !== question.key)),
      outlined: right ? new Set() : new Set([question.key]),
    }
  }
  const keys = placed(question)
  return checkedKeys(selected, {
    keys: keys.map((key) => key.midi),
    marks: new Map(keys.map((key) => [key.midi, { tone: key.tone.role, label: key.tone.degree }])),
  })
}
