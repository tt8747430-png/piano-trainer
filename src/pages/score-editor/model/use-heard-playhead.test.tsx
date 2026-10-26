import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { createFakeAudio } from '@/shared/api/audio'
import { audibleHands, schedule } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import type { Heard } from './editor-context'
import { useHeardPlayhead } from './use-heard-playhead'

describe('useHeardPlayhead (ADR 0096)', () => {
  it('stands at the onset Play reached, follows its clock between them, and is gone once it stops', () => {
    const audio = createFakeAudio()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    )
    // From bar 2 at 60 a minute: a beat group a second, from tick 96.
    const pass = schedule(TWO_BARS, { tempo: 60, hands: audibleHands('both'), fromTick: 96 })
    const playing: { heard: Heard | null } = { heard: { handle: audio.play(pass.sounds, 1), pass } }
    const { result, rerender } = renderHook(({ heard }) => useHeardPlayhead(heard), {
      wrapper,
      initialProps: playing,
    })
    // Before its first note, where Play starts.
    expect(result.current?.tick).toBe(96)
    act(() => audio.setNow(1 + 1.5))
    expect(result.current?.tick).toBe(120)
    expect(result.current?.clock()).toBe(132)
    rerender({ heard: null })
    expect(result.current).toBeNull()
  })
})
