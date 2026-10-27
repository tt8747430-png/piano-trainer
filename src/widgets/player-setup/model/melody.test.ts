import { describe, expect, it } from 'vitest'
import { melodyOf } from './melody'

const SONG = { staff: true, recording: false, inOwnKey: true, leadSheet: false } as const

describe('melodyOf (ADR 0115)', () => {
  it('plays the staff chosen, and nothing else', () => {
    expect(melodyOf('staff', SONG)).toEqual({
      shown: 'staff',
      tune: true,
      recording: false,
      greyed: { recording: 'noRecording' },
    })
  })

  it('shows None where the source saved is one the song has not, and plays nothing', () => {
    expect(melodyOf('recording', SONG)).toMatchObject({
      shown: 'none',
      tune: false,
      recording: false,
    })
    expect(melodyOf('staff', { ...SONG, staff: false, recording: true })).toMatchObject({
      shown: 'none',
      greyed: { staff: 'noStaff' },
    })
  })

  it('plays the recording in the song’s own key alone, greyed in another saying so', () => {
    const recorded = { ...SONG, staff: false, recording: true }
    expect(melodyOf('recording', recorded)).toMatchObject({ shown: 'recording', recording: true })
    expect(melodyOf('recording', { ...recorded, inOwnKey: false })).toEqual({
      shown: 'none',
      tune: false,
      recording: false,
      greyed: { staff: 'noStaff', recording: 'ownKey' },
    })
  })

  it('always plays a lead sheet’s melody: its staff is all its sheet shows', () => {
    expect(melodyOf('none', { ...SONG, leadSheet: true })).toEqual({
      shown: 'staff',
      tune: true,
      recording: false,
      greyed: { none: 'leadSheet', recording: 'noRecording' },
    })
  })
})
