import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio, type FakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { FULL_MIX } from './mix'
import { usePractice, type PracticeSetup } from './use-practice'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const CHART: Chart = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [{ lines: [[bar('C'), bar('G')]] }],
}
/** A whole-note chord a bar: each bar one beat group. */
const pattern = (lh: string) =>
  ({
    id: 'whole',
    rh: { kind: 'events', events: parseFigure('0/16 C') },
    lh: { kind: 'events', events: lh === '' ? [] : parseFigure(lh) },
  }) as const
const perform = (lh: string): Performance =>
  arrange(CHART, { tonic: note('C'), pattern: pattern(lh) })

/** Wait mode round a loop of the first bar alone. */
const SETUP: PracticeSetup = {
  mode: 'wait',
  hands: 'rh',
  tempo: 60,
  ownTempo: 60,
  speedTraining: false,
  swing: 'straight',
  loop: { first: 0, last: 0 },
  metronome: false,
  countIn: false,
  rest: 0,
  recording: null,
  mix: FULL_MIX,
}

let audio: FakeAudio
beforeEach(() => {
  vi.useFakeTimers()
  audio = createFakeAudio()
})
afterEach(() => vi.useRealTimers())

function practise(performance: Performance, setup: PracticeSetup) {
  const services = { audio, midi: createFakeMidi() }
  return renderHook(() => usePractice(performance, setup), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={services}>{children}</ServicesProvider>
    ),
  })
}

describe('Wait mode round a loop of one beat group', () => {
  it('goes on round it when the keys come again before it moved on', () => {
    const performance = perform('0/16 L1')
    const { result } = practise(performance, SETUP)
    act(() => result.current.play())
    const keys = (performance.beatGroups[0]?.notes ?? [])
      .map((i) => performance.notes[i])
      .filter((n) => n?.hand === 'rh')
      .map((n) => n?.midi)
      .filter((key) => key !== undefined)
    act(() => keys.forEach((key) => result.current.press(key)))
    expect(audio.played).toHaveLength(1)
    // Played again before it moved on: they answer the same beat group the second time round.
    act(() => keys.forEach((key) => result.current.press(key)))
    act(() => void vi.advanceTimersByTime(200))
    expect(audio.played).toHaveLength(2)
    act(() => void vi.advanceTimersByTime(200))
    expect(result.current.state.outcome).toBe('waiting')
  })

  it('plays the other hand round it, bar after bar, where the practised hand rests', () => {
    const { result } = practise(perform(''), { ...SETUP, hands: 'lh' })
    act(() => result.current.play())
    // Each time round is a whole note, four seconds at 60: three in twelve seconds.
    for (let step = 0; step < 24; step++) {
      act(() => {
        audio.setNow(step * 0.5)
        vi.advanceTimersByTime(500)
      })
    }
    expect(audio.played).toHaveLength(3)
  })
})
