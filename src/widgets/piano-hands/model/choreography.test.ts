import { describe, expect, it } from 'vitest'
import type { PerformanceNote } from '@/shared/lib/arrangement'
import { midi, pitchClass, plainSpelling, TICKS_PER_BEAT, type Finger } from '@/shared/lib/music'
import {
  choreograph,
  handPlace,
  handPose,
  handsApart,
  MOTION,
  pressHeld,
  type HandPart,
} from './choreography'
import { handIn, KEY, keyX } from './keys'

const BEAT = TICKS_PER_BEAT
/** The music's ticks a second at 60 beats a minute: a beat a second. */
const PER_SECOND = BEAT

const note = (
  key: number,
  beat: number,
  beats: number,
  hand: PerformanceNote['hand'] = 'rh',
  more: Partial<PerformanceNote> = {},
): PerformanceNote => ({
  midi: midi(key),
  spelled: plainSpelling(pitchClass(midi(key)), true),
  hand,
  startTick: beat * BEAT,
  durationTicks: beats * BEAT,
  velocity: 80,
  ...more,
})

/** C D E F G, a beat each, from `from`. */
const fiveUp = (from: number, hand: PerformanceNote['hand']) =>
  [0, 2, 4, 5, 7].map((step, i) => note(from + step, i, 1, hand))

const partOf = (part: HandPart | null): HandPart => {
  if (!part) throw new Error('No part')
  return part
}

describe('choreograph (R36, the hands at the keys)', () => {
  it('gives each hand its own notes, fingered, and leaves a staff’s notes and silent notes to neither', () => {
    const notes = [
      ...fiveUp(60, 'rh'),
      ...fiveUp(48, 'lh'),
      note(72, 0, 4, 'staff'),
      note(64, 5, 1, 'rh', { silent: true }),
    ]
    const { rh, lh } = choreograph(notes)
    expect(partOf(rh).notes.map((n) => n.finger)).toEqual([1, 2, 3, 4, 5])
    expect(partOf(lh).notes.map((n) => n.finger)).toEqual([5, 4, 3, 2, 1])
    expect(partOf(rh).notes).toHaveLength(5)
  })

  it('has no part for a hand the music gives nothing to play', () => {
    expect(choreograph(fiveUp(60, 'rh')).lh).toBeNull()
  })

  it('keeps the fingers the score writes', () => {
    const notes = fiveUp(60, 'rh').map((n, i) => (i === 0 ? { ...n, finger: 2 as const } : n))
    expect(partOf(choreograph(notes).rh).notes[0]?.finger).toBe(2)
  })

  it('stands the hand over the keys it plays: a five-finger position from C over its E', () => {
    const rh = partOf(choreograph(fiveUp(60, 'rh')).rh)
    for (const place of rh.places) expect(place.x).toBeCloseTo(keyX(midi(64)), 6)
    const lh = partOf(choreograph(fiveUp(48, 'lh')).lh)
    for (const place of lh.places) expect(place.x).toBeCloseTo(keyX(midi(52)), 6)
  })
})

describe('handsApart', () => {
  it('measures the hands at their widest apart, each where its last onset stood it', () => {
    const together = [...fiveUp(48, 'lh'), ...fiveUp(72, 'rh')]
    expect(handsApart(choreograph(together))).toBeCloseTo(keyX(midi(76)) - keyX(midi(52)), 6)
    // The right hand moves up an octave for its last notes while the left hand holds its place.
    const later = [...together, ...[0, 2, 4].map((step, i) => note(84 + step, 5 + i, 1, 'rh'))]
    expect(handsApart(choreograph(later))).toBeGreaterThan(handsApart(choreograph(together)))
  })

  it('is none where one hand has nothing to play', () => {
    expect(handsApart(choreograph(fiveUp(60, 'rh')))).toBe(0)
  })
})

describe('handPlace', () => {
  it('centres the hand on a chord its fingers reach at ease', () => {
    const chord: { key: ReturnType<typeof midi>; finger: Finger }[] = [
      { key: midi(60), finger: 1 },
      { key: midi(64), finger: 3 },
      { key: midi(67), finger: 5 },
    ]
    expect(handPlace('rh', chord)).toBeCloseTo(keyX(midi(64)), 6)
  })

  it('keeps the thumb within its short reach outward, giving the stretch to the 5th', () => {
    // C and A a sixth apart, 1 and 5: five white keys across, one more than the hand rests over.
    const x = handPlace('rh', [
      { key: midi(60), finger: 1 },
      { key: midi(69), finger: 5 },
    ])
    const thumbOut = keyX(midi(60)) - (x - 2 * KEY.width)
    expect(thumbOut).toBeGreaterThanOrEqual(-0.4 * KEY.width - 1e-9)
  })

  it('splits what no place can reach evenly between the fingers at the ends', () => {
    // An octave, 1 and 5: past both the thumb's and the 5th's reach.
    const x = handPlace('rh', [
      { key: midi(60), finger: 1 },
      { key: midi(72), finger: 5 },
    ])
    const thumbOver = -0.4 * KEY.width - (keyX(midi(60)) - (x - 2 * KEY.width))
    const pinkyOver = keyX(midi(72)) - (x + 2 * KEY.width) - 1.25 * KEY.width
    expect(thumbOver).toBeCloseTo(pinkyOver, 6)
  })

  it('moves the hand in for the thumb on a black key', () => {
    const rh = partOf(choreograph([note(61, 0, 1, 'rh', { finger: 1 })]).rh)
    expect(rh.places[0]?.depth).toBeCloseTo(handIn('thumb'), 6)
    const white = partOf(choreograph([note(60, 0, 1, 'rh', { finger: 1 })]).rh)
    expect(white.places[0]?.depth).toBe(0)
  })
})

