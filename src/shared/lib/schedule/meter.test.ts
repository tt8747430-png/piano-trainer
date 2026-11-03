import { describe, expect, it } from 'vitest'

import {
  barClicks,
  beatLevels,
  defaultLevels,
  meterBeats,
  nextLevel,
  parseMeter,
  speedAt,
} from './meter'
import type { Meter } from '@/shared/lib/music'

const meter = (text: string): Meter => {
  const read = parseMeter(text)
  if (!read) throw new Error(`no meter ${text}`)
  return read
}

/** The bar's clicks as `offset in beats:level`, for reading. */
const shape = (text: string, subdivision: Parameters<typeof barClicks>[0]['subdivision']) =>
  barClicks({ meter: meter(text), levels: null, subdivision, secondsPerBeat: 1 }).map(
    (click) => `${Number(click.at.toFixed(3))}:${click.level}`,
  )

describe('a meter', () => {
  it('reads any time signature the app writes, and refuses what is none', () => {
    expect(parseMeter('7/8')).toBe('7/8')
    expect(parseMeter(' 12/8 ')).toBe('12/8')
    for (const wrong of ['', '4', '0/4', '4/3', '4/0', '13/4', 'a/b'])
      expect(parseMeter(wrong)).toBeNull()
  })

  it('counts a simple meter in its written beat', () => {
    expect(meterBeats(meter('4/4'))).toEqual({ beats: [1, 1, 1, 1], unit: 4, groups: [0] })
    expect(meterBeats(meter('2/2'))).toEqual({ beats: [1, 1], unit: 2, groups: [0] })
    expect(meterBeats(meter('5/4'))).toEqual({ beats: [1, 1, 1, 1, 1], unit: 4, groups: [0, 3] })
  })

  it('counts a compound meter in dotted beats, three to each', () => {
    expect(meterBeats(meter('3/8'))).toEqual({ beats: [3], unit: 8, groups: [0] })
    expect(meterBeats(meter('6/8'))).toEqual({ beats: [3, 3], unit: 8, groups: [0] })
    expect(meterBeats(meter('9/8'))).toEqual({ beats: [3, 3, 3], unit: 8, groups: [0] })
    expect(meterBeats(meter('12/8'))).toEqual({ beats: [3, 3, 3, 3], unit: 8, groups: [0] })
  })

  it('groups an odd meter, its tempo the eighth, an accent at each group', () => {
    expect(meterBeats(meter('5/8'))).toEqual({ beats: [1, 1, 1, 1, 1], unit: 8, groups: [0, 3] })
    expect(meterBeats(meter('5/8'), [2, 3]).groups).toEqual([0, 2])
    expect(meterBeats(meter('7/8'))).toEqual({
      beats: [1, 1, 1, 1, 1, 1, 1],
      unit: 8,
      groups: [0, 2, 4],
    })
    expect(defaultLevels(meter('7/8'))).toEqual([
      'downbeat',
      'normal',
      'accent',
      'normal',
      'accent',
      'normal',
      'normal',
    ])
  })
})

describe('the beat squares', () => {
  it('cycle accent, normal, silent, and back', () => {
    expect(nextLevel('accent')).toBe('normal')
    expect(nextLevel('normal')).toBe('silent')
    expect(nextLevel('silent')).toBe('accent')
    expect(nextLevel('downbeat')).toBe('normal')
  })

  it('keep what the learner set while the meter has that many beats, else start afresh', () => {
    const set = ['accent', 'silent', 'normal', 'normal'] as const
    expect(beatLevels(meter('4/4'), set)).toEqual(set)
    expect(beatLevels(meter('3/4'), set)).toEqual(['downbeat', 'normal', 'normal'])
  })
})

