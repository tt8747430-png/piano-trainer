import { describe, expect, it } from 'vitest'
import { readStaves } from '@/features/practice'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { heardSounds } from './heard-staves'

const note = (part: 'rh' | 'lh' | 'staff', staff?: number): Sound => ({
  kind: 'note',
  midi: midi(60),
  at: 0,
  duration: 1,
  velocity: 0.8,
  part,
  ...(staff === undefined ? {} : { staff }),
})

describe('heardSounds (A40)', () => {
  it('leaves out the notes of a staff whose Play is off, and keeps the clicks', () => {
    const sounds = [
      note('rh'),
      note('lh'),
      note('staff', 0),
      { kind: 'click', at: 0, accent: true },
    ]
    const heard = heardSounds(sounds as Sound[], readStaves('l0s1,t00s1'))
    expect(heard).toEqual([sounds[0], sounds[3]])
    expect(heardSounds(sounds as Sound[], {})).toHaveLength(4)
  })
})
