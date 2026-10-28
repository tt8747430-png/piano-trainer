import { INTERVALS, type IntervalName } from './interval'
import { MIDDLE_C } from './keyboard'
import { closeFrom, placeChord, type PlacedChord, type PlacedTone } from './place'
import { midi, pitchClass, type Midi } from './pitch'
import { toneAbove, type Tone } from './tone'

/**
 * The ways the Chords explorer lays a chord on the keys (ADR 0052): close, as it is spelled; the jazz
 * pianist's drop 2 and drop 3 (a close 4-note chord's second or third voice from the top an octave
 * down); a shell (root, 3rd and 7th in the left hand); the rootless voicings of type A and B (3rd and
 * 7th with the 9th and the 5th or 13th, the left hand's, after Bill Evans); locked hands (a close
 * chord in the right hand, its top note doubled an octave down in the left, after George Shearing);
 * and So What (three 4ths and a major 3rd up from the root's 9th, the chord of Miles Davis's tune).
 */
export const VOICINGS = [
  'close',
  'drop2',
  'drop3',
  'shell',
  'rootlessA',
  'rootlessB',
  'locked',
  'soWhat',
] as const
export type Voicing = (typeof VOICINGS)[number]

/** Why a voicing cannot lay out a chord. */
export type VoicingBar = 'fourNotes' | 'noThird' | 'noSeventh' | 'notDorian'

/** The voicings an inversion chooses for: the ones made from a close chord. */
const FROM_CLOSE: readonly Voicing[] = ['close', 'drop2', 'drop3', 'locked']
export const voicingTakesInversion = (voicing: Voicing): boolean => FROM_CLOSE.includes(voicing)

/** The voicings the left hand holds alone. */
const LEFT_ALONE: readonly Voicing[] = ['shell', 'rootlessA', 'rootlessB']
export const voicingInLeftHand = (voicing: Voicing): boolean => LEFT_ALONE.includes(voicing)

const OCTAVE = 12
/** A drop voicing and locked hands are made from a close chord of four notes. */
const FOUR = 4
/** The notes above a root So What's shape holds: the pitch classes of the Dorian mode. */
const DORIAN = new Set([0, 2, 3, 5, 7, 9, 10])
const MAJOR_THIRD = 4
const PERFECT_FIFTH = 7
/** So What from the root's 9th: three perfect 4ths and a major 3rd. */
const SO_WHAT: readonly IntervalName[] = ['M9', 'P5', 'r', 'P11', 'M13']
/** Where a left-hand voicing's lowest key sits: D3 to C♯4, the middle of the left hand's range. */
const LEFT_LOWEST = 50
/** Where locked hands' right hand starts: in the octave from middle C. */
const RIGHT_LOWEST = MIDDLE_C

const third = (tones: readonly Tone[]) => tones.find((tone) => tone.role === '3rd')
const seventh = (tones: readonly Tone[]) => tones.find((tone) => tone.role === '7th')

/** Why a voicing cannot lay out these tones, from the root up; undefined where it can. */
export function voicingBar(tones: readonly Tone[], voicing: Voicing): VoicingBar | undefined {
  switch (voicing) {
    case 'close':
      return undefined
    case 'drop2':
    case 'drop3':
    case 'locked':
      return tones.length === FOUR ? undefined : 'fourNotes'
    case 'shell':
    case 'rootlessA':
    case 'rootlessB':
      if (!third(tones)) return 'noThird'
      return seventh(tones) ? undefined : 'noSeventh'
    case 'soWhat': {
      const above = tones.map((tone) => pitchClass(tone.semitones))
      const dorian =
        above.every((each) => DORIAN.has(each)) &&
        !tones.some((tone) => tone.role === '3rd' && tone.semitones === MAJOR_THIRD) &&
        above.some((each) => each === PERFECT_FIFTH)
      return dorian ? undefined : 'notDorian'
    }
  }
}

/** The key of the pitch class `pc` at or above `lowest`, within its octave. */
const keyFrom = (lowest: number, pc: number): Midi => midi(lowest + pitchClass(pc - lowest))

/** Tones close from `start`, the lowest on its key at or above `lowest`. */
const closeAbove = (tones: readonly Tone[], start: Tone, lowest: number): PlacedTone[] =>
  closeFrom(tones, start, keyFrom(lowest, start.pitchClass))

/** A close 4-note chord from its inversion's bass in the octave from middle C. */
function closeFour(tones: readonly Tone[], inversion: number): PlacedTone[] {
  const bass = tones[inversion]
  if (!bass) throw new RangeError(`A chord of ${tones.length} notes has no inversion ${inversion}`)
  return closeAbove(tones, bass, RIGHT_LOWEST)
}