describe('a bar of clicks', () => {
  it('clicks each beat, the first the downbeat', () => {
    expect(shape('4/4', 'none')).toEqual(['0:downbeat', '1:normal', '2:normal', '3:normal'])
    expect(shape('2/2', 'none')).toEqual(['0:downbeat', '1:normal'])
  })

  it('clicks 6/8 twice a bar at the dotted beat, its eighths under it when asked', () => {
    expect(shape('6/8', 'none')).toEqual(['0:downbeat', '1:normal'])
    expect(shape('6/8', '8ths')).toEqual([
      '0:downbeat',
      '0.333:sub',
      '0.667:sub',
      '1:normal',
      '1.333:sub',
      '1.667:sub',
    ])
  })

  it('subdivides a quarter beat in 8ths, triplets, 16ths and swing', () => {
    expect(shape('2/4', '8ths')).toEqual(['0:downbeat', '0.5:sub', '1:normal', '1.5:sub'])
    expect(shape('1/4', 'triplets')).toEqual(['0:downbeat', '0.333:sub', '0.667:sub'])
    expect(shape('1/4', '16ths')).toEqual(['0:downbeat', '0.25:sub', '0.5:sub', '0.75:sub'])
    expect(shape('1/4', 'swing')).toEqual(['0:downbeat', '0.667:sub'])
  })

  it('leaves a silent beat out, its subdivisions too', () => {
    const clicks = barClicks({
      meter: meter('3/4'),
      levels: ['downbeat', 'silent', 'normal'],
      subdivision: '8ths',
      secondsPerBeat: 0.5,
    })
    expect(clicks.map((click) => click.at)).toEqual([0, 0.25, 1, 1.25])
  })

  it('names the beat each click belongs to', () => {
    const clicks = barClicks({
      meter: meter('3/4'),
      levels: null,
      subdivision: '8ths',
      secondsPerBeat: 1,
    })
    expect(clicks.map((click) => click.beat)).toEqual([0, 0, 1, 1, 2, 2])
  })
})

describe('the drums', () => {
  const kit = (
    text: string,
    subdivision: Parameters<typeof barClicks>[0]['subdivision'] = 'none',
  ) =>
    barClicks({
      meter: meter(text),
      levels: null,
      subdivision,
      secondsPerBeat: 1,
      drums: true,
    }).map((click) => `${Number(click.at.toFixed(3))}:${click.voices.join('+')}`)

  it('play 4/4 as a rock beat: kick 1 and 3, snare 2 and 4, the hat on 8ths', () => {
    expect(kit('4/4')).toEqual([
      '0:kick+hat',
      '0.5:hat',
      '1:snare+hat',
      '1.5:hat',
      '2:kick+hat',
      '2.5:hat',
      '3:snare+hat',
      '3.5:hat',
    ])
  })

  it('play 3/4 as a waltz: kick on 1, snare on 2 and 3', () => {
    expect(kit('3/4').filter((click) => !click.endsWith(':hat'))).toEqual([
      '0:kick+hat',
      '1:snare+hat',
      '2:snare+hat',
    ])
  })

  it('play 2/4 as a backbeat and an odd meter by its groups', () => {
    expect(kit('2/4').filter((click) => !click.endsWith(':hat'))).toEqual([
      '0:kick+hat',
      '1:snare+hat',
    ])
    expect(kit('7/8').filter((click) => !click.endsWith(':hat'))).toEqual([
      '0:kick+hat',
      '2:snare+hat',
      '4:snare+hat',
    ])
  })

  it('play 6/8 with the kick on 1, the snare on 4, the hat on every eighth', () => {
    expect(kit('6/8')).toEqual([
      '0:kick+hat',
      '0.333:hat',
      '0.667:hat',
      '1:snare+hat',
      '1.333:hat',
      '1.667:hat',
    ])
  })

  it('put the hat on the subdivision chosen', () => {
    expect(kit('2/4', '16ths').filter((click) => click.endsWith(':hat'))).toHaveLength(6)
  })
})

describe('the speed trainer', () => {
  it('climbs by its step every so many bars, then holds the goal', () => {
    const trainer = { from: 80, to: 100, step: 5, every: 2 }
    expect([0, 1, 2, 3, 4, 8, 12].map((bar) => speedAt(bar, trainer))).toEqual([
      80, 80, 85, 85, 90, 100, 100,
    ])
  })

  it('comes down as well', () => {
    expect(speedAt(4, { from: 120, to: 100, step: 10, every: 1 })).toBe(100)
  })
})
