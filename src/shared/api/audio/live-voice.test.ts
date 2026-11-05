import { describe, expect, it } from 'vitest'
import { midi, type Midi } from '@/shared/lib/music'
import { velocityGain, type Damper } from '@/shared/lib/schedule'
import { createLiveVoice } from './live-voice'

const C = midi(60)

/** A live voice over a render that writes down what it is asked. */
function setUp() {
  const heard: string[] = []
  const changes: Damper[] = []
  const voice = createLiveVoice({
    strike: (key: Midi, gain: number, soft: boolean) =>
      heard.push(`strike ${key} ${gain}${soft ? ' soft' : ''}`),
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

  it('lets go of a key held from two places only when both let go', () => {
    const { voice, heard } = setUp()
    voice.press(C, 100)
    voice.press(C, 100)
    voice.release(C)
    expect(heard.at(-1)).toBe(`strike 60 ${velocityGain(100)}`)
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

  it('keeps a pedal two sources hold down until both let it up', () => {
    const { voice, heard } = setUp()
    voice.pedal('sustain', true)
    voice.pedal('sustain', true)
    voice.press(C, 100)
    voice.release(C)
    voice.pedal('sustain', false)
    expect(voice.pedals().sustain).toBe(true)
    expect(heard).toHaveLength(1)
    voice.pedal('sustain', false)
    expect(voice.pedals().sustain).toBe(false)
    expect(heard.at(-1)).toBe('silence 60')
  })

  it('lets a pedal up no further than up', () => {
    const { voice } = setUp()
    voice.pedal('sustain', false)
    voice.pedal('sustain', true)
    expect(voice.pedals().sustain).toBe(true)
  })

  it('silences a key still sounding before it strikes it again', () => {
    const { voice, heard } = setUp()
    voice.pedal('sustain', true)
    voice.press(C, 100)
    voice.release(C)
    voice.press(C, 64)
    expect(heard.slice(1)).toEqual(['silence 60', `strike 60 ${velocityGain(64)}`])
  })

  it('strikes a key under the soft pedal as soft, and the next one plain once it lifts', () => {
    const { voice, heard } = setUp()
    voice.pedal('soft', true)
    voice.press(C, 127)
    voice.release(C)
    voice.pedal('soft', false)
    voice.press(C, 127)
    expect(heard).toEqual([
      `strike 60 ${velocityGain(127)} soft`,
      'silence 60',
      `strike 60 ${velocityGain(127)}`,
    ])
  })

  it('lets every key the sustain held go together as it lifts, once each', () => {
    const { voice, heard } = setUp()
    const E = midi(64)
    voice.pedal('sustain', true)
    voice.press(C, 100)
    voice.press(E, 100)
    voice.release(C)
    voice.release(E)
    voice.pedal('sustain', false)
    expect(heard.slice(2)).toEqual(['silence 60', 'silence 64'])
    voice.pedal('sustain', false)
    expect(heard).toHaveLength(4)
  })

  it('keeps a key the sostenuto caught ringing after the sustain lifts', () => {
    const { voice, heard } = setUp()
    voice.press(C, 100)
    voice.pedal('sostenuto', true)
    voice.pedal('sustain', true)
    voice.release(C)
    voice.pedal('sustain', false)
    expect(heard).toHaveLength(1)
    voice.pedal('sostenuto', false)
    expect(heard.at(-1)).toBe('silence 60')
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
