import { describe, expect, it } from 'vitest'
import { midi, note, type Key } from '@/shared/lib/music'
import { liveName } from './live-name'

const C_MAJOR: Key = { tonic: note('C'), minor: false }
const named = (keys: number[], key: Key = C_MAJOR) => liveName(keys.map(midi), key)

describe('liveName', () => {
  it('names one key, or one note in octaves, as its note in the key', () => {
    expect(named([60])).toEqual({ kind: 'note', note: note('C') })
    expect(named([60, 72])).toEqual({ kind: 'note', note: note('C') })
    expect(named([66], { tonic: note('F'), minor: false })).toEqual({
      kind: 'note',
      note: note('G', -1),
    })
  })

  it('names two notes as their interval, compound past the octave where a chord names it', () => {
    expect(named([60, 64])).toEqual({ kind: 'interval', interval: 'M3' })
    expect(named([60, 74])).toEqual({ kind: 'interval', interval: 'M9' })
    expect(named([60, 76])).toEqual({ kind: 'interval', interval: 'M3' })
    expect(named([60, 64, 72])).toEqual({ kind: 'interval', interval: 'M3' })
  })

  it('names three notes or more as the chord finder does, its first name', () => {
    const found = named([60, 64, 67])
    expect(found.kind === 'chord' && found.found.symbol).toBe('C')
  })

  it('names nothing the chord finder cannot', () => {
    expect(named([60, 61, 62])).toEqual({ kind: 'none' })
    expect(named([])).toEqual({ kind: 'none' })
  })
})
