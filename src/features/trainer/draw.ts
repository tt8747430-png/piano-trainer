import {
  CHORD_QUALITIES,
  MIDDLE_C,
  chordFamily,
  chordSkill,
  chordSymbol,
  INTERVAL_GROUPS,
  INTERVALS,
  keyParam,
  keySignature,
  keyScale,
  midi,
  numeralChord,
  parseNumerals,
  PITCH_CLASSES,
  pitchClass,
  pitchClassOf,
  placeChord,
  placeScale,
  qualityRootSpelling,
  rootSpelling,
  sameNote,
  scaleRootSpelling,
  skillOf,
  spellAbove,
  spellChord,
  spellScale,
  type ChordQuality,
  type ReferenceInterval,
  type Key,
  type Midi,
  type PitchClass,
  type ScaleKind,
  type SkillId,
  type SpelledNote,
} from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import type { IntervalWay } from '@/shared/lib/schedule'
import { cadenceIn, cadencePlays, voiceCadence, type Cadence } from './ladders/cadences'
import { EAR_SCALES } from './ladders/ear'
import type { ChordQuestion, IntervalQuestion, Question } from './round-machine'
import type { CardSide, Drill } from './trainer-view'

/** A chord a level asks: a root and quality, and the inversion it must be built in, if any. */
export interface ChordItem {
  readonly root: SpelledNote
  readonly quality: ChordQuality
  readonly inversion: number | null
}

/** A note a reading level asks, on the staff it is read on. */
export interface ReadNote {
  readonly key: Midi
  readonly spelled: SpelledNote
  readonly clef: StaffId
}

/** What a run asks, worked out from its trainer and level: each round is drawn from it. */
export type Asks =
  /** Skills on any root, each built on the keys (My gaps, the Check, Scale building), in order or drawn. */
  | {
      readonly kind: 'skills'
      readonly skills: readonly SkillId[]
      readonly roots?: readonly PitchClass[]
      readonly ordered?: boolean
    }
  /** Chords, asked as a drill asks them: turned over, chosen by sight, played, or chosen by ear. */
  | {
      readonly kind: 'chords'
      readonly drill: Drill
      readonly chords: readonly ChordItem[]
      /** In turn, round and round (a piece's Check), rather than drawn. */
      readonly ordered?: boolean
      /** What a flashcard shows; its name where none is said. */
      readonly show?: CardSide
      /** By ear, the chord's notes one at a time. */
      readonly arpeggio?: boolean
    }
  /** Intervals, asked as a drill asks them, up from these roots (any where none is said). */
  | {
      readonly kind: 'intervals'
      readonly drill: Drill
      readonly intervals: readonly ReferenceInterval[]
      readonly ways: readonly IntervalWay[]
      readonly roots?: readonly SpelledNote[]
      readonly show?: CardSide
    }
  | { readonly kind: 'scales'; readonly kinds: readonly ScaleKind[]; readonly descending: boolean }
  | { readonly kind: 'notes'; readonly notes: readonly ReadNote[] }
  | { readonly kind: 'signatures'; readonly keys: readonly Key[] }
  | { readonly kind: 'degrees'; readonly keys: readonly Key[] }
  | { readonly kind: 'roles'; readonly keys: readonly Key[]; readonly numerals: readonly string[] }
  | {
      readonly kind: 'progressions'
      readonly keys: readonly Key[]
      readonly lines: readonly string[]
    }
  /** Cadences in these keys, asked as a drill asks them; a key asks only the cadences it has. */
  | {
      readonly kind: 'cadences'
      readonly drill: Drill
      readonly keys: readonly Key[]
      readonly cadences: readonly Cadence[]
      /** What a card shows: the cadence's name or its staff. */
      readonly show?: 'name' | 'staff'
    }

/** A numeral's triad in a key, in root position from the tonic's octave: every chord sounds as the key's. */
function numeralKeys(text: string, key: Key): Midi[] {
  const [read] = parseNumerals(text) ?? []
  if (!read) throw new RangeError(`${text} is not a numeral`)
  const chord = numeralChord(read, key, 'triads')
  const placed = placeChord(spellChord(chord.root, chord.quality), {
    inversion: 0,
    bothHands: false,
  }).rh
  const shift = pitchClassOf(chord.root) < pitchClassOf(key.tonic) ? 12 : 0
  return placed.map((tone) => midi(tone.midi - 12 + shift))
}

