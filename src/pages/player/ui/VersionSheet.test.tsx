import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { isLeadSheet, PIECES, PIECES_STORAGE_KEY, PIECES_VERSION, stavesOf } from '@/entities/piece'
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

/** The foot bar's Version, opening the Version sheet. */
const versionTool = async () =>
  within(await screen.findByRole('toolbar', { name: 'Practice tools' })).getByRole('button', {
    name: /^Version: /,
  })

/** Opens the Version sheet. */
async function openVersions(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await versionTool())
  return screen.findByRole('dialog', { name: 'Version' })
}

/** Opens the Version sheet and chooses a level; it plays and the sheet closes. */
async function choose(user: ReturnType<typeof userEvent.setup>, level: string) {
  const sheet = await openVersions(user)
  await user.click(within(sheet).getByRole('button', { name: new RegExp(`^${level}`) }))
}

/** The chords the Grid shows, bar by bar, as a screen reader names its bars. */
const gridBars = () =>
  within(screen.getByRole('region', { name: 'Grid' }))
    .getAllByRole('button', { name: /^Bar / })
    .map((bar) => bar.getAttribute('aria-label'))

describe('the Version sheet (R29 B8)', () => {
  it('plays and shows every chord as its plain triad in the Simplified version, and as written again, without a history entry', async () => {
    const user = userEvent.setup()
    const { router, settingsStore } = await renderApp('/play/my-1', {
      storage: withSong('Cmaj7 G7/B Am7 Dsus4'),
    })
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    expect(await screen.findByRole('button', { name: 'Bar 1: CMaj7' })).toBeInTheDocument()
    expect(await versionTool()).toHaveAccessibleName('Version: Original')
    const entries = router.history.length
    await choose(user, 'Simplified')
    expect(router.state.location.search).toMatchObject({ version: 'simple' })
    expect(router.history.length).toBe(entries)
    await waitFor(() =>
      expect(gridBars()).toEqual(['Bar 1: C', 'Bar 2: G', 'Bar 3: Am', 'Bar 4: D']),
    )
    await choose(user, 'Original')
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('version'))
    await waitFor(() =>
      expect(gridBars()).toEqual(['Bar 1: CMaj7', 'Bar 2: G7/B', 'Bar 3: Am7', 'Bar 4: Dsus4']),
    )
  })

  it('checks the version playing, its difficulty on each row', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1?version=easy', { storage: withSong('Cmaj7 G7/B') })
    const sheet = await openVersions(user)
    expect(within(sheet).getByRole('button', { name: /^Easy/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(sheet).getByRole('button', { name: /^Original/ })).toHaveTextContent(
      'Difficulty 3 of 3',
    )
    expect(within(sheet).getByRole('button', { name: /^Simplified/ })).toHaveTextContent(
      'Difficulty 2 of 3',
    )
    expect(within(sheet).getByRole('button', { name: /^Easy/ })).toHaveTextContent(
      'Difficulty 1 of 3',
    )
    // Each level says in a line what it plays.
    expect(within(sheet).getByRole('button', { name: /^Original/ })).toHaveTextContent(
      'The score as written',
    )
    expect(within(sheet).getByRole('button', { name: /^Simplified/ })).toHaveTextContent(
      'Every chord a plain triad, the tune kept',
    )
    expect(within(sheet).getByRole('button', { name: /^Easy/ })).toHaveTextContent(
      'The tune, one note of each chord',
    )
    // One arrangement, so nothing to choose between.
    expect(within(sheet).queryByRole('radiogroup', { name: 'Arrangement' })).not.toBeInTheDocument()
    expect(within(sheet).queryByRole('button', { name: 'Your version' })).not.toBeInTheDocument()
  })

  it('changes the arrangement from the sheet at once, the level kept', async () => {
    const withTune = PIECES.find((piece) => stavesOf(piece).length > 0 && !isLeadSheet(piece))
    if (!withTune) throw new Error('no piece has a tune')
    const user = userEvent.setup()
    const { router } = await renderApp(`/play/${withTune.id}?version=easy`)
    const sheet = await openVersions(user)
    const arrangement = within(sheet).getByRole('radiogroup', { name: 'Arrangement' })
    expect(within(arrangement).getByRole('radio', { name: 'Piano and voice' })).toBeChecked()
    const before = router.state.location.search
    await user.click(within(arrangement).getByRole('radio', { name: 'Piano solo' }))
    // The voice's staves are off, the level as it was, and the sheet still open.
    await waitFor(() => expect(router.state.location.search).not.toEqual(before))
    expect(router.state.location.search).toMatchObject({ version: 'easy' })
    expect(router.state.location.search.staves).toBeDefined()
    expect(within(arrangement).getByRole('radio', { name: 'Piano solo' })).toBeChecked()
    expect(within(sheet).getByRole('button', { name: /^Easy/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(arrangement).getByRole('radio', { name: 'Piano and voice' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('staves'))
    expect(router.state.location.search).toMatchObject({ version: 'easy' })
  })

  it('names the simplified chords in the key the song is transposed to (R29)', async () => {
    const { settingsStore } = await renderApp('/play/my-1?version=simple&transpose=2', {
      storage: withSong('Cmaj9/E G7/B'),
    })
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    await waitFor(() => expect(gridBars()).toEqual(['Bar 1: D', 'Bar 2: A']))
  })

  it('names the chords simply in Song information and on the sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1?version=simple', { storage: withSong('Cmaj7 G7/B') })
    expect(await screen.findByRole('button', { name: 'Bar 2: G' })).toBeInTheDocument()
    const foot = await screen.findByRole('toolbar', { name: 'Practice tools' })
    await user.click(within(foot).getByRole('button', { name: 'More' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Song information' }))
    const info = await screen.findByRole('dialog', { name: 'Song information' })
    const chords = within(within(info).getByRole('list', { name: 'Chords' })).getAllByRole('button')
    expect(chords.map((chord) => chord.textContent)).toEqual(['C', 'G'])
  })

  it('greys Simplified, saying why, where every chord is a plain triad already', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong('G C _ Em', 'D G') })
    const sheet = await openVersions(user)
    const simplified = within(sheet).getByRole('button', { name: /^Simplified/ })
    expect(simplified).toBeDisabled()
    expect(simplified).toHaveTextContent('Its chords are already simple')
  })

  it('plays a song written in degrees as triads, its chord size greyed while it does', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/romashki?chordSize=ninths')
    await choose(user, 'Simplified')
    expect(router.state.location.search).toMatchObject({ chordSize: 'ninths', version: 'simple' })
    await user.click(screen.getByRole('button', { name: 'Player settings' }))
    const setup = await screen.findByRole('dialog', { name: 'Player settings' })
    await user.click(within(setup).getByRole('button', { name: /^Accompaniment/ }))
    const size = await within(setup).findByRole('radiogroup', { name: 'Chord size' })
    for (const segment of within(size).getAllByRole('radio'))
      expect(segment).toHaveAttribute('aria-disabled', 'true')
    await user.click(within(setup).getByRole('button', { name: 'About Chord size' }))
    expect(await screen.findByRole('dialog', { name: 'Chord size' })).toHaveTextContent(
      'The Simplified version plays every chord as its triad.',
    )
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    await renderApp('/play/my-1', { storage: withSong('G C'), locale: 'ru' })
    await user.click(await screen.findByRole('button', { name: 'Версия: Оригинал' }))
    expect(await screen.findByRole('dialog', { name: 'Версия' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
