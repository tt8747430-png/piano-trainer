import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { createFakeAudio, type FakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import type { NoteSound, Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { ONE_BAR, TWO_BARS } from './testing/performances'
import { usePractice, type PracticeSetup } from './use-practice'

const LISTEN: PracticeSetup = {
  mode: 'listen',
  hands: 'both',
  tempo: 60,
  metronome: false,
  countIn: false,
}

let audio: FakeAudio
let keyboard: FakeMidi

function renderPractice(performance: Performance, setup: Partial<PracticeSetup> = {}) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: keyboard }}>{children}</ServicesProvider>
  )
  return renderHook(
    (props: { performance: Performance; setup: PracticeSetup }) =>
      usePractice(props.performance, props.setup),
    { wrapper, initialProps: { performance, setup: { ...LISTEN, ...setup } } },
  )
}

/** Moves the audio clock and lets the transport's timer see it. */
const clockTo = (seconds: number) =>
  act(() => {
    audio.setNow(seconds)
    vi.advanceTimersByTime(25)
  })
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

const notesOf = (sounds: readonly Sound[]) =>
  sounds.filter((sound): sound is NoteSound => sound.kind === 'note')
const keysOf = (sounds: readonly Sound[]) => notesOf(sounds).map((sound) => sound.midi)

beforeEach(() => {
  vi.useFakeTimers()
  audio = createFakeAudio()
  keyboard = createFakeMidi()
})
afterEach(() => vi.useRealTimers())

describe('usePractice: Listen', () => {
  it('plays a pass of the piece', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    expect(result.current.state.playing).toBe(true)
    expect(audio.played).toHaveLength(1)
    expect(audio.played[0]?.at).toBeCloseTo(0.1)
    expect(notesOf(audio.played[0]?.sounds ?? [])).toHaveLength(ONE_BAR.notes.length)
  })

  it('follows the music', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 2)
    expect(result.current.state.beatGroup).toBe(2)
  })

  it('loops, queueing the next pass half a second before the end', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 3.4)
    expect(audio.played).toHaveLength(1)
    clockTo(0.1 + 3.5)
    expect(audio.played).toHaveLength(2)
    expect(audio.played[1]?.at).toBeCloseTo(4.1)
    clockTo(4.1 + 1)
    expect(result.current.state.beatGroup).toBe(1)
  })

  it('counts in with a bar of clicks, and clicks every beat with the metronome', () => {
    const counted = renderPractice(ONE_BAR, { countIn: true })
    act(() => counted.result.current.play())
    expect(audio.played[0]?.sounds.slice(0, 4).map((sound) => sound.kind)).toEqual([
      'click',
      'click',
      'click',
      'click',
    ])
    counted.unmount()
    audio = createFakeAudio()
    const clicked = renderPractice(ONE_BAR, { metronome: true })
    act(() => clicked.result.current.play())
    expect(audio.played[0]?.sounds.filter((sound) => sound.kind === 'click')).toHaveLength(4)
  })

  it('stops the sound and stops following', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    act(() => result.current.stop())
    expect(audio.stops).toBe(1)
    expect(result.current.state.playing).toBe(false)
    clockTo(0.1 + 2)
    expect(result.current.state.beatGroup).toBe(0)
  })

  it('starts a new pass from where the learner jumps while playing', () => {
    const { result } = renderPractice(TWO_BARS)
    act(() => result.current.play())
    act(() => result.current.jumpToBar(1))
    expect(result.current.state.beatGroup).toBe(4)
    expect(audio.played).toHaveLength(2)
    const second = notesOf(audio.played[1]?.sounds ?? [])
    expect(second[0]?.at).toBe(0)
    expect(new Set(second.map((sound) => sound.midi % 12))).toEqual(new Set([7, 11, 2]))
  })

  it('starts over from the current beat group when the tempo changes while playing', () => {
    const { result, rerender } = renderPractice(ONE_BAR)
    act(() => result.current.play())
    clockTo(0.1 + 2)
    rerender({ performance: ONE_BAR, setup: { ...LISTEN, tempo: 120 } })
    expect(audio.played).toHaveLength(2)
    expect(notesOf(audio.played[1]?.sounds ?? [])).toHaveLength(
      ONE_BAR.notes.filter((n) => n.startTick >= 24).length,
    )
  })

  it('sounds the beat group moved to while stopped', () => {
    const { result } = renderPractice(ONE_BAR)
    act(() => result.current.next())
    expect(result.current.state.beatGroup).toBe(1)
    expect(keysOf(audio.played[0]?.sounds ?? [])).toEqual([60, 64, 67])
  })
})

describe('usePractice: Step', () => {
  it('sounds every beat group moved to, in the audible hands', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'step', hands: 'lh' })
    act(() => result.current.nextBar())
    act(() => result.current.jumpToBeatGroup(2))
    expect(audio.played.map((play) => keysOf(play.sounds))).toEqual([
      [36, 48],
      [31, 43],
    ])
  })
})

describe('usePractice: Wait mode', () => {
  it('waits for the practised hand, then plays the other and moves on', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    expect(result.current.state.expected).toEqual([0, 4, 7])
    act(() => result.current.press(midi(60)))
    act(() => keyboard.press(midi(76)))
    expect(audio.played).toHaveLength(0)
    act(() => keyboard.press(midi(55)))
    expect(result.current.state.outcome).toBe('correct')
    expect(keysOf(audio.played[0]?.sounds ?? [])).toEqual([36, 48])
    wait(149)
    expect(result.current.state.beatGroup).toBe(0)
    wait(1)
    expect(result.current.state.beatGroup).toBe(1)
  })

  it('plays through a beat group the practised hand has nothing in', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'lh' })
    act(() => result.current.press(midi(48)))
    wait(150)
    expect(result.current.state).toMatchObject({ beatGroup: 1, expected: [] })
    expect(keysOf(audio.played[1]?.sounds ?? [])).toEqual([60, 64, 67])
    wait(999)
    expect(result.current.state.beatGroup).toBe(1)
    wait(1)
    expect(result.current.state).toMatchObject({ beatGroup: 2, expected: [7] })
  })

  it('shows a wrong key and waits', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.press(midi(61)))
    wait(1000)
    expect(result.current.state).toMatchObject({ outcome: 'wrong', wrong: 61, beatGroup: 0 })
    expect(audio.played).toHaveLength(0)
  })

  it('plays nothing more once the piece is finished', () => {
    const { result } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'lh' })
    act(() => result.current.jumpToBeatGroup(3))
    wait(1000)
    expect(result.current.state.outcome).toBe('finished')
    const played = audio.played.length
    wait(5000)
    expect(audio.played).toHaveLength(played)
  })
})

describe('usePractice: unmount', () => {
  it('silences the sound and stops listening to the keyboard', () => {
    const { result, unmount } = renderPractice(ONE_BAR, { mode: 'wait', hands: 'rh' })
    act(() => result.current.press(midi(61)))
    unmount()
    expect(audio.stops).toBe(1)
    expect(() => keyboard.press(midi(60))).not.toThrow()
    expect(result.current.state.outcome).toBe('wrong')
  })
})
