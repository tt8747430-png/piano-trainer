import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { readSongLink } from '@/features/share-song'
import {
  arrangeLibrary,
  LIBRARY_STORAGE_KEY,
  LIBRARY_VERSION,
  libraryCatalog,
  placeIn,
} from '@/entities/library'
import { COLLECTIONS, PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { createMemoryStorage } from '@/shared/lib'

/**
 * A song's own music given up (Delete song, Reset to the original): red, in a group of its own, the
 * last of the window's, with no footnote (canvas v550, 6902302c).
 */
function expectLastApart(row: HTMLElement) {
  expect(row).toHaveAttribute('data-danger')
  const group = row.closest('[data-group="danger"]')
  expect(group).not.toBeNull()
  const sections = [
    ...(row.closest('[role="dialog"]') ?? document.body).querySelectorAll('section'),
  ]
  expect(sections.at(-1)).toBe(group)
}

/** Opens the song's Settings from its bar's More: a window over its page, everything else it does. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'More' }))
  await user.click(await screen.findByRole('menuitem', { name: 'Settings' }))
  return screen.findByRole('dialog', { name: 'Settings' })
}

describe('Piece', () => {
  it('titles a song in English over its printed title, with credits and source', async () => {
    await renderApp('/songs/bz5')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
    expect(screen.getByText('«Боже, спасибо» · No. 5 · p. 16')).toBeInTheDocument()
  })

  it('says what the song is, and plays nothing: no chart or keys (ADR 0108)', async () => {
    const { audio } = await renderApp('/songs/bz5')
    await screen.findByRole('heading', { level: 1, name: 'Still, my soul, be still' })
    expect(screen.getByText('72 BPM')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Scale: G major' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Bar 1/ })).not.toBeInTheDocument()
    // A page that plays nothing shows no keys, folded or not.
    expect(screen.queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Keys' })).not.toBeInTheDocument()
    expect(audio.played).toEqual([])
  })

  it('shows its chords as diagrams as they first sound, each opening its sheet, which learns nothing here', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['G', 'C', 'Em', 'G/B', 'C/E', 'Dsus4', 'D/F♯', 'Am', 'D7', 'D'])
    await user.click(within(chords).getAllByRole('button')[2] as HTMLElement)
    const sheet = await screen.findByRole('dialog', { name: 'Em chord' })
    expect(within(sheet).queryByText('Play it on the keys')).not.toBeInTheDocument()
  })

  it('names the progressions it uses under its chords, each opening Progressions in its key', async () => {
    await renderApp('/songs/amazing')
    const chords = await screen.findByRole('region', { name: 'Chords' })
    const used = within(chords).getByRole('list', { name: 'Progressions' })
    const links = within(used).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Gospel hymnI – IV – I – V',
      'Authentic cadenceI – V – I',
      'Plagal cadenceI – IV – I',
    ])
    const href = new URL(links[0]?.getAttribute('href') ?? '', 'http://x')
    expect(href.pathname).toBe('/practice/progressions/line')
    expect(Object.fromEntries(href.searchParams)).toEqual({ key: 'G', p: 'I-IV-I-V' })
  })

  it('names no progression where it uses none', async () => {
    await renderApp('/songs/aura-lee')
    await screen.findByRole('region', { name: 'Chords' })
    expect(screen.queryByRole('list', { name: 'Progressions' })).not.toBeInTheDocument()
  })

  it('puts its key, time and tempo in one line, its second title over them (ADR 0111)', async () => {
    await renderApp('/songs/bz5')
    const facts = (await screen.findByText('Tempo')).closest('dl') as HTMLElement
    expect(
      within(facts)
        .getAllByRole('term')
        .map((term) => [term.textContent, term.nextElementSibling?.textContent]),
    ).toEqual([
      ['Key', 'G major'],
      ['Time', '4/4'],
      ['Tempo', '72 BPM'],
    ])
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
  })

  it('prints its key and its chords as the Player prints chord symbols, with ♯ and ♭', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz2')
    const facts = (await screen.findByText('Tempo')).closest('dl') as HTMLElement
    expect(within(facts).getByText('Key').nextElementSibling).toHaveTextContent('C♯ minor')
    const chords = screen.getByRole('region', { name: 'Chords' })
    const [first] = within(chords).getAllByRole('button')
    expect(first).toHaveTextContent('C♯m')
    // Its keys are named by the symbol as printed, then the notes they mark.
    expect(first).toHaveAccessibleName(/^C♯m: /)
    await user.click(first as HTMLElement)
    expect(await screen.findByRole('dialog', { name: 'C♯m chord' })).toBeInTheDocument()
  })

  it('lists its sections under its chords, each a row to its page of lessons, with no learning card (ADR 0111)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    const sections = await screen.findByRole('region', { name: 'Sections' })
    const rows = within(sections).getAllByRole('link')
    // Its name, how often its chords go round and its bars.
    expect(rows.map((row) => [row.textContent, row.getAttribute('href')])).toEqual([
      ['Verse2× · bars 1–8', '/songs/bz5/sections/1'],
      ['Chorusbars 9–18', '/songs/bz5/sections/2'],
      ['Endingbars 19–19', '/songs/bz5/sections/3'],
    ])
    expect(screen.queryByRole('link', { name: /^Learn it step by step/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/^Lessons done/)).not.toBeInTheDocument()
    await user.click(rows[1] as HTMLElement)
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5/sections/2'))
  })

  it('shows a study of one section its one section, its chords once, as diagrams (ADR 0111)', async () => {
    await renderApp('/practice/accompaniment/studies/ex3')
    await screen.findByRole('heading', { level: 1 })
    // A song of one section too: its section's page is the way in.
    const [section] = within(screen.getByRole('region', { name: 'Sections' })).getAllByRole('link')
    expect(section).toHaveAttribute('href', '/practice/accompaniment/studies/ex3/sections/1')
    expect(screen.queryByRole('heading', { name: 'Changes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Learn / })).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Chords' }))
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['C', 'Dm', 'G', 'F'])
    expect(screen.getByRole('link', { name: 'Practise' })).toHaveAttribute('href', '/play/ex3')
  })

  it('exports from one sheet: MusicXML for notation apps and MIDI, each named for its file', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    await user.click(within(await openSettings(user)).getByRole('button', { name: /^Export…/ }))
    // A page of the Settings window, Back to Settings.
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(within(sheet).getByRole('button', { name: 'Settings' })).toBeInTheDocument()
    expect(
      within(within(sheet).getByRole('list', { name: 'Export' }))
        .getAllByRole('button')
        .map((row) => row.textContent),
    ).toEqual(['MusicXML', 'Compressed MusicXML (.mxl)', 'MIDI'])
  })

  it('keeps everything else in its Settings window, grouped: its place, its ways out (round 26)', async () => {
    await renderApp('/songs/bz5')
    const settings = await openSettings(userEvent.setup())
    expect(
      within(settings)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Settings', 'Library', 'Share'])
    // Favourite is the bar's ♡ alone (owner, 2026-11-12): no switch here.
    expect(screen.queryByRole('switch', { name: 'Favourite' })).toBeNull()
    // One of the app's songs stays in its playlist (D8): Archive, no Playlist.
    expect(screen.queryByRole('button', { name: /^Playlist/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Export…/ })).toBeInTheDocument()
    // The page edits what it says of itself; its score is ✎'s on the page (R32-C).
    expect(screen.queryByRole('link', { name: /^Edit song page/ })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Edit score' })).toBeNull()
    // Nothing of the learner's own to give up, and no original for a learner.
    expect(screen.queryByRole('button', { name: /^(Delete|Reset to the original)$/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /Edit the original/ })).toBeNull()
  })

  it('shares a song of the app as a link to it in the Player, in the key and as simplified as last played (ADR 0107)', async () => {
    const user = userEvent.setup()
    const { viewsStore } = await renderApp('/songs/bz5')
    act(() => viewsStore.setState({ views: { '/play/bz5': { transpose: 2, version: 'simple' } } }))
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: /^Share link/ }))
    await waitFor(() =>
      expect(screen.getByRole('status', { name: '' })).toHaveTextContent(
        'Link copied. Anyone who opens it sees the chords as you play them.',
      ),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(`${link.pathname}${link.search}`).toBe('/play/bz5?transpose=2&version=simple')
  })

  it('keeps Learned, ♡ and More in its bar, ✎ beside the title and Play floating (R30 S4, R34)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    await screen.findByRole('region', { name: 'The song' })
    expect(screen.getByRole('link', { name: 'Practise' })).toHaveAttribute('href', '/play/bz5')
    const bar = screen.getByRole('banner')
    expect(within(bar).getByRole('button', { name: 'Add to Favourites' })).toBeInTheDocument()
    expect(within(bar).getByRole('button', { name: 'Learned' })).toBeInTheDocument()
    // More holds Edit score and Settings.
    await user.click(within(bar).getByRole('button', { name: 'More' }))
    expect((await screen.findAllByRole('menuitem')).map((item) => item.textContent)).toEqual([
      'Edit score',
      'Settings',
    ])
    await user.keyboard('{Escape}')
    // ✎ beside the title opens the editor on its Title and credits.
    const edit = screen.getByRole('link', { name: 'Edit title and credits' })
    expect(edit).toHaveAttribute('href', '/edit/bz5?credits=true')
    await user.click(edit)
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/bz5'))
  })

  it('changes the cover from a tap on it in Settings, and Remove cover takes it off (R32-C)', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5')
    await user.click(within(await openSettings(user)).getByRole('button', { name: 'Change cover' }))
    const sheet = await screen.findByRole('dialog', { name: 'Cover' })
    await user.click(within(sheet).getByRole('radio', { name: 'Piano' }))
    await user.click(within(sheet).getByRole('radio', { name: 'Grass' }))
    expect(libraryStore.getState().songLooks['bz5']).toEqual({ picture: 'piano', paint: 'grass' })
    await user.click(within(sheet).getByRole('button', { name: 'Remove cover' }))
    expect(libraryStore.getState().songLooks['bz5']).toBeUndefined()
  })

  it('keeps a song’s genre, language and tags from its Details, read on its page (R32-C)', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: /^Genre/ }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Genre' })).getByRole('option', {
        name: 'Hymn',
      }),
    )
    await user.click(screen.getByRole('button', { name: /^Language/ }))
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Language' })).getByRole('option', {
        name: 'Russian',
      }),
    )
    await user.click(screen.getByRole('button', { name: /^Tags/ }))
    const tags = await screen.findByRole('dialog', { name: 'Tags' })
    await user.type(within(tags).getByRole('textbox', { name: 'Add a tag' }), 'Sunday{Enter}')
    expect(libraryStore.getState().songDetails.bz5).toMatchObject({
      genre: 'hymn',
      language: 'ru',
      tags: ['sunday'],
    })
    await user.keyboard('{Escape}')
    const details = screen.getByRole('region', { name: 'Details' })
    expect(within(details).getByRole('button', { name: /^Genre/ })).toHaveTextContent('Hymn')
    expect(within(details).getByRole('button', { name: /^Language/ })).toHaveTextContent('Russian')
    expect(within(details).getByRole('button', { name: /^Tags/ })).toHaveTextContent('sunday')
  })

  it('says a course’s song takes its level from its course, never a choice (R32-C)', async () => {
    await renderApp('/songs/bz5')
    const details = await screen.findByRole('region', { name: 'Details' })
    expect(within(details).queryByRole('button', { name: /^Level/ })).toBeNull()
    expect(within(details).getByText('Level')).toBeInTheDocument()
    expect(within(details).getByRole('button', { name: 'About Level' })).toBeInTheDocument()
  })

  it('opens the Player and marks the song learned', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp('/songs/bz5')
    expect(await screen.findByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    const learned = screen.getByRole('button', { name: 'Learned' })
    expect(learned).toHaveAttribute('aria-pressed', 'false')
    await user.click(learned)
    expect(learned).toHaveAttribute('aria-pressed', 'true')
    expect(progressStore.getState().learned['piece:bz5']).toBeDefined()
  })

  it('reads in Russian, its sections too', async () => {
    await renderApp('/songs/bz5', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Мир, душа, храни' }),
    ).toBeInTheDocument()
    const sections = screen.getByRole('region', { name: 'Разделы' })
    expect(within(sections).getAllByRole('link')[0]).toHaveTextContent(/^Куплет/)
    expect(untranslated(document.body)).toEqual([])
  })

  it('reads a study’s page in Russian', async () => {
    await renderApp('/practice/accompaniment/studies/ex3', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Аккорды' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })

  it('says a folk tune’s credit in Russian, and keeps names as printed', async () => {
    await renderApp('/songs/hot-cross-buns', { locale: 'ru' })
    // Under the title, the role in Russian and the tune said.
    expect((await screen.findAllByText(/: народная$/)).length).toBeGreaterThan(0)
    expect(screen.queryByText('Traditional')).toBeNull()
  })

  it('says “American folk tune” in Russian beside the tune’s name', async () => {
    await renderApp('/songs/amazing', { locale: 'ru' })
    expect(
      (await screen.findAllByText(/: New Britain \(американская народная мелодия\)/)).length,
    ).toBeGreaterThan(0)
  })

  it('shows a listing without a chart: its one action writes it', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalog has no listing')
    await renderApp(`/songs/${listing.id}`)
    // It says what is missing, and what writing it gives.
    expect(await screen.findByText('Chart not available')).toBeInTheDocument()
    expect(
      (await screen.findByRole('link', { name: 'Write the chart' })).closest(
        '[data-slot="floating-actions"]',
      ),
    ).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'Practise' })).not.toBeInTheDocument()
  })
})

describe('Piece: the learner’s own music', () => {
  const MUSIC = {
    key: 'G',
    meter: '3/4',
    tempo: 80,
    pattern: 'r2',
    sections: [{ kind: 'verse', lines: ['Em D C G'] }],
  }
  const saved = (state: object) => {
    const storage = createMemoryStorage()
    storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version: PIECES_VERSION }))
    return storage
  }

  it('offers no Check for a new song of no chord symbol, only its own ways (ADR 0114)', async () => {
    const user = userEvent.setup()
    const silent = { rh: 'r/3 | r/3 | r/3 | r/3', lh: 'r/3 | r/3 | r/3 | r/3' }
    const song = {
      ...MUSIC,
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      sections: [{ kind: 'verse', lines: ['_ _ _ _'] }],
      hands: silent,
    }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    const settings = await openSettings(user)
    expect(
      within(settings)
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(['Settings', 'Library', 'Share'])
    expectLastApart(within(settings).getByRole('button', { name: 'Delete song' }))
    expect(within(settings).getByRole('button', { name: /^Publish…/ })).toBeInTheDocument()
    expect(within(settings).queryByRole('button', { name: /^Check/ })).toBeNull()
  })

  it('lists the sections of a song of no chord symbol by their bars alone', async () => {
    const song = {
      ...MUSIC,
      id: 'my-1',
      title: 'Morning',
      added: '2026-11-01T09:00:00.000Z',
      sections: [
        { kind: 'verse', lines: ['_'] },
        { kind: 'chorus', lines: ['_'] },
      ],
      hands: { rh: 'r/3 | r/3', lh: 'r/3 | r/3' },
    }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    const sections = await screen.findByRole('region', { name: 'Sections' })
    expect(
      within(sections)
        .getAllByRole('link')
        .map((row) => row.textContent),
    ).toEqual(['Versebars 1–1', 'Chorusbars 2–2'])
  })

  it('shows the learner’s version, and resets it to the original once asked', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/amazing', {
      storage: saved({ versions: { amazing: { ...MUSIC, tempo: 96 } } }),
    })
    expect((await screen.findByText('Your version')).closest('dl')).not.toBeNull()
    expect(screen.getByText('96 BPM')).toBeInTheDocument()
    await openSettings(user)
    expectLastApart(await screen.findByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(piecesStore.getState().versions).toEqual({})
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(await screen.findByText('80 BPM')).toBeInTheDocument()
    expect(screen.queryByText('Your version')).toBeNull()
  })

  it('names a version by the learner’s own title in Songs, Search and on its page; Reset brings back the catalog’s (ADR 0114)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/folders/hymns', {
      storage: saved({ versions: { amazing: { ...MUSIC, title: 'My grace' } } }),
    })
    expect(await screen.findByRole('link', { name: /My grace/ })).toHaveAttribute(
      'href',
      '/songs/amazing',
    )
    await act(() => router.navigate({ to: '/search', search: { q: 'my grace' } }))
    expect(await screen.findByRole('option', { name: /My grace/ })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await act(() => router.navigate({ to: '/songs/$pieceId', params: { pieceId: 'amazing' } }))
    expect(await screen.findByRole('heading', { level: 1, name: 'My grace' })).toBeInTheDocument()
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Amazing Grace' }),
    ).toBeInTheDocument()
  })

  it('gives the focus back to Reset once it is not wanted', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/amazing', { storage: saved({ versions: { amazing: MUSIC } }) })
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Reset to the original' }))
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Reset to the original' })).toHaveFocus(),
    )
  })

  it('shares an own song as a link that carries it, copied where there is no share sheet', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', added: '2026-11-01T09:00:00.000Z', ...MUSIC }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: /^Share link/ }))
    // The status line is always there, empty until the song is deflated and copied.
    await waitFor(() =>
      expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Link copied.'),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(link.pathname).toBe('/songs/shared')
    expect(await readSongLink(link.searchParams.get('song') ?? '')).toEqual({
      title: 'Morning',
      music: MUSIC,
    })
  })

  it('moves an own song to the Trash, back on Songs, Undo bringing it back', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', added: '2026-11-01T09:00:00.000Z', ...MUSIC }
    const { router, piecesStore, libraryStore } = await renderApp('/songs/my-1', {
      storage: saved({ songs: [song], nextSong: 2 }),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    // Learned on an own song too (R29 A28), beside Favourite.
    expect(screen.getByRole('button', { name: 'Learned' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add to Favourites' }))
    expect(libraryStore.getState().favourites).toEqual(['my-1'])
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Delete song' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(await screen.findByText('“Morning” moved to the Trash')).toBeInTheDocument()
    expect(libraryStore.getState().trash.map((each) => each.id)).toEqual(['my-1'])
    expect(piecesStore.getState().songs).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(libraryStore.getState().trash).toEqual([])
  })

  it('writes a listing’s chart in the editor', async () => {
    await renderApp('/songs/bz4')
    expect(await screen.findByRole('link', { name: 'Write the chart' })).toHaveAttribute(
      'href',
      '/edit/bz4',
    )
  })
})

describe('Piece: the learner’s library (ADR 0106)', () => {
  /** A device whose library holds `state`. */
  const kept = (state: object) => {
    const storage = createMemoryStorage()
    storage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify({ state, version: LIBRARY_VERSION }))
    return storage
  }
  /** The learner's own folder, holding one of the app's songs (theirs to move, D8). */
  const SUNDAY = {
    folders: [{ id: 'folder-1', name: 'Sunday', picture: 'church', paint: 'sky', songs: ['bz5'] }],
    nextFolder: 2,
  }
  const placeOf = (state: Parameters<typeof arrangeLibrary>[0], id: string) =>
    placeIn(arrangeLibrary(state, libraryCatalog({ ownSongs: [] })), id)

  it('keeps a song among the favourites from its ♡, named by what a tap does now', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5')
    await user.click(await screen.findByRole('button', { name: 'Add to Favourites' }))
    expect(libraryStore.getState().favourites).toEqual(['bz5'])
    await user.click(screen.getByRole('button', { name: 'Remove from Favourites' }))
    expect(libraryStore.getState().favourites).toEqual([])
  })

  it('moves the song to another playlist from its Settings’ Playlist, saying so with Undo', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5', { storage: kept(SUNDAY) })
    await user.click(within(await openSettings(user)).getByRole('button', { name: /^Playlist/ }))
    const sheet = await screen.findByRole('dialog', { name: 'Move to' })
    // Where it stands now is marked Here, no place to move it to; a tap elsewhere moves at once.
    expect(within(sheet).getByRole('button', { name: 'Sunday Here' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    await user.click(within(sheet).getByRole('button', { name: 'Home' }))
    expect(placeOf(libraryStore.getState(), 'bz5')).toMatchObject({ folder: null })
    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(placeOf(libraryStore.getState(), 'bz5')).toEqual({ folder: 'folder-1', index: 0 })
  })

  it('keeps one of the app’s songs in its playlist: no Playlist row (R29 B4, D8)', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    const settings = await openSettings(user)
    expect(within(settings).getByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(within(settings).queryByRole('button', { name: /^Playlist/ })).toBeNull()
  })

  it('archives the song from its Settings at once, and brings it back from there while it is archived', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5')
    const settings = await openSettings(user)
    // A loss that can be undone: at once, Undo in its toast.
    await user.click(within(settings).getByRole('button', { name: 'Archive' }))
    expect(placeOf(libraryStore.getState(), 'bz5')).toBe('archived')
    expect(await screen.findByText('“Still, my soul, be still” archived')).toBeInTheDocument()
    // An archived song still opens; Restore stands in place of its Archive.
    await user.click(within(settings).getByRole('button', { name: 'Restore' }))
    expect(placeOf(libraryStore.getState(), 'bz5')).toMatchObject({ folder: 'bozhe-spasibo' })
  })

  it('offers a study no place in the library: no ♡, no Move to… or Archive', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment/studies/ex3')
    await screen.findByRole('link', { name: 'Practise' })
    expect(screen.queryByRole('button', { name: 'Add to Favourites' })).toBeNull()
    const settings = await openSettings(user)
    expect(within(settings).queryByRole('button', { name: 'Archive' })).toBeNull()
    expect(within(settings).queryByRole('switch', { name: 'Favourite' })).toBeNull()
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5', {
      locale: 'ru',
      storage: kept({ ...SUNDAY, favourites: ['bz5'] }),
    })
    expect(await screen.findByRole('button', { name: 'Убрать из избранного' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ещё' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Настройки' }))
    const settings = await screen.findByRole('dialog', { name: 'Настройки' })
    await user.click(within(settings).getByRole('button', { name: /^Плейлист/ }))
    expect(await screen.findByRole('dialog', { name: 'Переместить' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
