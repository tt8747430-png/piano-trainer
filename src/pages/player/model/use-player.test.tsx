import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { pieceById } from '@/entities/piece'
import { createSettingsStore, SettingsStoreProvider } from '@/entities/settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { note, noteParam } from '@/shared/lib/music'
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
    const { result } = setup({ hands: 'both', mode: 'listen', key: noteParam(note('A')) })
    expect(result.current.performance.chords[0]?.symbol).toBe('A')
  })

  it('writes a Setup change to the URL, leaving out the piece’s own choice', () => {
    const { result, setSearch } = setup({
      hands: 'both',
      mode: 'listen',
      key: noteParam(note('A')),
    })
    act(() => result.current.change({ key: noteParam(note('G')) }))
    expect(setSearch).toHaveBeenLastCalledWith({ key: undefined })
    act(() => result.current.setMode('step'))
    expect(setSearch).toHaveBeenLastCalledWith({ mode: 'step' })
  })

  it('marks the hands the learner hears', () => {
    const { result } = setup({ hands: 'lh', mode: 'listen' })
    const tones = [...result.current.marks.values()].map((mark) => mark.tone)
    expect(tones.length).toBeGreaterThan(0)
    expect(tones.every((tone) => tone === 'lh')).toBe(true)
  })

  it('keeps the marked keys in view', () => {
    const { result } = setup({ hands: 'both', mode: 'step' })
    const keys = [...result.current.marks.keys()]
    expect(result.current.inView).toEqual({ from: Math.min(...keys), to: Math.max(...keys) })
  })

  it('takes a tapped key as an answer in Wait mode, and leaves the sound to the keyboard', () => {
    const { result, audio } = setup({ hands: 'both', mode: 'wait' })
    const [key] = result.current.marks.keys()
    if (key === undefined) throw new Error('nothing to play')
    act(() => result.current.tapKey(key))
    expect(result.current.practice.state.received).toContain(key % 12)
    expect(audio.played.flatMap((play) => play.sounds)).toEqual([])
  })

  it('stops Hear these notes on a second hear, and says while they play', () => {
    const { result, audio } = setup({ hands: 'both', mode: 'wait' })
    act(() => result.current.hear())
    expect(result.current.hearing).toBe(true)
    const stops = audio.stops
    act(() => result.current.hear())
    expect(audio.stops).toBe(stops + 1)
    expect(result.current.hearing).toBe(false)
  })
})
