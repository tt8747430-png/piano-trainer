import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate, type TimedMusic, type TimedNote } from '@/shared/lib/notation'
import { LAST_STAFF, scoreHeight, STAFF_GAP, staffHeight, VERSE, versesOf } from './size'

const B = TICKS_PER_BEAT

const sung = (text: string) => ({ text, hyphen: false, held: 0 })

const n = (key: number, hand: TimedNote['hand'], startTick: number, verses = 0): TimedNote => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick,
  durationTicks: B,
  ...(verses > 0 ? { lyrics: Array.from({ length: verses }, (_, i) => sung(`v${i + 1}`)) } : {}),
})

/** A note of the single staff over the piano (ADR 0097). */
const over = (key: number, startTick: number, verses = 0): TimedNote => ({
  ...n(key, 'staff', startTick, verses),
  staff: 0,
})
const OVER = { staves: [{ clef: 'treble' as const }] }

const music = (notes: TimedNote[], extra: Partial<TimedMusic> = {}): TimedMusic => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  notes,
  chords: [],
  ...extra,
})

describe('versesOf', () => {
  it('counts the most verses any note of the drawn staves sings', () => {
    const score = notate(
      music([over(72, 0, 1), over(74, B, 3), n(60, 'rh', 0), n(48, 'lh', 0)], OVER),
    )
    expect(versesOf(score)).toBe(3)
    expect(versesOf(score, ['staff0'])).toBe(3)
  })

  it('counts none where the staff that sings is not drawn, or nothing sings', () => {
    const score = notate(music([over(72, 0, 2), n(60, 'rh', 0), n(48, 'lh', 0)], OVER))
    expect(versesOf(score, ['treble', 'bass'])).toBe(0)
    expect(versesOf(notate(music([n(60, 'rh', 0), n(48, 'lh', 0)])))).toBe(0)
  })
})

describe('staffHeight', () => {
  it('is the staves’ room, and a verse’s more for each verse under them (ADR 0097)', () => {
    expect(staffHeight(undefined, 2)).toBe(STAFF_GAP + LAST_STAFF)
    expect(staffHeight(undefined, 2, 2)).toBe(STAFF_GAP + LAST_STAFF + 2 * VERSE)
    expect(staffHeight('treble', 2, 1)).toBe(LAST_STAFF + VERSE)
  })
})

describe('scoreHeight', () => {
  it('is the height a score’s drawn staves take with their verses', () => {
    const score = notate(music([over(72, 0, 2), n(60, 'rh', 0), n(48, 'lh', 0)], OVER))
    expect(scoreHeight(score)).toBe(staffHeight(undefined, 3, 2))
    expect(scoreHeight(score, ['treble', 'bass'])).toBe(staffHeight(undefined, 2))
    expect(scoreHeight(score, ['staff0'])).toBe(staffHeight(undefined, 1, 2))
  })
})
