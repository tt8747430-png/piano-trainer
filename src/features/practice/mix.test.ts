import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { FULL_MIX, heardIn, mixGain, partGain } from './mix'

const ALL = { rh: true, lh: true, staff: true }

describe('the Player’s mix (ADR 0105, A35)', () => {
  it('plays a part it does not name as loud as it is', () => {
    expect(partGain(FULL_MIX, 'treble')).toBe(1)
    expect(partGain({ bass: 0.5 }, 'bass')).toBe(0.5)
  })

  it('plays no hand whose staff is turned right down', () => {
    expect(heardIn(ALL, { bass: 0 })).toEqual({ rh: true, lh: false, staff: true })
  })

  it('gives each note its staff’s gain, a click the click’s', () => {
    const gain = mixGain(() => ({ treble: 0.25, staff1: 0, click: 0.5 }))
    const note = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 1 } as const
    expect(gain({ ...note, part: 'rh' })).toBe(0.25)
    expect(gain({ ...note, part: 'staff', staff: 1 })).toBe(0)
    expect(gain({ ...note, part: 'staff', staff: 0 })).toBe(1)
    expect(gain(note)).toBe(1)
    expect(gain({ kind: 'click', at: 0, accent: false })).toBe(0.5)
  })
})
