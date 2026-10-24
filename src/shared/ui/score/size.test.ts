import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { notate, type TimedMusic, type TimedNote } from '@/shared/lib/notation'
import { LAST_STAFF, scoreHeight, STAFF_GAP, staffHeight, VERSE, versesOf } from './size'

const sung = (text: string) => ({ text, hyphen: false, held: 0 })

const n = (key: number, hand: TimedNote['hand'], startTick: number, verses = 0): TimedNote => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick,
  durationTicks: 24,
  ...(verses > 0 ? { lyrics: Array.from({ length: verses }, (_, i) => sung(`v${i + 1}`)) } : {}),
})

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
      music([n(72, 'melody', 0, 1), n(74, 'melody', 24, 3), n(60, 'rh', 0), n(48, 'lh', 0)], {
        melodyStaff: true,
      }),
    )
    expect(versesOf(score)).toBe(3)
    expect(versesOf(score, ['melody'])).toBe(3)
  })

  it('counts none where the tune’s staff is not drawn, or nothing sings', () => {
    const score = notate(
      music([n(72, 'melody', 0, 2), n(60, 'rh', 0), n(48, 'lh', 0)], { melodyStaff: true }),
    )
    expect(versesOf(score, ['treble', 'bass'])).toBe(0)
    expect(versesOf(notate(music([n(60, 'rh', 0), n(48, 'lh', 0)])))).toBe(0)
  })
})

describe('staffHeight', () => {
  it('is the staves’ room, and a verse’s more for each verse under them (ADR 0093)', () => {
    expect(staffHeight(undefined, 2)).toBe(STAFF_GAP + LAST_STAFF)
    expect(staffHeight(undefined, 2, 2)).toBe(STAFF_GAP + LAST_STAFF + 2 * VERSE)
    expect(staffHeight('treble', 2, 1)).toBe(LAST_STAFF + VERSE)
  })
})

describe('scoreHeight', () => {
  it('is the height a score’s drawn staves take with their verses', () => {
    const score = notate(
      music([n(72, 'melody', 0, 2), n(60, 'rh', 0), n(48, 'lh', 0)], { melodyStaff: true }),
    )
    expect(scoreHeight(score)).toBe(staffHeight(undefined, 3, 2))
    expect(scoreHeight(score, ['treble', 'bass'])).toBe(staffHeight(undefined, 2))
    expect(scoreHeight(score, ['melody'])).toBe(staffHeight(undefined, 1, 2))
  })
})
