import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { arrange, parseFigure } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { audibleHands, type NoteSound } from '@/shared/lib/schedule'
import { FULL_MIX, type Mix } from './mix'
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
const WHOLE = { hands: audibleHands('both'), tempo: 60, range: { from: 0, to: 384 }, fromTick: 0 }
const IGNORED = { reach: () => {}, tempo: () => {}, count: () => {} }
const FULL = () => FULL_MIX

describe('startTransport', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('plays the recording with every pass, each from the passage’s first bar', async () => {
    const audio = createFakeAudio()
    const transport = startTransport(
      audio,
      performance,
      { hands: audibleHands('both'), tempo: 60, range: { from: 96, to: 288 }, fromTick: 192 },
      IGNORED,
      { recording: VOCAL, mix: FULL },
    )
    // The first pass from the cursor (bar 3: 8 seconds in), the second from the loop's first bar (bar 2).
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10])
    audio.setNow(4)
    await vi.advanceTimersByTimeAsync(30)
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10, 6])
    expect(audio.recordings.every(({ src, play }) => src === 'vocal.m4a' && play.rate === 1)).toBe(
      true,
    )
    transport.stop()
  })

  it('plays none without a recording', () => {
    const audio = createFakeAudio()
    startTransport(audio, performance, WHOLE, IGNORED, { recording: null, mix: FULL }).stop()
    expect(audio.recordings).toEqual([])
  })

  it('plays each part and the recording as loud as the mix says as they sound (ADR 0105)', () => {
    const audio = createFakeAudio()
    let mix: Mix = { ...FULL_MIX, lh: 0.25, recording: 0.5 }
    const transport = startTransport(audio, performance, WHOLE, IGNORED, {
      recording: VOCAL,
      mix: () => mix,
    })
    const [pass] = audio.played
    const notes = (pass?.sounds ?? []).filter((sound): sound is NoteSound => sound.kind === 'note')
    const gainOf = (part: NoteSound['part']) => {
      const sound = notes.find((each) => each.part === part)
      return sound ? pass?.gain?.(sound) : undefined
    }
    expect([gainOf('rh'), gainOf('lh')]).toEqual([1, 0.25])
    expect(audio.recordings[0]?.volume?.()).toBe(0.5)
    // Turned up as it plays: the sounds still to come and the recording follow it.
    mix = { ...mix, lh: 0.81, recording: 0.09 }
    expect(gainOf('lh')).toBe(0.81)
    expect(audio.recordings[0]?.volume?.()).toBe(0.09)
    transport.stop()
  })

  it('counts its count-in down as it sounds, then nothing once the music starts', async () => {
    const audio = createFakeAudio()
    const counts: (number | null)[] = []
    const transport = startTransport(
      audio,
      performance,
      { ...WHOLE, countIn: true },
      { ...IGNORED, count: (left) => counts.push(left) },
      { recording: null, mix: FULL },
    )
    // Its first beat just after now (0.1 s), a beat a second at 60.
    for (const now of [0.1, 0.5, 1.1, 2.1, 3.1, 4.1]) {
      audio.setNow(now)
      await vi.advanceTimersByTimeAsync(25)
    }
    expect(counts).toEqual([4, 3, 2, 1, null])
    transport.stop()
  })

  it('says the tick its music sounds at a time on the clock, between the beat groups (ADR 0096)', () => {
    const audio = createFakeAudio()
    const transport = startTransport(audio, performance, { ...WHOLE, fromTick: 96 }, IGNORED, {
      recording: null,
      mix: FULL,
    })
    // From bar 2, a beat group of a bar's chord every four seconds at 60.
    expect(transport.tickAt(0)).toBeNull()
    expect(transport.tickAt(0.1 + 2)).toBe(144)
    transport.stop()
  })
})
