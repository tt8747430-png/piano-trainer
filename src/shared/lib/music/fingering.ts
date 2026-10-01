import { isBlackKey } from './keyboard'
import { pitchClassOf, type SpelledNote } from './note'
import { midi, type Midi } from './pitch'
import { relatedScale, scaleHasChords, scaleIntervals, spellScale, type ScaleKind } from './scale'

export type Finger = 1 | 2 | 3 | 4 | 5
export type Hand = 'rh' | 'lh'

const FINGERS: readonly Finger[] = [1, 2, 3, 4, 5]

/** How a run is fingered: the thumb on its first note, or each note as the scale fingers it. */
export const FINGERINGS = ['thumb', 'scale'] as const
export type Fingering = (typeof FINGERINGS)[number]

type FingeringTable = 'major' | 'natural' | 'pent' | 'blues'

/** The kinds taught a fingering of their own; harmonic and melodic minor are fingered as natural minor. */
const OWN_TABLE: Readonly<Partial<Record<ScaleKind, FingeringTable>>> = {
  major: 'major',
  natural: 'natural',
  harmonic: 'natural',
  melodic: 'natural',
  pent: 'pent',
  blues: 'blues',
}

/** One octave up from the tonic, a digit a note, the octave's included; the left hand read from the bottom note up. */
type Run = Readonly<Record<Hand, string>>
const fingers = (rh: string, lh: string): Run => ({ rh, lh })
const C_SHAPE = fingers('12312345', '54321321')