/** A close chord's voice `fromTop` from the top an octave down, in the left hand. */
function dropped(close: readonly PlacedTone[], fromTop: 2 | 3): PlacedChord {
  const at = close.length - fromTop
  const voice = close[at]
  if (!voice) throw new RangeError('A drop voicing needs a close chord of four notes')
  return {
    lh: [{ ...voice, midi: midi(voice.midi - OCTAVE) }],
    rh: close.filter((_, i) => i !== at),
  }
}

/**
 * The four tones of a rootless voicing: the 3rd and 7th; the chord's 9th (its ♭9 before its #9), or
 * the natural 9th added; and the chord's altered 5th, else its 13th, else on a dominant with a
 * natural 9th the 13th added, else its 5th. Type A starts from the 3rd and type B from the 7th, a
 * dominant the other way round, so a ii–V–I holds its hand still.
 */
function rootless(tones: readonly Tone[], type: 'A' | 'B'): PlacedTone[] {
  const [root] = tones
  const three = third(tones)
  const seven = seventh(tones)
  if (!root || !three || !seven) throw new RangeError('A rootless voicing needs a 3rd and a 7th')
  const above = (name: IntervalName) => toneAbove(root.note, INTERVALS[name])
  const ninths = tones.filter((tone) => tone.role === '9th')
  const ninth = ninths.find((tone) => tone.degree.startsWith('♭')) ?? ninths[0] ?? above('M9')
  const fifths = tones.filter((tone) => tone.role === '5th')
  const dominant = three.semitones === MAJOR_THIRD && seven.semitones === INTERVALS.m7.semitones
  const thirteenth = tones.find((tone) => tone.role === '13th')
  const altered =
    fifths.find((tone) => tone.degree.startsWith('#')) ??
    fifths.find((tone) => tone.semitones !== PERFECT_FIFTH)
  const fifth =
    altered ??
    thirteenth ??
    (dominant && ninth.semitones === INTERVALS.M9.semitones ? above('M13') : fifths[0]) ??
    above('P5')
  const fromThird = (type === 'A') !== dominant
  return closeAbove([three, fifth, seven, ninth], fromThird ? three : seven, LEFT_LOWEST)
}

/** So What on the chord's root: its 9th's key in the left hand's middle, the two 4ths below in the left hand. */
function soWhat(tones: readonly Tone[]): PlacedChord {
  const [root] = tones
  if (!root) throw new RangeError('A chord has at least its root')
  const stack = SO_WHAT.map((name) => toneAbove(root.note, INTERVALS[name]))
  const start = stack[0]
  if (!start) throw new RangeError('So What starts from the 9th')
  const lowest = keyFrom(LEFT_LOWEST, start.pitchClass)
  const steps = [0, 5, 10, 15, 19]
  const keys = stack.map((tone, i) => ({ tone, midi: midi(lowest + (steps[i] ?? 0)) }))
  return { lh: keys.slice(0, 2), rh: keys.slice(2) }
}

/**
 * A chord's tones, from its root up, laid on the keys in a voicing (`voicingBar` must allow it). Close
 * is the explorer's own placement in the right hand (`placeChord`); the voicings from a close chord
 * take its `inversion`; the rest have one shape.
 */
export function voiceChord(
  tones: readonly Tone[],
  voicing: Voicing,
  inversion: number,
): PlacedChord {
  const bar = voicingBar(tones, voicing)
  if (bar) throw new RangeError(`${voicing} cannot voice this chord: ${bar}`)
  switch (voicing) {
    case 'close':
      return placeChord(tones, { inversion, bothHands: false })
    case 'drop2':
      return dropped(closeFour(tones, inversion), 2)
    case 'drop3':
      return dropped(closeFour(tones, inversion), 3)
    case 'locked': {
      const close = closeFour(tones, inversion)
      const top = close.at(-1)
      if (!top) throw new RangeError('Locked hands need a close chord')
      return { lh: [{ ...top, midi: midi(top.midi - OCTAVE) }], rh: close }
    }
    case 'shell': {
      const [root] = tones
      const three = third(tones)
      const seven = seventh(tones)
      if (!root || !three || !seven) throw new RangeError('A shell needs a 3rd and a 7th')
      return { lh: closeAbove([root, three, seven], root, MIDDLE_C - OCTAVE), rh: [] }
    }
    case 'rootlessA':
      return { lh: rootless(tones, 'A'), rh: [] }
    case 'rootlessB':
      return { lh: rootless(tones, 'B'), rh: [] }
    case 'soWhat':
      return soWhat(tones)
  }
}
