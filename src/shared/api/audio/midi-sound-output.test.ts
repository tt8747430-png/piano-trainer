import { describe, expect, it } from 'vitest'
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
  it('sends a note on at its start and off at its end, on the page’s clock, at its velocity', () => {
    const { output, sent } = speaker()
    const sound = createMidiSoundOutput(output, { pageTimeOf, pageNow: () => 1000 })
    sound.render(note(60, 0.5), 2)
    expect(sent).toEqual(['on 60 90 @3000', 'off 60 @3500'])
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
})