describe('handPose', () => {
  const rh = partOf(choreograph(fiveUp(60, 'rh')).rh)

  it('presses each note’s key with its finger while it sounds, and lets it up by its end', () => {
    const mid = handPose(rh, 1.5 * BEAT, PER_SECOND)
    expect(mid.fingers[1]?.press).toBe(1)
    expect(mid.keys.get(midi(62))).toBe(1)
    expect(mid.fingers[0]?.press).toBe(0)
    // At its very start the finger is on its key, not yet down: Wait mode's notes awaited.
    const start = handPose(rh, 1 * BEAT, PER_SECOND)
    expect(start.fingers[1]?.press).toBe(0)
    expect(start.fingers[1]?.dx).toBeCloseTo(0, 6)
    const end = handPose(rh, 2 * BEAT - 1, PER_SECOND)
    expect(end.fingers[1]?.press).toBeLessThan(0.01)
  })

  it('turns a finger to its key before it plays it, and back to rest after', () => {
    // The thumb passes under to F after E: the hand moves on, the thumb goes ahead to F.
    const scale = partOf(
      choreograph([0, 2, 4, 5, 7, 9, 11, 12].map((step, i) => note(60 + step, i, 1, 'rh'))).rh,
    )
    expect(scale.notes.map((n) => n.finger)).toEqual([1, 2, 3, 1, 2, 3, 4, 5])
    const before = handPose(scale, 3 * BEAT - 0.1 * PER_SECOND, PER_SECOND)
    const thumb = before.fingers[0]
    expect(thumb?.press).toBe(0)
    // On its way: past rest toward F, the key it plays next.
    const toF = keyX(midi(65)) - (before.x - 2 * KEY.width)
    expect(thumb?.dx ?? 0).toBeGreaterThan(0)
    expect(thumb?.dx ?? 0).toBeLessThanOrEqual(toF + 1e-9)
  })

  it('glides the hand to its next place just before it plays there, lifting only with no key held', () => {
    const jump = partOf(
      choreograph([note(60, 0, 0.5, 'rh', { finger: 1 }), note(72, 1, 1, 'rh', { finger: 1 })]).rh,
    )
    const [first, second] = jump.places
    expect(handPose(jump, 0.25 * BEAT, PER_SECOND).x).toBeCloseTo(first?.x ?? NaN, 6)
    const midway = 1 * BEAT - (MOTION.glide / 2) * PER_SECOND
    const gliding = handPose(jump, midway, PER_SECOND)
    expect(gliding.x).toBeGreaterThan(first?.x ?? Infinity)
    expect(gliding.x).toBeLessThan(second?.x ?? -Infinity)
    expect(gliding.lift).toBeGreaterThan(0)
    expect(handPose(jump, 1 * BEAT, PER_SECOND).x).toBeCloseTo(second?.x ?? NaN, 6)
    // Holding the first note into the glide, the hand stays down.
    const held = partOf(
      choreograph([note(60, 0, 1, 'rh', { finger: 1 }), note(72, 1, 1, 'rh', { finger: 1 })]).rh,
    )
    expect(handPose(held, midway, PER_SECOND).lift).toBe(0)
  })

  it('stands on the notes awaited and presses those the learner holds', () => {
    const awaiting = handPose(rh, 1 * BEAT, PER_SECOND)
    expect(awaiting.fingers[1]?.key).toBe(midi(62))
    // The thumb just off C is still over it, held legato; the 5th, far from its G, over none.
    expect(awaiting.fingers[0]?.key).toBe(midi(60))
    expect(awaiting.fingers[4]?.key).toBeNull()
    const played = pressHeld(awaiting, new Set([midi(62), midi(70)]))
    expect(played.fingers[1]?.press).toBe(1)
    expect(played.keys.get(midi(62))).toBe(1)
    // A key no finger stands on is the learner's own: no finger goes to it.
    expect(played.keys.has(midi(70))).toBe(false)
    expect(pressHeld(awaiting, new Set())).toBe(awaiting)
  })

  it('waits at its first place before the music starts, and stays at its last after', () => {
    expect(handPose(rh, -BEAT, PER_SECOND).x).toBeCloseTo(rh.places[0]?.x ?? NaN, 6)
    expect(handPose(rh, 100 * BEAT, PER_SECOND).x).toBeCloseTo(rh.places.at(-1)?.x ?? NaN, 6)
    expect(handPose(rh, 100 * BEAT, PER_SECOND).keys.size).toBe(0)
  })
})
