import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { velocityGain, type NoteSound } from '@/shared/lib/schedule'
import { createMidiSoundOutput } from './midi-sound-output'
import type { NoteOutput } from './types'

/** A keyboard's speaker that writes down what it is sent. */
function speaker() {
  const sent: string[] = []
  const output: NoteOutput = {
    noteOn: (key, velocity, at) => sent.push(`on ${key} ${velocity} @${at}`),
    noteOff: (key, at) => sent.push(`off ${key} @${at}`),
    clear: () => sent.push('clear'),
    sustain: (down, at) => sent.push(`pedal ${down ? 'down' : 'up'} @${at}`),
  }
  return { output, sent }
}

const note = (key: number, duration: number): NoteSound => ({
  kind: 'note',
  midi: midi(key),
  at: 0,
  duration,
  velocity: velocityGain(90),
})

/** The audio clock's second 0 is the page's 1000 ms. */
const pageTimeOf = (audioTime: number) => 1000 + audioTime * 1000

describe('createMidiSoundOutput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('sends a note on at its start and its off shortly before its end, on the page’s clock', () => {
    const { output, sent } = speaker()
    let now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render(note(60, 0.5), 2)
    expect(sent).toEqual(['on 60 90 @3000'])
    now = 3420
    vi.advanceTimersByTime(25)
    expect(sent).toEqual(['on 60 90 @3000', 'off 60 @3500'])
  })

  it('ends a note on its key just before the same key is struck again, never cutting the new one', () => {
    const { output, sent } = speaker()
    let now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render(note(60, 0.15), 0)
    sound.render({ ...note(60, 0.15), velocity: velocityGain(90) }, 0.125)
    now = 1300
    vi.advanceTimersByTime(25)
    expect(sent).toEqual(['on 60 90 @1000', 'off 60 @1124', 'on 60 90 @1125', 'off 60 @1275'])
  })

  it('on Stop drops what is queued and lets go now of a key still sounding, and after one still to start', () => {
    const { output, sent } = speaker()
    let now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render(note(60, 2), 0)
    sound.render(note(64, 1), 0.2)
    sound.render(note(67, 0.1), 0)
    now = 1150
    sent.length = 0
    sound.stop()
    expect(sent).toEqual(['clear', 'off 60 @1150', 'off 64 @1150', 'off 64 @1201'])
  })
  it('sends the pedal as the pedal (control 64) at each pedal sound, a note’s off at its written end', () => {
    const { output, sent } = speaker()
    let now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render({ kind: 'pedal', at: 0, down: true }, 0)
    sound.render({ ...note(60, 2), held: 0.5 }, 0)
    sound.render({ kind: 'pedal', at: 2, down: false }, 2)
    now = 3500
    vi.advanceTimersByTime(25)
    expect(sent).toEqual(['pedal down @1000', 'on 60 90 @1000', 'pedal up @3000', 'off 60 @1500'])
  })

  it('lets the pedal up on Stop where it was sent down', () => {
    const { output, sent } = speaker()
    const now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render({ kind: 'pedal', at: 0, down: true }, 0)
    sent.length = 0
    sound.stop()
    expect(sent).toEqual(['clear', 'pedal up @1000'])
  })

  it('lets go again on Stop of a key whose off is only queued, though it forgets keys that have ended', () => {
    const { output, sent } = speaker()
    let now = 1000
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => now })
    sound.render(note(60, 0.1), 0)
    sound.render(note(64, 0.5), 0)
    now = 1420
    vi.advanceTimersByTime(25)
    expect(sent.at(-1)).toBe('off 64 @1500')
    sent.length = 0
    sound.stop()
    expect(sent).toEqual(['clear', 'off 64 @1420'])
  })
})
