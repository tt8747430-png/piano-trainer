import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { chordSounds, type Sound } from '@/shared/lib/schedule'
import { createFakeAudio } from './fake-audio'

const CLICK: Sound = { kind: 'click', at: 0, accent: false }
const C_MAJOR = [60, 64, 67].map(midi)

describe('createFakeAudio', () => {
  it('records unlocks, plays and stops', async () => {
    const audio = createFakeAudio()
    await audio.unlock()
    audio.play([CLICK], 3)
    audio.stop()
    expect(audio.unlocks).toBe(1)
    expect(audio.played).toEqual([{ sounds: [CLICK], at: 3 }])
    expect(audio.stops).toBe(1)
  })

  it('keeps the clock it is given, and plays shortly after it by default', () => {
    const audio = createFakeAudio()
    expect(audio.now()).toBe(0)
    audio.setNow(5)
    expect(audio.now()).toBe(5)
    audio.play([CLICK])
    expect(audio.played[0]?.at).toBeCloseTo(5.1)
  })

  it('hears the page’s now as its own clock’s now: a key struck now falls where the test set it', () => {
    const audio = createFakeAudio()
    audio.setNow(5)
    expect(audio.audioTimeAt(performance.now())).toBeCloseTo(5, 2)
    expect(audio.audioTimeAt(performance.now() - 500)).toBeCloseTo(4.5, 2)
  })

  it('knows which keys sound as the test moves its clock, and forgets them on stop', () => {
    const audio = createFakeAudio()
    const onChange = vi.fn()
    audio.onSounding(onChange)
    audio.play(chordSounds([midi(60), midi(64)], { arpeggio: true }), 0)
    audio.setNow(0.1)
    expect([...audio.sounding()]).toEqual([60])
    audio.setNow(0.3)
    expect([...audio.sounding()]).toEqual([60, 64])
    audio.stop()
    expect(audio.sounding().size).toBe(0)
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('hands back each play, playing until its end or a stop, and the keys struck last', () => {
    const audio = createFakeAudio()
    const play = audio.play(chordSounds(C_MAJOR, { arpeggio: true }), 0)
    audio.setNow(0.3)
    expect([...audio.struck()]).toEqual([64])
    expect(audio.isPlaying(play)).toBe(true)
    audio.stop()
    expect(audio.isPlaying(play)).toBe(false)
  })
})

describe('the fake’s live voice', () => {
  it('records each press, release and pedal', () => {
    const audio = createFakeAudio()
    audio.press(midi(60), 100)
    audio.pedal('sustain', true)
    audio.release(midi(60))
    expect(audio.voice).toEqual([
      { kind: 'press', midi: 60, velocity: 100 },
      { kind: 'pedal', pedal: 'sustain', down: true },
      { kind: 'release', midi: 60 },
    ])
  })

  it('sounds a key let go under the sustain until the sustain comes up, and says so each time', () => {
    const audio = createFakeAudio()
    const onChange = vi.fn()
    audio.onSounding(onChange)
    audio.pedal('sustain', true)
    audio.press(midi(60), 100)
    audio.release(midi(60))
    expect([...audio.live()]).toEqual([60])
    expect(audio.pedals().sustain).toBe(true)
    audio.pedal('sustain', false)
    expect(audio.live().size).toBe(0)
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('leaves a held key sounding through a stop', () => {
    const audio = createFakeAudio()
    audio.press(midi(60), 100)
    audio.stop()
    expect([...audio.live()]).toEqual([60])
  })
})

describe('the fake’s piano', () => {
  it('keeps the speaker the notes are sent to', () => {
    const audio = createFakeAudio()
    const output = { noteOn() {}, noteOff() {}, clear() {} }
    audio.notesTo(output)
    expect(audio.notesOut).toBe(output)
    audio.notesTo(null)
    expect(audio.notesOut).toBeNull()
  })
})

describe('the fake’s recordings', () => {
  it('records what it loads and each play of a recording', () => {
    const audio = createFakeAudio()
    audio.loadRecording('vocal.m4a')
    audio.playRecording('vocal.m4a', { at: 1, offset: 2, rate: 1, until: 9 })
    expect(audio.loadedRecordings).toEqual(['vocal.m4a'])
    expect(audio.recordings).toEqual([
      { src: 'vocal.m4a', play: { at: 1, offset: 2, rate: 1, until: 9 } },
    ])
  })
})
