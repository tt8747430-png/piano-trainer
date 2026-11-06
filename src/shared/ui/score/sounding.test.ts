import { describe, expect, it } from 'vitest'
import type { StaffId } from '@/shared/lib/notation'
import type { Head, Rest } from './layout'
import { soundingHeads } from './sounding'

const box = { left: 0, right: 1, top: 0, bottom: 1 }
const head = (staff: StaffId, tick: number, index = 0): Head => ({
  ...box,
  id: `n-${staff}-${tick}-${index}`,
  staff,
  tick,
  index,
})
const rest = (staff: StaffId, tick: number): Rest => ({ ...box, staff, tick })

describe('soundingHeads', () => {
  const heads = [head('treble', 0), head('treble', 0, 1), head('treble', 480), head('bass', 0)]

  it('lights each staff’s latest onset at or before the time, a chord whole', () => {
    expect(soundingHeads({ heads }, 0)).toEqual(['n-treble-0-0', 'n-treble-0-1', 'n-bass-0-0'])
  })

  it('holds a staff’s note while another staff moves on', () => {
    expect(soundingHeads({ heads }, 600)).toEqual(['n-treble-480-0', 'n-bass-0-0'])
  })

  it('silences a staff at its rest', () => {
    expect(soundingHeads({ heads, rests: [rest('bass', 240)] }, 300)).toEqual([
      'n-treble-0-0',
      'n-treble-0-1',
    ])
  })

  it('lights nothing before the first onset', () => {
    expect(soundingHeads({ heads: [head('treble', 480)] }, 100)).toEqual([])
  })
})
