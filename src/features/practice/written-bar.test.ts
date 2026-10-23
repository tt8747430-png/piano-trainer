import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { TWO_BARS } from './testing/performances'
import { beatGroupInBar, writtenBarAt } from './written-bar'

const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
} as const

/** C F G, the first two repeated: played C F C F G. */
const REPEATED: Chart = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [
    {
      lines: [
        [
          { chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4, repeatStart: true },
          { chords: [{ ...parseChordSymbol('F'), beats: 4 }], beats: 4, barline: 'repeat' },
          { chords: [{ ...parseChordSymbol('G'), beats: 4 }], beats: 4, barline: 'final' },
        ],
      ],
    },
  ],
}
const PLAYED = arrange(REPEATED, { tonic: note('C'), pattern: BEATS, unfold: true })

describe('the bar as written, between the Player and the editor', () => {
  it('reads the bar a beat group is in, as written', () => {
    expect(writtenBarAt(TWO_BARS, 0)).toBe(0)
    expect(writtenBarAt(TWO_BARS, 5)).toBe(1)
    // The repeat taken: the third bar played is the first as written.
    expect(writtenBarAt(PLAYED, 8)).toBe(0)
    expect(writtenBarAt(PLAYED, 16)).toBe(2)
  })

  it('finds a written bar’s first beat group, the first time it is played', () => {
    expect(beatGroupInBar(TWO_BARS, 1)).toBe(4)
    expect(beatGroupInBar(PLAYED, 1)).toBe(4)
    expect(beatGroupInBar(PLAYED, 2)).toBe(16)
  })

  it('finds none past the last bar', () => {
    expect(beatGroupInBar(TWO_BARS, 2)).toBeNull()
    expect(beatGroupInBar(TWO_BARS, -1)).toBeNull()
  })
})
