import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { pieceById } from '@/entities/piece'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { PlayerSearch } from './player-search'
import { usePlayer } from './use-player'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

function setup(search: PlayerSearch) {
  const storage = createMemoryStorage()
  const settings = createSettingsStore({ storage, languages: ['en'] })
  const progress = createProgressStore({ storage })
  const audio = createFakeAudio()
  const setSearch = vi.fn()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SettingsStoreProvider store={settings}>
      <ProgressStoreProvider store={progress}>
        <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
      </ProgressStoreProvider>
    </SettingsStoreProvider>
  )
  const hook = renderHook(() => usePlayer(bz5, search, setSearch), { wrapper })
  return { ...hook, progress, audio, setSearch }
}

describe('usePlayer', () => {
  it('records the piece as practised when it opens', () => {
    const { progress } = setup({ hands: 'both', mode: 'listen' })
    expect(progress.getState().practised.bz5).toBeDefined()
  })

  it('arranges the piece in the key the URL names', () => {
    const { result } = setup({ hands: 'both', mode: 'listen', key: 'A' })
    expect(result.current.performance.chords[0]?.symbol).toBe('A')
  })

  it('writes a Setup change to the URL, leaving out the piece’s own choice', () => {
    const { result, setSearch } = setup({ hands: 'both', mode: 'listen', key: 'A' })
    act(() => result.current.change({ key: 'G' }))
    expect(setSearch).toHaveBeenLastCalledWith({ key: undefined })
    act(() => result.current.setMode('step'))
    expect(setSearch).toHaveBeenLastCalledWith({ mode: 'step' })
  })

  it('sounds a tapped key outside Your turn', () => {
    const { result, audio } = setup({ hands: 'both', mode: 'step' })
    act(() => result.current.tapKey(midi(60)))
    expect(audio.played).toHaveLength(1)
  })
})
