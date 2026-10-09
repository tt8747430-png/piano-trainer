import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { ServicesProvider } from './ServicesProvider'
import { usePedal } from './use-pedal'

describe('usePedal', () => {
  it('follows a pedal of the port, the sustain by default', () => {
    const audio = createFakeAudio()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    )
    const { result } = renderHook(() => [usePedal(), usePedal('soft')], { wrapper })
    expect(result.current).toEqual([false, false])
    act(() => audio.pedal('sustain', true))
    expect(result.current).toEqual([true, false])
    act(() => audio.pedal('soft', true))
    act(() => audio.pedal('sustain', false))
    expect(result.current).toEqual([false, true])
  })
})
