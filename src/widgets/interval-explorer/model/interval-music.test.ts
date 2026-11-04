import { describe, expect, it } from 'vitest'
import { intervalExample } from '@/features/play-example'
import { note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { intervalMusic } from './interval-music'

const example = intervalExample(note('C'), 'M3')

describe('an interval on a staff (A22)', () => {
  it('writes the way it is played: up, down, or together', () => {
    const at = (way: 'up' | 'down' | 'together') =>
      intervalMusic(example.music, way).notes.map((each) => [each.midi, each.startTick])
    expect(at('up')).toEqual([
      [example.low, 0],
      [example.high, 2 * TICKS_PER_BEAT],
    ])
    expect(at('down')).toEqual([
      [example.high, 0],
      [example.low, 2 * TICKS_PER_BEAT],
    ])
    expect(at('together')).toEqual([
      [example.low, 0],
      [example.high, 0],
    ])
  })
})