/** By the root's pitch class. */
const RUNS: Readonly<Record<FingeringTable, Readonly<Partial<Record<number, Run>>>>> = {
  major: {
    0: C_SHAPE,
    1: fingers('23123412', '32143213'),
    2: C_SHAPE,
    3: fingers('31234123', '32143213'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23412312', '43213214'),
    7: C_SHAPE,
    8: fingers('23123123', '32143213'),
    9: C_SHAPE,
    10: fingers('21231234', '32143213'),
    11: fingers('12312345', '43214321'),
  },
  natural: {
    0: C_SHAPE,
    1: fingers('23123123', '32143213'),
    2: C_SHAPE,
    3: fingers('21234123', '21432132'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23123123', '43213214'),
    7: C_SHAPE,
    8: fingers('23123123', '32132143'),
    9: C_SHAPE,
    10: fingers('21231234', '21321432'),
    11: fingers('12312345', '43214321'),
  },
  // The octave's finger is the next in the hand's direction; a left hand on its thumb crosses 3 over.
  pent: {
    0: fingers('123123', '321213'),
    1: fingers('231234', '321321'),
    2: fingers('123123', '432121'),
    3: fingers('123123', '432121'),
    4: fingers('123123', '432121'),
    5: fingers('123123', '321213'),
    6: fingers('123123', '432121'),
    7: fingers('123123', '321213'),
    8: fingers('231212', '321321'),
    9: fingers('123123', '432121'),
    10: fingers('212123', '321213'),
    11: fingers('123123', '321321'),
  },
  blues: {
    0: fingers('1234123', '4214321'),
    1: fingers('2123412', '2143212'),
    2: fingers('1234123', '4214321'),
    3: fingers('1231234', '4321321'),
    4: fingers('1234123', '4214321'),
    5: fingers('1231234', '4321321'),
    6: fingers('2123412', '4321214'),
    7: fingers('1234123', '4214321'),
    8: fingers('1231234', '4321432'),
    9: fingers('1234123', '4214321'),
    10: fingers('1231234', '4321321'),
    11: fingers('1231234', '5321321'),
  },
}

function toFinger(n: number): Finger {
  const finger = FINGERS[n - 1]
  if (finger === undefined || finger !== n) throw new RangeError(`${n} is not a finger`)
  return finger
}

/** A table's one-octave run from the tonic. */
function tableRun(table: FingeringTable, root: SpelledNote, hand: Hand): Finger[] {
  const run = RUNS[table][pitchClassOf(root)]
  if (!run) throw new RangeError(`The ${table} table has no fingering on ${pitchClassOf(root)}`)
  return [...run[hand]].map((digit) => toFinger(Number(digit)))
}

/**
 * The table a kind is fingered by on a root, in a hand. Melodic minor's raised 6th and 7th can put
 * natural minor's thumb on a black key (C♯: A♯); there it takes its tonic's major's, from which it
 * differs only in its 3rd.
 */
function tableFor(kind: ScaleKind, root: SpelledNote, hand: Hand): FingeringTable | undefined {
  const own = OWN_TABLE[kind]
  if (kind !== 'melodic' || own === undefined) return own
  const tones = spellScale(root, kind)
  const thumbOnBlack = tableRun(own, root, hand).some((finger, i) => {
    const tone = tones[i % tones.length]
    return finger === 1 && tone !== undefined && isBlackKey(midi(tone.pitchClass))
  })
  return thumbOnBlack ? 'major' : own
}

/**
 * Each degree's finger in a longer run, from where the run puts the thumb: a right-hand note takes
 * one finger more for each degree it lies above the thumb before it, a left-hand note for each
 * degree below the thumb after it (B♭ major's thumbs are on C and F, so between octaves B♭ is 4).
 */
function continuing(run: readonly Finger[], hand: Hand): Finger[] {
  return Array.from({ length: run.length - 1 }, (_, degree) => continuingAt(run, hand, degree))
}

/** One degree's finger in a longer run: `continuing`'s rule for that degree alone. */
function continuingAt(run: readonly Finger[], hand: Hand, degree: number): Finger {
  const degrees = run.length - 1
  const thumbs = new Set(run.flatMap((finger, i) => (finger === 1 ? [i % degrees] : [])))
  for (let steps = 0; steps < degrees; steps++) {
    const at = hand === 'rh' ? degree - steps : degree + steps
    if (thumbs.has((at + degrees) % degrees)) return toFinger(steps + 1)
  }
  throw new RangeError('A fingering puts the thumb on no degree')
}

/** Each degree's continuing finger: the kind's own table, or a mode's parent major's. */
function continuingFingers(root: SpelledNote, kind: ScaleKind, hand: Hand): Finger[] {
  const own = tableFor(kind, root, hand)
  if (own) return continuing(tableRun(own, root, hand), hand)
  const parent = relatedScale(root, kind)
  if (parent?.relation !== 'parent') throw new RangeError(`${kind} has no fingering to carry`)
  const source = continuing(tableRun('major', parent.root, hand), hand)
  // This scale's degree d is the parent's degree d − (where the parent's tonic sits in this scale).
  return source.map((_, degree) => source[(degree - parent.degree + 7) % 7] ?? 1)
}

/**
 * A run from degree `start` (0 the tonic) up `octaves` octaves, fingered as the scale fingers each
 * note, read from the bottom note up: from a taught tonic its taught fingering, each octave's tonic
 * between taking the finger a longer run gives it (B♭ major's middle B♭ is 4); from any other note of
 * a seven-note scale each note's finger in a longer run (PWJ: E to E with C major's, 3 1 2 3 4 1 2 3).
 */
export function scaleFingering(
  root: SpelledNote,
  kind: ScaleKind,
  hand: Hand,
  start: number,
  octaves = 1,
): Finger[] {
  const own = tableFor(kind, root, hand)
  if (own && start === 0) {
    const run = tableRun(own, root, hand)
    const octave = run.slice(1, -1)
    const turns = Array.from({ length: octaves - 1 }, () => [continuingAt(run, hand, 0), ...octave])
    return [...run.slice(0, -1), ...turns.flat(), run.at(-1) ?? 1]
  }
  if (!scaleHasChords(kind))
    throw new RangeError(`${kind} is fingered as its scale from its tonic only`)
  const byDegree = continuingFingers(root, kind, hand)
  return Array.from({ length: 7 * octaves + 1 }, (_, i) => byDegree[(start + i) % 7] ?? 1)
}

/** The ways to finger `count` notes in groups from the thumb (1 2 3 …): every group of 2 to 4, the last of 2 to 5. */
function* groupings(count: number): Generator<number[]> {
  for (let first = 2; first <= Math.min(5, count); first++) {
    if (first === count) yield [first]
    else if (first <= 4 && count - first >= 2) {
      for (const rest of groupings(count - first)) yield [first, ...rest]
    }
  }
}

/** How much a group is preferred, least first: groups of 3, then 4, then 2, then the closing 5. */
const GROUP_RANK: Readonly<Record<number, number>> = { 3: 0, 4: 1, 2: 2, 5: 3 }

/** A grouping's cost: later thumbs on black keys, then the number of groups, then its groups' ranks. */
function cost(keys: readonly Midi[], grouping: readonly number[]): number[] {
  let at = 0
  let blackThumbs = 0
  grouping.forEach((size, i) => {
    const key = keys[at]
    if (i > 0 && key !== undefined && isBlackKey(key)) blackThumbs++
    at += size
  })
  return [blackThumbs, grouping.length, ...grouping.map((size) => GROUP_RANK[size] ?? 4)]
}

function cheaper(a: readonly number[], b: readonly number[]): boolean {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0)
    if (difference !== 0) return difference < 0
  }
  return false
}

