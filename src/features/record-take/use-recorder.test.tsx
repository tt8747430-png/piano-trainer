import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { RecorderPlan } from './model/recorder'
import { useRecorder } from './use-recorder'

const PLAN: RecorderPlan = {
  bars: [{ startTick: 0, beats: 4 }],
  meter: '4/4',
  from: 0,
  tempo: 120,
  click: true,
  room: 100,
  tune: [],
}

function renderRecorder({ webMidi = true }: { webMidi?: boolean } = {}) {
  const audio = createFakeAudio()
  const keyboard = createFakeMidi()
  const onTake = vi.fn()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: webMidi ? keyboard : null }}>
      {children}
    </ServicesProvider>
  )
  const view = renderHook(() => useRecorder(onTake), { wrapper })
  return { audio, keyboard, onTake, ...view }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useRecorder', () => {
  it('counts in, records, and hands on the take at Stop with what it was recorded to', () => {
    // The stage is the screen's; where the take is, beat by beat, only the part that shows it reads.
    const { audio, keyboard, onTake, result } = renderRecorder()
    expect(result.current.stage).toBe('idle')
    act(() => result.current.start(PLAN))
    expect(result.current.stage).toBe('counting')
    expect(result.current.progress.current()).toEqual({ stage: 'counting', beat: 1 })
    act(() => {
      audio.setNow(2.2)
      vi.advanceTimersByTime(25)
    })
    expect(result.current.stage).toBe('recording')
    expect(result.current.progress.current()).toEqual({ stage: 'recording', bar: 0, seconds: 0 })
    act(() => keyboard.press(midi(60)))
    act(() => {
      audio.setNow(2.6)
      result.current.stop()
    })
    expect(result.current.stage).toBe('idle')
    expect(result.current.progress.current()).toBeNull()
    expect(onTake).toHaveBeenCalledOnce()
    expect(onTake.mock.calls[0]?.[0].notes).toEqual([
      { midi: 60, at: 100, held: 400, velocity: 100 },
    ])
    expect(onTake.mock.calls[0]?.[1]).toBe(PLAN)
    expect(onTake.mock.calls[0]?.[2]).toBe('stopped')
  })

  it('hands on nothing for a take stopped in its count-in', () => {
    const { onTake, result } = renderRecorder()
    act(() => result.current.start(PLAN))
    act(() => result.current.stop())
    expect(result.current.stage).toBe('idle')
    expect(onTake).not.toHaveBeenCalled()
  })

  it('keeps the take when the screen goes mid-take', () => {
    const { audio, keyboard, onTake, result, unmount } = renderRecorder()
    act(() => result.current.start(PLAN))
    act(() => {
      audio.setNow(2.5)
      keyboard.press(midi(62))
    })
    unmount()
    expect(onTake).toHaveBeenCalledOnce()
    // The screen is gone: the take is only kept.
    expect(onTake.mock.calls[0]?.[2]).toBe('left')
  })

  it('stops and keeps the take when the app is hidden (a tab closed, the app swiped away)', () => {
    const { audio, keyboard, onTake, result } = renderRecorder()
    act(() => result.current.start(PLAN))
    act(() => {
      audio.setNow(2.5)
      keyboard.press(midi(62))
    })
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    visibility.mockRestore()
    expect(result.current.stage).toBe('idle')
    expect(onTake).toHaveBeenCalledOnce()
    expect(onTake.mock.calls[0]?.[2]).toBe('stopped')
  })

  it('records nothing without a MIDI keyboard', () => {
    const { audio, result } = renderRecorder({ webMidi: false })
    act(() => result.current.start(PLAN))
    expect(result.current.stage).toBe('idle')
    expect(audio.played).toEqual([])
  })
})
