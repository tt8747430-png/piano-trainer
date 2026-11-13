import { partsFromParams, partsParams } from '@/shared/lib'
import {
  buildChord,
  chordInversions,
  noteFromParam,
  noteParam,
  partsOf,
  pitchClassOf,
  qualityRootSpelling,
  spellScale,
  type ChordQuality,
  type Key,
  type PitchClass,
} from '@/shared/lib/music'
import {
  changedView,
  chordKeys,
  chordSteps,
  stepOf,
  type ChordStep,
  type ChordView,
} from './chord-view'

/** How the next chord is offered: the key's own chords, or the chosen one's type moved by a step. */
export type NextWay = 'diatonic' | 'chromatic'

/** A chord offered next: the step it adds, and what it is to the chord before (a numeral, a move). */
export interface NextChord {
  readonly step: ChordStep
  /** A numeral in the key ("ii7"), or the move from the chosen chord, by its semitones (−3 to 3). */
  readonly numeral?: string
  readonly move?: number
}

/** The key's chords, degree by degree, as the canvas's tables (KQ): triads, then sevenths. */
const QUALITIES: Readonly<Record<'major' | 'minor', Record<'triad' | 'seventh', ChordQuality[]>>> =
  {
    major: {
      triad: ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
      seventh: ['maj7', 'm7', 'm7', 'maj7', 'd7', 'm7', 'hd'],
    },
    minor: {
      triad: ['min', 'dim', 'maj', 'min', 'maj', 'maj', 'maj'],
      seventh: ['m7', 'hd', 'maj7', 'm7', 'd7', 'maj7', 'd7'],
    },
  }
const NUMERALS: Readonly<Record<'major' | 'minor', Record<'triad' | 'seventh', string[]>>> = {
  major: {
    triad: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    seventh: ['Imaj7', 'ii7', 'iii7', 'IVmaj7', 'V7', 'vi7', 'viiø7'],
  },
  minor: {
    triad: ['i', 'ii°', 'III', 'iv', 'V', 'VI', 'VII'],
    seventh: ['i7', 'iiø7', 'IIImaj7', 'iv7', 'V7', 'VImaj7', 'VII7'],
  },
}
/** The degrees likeliest after each degree, as the canvas's NEXT (the common progressions). */
const LIKELY: Readonly<Record<'major' | 'minor', readonly (readonly number[])[]>> = {
  major: [[3, 4, 5, 1], [4, 6], [5, 3], [4, 0, 1], [0, 5], [3, 1, 4], [0]],
  minor: [
    [3, 4, 5, 6],
    [4, 0],
    [5, 3],
    [4, 0, 6],
    [0, 5],
    [3, 1, 4],
    [2, 0],
  ],
}
/** The chromatic moves offered, in semitones: a half step, a whole step, a minor 3rd, up then down. */
const MOVES = [1, -1, 2, -2, 3, -3] as const
/** How many chords are offered. */
const OFFERED = 6

/** The key the staff's chords are in: the first chord's root, minor where that chord is. */
export function staffKey(view: ChordView): Key {
  const [first = stepOf(view)] = chordSteps(view)
  return { tonic: noteFromParam(first.root), minor: first.triad === 'min' || first.triad === 'dim' }
}

/** A chord's root and quality as one, to leave out what the staff already holds. */
const sameChord = (step: ChordStep): string => {
  const { root, quality } = buildChord(noteFromParam(step.root), partsFromParams(step))
  return `${pitchClassOf(root)}:${quality ?? ''}`
}

/**
 * A step in the inversion whose keys move least from the last chord on the staff, as a pianist voices
 * a progression (the canvas's `nearest`): each key's distance to the nearest key before, summed.
 */
function nearest(view: ChordView, step: ChordStep): ChordStep {
  const steps = chordSteps(view)
  const last = steps[steps.length - 1] ?? stepOf(view)
  const before = chordKeys(changedView(view, last))
  const { tones } = buildChord(noteFromParam(step.root), partsFromParams(step))
  const moved = (inversion: number) =>
    chordKeys(changedView(view, { ...step, inversion })).reduce(
      (sum, key) => sum + Math.min(...before.map((other) => Math.abs(other - key))),
      0,
    )
  const [best = 0] = [...chordInversions(tones)].sort((a, b) => moved(a) - moved(b))
  return { ...step, inversion: best }
}

const stepFor = (root: Parameters<typeof noteParam>[0], quality: ChordQuality): ChordStep => ({
  root: noteParam(root),
  ...partsParams(partsOf(quality)),
  inversion: 0,
})

/**
 * The chords offered after the chosen one, those on the staff left out. Diatonic: six of the key's
 * chords, the likeliest after the chosen one first (its degree's common moves, then the rest), shown
 * by degree; sevenths when the chosen chord has a 7th. Chromatic: the chosen chord's type a half
 * step, a whole step and a minor 3rd up and down. Each in the inversion that moves least.
 */
export function nextChords(view: ChordView, way: NextWay): NextChord[] {
  const used = new Set(chordSteps(view).map(sameChord))
  const fresh = ({ step }: NextChord) => !used.has(sameChord(step))
  const chosen = buildChord(noteFromParam(view.root), partsFromParams(view))
  if (way === 'chromatic') {
    const quality = chosen.quality
    if (!quality) return []
    const from = pitchClassOf(chosen.root)
    return MOVES.map((move) => ({
      step: stepFor(qualityRootSpelling(((from + move + 12) % 12) as PitchClass, quality), quality),
      move,
    }))
      .filter(fresh)
      .map((each) => ({ ...each, step: nearest(view, each.step) }))
  }
  const key = staffKey(view)
  const mode = key.minor ? 'minor' : 'major'
  const size = view.size >= 7 ? 'seventh' : 'triad'
  const scale = spellScale(key.tonic, key.minor ? 'natural' : 'major')
  const tonic = pitchClassOf(key.tonic)
  const degree = scale.findIndex(
    (tone) =>
      (pitchClassOf(tone.note) - tonic + 12) % 12 === (pitchClassOf(chosen.root) - tonic + 12) % 12,
  )
  const order = [...(LIKELY[mode][degree] ?? LIKELY[mode][0] ?? []), 0, 1, 2, 3, 4, 5, 6].filter(
    (each, i, all) => all.indexOf(each) === i && each !== degree,
  )
  return order
    .map((each): NextChord | null => {
      const tone = scale[each]
      const quality = QUALITIES[mode][size][each]
      if (!tone || !quality) return null
      return { step: stepFor(tone.note, quality), numeral: NUMERALS[mode][size][each] ?? '' }
    })
    .filter((each): each is NextChord => each !== null)
    .filter(fresh)
    .slice(0, OFFERED)
    .sort(
      (a, b) =>
        (NUMERALS[mode][size].indexOf(a.numeral ?? '') ?? 0) -
        (NUMERALS[mode][size].indexOf(b.numeral ?? '') ?? 0),
    )
    .map((each) => ({ ...each, step: nearest(view, each.step) }))
}
