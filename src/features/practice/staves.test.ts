import { describe, expect, it } from 'vitest'
import {
  hiddenStaves,
  isStavesParam,
  noteStaff,
  readStaves,
  stavesParam,
  trackOf,
  withTrack,
} from './staves'

describe('the Player’s staves (A35)', () => {
  it('plays and shows every track that is not written otherwise', () => {
    expect(trackOf({}, 'treble')).toEqual({ play: true, show: true })
    expect(trackOf(readStaves('l0s1'), 'bass')).toEqual({ play: false, show: true })
  })

  it('writes only what differs from all on, in the order of the score, and reads it back', () => {
    const staves = withTrack(withTrack({}, 'bass', { play: false }), 'staff1', { show: false })
    expect(stavesParam(staves)).toBe('t11s0,l0s1')
    expect(readStaves('t11s0,l0s1')).toEqual(staves)
    expect(stavesParam(withTrack(staves, 'bass', { play: true }))).toBe('t11s0')
    expect(stavesParam({})).toBeUndefined()
  })

  it('takes the recording as a track of its own, never shown', () => {
    const staves = withTrack({}, 'recording', { play: false })
    expect(stavesParam(staves)).toBe('r0s1')
    expect(hiddenStaves(withTrack(staves, 'recording', { show: false }))).toEqual([])
  })

  it('names the staves out of sight', () => {
    expect(hiddenStaves(readStaves('u1s0,t01s0'))).toEqual(['staff0', 'treble'])
  })

  it('checks a param: tracks it knows, each once', () => {
    expect(isStavesParam('u1s0,l0s1')).toBe(true)
    expect(isStavesParam('u1s0,u0s1')).toBe(false)
    expect(isStavesParam('x1s1')).toBe(false)
    expect(isStavesParam('')).toBe(false)
    expect(isStavesParam(3)).toBe(false)
  })

  it('finds a note’s staff: a hand’s the piano’s, a single staff’s its own', () => {
    expect(noteStaff({ hand: 'rh' })).toBe('treble')
    expect(noteStaff({ hand: 'lh' })).toBe('bass')
    expect(noteStaff({ hand: 'staff', staff: 2 })).toBe('staff2')
  })
})
