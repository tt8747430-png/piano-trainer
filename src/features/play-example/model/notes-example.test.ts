import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import { barOf, barShown, notesShown } from './notes-example'

describe('notesShown', () => {
  it('marks each key a line plays with its note’s name, once', () => {
    const line = noteLine('E4 G4 E4 B♭4', {
      hand: 'rh',
      meter: '4/4',
      key: { tonic: note('C'), minor: false },
    })
    const shown = notesShown(line)
    expect(shown.keys).toEqual([64, 67, 70])
    expect(shown.marks.get(midi(70))).toEqual({ tone: 'scale', label: 'B♭' })
  })
})

describe('barOf and barShown', () => {
  const line = noteLine('C4 D4 E4 F4 G4 A4 B4 C5', {
    hand: 'rh',
    meter: '4/4',
    key: { tonic: note('C'), minor: false },
  })

  it('finds the bar a tick falls in', () => {
    const second = line.bars[1]!.startTick
    expect(barOf(line, 0)).toBe(0)
    expect(barOf(line, second - 1)).toBe(0)
    expect(barOf(line, second)).toBe(1)
  })

  it('marks only the keys of one bar', () => {
    expect(barShown(line, 0).keys).toEqual([60, 62, 64, 65])
    expect(barShown(line, 1).keys).toEqual([67, 69, 71, 72])
  })
})
