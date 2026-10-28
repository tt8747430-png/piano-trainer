import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { logClock, logKeyName, pedalDown } from './log-words'

describe('the MIDI log’s words', () => {
  it('names a key by its letter, a sharp where it has one, and its octave', () => {
    expect(logKeyName(midi(60))).toBe('C4')
    expect(logKeyName(midi(61))).toBe('C♯4')
    expect(logKeyName(midi(21))).toBe('A0')
  })

  it('times a message to the millisecond', () => {
    expect(logClock(new Date(2026, 9, 28, 9, 5, 7, 42).getTime())).toBe('09:05:07.042')
  })

  it('reads a pedal down from the middle of its travel, up below it', () => {
    expect(pedalDown(64)).toBe(true)
    expect(pedalDown(63)).toBe(false)
  })
})
