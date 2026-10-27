import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { setScoreView } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'

/** The device's storage holding one own song, `my-1`, of these lines. */
function withSong(...lines: string[]): Storage {
  const storage = createMemoryStorage()
  const song = {
    id: 'my-1',
    title: 'Morning',
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'block',
    sections: [{ kind: 'verse', lines }],
  }
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

/** The tools row's Simplify. */
const simplify = async () =>
  within(await screen.findByRole('toolbar', { name: 'Tools' })).getByRole('button', {
    name: 'Simplify',
  })

/** The chords the Grid shows, bar by bar, as a screen reader names its bars. */
const gridBars = () =>
  within(screen.getByRole('region', { name: 'Grid' }))
    .getAllByRole('button', { name: /^Bar / })
    .map((bar) => bar.getAttribute('aria-label'))

describe('Simplify (ADR 0105)', () => {
  it('plays and shows every chord as its plain triad while pressed, and as written again', async () => {
    const user = userEvent.setup()
    const { router, settingsStore } = await renderApp('/play/my-1', {
      storage: withSong('Cmaj7 G7/B Am7 Dsus4'),
    })
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    expect(await screen.findByRole('button', { name: 'Bar 1: CMaj7' })).toBeInTheDocument()
    const tool = await simplify()
    expect(tool).toHaveAttribute('aria-pressed', 'false')
    await user.click(tool)
    expect(tool).toHaveAttribute('aria-pressed', 'true')
    expect(router.state.location.search).toMatchObject({ simple: true })
    await waitFor(() =>
      expect(gridBars()).toEqual(['Bar 1: C', 'Bar 2: G', 'Bar 3: Am', 'Bar 4: D']),
    )
    await user.click(tool)
    expect(tool).toHaveAttribute('aria-pressed', 'false')
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('simple'))
    await waitFor(() =>
      expect(gridBars()).toEqual(['Bar 1: CMaj7', 'Bar 2: G7/B', 'Bar 3: Am7', 'Bar 4: Dsus4']),
    )
  })

  it('names the chords simply in Song information and on the sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1?simple=true', { storage: withSong('Cmaj7 G7/B') })
    expect(await screen.findByRole('button', { name: 'Bar 2: G' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('button', { name: 'Song information' }))
    const info = await screen.findByRole('dialog', { name: 'Song information' })
    const chords = within(within(info).getByRole('list', { name: 'Chords' })).getAllByRole('button')
    expect(chords.map((chord) => chord.textContent)).toEqual(['C', 'G'])
  })

  it('is greyed, saying why, where every chord is a plain triad already', async () => {
    await renderApp('/play/my-1', { storage: withSong('G C _ Em', 'D G') })
    const tool = await simplify()
    expect(tool).toBeDisabled()
    expect(tool).toHaveAttribute('aria-pressed', 'false')
    expect(tool).toHaveAttribute('title', 'No chord to simplify')
    expect(tool).toHaveAccessibleDescription('No chord to simplify')
  })

  it('says what it does in its tooltip', async () => {
    await renderApp('/play/bz5')
    const tool = await simplify()
    expect(tool).toBeEnabled()
    expect(tool).toHaveAccessibleDescription('Every chord as its plain major or minor triad')
  })

  it('plays a song written in degrees as triads, its chord size greyed while it does', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/romashki?chordSize=ninths')
    await user.click(await simplify())
    expect(router.state.location.search).toMatchObject({ chordSize: 'ninths', simple: true })
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    const size = within(setup).getByRole('radiogroup', { name: 'Chord size' })
    for (const segment of within(size).getAllByRole('radio'))
      expect(segment).toHaveAttribute('aria-disabled', 'true')
    await user.click(within(setup).getByRole('button', { name: 'About Chord size' }))
    expect(await screen.findByRole('dialog', { name: 'Chord size' })).toHaveTextContent(
      'Simplify plays every chord as its triad.',
    )
  })

  it('reads in Russian', async () => {
    await renderApp('/play/my-1', { storage: withSong('G C'), locale: 'ru' })
    const tool = await screen.findByRole('button', { name: 'Упростить' })
    expect(tool).toHaveAttribute('title', 'Нет аккордов для упрощения')
    expect(untranslated(document.body)).toEqual([])
  })
})
