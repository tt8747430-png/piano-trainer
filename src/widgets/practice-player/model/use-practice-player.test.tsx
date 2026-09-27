import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { createMemoryStorage } from '@/shared/lib'
import { ServicesProvider } from '@/shared/lib/services'
import type { PracticeView } from './practice-view'
import { usePracticePlayer } from './use-practice-player'

const VIEW: PracticeView = { mode: 'listen', speedTraining: false, hands: 'both', swing: false }

function renderPlayer(view: Partial<PracticeView> = {}) {
  const setView = vi.fn()
  const settingsStore = createSettingsStore({
    storage: createMemoryStorage(),
    languages: ['en'],
    finePointer: false,
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsStoreProvider store={settingsStore}>
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
        {children}
      </ServicesProvider>
    </SettingsStoreProvider>
  )
  const hook = renderHook(() => usePracticePlayer(TWO_BARS, { ...VIEW, ...view }, setView, 72), {
    wrapper,
  })
  return { ...hook, setView }
}

describe('usePracticePlayer', () => {
  it('writes the piece’s own tempo as absent', () => {
    const { result, setView } = renderPlayer()
    act(() => result.current.setTempo(72))
    expect(setView).toHaveBeenLastCalledWith({ tempo: undefined })
    act(() => result.current.setTempo(36))
    expect(setView).toHaveBeenLastCalledWith({ tempo: 36 })
  })

  it('writes Listen and a tempo in one change', () => {
    const { result, setView } = renderPlayer({ mode: 'wait' })
    act(() => result.current.listenAt(36))
    expect(setView).toHaveBeenLastCalledWith({ mode: 'listen', tempo: 36 })
    expect(setView).toHaveBeenCalledTimes(1)
  })

  it('loops the bar the cursor is in, and removes the loop', () => {
    const { result, setView } = renderPlayer()
    act(() => result.current.practice.jumpToBeatGroup(5))
    act(() => result.current.toggleLoop())
    expect(setView).toHaveBeenLastCalledWith({ loop: '2-2' })
    const looped = renderPlayer({ loop: '2-2' })
    expect(looped.result.current.loop).toEqual({ first: 1, last: 1 })
    act(() => looped.result.current.toggleLoop())
    expect(looped.setView).toHaveBeenLastCalledWith({ loop: undefined })
  })

  it('reads a loop past the piece’s end as none', () => {
    expect(renderPlayer({ loop: '40-44' }).result.current.loop).toBeNull()
  })

  it('mutes the staff of the hand not played', () => {
    expect(renderPlayer({ hands: 'rh' }).result.current.muted).toBe('bass')
    expect(renderPlayer({ hands: 'lh' }).result.current.muted).toBe('treble')
    expect(renderPlayer().result.current.muted).toBeUndefined()
  })
})