/** Keys in the order played, fingered from the thumb in the grouping that costs least. */
function fromTheThumb(keys: readonly Midi[]): Finger[] {
  let best: number[] = []
  let bestCost: number[] | null = null
  for (const grouping of groupings(keys.length)) {
    const groupingCost = cost(keys, grouping)
    if (!bestCost || cheaper(groupingCost, bestCost)) {
      best = grouping
      bestCost = groupingCost
    }
  }
  return best.flatMap((size) => FINGERS.slice(0, size))
}

/**
 * A run fingered from the thumb (`keys` from the bottom note up): the right hand's thumb on the
 * bottom note going up, the left hand's on the top note coming down, every later thumb kept off the
 * black keys where it can be. Read from the bottom note up.
 */
export function thumbFingering(keys: readonly Midi[], hand: Hand): Finger[] {
  if (hand === 'rh') return fromTheThumb(keys)
  return fromTheThumb([...keys].reverse()).reverse()
}

/** The finger a hand's 2nd or 3rd note from its thumb takes: wider when it reaches over a 4th. */
const reach = (gap: number): Finger => (gap >= 5 ? 4 : 3)

/**
 * An arpeggio's fingers (`keys` from the bottom note up, a chord's tones over its octaves): the thumb
 * on one tone in every octave, the first white key from the bottom note (the bottom note if all are
 * black). The right hand counts 1 2 3 (4) up from each thumb, its 3rd finger a 4 when it reaches over
 * a 4th, and takes 5 on a top note a thumb would land on; the left hand mirrors it, 1 on each thumb,
 * 2 under it, then 4 (3 over a 4th from below) and 5 on a bottom note a thumb would land on. Read
 * from the bottom note up.
 */
export function arpeggioFingering(keys: readonly Midi[], hand: Hand): Finger[] {
  const tones = new Set(keys.map((key) => key % 12)).size
  const thumbTone = (keys.find((key) => !isBlackKey(key)) ?? keys[0] ?? 0) % 12
  const thumbs = keys.flatMap((key, i) => (key % 12 === thumbTone ? [i] : []))
  const first = thumbs[0] ?? 0
  const last = thumbs.at(-1) ?? 0
  const gapBelow = (i: number) => (keys[i] ?? 0) - (keys[i - 1] ?? keys[i] ?? 0)
  return keys.map((_, i): Finger => {
    // Before the right hand's first thumb, fingers count down to it: the hand starts there.
    if (hand === 'rh' && i < first) return toFinger(first - i + 1)
    // A note's place from its thumb: up from the thumb before it (right hand), or down from the
    // thumb after it (left hand); past the last thumb the left hand counts to the next octave's.
    const place =
      hand === 'rh'
        ? (i - first) % tones
        : i > last
          ? (tones - ((i - last) % tones)) % tones
          : ((thumbs.find((thumb) => thumb >= i) ?? i) - i) % tones
    if (place === 0) {
      const outer = hand === 'rh' ? i === keys.length - 1 && i > 0 : i === 0 && keys.length > 1
      return outer ? 5 : 1
    }
    if (place === 1) return 2
    if (place === 3) return 4
    if (tones > 3) return 3
    return hand === 'rh' ? reach(gapBelow(i)) : reach(gapBelow(i)) === 4 ? 3 : 4
  })
}

/** The fingering a run takes when none is chosen: a taught scale's from its tonic, else from the thumb. */
export const ownFingering = (kind: ScaleKind, start: number): Fingering =>
  OWN_TABLE[kind] && start === 0 ? 'scale' : 'thumb'

/** The fingerings a run can take: both for a seven-note scale, else only its own. */
export const fingeringsOf = (kind: ScaleKind, start: number): readonly Fingering[] =>
  scaleHasChords(kind) ? FINGERINGS : [ownFingering(kind, start)]

/**
 * A run's fingers from its bottom note up (`keys` its keys from degree `start`, over as many octaves
 * as they span), as the scale fingers it or from the thumb.
 */
export function runFingering(
  root: SpelledNote,
  kind: ScaleKind,
  start: number,
  keys: readonly Midi[],
  hand: Hand,
  fingering: Fingering,
): Finger[] {
  return fingering === 'scale'
    ? scaleFingering(root, kind, hand, start, (keys.length - 1) / scaleIntervals(kind).length)
    : thumbFingering(keys, hand)
}
