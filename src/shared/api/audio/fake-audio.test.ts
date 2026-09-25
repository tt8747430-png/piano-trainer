import { describe, expect, it } from 'vitest'
import type { Sound } from '@/shared/lib/schedule'
import { createFakeAudio } from './fake-audio'

const CLICK: Sound = { kind: 'click', at: 0, accent: false }

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
})
