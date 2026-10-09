import { describe, expect, it } from 'vitest'
import { note, noteParam } from '@/shared/lib/music'
import { changedView, viewChord, type ChordView } from './chord-view'

const C: ChordView = {
  root: noteParam(note('C')),
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: '',
  alter: '',
  inversion: 0,
  hands: 'rh',
}

describe('viewChord', () => {
  it('builds the view’s chord and places its keys', () => {
    const { chord, placed } = viewChord({ ...C, size: 7, inversion: 1, hands: 'both' })
    expect(chord.suffix).toBe('7')
    expect(placed.rh.map((key) => key.midi)).toEqual([64, 67, 70, 72])
    expect(placed.lh.map((key) => key.midi)).toEqual([48])
  })
})

describe('viewChord, from five notes', () => {
  it('shares the chord between two hands, whichever hands the view names', () => {
    const { placed } = viewChord({ ...C, size: 9 })
    expect(placed.lh.map((key) => key.midi)).toEqual([48])
    expect(placed.rh.map((key) => key.midi)).toEqual([64, 67, 70, 74])
  })
})

describe('changedView', () => {
  it('fits the parts to one another', () => {
    const dominant = { ...C, size: 9 as const, alter: 'b9' }
    expect(changedView(dominant, { triad: 'min' })).toMatchObject({
      triad: 'min',
      size: 9,
      alter: '',
    })
    expect(changedView(dominant, { triad: 'sus2' })).toMatchObject({ size: 7, alter: '' })
  })

  it('drops a suspension the size chosen cannot take, keeping the size', () => {
    const sus2 = { ...C, triad: 'sus2' as const, size: 7 as const }
    expect(changedView(sus2, { size: 9 })).toMatchObject({ triad: 'maj', size: 9 })
    expect(changedView({ ...C, triad: 'sus4' }, { size: 13 })).toMatchObject({
      triad: 'sus4',
      size: 13,
    })
    expect(changedView({ ...C, triad: 'sus4' }, { size: 11 })).toMatchObject({
      triad: 'maj',
      size: 11,
    })
  })

  it('keeps the right hand’s start a bigger chord has: from the 7th, else root position', () => {
    expect(changedView({ ...C, size: 7, inversion: 3 }, { size: 9 }).inversion).toBe(3)
    expect(changedView({ ...C, size: 7, inversion: 1 }, { size: 9 }).inversion).toBe(0)
    expect(changedView({ ...C, size: 9, inversion: 3 }, { size: 7 }).inversion).toBe(3)
  })

  it('keeps the inversion the smaller chord has', () => {
    expect(changedView({ ...C, size: 7, inversion: 3 }, { size: 5 }).inversion).toBe(2)
    expect(changedView({ ...C, size: 7, inversion: 1 }, { size: 5 }).inversion).toBe(1)
  })
})
