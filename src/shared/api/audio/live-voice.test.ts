import { describe, expect, it } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { SOFT_GAIN, velocityGain, type Damper } from '@/shared/lib/schedule'
import { createLiveVoice } from './live-voice'

const C = midi(60)

/** A live voice over a render that writes down what it is asked. */
function setUp() {
  const heard: string[] = []
  const changes: Damper[] = []
  const voice = createLiveVoice({
    strike: (key: Midi, gain: number) => heard.push(`strike ${key} ${gain}`),
    silence: (key: Midi) => heard.push(`silence ${key}`),
    changed: (damper) => changes.push(damper),
  })
  return { voice, heard, changes }
}

describe('createLiveVoice', () => {
  it('strikes a key as loud as its velocity', () => {
    const { voice, heard } = setUp()
    voice.press(C, 100)
    expect(heard).toEqual([`strike 60 ${velocityGain(100)}`])
  })

  it('silences a key let go', () => {
    const { voice, heard } = setUp()
    voice.press(C, 100)
    voice.release(C)
    expect(heard.at(-1)).toBe('silence 60')
  })

  it('keeps a key let go under the sustain sounding until the sustain comes up', () => {
    const { voice, heard } = setUp()
    voice.pedal('sustain', true)
    voice.press(C, 100)
    voice.release(C)
    expect(heard).toHaveLength(1)
    voice.pedal('sustain', false)
    expect(heard.at(-1)).toBe('silence 60')
  })

  it('silences a key still sounding before it strikes it again', () => {
    const { voice, heard } = setUp()
    voice.pedal('sustain', true)
    voice.press(C, 100)
    voice.release(C)
    voice.press(C, 64)
    expect(heard.slice(1)).toEqual(['silence 60', `strike 60 ${velocityGain(64)}`])
  })

  it('strikes a key under the soft pedal at two thirds of its gain', () => {
    const { voice, heard } = setUp()
    voice.pedal('soft', true)
    voice.press(C, 127)
    expect(heard).toEqual([`strike 60 ${velocityGain(127) * SOFT_GAIN}`])
  })

  it('says what sounds after every change, and keeps the pedals until one changes', () => {
    const { voice, changes } = setUp()
    const before = voice.pedals()
    voice.press(C, 100)
    expect(voice.pedals()).toBe(before)
    voice.pedal('sustain', true)
    expect(voice.pedals()).toEqual({ sustain: true, soft: false, sostenuto: false })
    expect(changes.map((damper) => [...damper.sounding])).toEqual([[C], [C]])
  })
})
