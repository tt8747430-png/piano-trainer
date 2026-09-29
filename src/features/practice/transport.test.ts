import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { arrange, parseFigure } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { audibleHands } from '@/shared/lib/schedule'
import { startTransport } from './transport'

const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const performance = arrange(
  {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: [
      {
        lines: [
          ['C', 'F', 'G', 'C'].map((symbol) => ({
            chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
            beats: 4,
          })),
        ],
      },
    ],
  },
  { tonic: note('C'), pattern: BLOCK },
)
const VOCAL = { src: 'vocal.m4a', start: 2, tempo: 60 }

describe('startTransport', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('plays the recording with every pass, each from the passage’s first bar', async () => {
    const audio = createFakeAudio()
    const stop = startTransport(
      audio,
      performance,
      { hands: audibleHands('both'), tempo: 60, range: { from: 48, to: 144 }, fromTick: 96 },
      { reach: () => {}, tempo: () => {} },
      VOCAL,
    )
    // The first pass from the cursor (bar 3: 8 seconds in), the second from the loop's first bar (bar 2).
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10])
    audio.setNow(4)
    await vi.advanceTimersByTimeAsync(30)
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10, 6])
    expect(audio.recordings.every(({ src, play }) => src === 'vocal.m4a' && play.rate === 1)).toBe(
      true,
    )
    stop()
  })

  it('plays none without a recording', () => {
    const audio = createFakeAudio()
    startTransport(
      audio,
      performance,
      { hands: audibleHands('both'), tempo: 60, range: { from: 0, to: 192 }, fromTick: 0 },
      { reach: () => {}, tempo: () => {} },
      null,
    )()
    expect(audio.recordings).toEqual([])
  })
})