/** A question equal to the last one is drawn again at most this many times. */
const DRAWS = 8
const OPTIONS = 4
/** Where an interval heard starts: a root from G3 to F♯4, so every interval sounds clearly. */
const EAR_LOW = midi(55)

function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) throw new RangeError(`No item ${index} of ${items.length}`)
  return item
}

const pick = <T>(items: readonly T[], random: () => number): T =>
  itemAt(items, Math.min(items.length - 1, Math.floor(random() * items.length)))

/** In an order drawn from `random`. */
const shuffled = <T>(items: readonly T[], random: () => number): T[] =>
  items
    .map((item) => ({ item, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item)

/** The answer and up to three others, the nearest first, in an order drawn from `random`. */
const withOthers = <T>(answer: T, others: readonly T[], random: () => number): T[] =>
  shuffled(
    [answer, ...[...new Set(others)].filter((other) => other !== answer).slice(0, OPTIONS - 1)],
    random,
  )

/**
 * An ear round's options: the level's own; a Custom of one alone is filled from any other its trainer
 * could ask, so a round is never answered by its one button.
 */
const earOptions = <T>(answer: T, own: readonly T[], all: readonly T[], random: () => number) =>
  withOthers(
    answer,
    [...shuffled(own, random), ...(own.length > 1 ? [] : shuffled(all, random))],
    random,
  )

/** Every interval an ear round can ask: a level of one or two is filled from these. */
const EAR_INTERVALS: readonly ReferenceInterval[] = [
  ...INTERVAL_GROUPS.simple.slice(1),
  ...INTERVAL_GROUPS.compound,
]

/** A chord on its root's key: its symbol over its bass in an inversion. */
function chordQuestion(item: ChordItem, skill: SkillId | undefined): ChordQuestion {
  const tones = spellChord(item.root, item.quality)
  const bass = item.inversion ? tones[item.inversion]?.note : undefined
  return {
    ...(skill ? { skill } : {}),
    root: item.root,
    quality: item.quality,
    symbol: chordSymbol({ root: item.root, quality: item.quality, ...(bass ? { bass } : {}) }),
    tones,
    inversion: item.inversion,
  }
}

/**
 * A chord quiz's options: the answer and three other chords on the same root in the same inversion,
 * differing only in quality, so the quality is what is read or heard: the qualities the drill asks
 * first, then the answer's family, then any other. Every option is spelled on the answer's root,
 * so no spelling gives the answer away.
 */
function nameOptions(
  question: ChordQuestion,
  asked: readonly ChordQuality[],
  random: () => number,
) {
  const family = chordFamily(question.quality)
  const qualities = [
    ...shuffled([...new Set(asked)], random),
    ...shuffled(
      CHORD_QUALITIES.filter((q) => chordFamily(q) === family),
      random,
    ),
    ...shuffled(
      CHORD_QUALITIES.filter((q) => chordFamily(q) !== family),
      random,
    ),
  ].filter(
    (quality) =>
      quality !== question.quality &&
      (question.inversion === null ||
        spellChord(question.root, quality).length > question.inversion),
  )
  const others = qualities.map(
    (quality) =>
      chordQuestion({ root: question.root, quality, inversion: question.inversion }, undefined)
        .symbol,
  )
  return withOthers(
    question.symbol,
    [...new Set(others)].filter((s) => s !== question.symbol),
    random,
  )
}

/** A chord asked as the drill asks it; only a chord read or played is evidence on its quality. */
function chordRound(
  asks: Extract<Asks, { kind: 'chords' }>,
  item: ChordItem,
  random: () => number,
): Question {
  const chord = chordQuestion(item, chordSkill(item.quality))
  const { skill: _rated, ...unrated } = chord
  switch (asks.drill) {
    case 'entry':
      return { mode: 'build-chord', ...chord }
    case 'flashcards':
      return { mode: 'chord-card', ...unrated, show: asks.show ?? 'name' }
    case 'quiz':
    case 'ear': {
      const options = nameOptions(
        chord,
        asks.chords.map((asked) => asked.quality),
        random,
      )
      const heard = asks.drill === 'ear'
      return {
        mode: 'name-chord',
        ...(heard ? unrated : chord),
        options,
        heard,
        arpeggio: heard && asks.arpeggio === true,
      }
    }
  }
}

/** A root's key from `from` up, within the octave. */
const keyFrom = (from: Midi, root: SpelledNote): Midi =>
  midi(from + pitchClass(pitchClassOf(root) - from))

/** An interval asked as the drill asks it: up from a root of the drill's, heard from G3, else seen from middle C. */
function intervalRound(asks: Extract<Asks, { kind: 'intervals' }>, random: () => number): Question {
  const interval = pick(asks.intervals, random)
  const lowNote = asks.roots?.length
    ? pick(asks.roots, random)
    : rootSpelling(pick(PITCH_CLASSES, random), false)
  const low = keyFrom(asks.drill === 'ear' ? EAR_LOW : MIDDLE_C, lowNote)
  const asked: IntervalQuestion = {
    interval,
    low,
    high: midi(low + INTERVALS[interval].semitones),
    lowNote,
    highNote: spellAbove(lowNote, INTERVALS[interval]),
    way: asks.drill === 'ear' ? pick(asks.ways, random) : 'up',
  }
  switch (asks.drill) {
    case 'flashcards':
      return { mode: 'interval-card', ...asked, show: asks.show ?? 'name' }
    case 'entry':
      return { mode: 'build-interval', ...asked }
    case 'quiz':
    case 'ear':
      return {
        mode: 'name-interval',
        ...asked,
        heard: asks.drill === 'ear',
        options: earOptions(interval, asks.intervals, EAR_INTERVALS, random),
      }
  }
}

/** A round from a skill on a root, built on the keys (My gaps, the Check, Scale building). */
function skillRound(asks: Extract<Asks, { kind: 'skills' }>, index: number, random: () => number) {
  const skill = asks.ordered
    ? itemAt(asks.skills, index % asks.skills.length)
    : pick(asks.skills, random)
  const pc = pick(asks.roots?.length ? asks.roots : PITCH_CLASSES, random)
  const target = skillOf(skill)
  if (target.kind === 'scale') {
    const root = scaleRootSpelling(pc, target.scale)
    return {
      mode: 'build-scale',
      skill,
      root,
      kind: target.scale,
      notes: spellScale(root, target.scale),
    } as const
  }
  const item = {
    root: qualityRootSpelling(pc, target.quality),
    quality: target.quality,
    inversion: null,
  }
  return { mode: 'build-chord', ...chordQuestion(item, skill) } as const
}

/**
 * A cadence asked as the drill asks it: a card, its staff read, the chord that tells it played, or
 * heard after its key's tonic. A key draws only the cadences it has, and the options are those too.
 */
function cadenceRound(asks: Extract<Asks, { kind: 'cadences' }>, random: () => number): Question {
  const key = pick(asks.keys, random)
  const own = asks.cadences.filter((cadence) => cadenceIn(cadence, key))
  const cadence = pick(own, random)
  const voicing = voiceCadence(cadence, key)
  switch (asks.drill) {
    case 'flashcards':
      return { mode: 'cadence-card', key, cadence, voicing, show: asks.show ?? 'name' }
    case 'entry': {
      const { at, inversion } = cadencePlays(cadence, key)
      const played = voicing.chords[at]
      const [numeral] = parseNumerals(played.numeral) ?? []
      if (!numeral) throw new RangeError(`${played.numeral} is not a numeral`)
      const { root, quality } = numeralChord(numeral, key, 'triads')
      return {
        mode: 'build-chord',
        ...chordQuestion({ root, quality, inversion }, undefined),
        cadence: { cadence, key, at, voicing },
      }
    }
    case 'quiz':
    case 'ear':
      return {
        mode: 'name-cadence',
        key,
        cadence,
        voicing,
        heard: asks.drill === 'ear',
        options: withOthers(cadence, shuffled(own, random), random),
      }
  }
}

/** A count of sharps (positive) or flats (negative), as an option: `3♯`, `2♭`, `0`. */
const countOption = (count: number): string =>
  count > 0 ? `${count}♯` : count < 0 ? `${-count}♭` : '0'

/** A key's signature as Key signatures' count options write it. */
export const signatureOption = (key: Key): string => countOption(keySignature(key))

function draw(asks: Asks, index: number, random: () => number): Question {
  switch (asks.kind) {
    case 'skills':
      return skillRound(asks, index, random)
    case 'chords':
      return chordRound(
        asks,
        asks.ordered ? itemAt(asks.chords, index % asks.chords.length) : pick(asks.chords, random),
        random,
      )
    case 'intervals':
      return intervalRound(asks, random)
    case 'scales': {
      const kind = pick(asks.kinds, random)
      const root = scaleRootSpelling(pick(PITCH_CLASSES, random), kind)
      const up = placeScale(root, kind).map((tone) => tone.midi)
      return {
        mode: 'name-scale',
        root,
        keys: asks.descending ? up.toReversed() : up,
        kind,
        options: earOptions(kind, asks.kinds, EAR_SCALES, random),
      }
    }
    case 'notes':
      return { mode: 'read-note', ...pick(asks.notes, random) }
    case 'signatures': {
      const key = pick(asks.keys, random)
      if (random() < 0.5) {
        const count = keySignature(key)
        const near = [count + 1, count - 1, count + 2, count - 2].filter((n) => Math.abs(n) <= 7)
        return {
          mode: 'key-signature',
          key,
          ask: 'count',
          answer: countOption(count),
          options: withOthers(countOption(count), near.map(countOption), random),
        }
      }
      const others = shuffled(asks.keys, random).filter(
        (other) => keySignature(other) !== keySignature(key),
      )
      return {
        mode: 'key-signature',
        key,
        ask: 'name',
        answer: keyParam(key),
        options: withOthers(keyParam(key), others.map(keyParam), random),
      }
    }
    case 'degrees': {
      const key = pick(asks.keys, random)
      return { mode: 'key-degrees', key, notes: spellScale(key.tonic, keyScale(key)) }
    }
    case 'roles': {
      const key = pick(asks.keys, random)
      const numeral = pick(asks.numerals, random)
      return {
        mode: 'chord-role',
        key,
        numeral,
        tonicKeys: numeralKeys(key.minor ? 'i' : 'I', key),
        chordKeys: numeralKeys(numeral, key),
        options: withOthers(numeral, shuffled(asks.numerals, random), random),
      }
    }
    case 'progressions': {
      const key = pick(asks.keys, random)
      const line = pick(asks.lines, random)
      return {
        mode: 'name-progression',
        key,
        line,
        tonicKeys: numeralKeys(key.minor ? 'i' : 'I', key),
        chordKeys: line.split(' ').map((numeral) => numeralKeys(numeral, key)),
        options: withOthers(line, shuffled(asks.lines, random), random),
      }
    }
    case 'cadences':
      return cadenceRound(asks, random)
  }
}

/** Whether two rounds ask the same thing: drawn again rather than asked twice in a row. */
function sameQuestion(a: Question, b: Question | null | undefined): boolean {
  if (!b) return false
  const sameKey = (x: Key, y: Key) => sameNote(x.tonic, y.tonic) && x.minor === y.minor
  switch (a.mode) {
    case 'read-note':
      return b.mode === a.mode && a.key === b.key
    case 'name-interval':
    case 'build-interval':
    case 'interval-card':
      return b.mode === a.mode && a.interval === b.interval && a.low === b.low
    case 'key-signature':
    case 'key-degrees':
      return b.mode === a.mode && sameKey(a.key, b.key)
    case 'chord-role':
      return b.mode === a.mode && sameKey(a.key, b.key) && a.numeral === b.numeral
    case 'name-progression':
      return b.mode === a.mode && sameKey(a.key, b.key) && a.line === b.line
    case 'name-cadence':
    case 'cadence-card':
      return b.mode === a.mode && sameKey(a.key, b.key) && a.cadence === b.cadence
    case 'build-scale':
    case 'name-scale':
      return b.mode === a.mode && a.kind === b.kind && sameNote(a.root, b.root)
    case 'build-chord':
    case 'name-chord':
    case 'chord-card':
      return b.mode === a.mode && a.quality === b.quality && sameNote(a.root, b.root)
  }
}

/** The next round of a run; a repeat of the last one is drawn again, up to 8 times. */
export function drawRound(
  asks: Asks,
  context: { index: number; random: () => number; previous?: Question | null },
): Question {
  let question = draw(asks, context.index, context.random)
  for (let draws = 1; draws < DRAWS && sameQuestion(question, context.previous); draws++) {
    question = draw(asks, context.index, context.random)
  }
  return question
}
