import { describe, expect, it } from 'vitest'
import { parseFigure } from './figure'

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
    expect(rolled?.tones).toEqual([{ token: { kind: 'triad', inversion: 2 } }])
  })

  it.each([
    ['T', { kind: 'triad', inversion: 0 }],
    ['T1', { kind: 'triad', inversion: 1 }],
    ['T8', { kind: 'triad-octave' }],
    ['U', { kind: 'upper-pair' }],
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
