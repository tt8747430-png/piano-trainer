import { describe, expect, it } from 'vitest'
import { parseFigure, playsKeyTriads, splitsTheBeat } from './figure'

describe('parseFigure', () => {
  it('reads positions in 16ths as ticks', () => {
    const events = parseFigure('0/4 C,4/4 C')
    expect(events.map(({ start, duration }) => ({ start, duration }))).toEqual([
      { start: 0, duration: 12 },
      { start: 12, duration: 12 },
    ])
    expect(events[0]?.tones).toEqual([{ token: { kind: 'chord' } }])
    expect(events[0]?.accent).toBe(false)
    expect(events[0]?.rolled).toBe(false)
  })

  it('reads positions in triplet 8ths', () => {
    const [event] = parseFigure('3/6 C', { triplets: true })
    expect(event?.start).toBe(12)
    expect(event?.duration).toBe(24)
  })

  it('reads accents and rolls', () => {
    expect(parseFigure('0/2 C!')[0]?.accent).toBe(true)
    const [rolled] = parseFigure('8/8 T2~')
    expect(rolled?.rolled).toBe(true)
    expect(rolled?.tones).toEqual([{ token: { kind: 'triad', inversion: 2, octaves: 0 } }])
  })

  it.each([
    ['T', { kind: 'triad', inversion: 0, octaves: 0 }],
    ['T1', { kind: 'triad', inversion: 1, octaves: 0 }],
    ['T8', { kind: 'triad', inversion: 0, octaves: 1 }],
    ['T15', { kind: 'triad', inversion: 0, octaves: 2 }],
    ['U', { kind: 'upper-voices' }],
    ['v3', { kind: 'voice', index: 2 }],
    ['Ka', { kind: 'key-triad', triad: 'I' }],
    ['Kb', { kind: 'key-triad', triad: 'IV' }],
    ['Kc', { kind: 'key-triad', triad: 'V' }],
    ['L1', { kind: 'bass-degree', degree: 1 }],
    ['L10', { kind: 'bass-degree', degree: 10 }],
    ['s7', { kind: 'scale-degree', degree: 7 }],
    ['_7', { kind: 'below-root', semitones: 1 }],
    ['_b7', { kind: 'below-root', semitones: 2 }],
    ['_6', { kind: 'below-root', semitones: 3 }],
    ['15', { kind: 'chord-degree', degree: 15 }],
  ])('reads the token %s', (text, token) => {
    expect(parseFigure(`0/4 ${text}`)[0]?.tones).toEqual([{ token }])
  })

  it('reads fingers', () => {
    expect(parseFigure('6/2 3^1')[0]?.tones).toEqual([
      { token: { kind: 'chord-degree', degree: 3 }, finger: 1 },
    ])
    expect(parseFigure('8/8 5^2+8^5')[0]?.tones.map((tone) => tone.finger)).toEqual([2, 5])
  })

  it.each(['0/4 Q', '0 C', '0/4', '0/4 1^6', 'x/4 C', '0/0 C', '0/4 16', '0/4 C?'])(
    'names the event it cannot read: %j',
    (text) => {
      expect(() => parseFigure(text)).toThrow(`"${text}"`)
    },
  )
})

describe('playsKeyTriads', () => {
  it('finds the key’s triads in any of a figure’s events', () => {
    expect(playsKeyTriads({ kind: 'events', events: parseFigure('0/4 Ka,4/4 C') })).toBe(true)
    expect(
      playsKeyTriads({
        kind: 'events',
        events: parseFigure('0/16 C'),
        inThree: parseFigure('0/4 Kb'),
      }),
    ).toBe(true)
    expect(playsKeyTriads({ kind: 'events', events: parseFigure('0/4 C,4/4 T1') })).toBe(false)
  })
})

describe('splitsTheBeat', () => {
  it('finds a figure that plays inside a beat, which a compound meter divides in three', () => {
    expect(splitsTheBeat({ kind: 'events', events: parseFigure('0/4 C,4/4 C') })).toBe(false)
    expect(splitsTheBeat({ kind: 'events', events: parseFigure('0/16 L1+L8') })).toBe(false)
    expect(splitsTheBeat({ kind: 'events', events: parseFigure('0/2 C,2/2 C') })).toBe(true)
    expect(
      splitsTheBeat({
        kind: 'events',
        events: parseFigure('0/4 C'),
        onMajor: parseFigure('0/4 C,6/2 C'),
      }),
    ).toBe(true)
  })
})
