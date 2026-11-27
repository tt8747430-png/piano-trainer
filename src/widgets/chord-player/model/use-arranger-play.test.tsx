import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { DEFAULT_SHEET_SETTINGS } from '@/entities/chord-sheet'
import { BUILT_IN_STYLES } from '@/entities/pattern'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeArranger, createFakeMidi } from '@/shared/api/midi'
import { lineSheet, SECTION } from '@/shared/lib/arrangement'
import { C_MAJOR, parseChordSymbol } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useArrangerPlay } from './use-arranger-play'

const sheet = lineSheet(['C', 'G', 'Am', 'F'].map(parseChordSymbol), C_MAJOR, '4/4')
const style = BUILT_IN_STYLES[0]!

function play(connected: boolean) {
  const arranger = createFakeArranger(
    connected ? { state: 'connected', device: 'Genos' } : { state: 'no-device' },
  )
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, arranger, midi: createFakeMidi() }}>
      {children}
    </ServicesProvider>
  )
  const view = renderHook(
    () =>
      useArrangerPlay({
        sheet,
        style,
        tempo: 120,
        settings: { ...DEFAULT_SHEET_SETTINGS, countIn: 0 },
        block: false,
        follow: true,
        styleName: 'Pop 1',
      }),
    { wrapper },
  )
  return { arranger, audio, view }
}

describe('useArrangerPlay', () => {
  it('with no Genos, the app’s band plays: Play works and the Main pressed lights', async () => {
    const { view } = play(false)
    await waitFor(() => expect(view.result.current.panel.status?.state).toBe('no-device'))
    expect(view.result.current.device).toBe('Pop 1')
    act(() => view.result.current.panel.press(SECTION.main.B))
    expect(view.result.current.panel.section).toBe(SECTION.main.B)
    act(() => view.result.current.panel.toggle())
    expect(view.result.current.playing).toBe(true)
    expect(view.result.current.lit).toEqual({ section: 0, index: 0 })
    expect(view.result.current.panel.section).toBe(SECTION.main.B)
  })
  it('with a Genos, Play starts it on the app’s clock and the band is silent', async () => {
    const { arranger, view } = play(true)
    await waitFor(() => expect(view.result.current.panel.status?.state).toBe('connected'))
    act(() => view.result.current.panel.toggle())
    expect(view.result.current.playing).toBe(true)
    expect(arranger.sent.some((bytes) => bytes[0] === 0xfa)).toBe(true)
    act(() => view.result.current.toggle())
    expect(arranger.sent.at(-1)).toEqual([0xfc])
  })
})
