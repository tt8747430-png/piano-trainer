import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeArranger, createFakeMidi } from '@/shared/api/midi'
import { lineSheet, sectionControl, SECTION } from '@/shared/lib/arrangement'
import { C_MAJOR, parseChordSymbol } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useArrangerFollow } from './use-arranger-follow'

const sheet = lineSheet(['C', 'G', 'Am', 'F'].map(parseChordSymbol), C_MAJOR, '4/4')

function follow() {
  const arranger = createFakeArranger()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio: createFakeAudio(), arranger, midi: createFakeMidi() }}>
      {children}
    </ServicesProvider>
  )
  const view = renderHook(() => useArrangerFollow(sheet, true, 120), { wrapper })
  return { arranger, view }
}

afterEach(() => vi.useRealTimers())

describe('useArrangerFollow', () => {
  it('starts the Genos on the app’s clock: its panel set, MIDI Start, then 24 clocks a beat', async () => {
    const { arranger, view } = follow()
    await waitFor(() => expect(view.result.current.status?.state).toBe('connected'))
    vi.useFakeTimers()
    act(() => view.result.current.start(0, 120, [SECTION.main.B], () => undefined))
    const sent = arranger.sent.map((bytes) => bytes.join(' '))
    const start = sent.indexOf('250')
    expect(sent.slice(0, start)).toContain(sectionControl(SECTION.main.B).join(' '))
    act(() => vi.advanceTimersByTime(500))
    // At 120 a beat is 500 ms: a beat's clocks, and the look-ahead's few more.
    expect(sent.length).toBeLessThan(arranger.sent.length)
    const clocks = arranger.sent.filter((bytes) => bytes[0] === 0xf8)
    expect(clocks.length).toBeGreaterThanOrEqual(24)
    const gaps = arranger.times
      .filter((_, i) => arranger.sent[i]?.[0] === 0xf8)
      .map((at, i, all) => (at ?? 0) - (all[i - 1] ?? at ?? 0))
      .slice(1)
    for (const gap of gaps) expect(gap).toBeCloseTo(500 / 24, 5)
    act(() => view.result.current.stop())
    expect(arranger.sent.at(-1)).toEqual([0xfc])
  })

  it('never sends a chord or a note', async () => {
    const { arranger, view } = follow()
    await waitFor(() => expect(view.result.current.status?.state).toBe('connected'))
    vi.useFakeTimers()
    act(() => view.result.current.start(0, 120, [], () => undefined))
    act(() => view.result.current.bar(3, 0))
    act(() => vi.advanceTimersByTime(2000))
    act(() => view.result.current.stop())
    const kinds = new Set(arranger.sent.map((bytes) => bytes[0]))
    for (const kind of kinds) expect([0xf0, 0xf8, 0xfa, 0xfc]).toContain(kind)
    // Section Control alone among the system exclusives: never Chord Control (F0 43 7E 02 …).
    for (const bytes of arranger.sent.filter((each) => each[0] === 0xf0)) expect(bytes[3]).toBe(0)
  })

  it('asks for MIDI again from Try again', async () => {
    const { arranger, view } = follow()
    await waitFor(() => expect(view.result.current.status?.state).toBe('connected'))
    act(() => arranger.disconnect())
    act(() => view.result.current.reconnect())
    await waitFor(() => expect(arranger.current()?.state).toBe('connected'))
  })
})
