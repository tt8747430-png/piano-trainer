import type { Performance } from '@/shared/lib/arrangement'
import {
  MIDDLE_C,
  midi,
  note,
  pitchClass,
  pitchClassOf,
  scaleChordAt,
  runFingering,
  spellScale,
  walkKeys,
  type Finger,
  type Hand,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import {
  BAR,
  fingered,
  inBeats,
  inEighths,
  handBelow,
  scaleDegrees,
  shell,
  type Played,
} from './line'
import { exercisePerformance, type Harmony, type LineNote } from './performance'

// Piano With Jonny's five major-scale exercises: the scale as music uses it (roadmap §9.4).

const HALF = BAR / 2
const MAJOR = 'major'
const tonicAt = (root: SpelledNote, octave: number): Midi =>
  midi(MIDDLE_C + 12 * (octave - 4) + pitchClassOf(root))
const sevenths = (root: SpelledNote, degrees: readonly number[]) =>
  degrees.map((degree) => scaleChordAt(root, MAJOR, degree % 7, 4))
const barEach = (chords: readonly Harmony['chord'][]): Harmony[] =>
  chords.map((chord, i) => ({ chord, startTick: i * BAR, durationTicks: BAR }))
const seventhOf = (quality: string) => (quality === 'maj7' ? 11 : quality === 'o7' ? 9 : 10)

/**
 * The major scale up over the ii's shell and down over the V's, home on the I's (2-5-1 scale):
 * swung 8ths in the right hand, the left hand's root and 7th a bar a chord.
 */
export function twoFiveOneScale(choice: { readonly root: SpelledNote }): Performance {
  const { root } = choice
  const place = scaleDegrees(root, MAJOR, tonicAt(root, 4))
  const up = [0, 1, 2, 3, 4, 5, 6, 7].map(place)
  const down = [8, 7, 6, 5, 4, 3, 2, 1].map(place)
  const chords = sevenths(root, [1, 4, 0])
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: [
      ...inEighths({ rh: [...up, ...down] }),
      ...inEighths({ rh: [place(0)] }, 2 * BAR),
      ...inBeats({ lh: chords.map((chord) => shell(chord, seventhOf(chord.quality))) }, BAR),
    ],
    harmony: barEach(chords),
  })
}

/**
 * The key's 7th chords up the scale, a bar each: the left hand's root; the right hand's 3rd on top
 * with the 5th finger, held, and its 7th under it with the 2nd, stepping down to the 6th with the
 * thumb halfway through the bar (the inner voice).
 */
export function innerVoice(choice: { readonly root: SpelledNote }): Performance {
  const { root } = choice
  const right = scaleDegrees(root, MAJOR, tonicAt(root, 4))
  const left = scaleDegrees(root, MAJOR, tonicAt(root, 3))
  const degrees = [0, 1, 2, 3, 4, 5, 6, 7]
  const finger = (key: Played, f: Finger): Played => ({ ...key, finger: f })
  const notes: LineNote[] = degrees.flatMap((degree, i) => [
    ...inBeats({ rh: [[finger(right(degree + 2), 5)]], lh: [[left(degree)]] }, BAR, i * BAR),
    ...inBeats(
      { rh: [[finger(right(degree - 1), 2)], [finger(right(degree - 2), 1)]] },
      HALF,
      i * BAR,
    ),
  ])
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes,
    harmony: barEach(sevenths(root, degrees)),
  })
}

/**
 * The major scale from each of its degrees, Ionian to Locrian, up an octave and back, two bars a
 * mode, both hands fingered as the parent scale (the thumbs where C major puts them).
 */
export function modes(choice: { readonly root: SpelledNote }): Performance {
  const { root } = choice
  const runs = [0, 1, 2, 3, 4, 5, 6].map((start) => {
    const hand = (side: Hand): Played[] => {
      const place = scaleDegrees(root, MAJOR, tonicAt(root, side === 'rh' ? 4 : 3))
      const keys = Array.from({ length: 8 }, (_, i) => place(start + i))
      const fingers = runFingering(
        root,
        MAJOR,
        start,
        keys.map((key) => key.midi),
        side,
        'scale',
      )
      const up = fingered(keys, fingers)
      return [...up, ...[...up].reverse().slice(1)]
    }
    return inEighths({ rh: hand('rh'), lh: hand('lh') }, start * 2 * BAR)
  })
  return exercisePerformance({
    key: { tonic: root, minor: false },
    notes: runs.flat(),
    harmony: [0, 1, 2, 3, 4, 5, 6].map((degree) => ({
      chord: scaleChordAt(root, MAJOR, degree, 3),
      startTick: degree * 2 * BAR,
      durationTicks: 2 * BAR,
    })),
  })
}

/** A key's major scale as keys: its pitch classes and how it spells each. */
function scaleOf(tonic: SpelledNote) {
  const spelled = new Map(spellScale(tonic, MAJOR).map((tone) => [tone.pitchClass, tone.note]))
  return (key: number): SpelledNote | undefined => spelled.get(pitchClass(key))
}

/** The scale's next key from `from`, up or down. */
function step(spell: (key: number) => SpelledNote | undefined, from: number, by: 1 | -1): Played {
  let key = from + by
  while (!spell(key)) key += by
  const spelled = spell(key)
  if (!spelled) throw new RangeError('A major scale has a note in every octave')
  return { midi: midi(key), spelled }
}

/**
 * One unbroken line of 8ths round the circle of fifths (a 5th lower each time): up a bar in one key,
 * down the next bar in the next, each bar leaving from where the last ended, home on the first key's
 * tonic. Written in C, so each bar's accidentals are its key's.
 */
export function rapidSwitch(choice: { readonly root: SpelledNote }): Performance {
  const { root } = choice
  const keys = walkKeys({ tonic: root, minor: false }, 'fifths').slice(0, 12)
  let at: number = tonicAt(root, 4) - 1
  const bars = keys.map((key, i) => {
    const spell = scaleOf(key.tonic)
    const by = i % 2 === 0 ? 1 : -1
    return Array.from({ length: 8 }, () => {
      const played = step(spell, at, by)
      at = played.midi
      return played
    })
  })
  const closing: Played = { midi: nearestTonic(at, root), spelled: root }
  const line = bars.flat()
  return exercisePerformance({
    key: { tonic: note('C'), minor: false },
    notes: [
      ...inEighths({ rh: line, lh: handBelow(line) }),
      ...inEighths({ rh: [closing], lh: handBelow([closing]) }, 12 * BAR),
    ],
    harmony: [
      ...keys.map((key, i) => ({
        chord: { root: key.tonic, quality: 'maj' as const },
        startTick: i * BAR,
        durationTicks: BAR,
      })),
      { chord: { root, quality: 'maj' }, startTick: 12 * BAR, durationTicks: BAR },
    ],
  })
}

/** The tonic's key nearest `to`, the lower on a tie. */
function nearestTonic(to: number, tonic: SpelledNote): Midi {
  const below = to - pitchClass(to - pitchClassOf(tonic))
  return midi(to - below <= below + 12 - to ? below : below + 12)
}
