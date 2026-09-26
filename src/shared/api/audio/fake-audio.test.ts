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
