import {
  CHORD_QUALITIES,
  chordFamily,
  chordSkill,
  chordSymbol,
  INTERVALS,
  keyParam,
  keySignature,
  keyScale,
  midi,
  numeralChord,
  parseNumerals,
  PITCH_CLASSES,
  pitchClassOf,
  placeChord,
  placeScale,
  qualityRootSpelling,
  sameNote,
  scaleRootSpelling,
  skillOf,
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
import type { ChordQuestion, Question } from './round-machine'

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
  /** Skills on any root (My gaps, the Check, a chord or scale trainer's Custom), in order or drawn. */
  | {
      readonly kind: 'skills'
      readonly chords: 'build-chord' | 'name-chord'
      readonly skills: readonly SkillId[]
      readonly roots?: readonly PitchClass[]
      readonly ordered?: boolean
    }
  | {
      readonly kind: 'chords'
      readonly mode: 'build-chord' | 'name-chord'
      readonly chords: readonly ChordItem[]
    }
  | {
      readonly kind: 'intervals'
      readonly intervals: readonly ReferenceInterval[]
      readonly ways: readonly IntervalWay[]
    }
  | {
      readonly kind: 'qualities'
      readonly qualities: readonly ChordQuality[]
      readonly arpeggio: boolean
    }
  | { readonly kind: 'scales'; readonly kinds: readonly ScaleKind[]; readonly descending: boolean }
  | { readonly kind: 'notes'; readonly notes: readonly ReadNote[] }
  | { readonly kind: 'signatures'; readonly keys: readonly Key[] }
  | { readonly kind: 'degrees'; readonly keys: readonly Key[] }
  | { readonly kind: 'roles'; readonly keys: readonly Key[]; readonly numerals: readonly string[] }

/** A question equal to the last one is drawn again at most this many times. */
const DRAWS = 8
const OPTIONS = 4
/** Where an ear trainer's sound starts: a root from G3 to F♯4, so every interval and chord sounds clearly. */
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
  shuffled([answer, ...others.filter((other) => other !== answer).slice(0, OPTIONS - 1)], random)

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
 * Name chord's options: the answer and three other chords, the level's own first (another chord
 * it asks, on any root), then other qualities on the same root, the answer's family first.
 */
function nameOptions(question: ChordQuestion, asked: readonly ChordItem[], random: () => number) {
  const ownSymbols = shuffled(
    [...new Set(asked.map((item) => chordQuestion(item, undefined).symbol))],
    random,
  )
  const family = chordFamily(question.quality)
  const sameRoot = [
    ...shuffled(
      CHORD_QUALITIES.filter((q) => chordFamily(q) === family),
      random,
    ),
    ...shuffled(
      CHORD_QUALITIES.filter((q) => chordFamily(q) !== family),
      random,
    ),
  ]
    .filter((quality) => quality !== question.quality)
    .map((quality) =>
      chordSymbol({ root: qualityRootSpelling(pitchClassOf(question.root), quality), quality }),
    )
  const others = [...new Set([...ownSymbols, ...sameRoot])].filter((s) => s !== question.symbol)
  return withOthers(question.symbol, others, random)
}

/** A chord round from a skill on a root: the quiz's way (My gaps, the Check, Custom). */
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
  const chord = chordQuestion(item, skill)
  if (asks.chords === 'build-chord') return { mode: 'build-chord', ...chord } as const
  const asked = asks.skills.flatMap((id) => {
    const other = skillOf(id)
    return other.kind === 'chord'
      ? [{ root: qualityRootSpelling(pc, other.quality), quality: other.quality, inversion: null }]
      : []
  })
  return { mode: 'name-chord', ...chord, options: nameOptions(chord, asked, random) } as const
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
    case 'chords': {
      const item = pick(asks.chords, random)
      const chord = chordQuestion(item, chordSkill(item.quality))
      return asks.mode === 'build-chord'
        ? { mode: 'build-chord', ...chord }
        : { mode: 'name-chord', ...chord, options: nameOptions(chord, asks.chords, random) }
    }
    case 'intervals': {
      const interval = pick(asks.intervals, random)
      const low = midi(EAR_LOW + Math.floor(random() * 12))
      return {
        mode: 'name-interval',
        interval,
        low,
        high: midi(low + INTERVALS[interval].semitones),
        way: pick(asks.ways, random),
        options: withOthers(interval, shuffled(asks.intervals, random), random),
      }
    }
    case 'qualities': {
      const quality = pick(asks.qualities, random)
      const root = qualityRootSpelling(pick(PITCH_CLASSES, random), quality)
      const keys = placeChord(spellChord(root, quality), { inversion: 0, bothHands: false }).rh.map(
        (tone) => midi(tone.midi - 12),
      )
      return {
        mode: 'name-quality',
        root,
        keys,
        quality,
        arpeggio: asks.arpeggio,
        options: withOthers(quality, shuffled(asks.qualities, random), random),
      }
    }
    case 'scales': {
      const kind = pick(asks.kinds, random)
      const root = scaleRootSpelling(pick(PITCH_CLASSES, random), kind)
      const up = placeScale(root, kind).map((tone) => tone.midi)
      return {
        mode: 'name-scale',
        root,
        keys: asks.descending ? up.toReversed() : up,
        kind,
        options: withOthers(kind, shuffled(asks.kinds, random), random),
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
      const keysOf = (text: string) => {
        const [read] = parseNumerals(text) ?? []
        if (!read) throw new RangeError(`${text} is not a numeral`)
        const chord = numeralChord(read, key, 'triads')
        const placed = placeChord(spellChord(chord.root, chord.quality), {
          inversion: 0,
          bothHands: false,
        }).rh
        // From the tonic's octave, so every chord sounds as the key's.
        const shift = pitchClassOf(chord.root) < pitchClassOf(key.tonic) ? 12 : 0
        return placed.map((tone) => midi(tone.midi - 12 + shift))
      }
      return {
        mode: 'chord-role',
        key,
        numeral,
        tonicKeys: keysOf(key.minor ? 'i' : 'I'),
        chordKeys: keysOf(numeral),
        options: withOthers(numeral, shuffled(asks.numerals, random), random),
      }
    }
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
      return b.mode === a.mode && a.interval === b.interval && a.low === b.low
    case 'key-signature':
    case 'key-degrees':
      return b.mode === a.mode && sameKey(a.key, b.key)
    case 'chord-role':
      return b.mode === a.mode && sameKey(a.key, b.key) && a.numeral === b.numeral
    case 'build-scale':
    case 'name-scale':
      return b.mode === a.mode && a.kind === b.kind && sameNote(a.root, b.root)
    case 'build-chord':
    case 'name-chord':
    case 'name-quality':
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
