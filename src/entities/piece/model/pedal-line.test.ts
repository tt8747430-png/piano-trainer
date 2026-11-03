import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { readPedalLine, writePedalLine } from './pedal-line'

const B = TICKS_PER_BEAT

describe('readPedalLine', () => {
  it('reads each event at its beat from the music’s start', () => {
    expect(readPedalLine('down@0 change@4 up@15.5', 'p')).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 4 * B, kind: 'change' },
      { tick: 15.5 * B, kind: 'up' },
    ])
  })

  it('reads a beat a decimal cannot write as a fraction, as the staves do', () => {
    expect(readPedalLine('down@1:3 up@8', 'p')).toEqual([
      { tick: B / 3, kind: 'down' },
      { tick: 8 * B, kind: 'up' },
    ])
  })

  it('reads none from nothing, and puts the events in order, an up and a down at one beat a change', () => {
    expect(readPedalLine(undefined, 'p')).toEqual([])
    expect(readPedalLine('  ', 'p')).toEqual([])
    expect(readPedalLine('up@8 down@0 down@4 up@4', 'p')).toEqual([
      { tick: 0, kind: 'down' },
      { tick: 4 * B, kind: 'change' },
      { tick: 8 * B, kind: 'up' },
    ])
  })

  it('throws a ContentError naming an event it cannot read', () => {
    for (const text of ['down@', 'lift@4', 'down4', 'down@-1', 'down@.0001', 'down@1:0', 'up@x'])
      expect(() => readPedalLine(`down@0 ${text}`, 'song')).toThrow(ContentError)
    expect(() => readPedalLine('down@0 lift@4', 'song')).toThrow(/song · pedal 2: .*"lift@4"/)
  })
})

describe('writePedalLine', () => {
  it('writes each event at its beat, a third of a beat as a fraction', () => {
    expect(
      writePedalLine([
        { tick: 0, kind: 'down' },
        { tick: 4 * B, kind: 'change' },
        { tick: B / 3, kind: 'change' },
        { tick: 15.5 * B, kind: 'up' },
      ]),
    ).toBe('down@0 change@1:3 change@4 up@15.5')
  })

  it('reads back what it writes', () => {
    const line = [
      { tick: 0, kind: 'down' },
      { tick: (7 * B) / 6, kind: 'change' },
      { tick: 3.25 * B, kind: 'change' },
      { tick: 9 * B, kind: 'up' },
    ] as const
    expect(readPedalLine(writePedalLine(line), 'p')).toEqual(line)
  })
})
