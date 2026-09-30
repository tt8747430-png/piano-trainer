import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { fourToALine, wholeBar } from './chart-layout'

const C = { root: note('C'), quality: 'maj' } as const

describe('the layout of a chart the app writes', () => {
  it('holds a chord a whole bar of 4/4', () => {
    expect(wholeBar(C)).toEqual({ chords: [{ ...C, beats: 4 }], beats: 4 })
  })

  it('lays bars four to a line, the last line what is left', () => {
    const bars = Array.from({ length: 6 }, () => wholeBar(C))
    expect(fourToALine(bars).map((line) => line.length)).toEqual([4, 2])
  })
})
