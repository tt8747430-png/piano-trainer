import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { readSongLink } from '@/features/share-song'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import {
  arrangeLibrary,
  LIBRARY_STORAGE_KEY,
  LIBRARY_VERSION,
  libraryCatalog,
  placeIn,
} from '@/entities/library'
import { COLLECTIONS, pieceById, PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { createMemoryStorage } from '@/shared/lib'
import { confirmAsked } from '@/shared/test/confirm'
import { lessonKeys, sectionLessons } from '../model/section-lessons'
import { expectLastAndAlone } from '@/shared/test/danger'

const DAY = '2026-10-25T10:00:00.000Z'

/** bz5 as the Player plays it, its repeats taken: what its lessons are read from. */
function bz5Played() {
  const piece = pieceById('bz5')
  if (!piece) throw new Error('no bz5')
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

/** Opens the song's Settings from the gear in its bar (round 26): everything else it does. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('heading', { level: 1 })
  const bar = document.querySelector('[data-slot="screen-bar"]') as HTMLElement
  await user.click(within(bar).getByRole('link', { name: 'Settings' }))
  await screen.findByRole('heading', { level: 1, name: 'Settings' })
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
      'Gospel hymnI–IV–I–V',
      'Authentic cadenceI–V–I',
      'Plagal cadenceI–IV–I',
    ])
    const href = new URL(links[0]?.getAttribute('href') ?? '', 'http://x')
    expect(href.pathname).toBe('/practice/progressions')
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
      ['Key', 'G'],
      ['Time', '4/4'],
      ['Tempo', '72 BPM'],
    ])
    expect(screen.getByText('Мир, душа, храни')).toBeInTheDocument()
  })

  it('prints its key and its chords as the Player prints chord symbols, with ♯ and ♭', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz2')
    const facts = (await screen.findByText('Tempo')).closest('dl') as HTMLElement
    expect(within(facts).getByText('Key').nextElementSibling).toHaveTextContent('C♯m')
    const chords = screen.getByRole('region', { name: 'Chords' })
    const [first] = within(chords).getAllByRole('button')
    expect(first).toHaveTextContent('C♯m')
    // Its keys are named by the symbol as printed, then the notes they mark.
    expect(within(first as HTMLElement).getByRole('img')).toHaveAccessibleName(/^C♯m: /)
    await user.click(first as HTMLElement)
    expect(await screen.findByRole('dialog', { name: 'C♯m chord' })).toBeInTheDocument()
  })

  it('lists its sections, each a row to its page of lessons in its paint (ADR 0111)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    const sections = await screen.findByRole('region', { name: 'Sections' })
    const rows = within(sections).getAllByRole('link')
    expect(rows.map((row) => [row.textContent, row.getAttribute('href')])).toEqual([
      ['Verse 15 lessons · 0 done', '/songs/bz5/sections/1'],
      ['Chorus 21 lessons · 0 done', '/songs/bz5/sections/2'],
      ['Ending 2 lessons · 0 done', '/songs/bz5/sections/3'],
    ])
    const paints = rows.map(
      (row) => row.querySelector('[data-slot="row-tile"]')?.className.match(/bg-paint-[a-z]+/)?.[0],
    )
    expect(paints).toEqual(['bg-paint-sky', 'bg-paint-grass', 'bg-paint-sand'])
    await user.click(rows[1] as HTMLElement)
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs/bz5/sections/2'))
  })

  it('shows no learning card over its facts: each section says its lessons done (ADR 0111, amended)', async () => {
    const { progressStore } = await renderApp('/songs/bz5')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('link', { name: /^Learn it step by step/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/^Lessons done/)).not.toBeInTheDocument()
    // The verse played through, every chord of it learned: the chorus and the ending play some.
    const verse = sectionLessons(bz5Played(), 'bz5', 0)
    if (!verse) throw new Error('bz5 has a verse')
    act(() =>
      progressStore.setState({
        lessons: Object.fromEntries(lessonKeys(verse).map((key) => [key, DAY])),
      }),
    )
    const sections = screen.getByRole('region', { name: 'Sections' })
    expect(
      within(sections)
        .getAllByRole('link')
        .map((row) => row.textContent),
    ).toEqual([
      'Verse 15 lessons · 15 done',
      'Chorus 21 lessons · 5 done',
      'Ending 2 lessons · 1 done',
    ])
  })

  it('shows a study of one section no section machinery: its chords once, as diagrams (ADR 0111)', async () => {
    await renderApp('/practice/accompaniment/studies/ex3')
    await screen.findByRole('heading', { level: 1 })
    expect(screen.queryByRole('region', { name: 'Sections' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Changes' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Learn / })).not.toBeInTheDocument()
    expect(
      within(screen.getByRole('region', { name: 'Chords' }))
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['C', 'Dm', 'G', 'F'])
    expect(screen.getByRole('link', { name: 'Practise' })).toHaveAttribute('href', '/play/ex3')
  })

  it('exports from one sheet: MusicXML for notation apps, MIDI, and its link, each named for its file', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Export…' }))
    const sheet = await screen.findByRole('dialog', { name: 'Export' })
    expect(
      within(within(sheet).getByRole('list', { name: 'Export' }))
        .getAllByRole('button')
        .map((row) => row.textContent),
    ).toEqual(['MusicXML', 'MIDI', 'Share link'])
  })

  it('keeps everything else on its Settings page, grouped: its music, its place, its ways out (round 26)', async () => {
    await renderApp('/songs/bz5')
    await openSettings(userEvent.setup())
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['In your library', 'Share'])
    // Favourite is an act on the song (its ♡, its menus), never a switch here (R19).
    expect(screen.queryByRole('switch', { name: 'Favourite' })).not.toBeInTheDocument()
    // One of the app's songs stays in its folder (D8): Archive, no Move to folder….
    expect(screen.queryByRole('button', { name: /^Move to folder…/ })).toBeNull()
    for (const name of ['Archive', 'Export…'])
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    // Nothing of the learner's own to give up, and no original for a learner.
    expect(screen.queryByRole('button', { name: /^(Delete|Reset to the original)$/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /Edit the original/ })).toBeNull()
  })

  it('shares a song of the app as a link to it in the Player, in the key and as simplified as last played (ADR 0107)', async () => {
    const user = userEvent.setup()
    const { viewsStore } = await renderApp('/songs/bz5')
    act(() => viewsStore.setState({ views: { '/play/bz5': { transpose: 2, simple: true } } }))
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: /^Share link/ }))
    await waitFor(() =>
      expect(screen.getByRole('status', { name: '' })).toHaveTextContent(
        'Link copied. Anyone who opens it sees the chords as you play them.',
      ),
    )
    const link = new URL(await navigator.clipboard.readText())
    expect(`${link.pathname}${link.search}`).toBe('/play/bz5?transpose=2&simple=true')
  })

  it('keeps Settings and ✎ (the score) in its bar; Practise, Learned and ♡ on its overview card (A38, R29)', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    const card = await screen.findByRole('region', { name: 'The song' })
    expect(within(card).getByRole('link', { name: 'Practise' })).toHaveAttribute(
      'href',
      '/play/bz5',
    )
    for (const name of ['Learned', 'Add to favourites'])
      expect(within(card).getByRole('button', { name })).toBeInTheDocument()
    expect(within(card).queryByRole('link', { name: 'Edit score' })).toBeNull()
    const bar = document.querySelector('[data-slot="screen-bar"]') as HTMLElement
    expect(within(bar).getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/songs/bz5/settings',
    )
    expect(within(bar).queryByRole('button', { name: 'More' })).toBeNull()
    // ✎ opens the score in the editor, the learner's version of one of the app's songs (R29 1.2).
    await user.click(within(bar).getByRole('button', { name: 'Edit' }))
    expect(await screen.findByRole('button', { name: 'Done' })).toBeInTheDocument()
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
    expect(within(sections).getAllByRole('link')[0]).toHaveTextContent(
      'Куплет 15 уроков · пройдено: 0',
    )
    expect(untranslated(document.body)).toEqual([])
  })

  it('reads a study’s page in Russian', async () => {
    await renderApp('/practice/accompaniment/studies/ex3', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Аккорды' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })

  it('says a folk tune’s credit in Russian, and keeps names as printed', async () => {
    await renderApp('/songs/hot-cross-buns', { locale: 'ru' })
    expect(await screen.findByText('народная')).toBeInTheDocument()
    expect(screen.queryByText('Traditional')).toBeNull()
  })

  it('says “American folk tune” in Russian beside the tune’s name', async () => {
    await renderApp('/songs/amazing', { locale: 'ru' })
    expect(
      await screen.findByText('New Britain (американская народная мелодия)'),
    ).toBeInTheDocument()
  })

  it('shows a listing without a chart: its one action writes it', async () => {
    const listing = COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('the catalog has no listing')
    await renderApp(`/songs/${listing.id}`)
    // It says what is missing, and what writing it gives.
    expect(await screen.findByText('No chart yet')).toBeInTheDocument()
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
      sections: [{ kind: 'verse', lines: ['_ _ _ _'] }],
      hands: silent,
    }
    await renderApp('/songs/my-1', { storage: saved({ songs: [song], nextSong: 2 }) })
    await openSettings(user)
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['In your library', 'Share'])
    expectLastAndAlone(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('link', { name: /^Publish…/ })).toHaveAttribute(
      'href',
      '/songs/my-1/publish',
    )
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('has nothing to learn in a song of no chord symbol: its sections say so', async () => {
    const song = {
      ...MUSIC,
      id: 'my-1',
      title: 'Morning',
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
    ).toEqual(['Verse', 'Chorus'])
  })

  it('edits a song in the score editor from ✎', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/amazing')
    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/edit/amazing'))
  })

  it('shows the learner’s version, and resets it to the original once asked', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/amazing', {
      storage: saved({ versions: { amazing: { ...MUSIC, tempo: 96 } } }),
    })
    expect((await screen.findByText('Your version')).closest('dl')).not.toBeNull()
    expect(screen.getByText('96 BPM')).toBeInTheDocument()
    await openSettings(user)
    expectLastAndAlone(await screen.findByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset to the original' }))
    await user.click(await screen.findByRole('button', { name: 'Reset' }))
    expect(piecesStore.getState().versions).toEqual({})
    await user.click(screen.getByRole('button', { name: 'Back' }))
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
    await user.click(screen.getByRole('button', { name: 'Back' }))
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
    const song = { id: 'my-1', title: 'Morning', ...MUSIC }
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

  it('deletes an own song once asked, out of the favourites too, back on Songs', async () => {
    const user = userEvent.setup()
    const song = { id: 'my-1', title: 'Morning', ...MUSIC }
    const { router, piecesStore, libraryStore } = await renderApp('/songs/my-1', {
      storage: saved({ songs: [song], nextSong: 2 }),
    })
    expect(await screen.findByRole('heading', { level: 1, name: 'Morning' })).toBeInTheDocument()
    // Learned on an own song too (R29 A28), beside Favourite.
    expect(screen.getByRole('button', { name: 'Learned' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Add to favourites' }))
    expect(libraryStore.getState().favourites).toEqual(['my-1'])
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Delete for good' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/songs'))
    expect(piecesStore.getState().songs).toEqual([])
    expect(libraryStore.getState().favourites).toEqual([])
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
    await user.click(await screen.findByRole('button', { name: 'Add to favourites' }))
    expect(libraryStore.getState().favourites).toEqual(['bz5'])
    await user.click(screen.getByRole('button', { name: 'Remove from favourites' }))
    expect(libraryStore.getState().favourites).toEqual([])
  })

  it('moves the song to another folder from its Settings’ Folder, saying so with Undo', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5', { storage: kept(SUNDAY) })
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: /^Move to folder…/ }))
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

  it('keeps one of the app’s songs in its folder: no Move to folder… (R29 B4, D8)', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    await openSettings(user)
    expect(await screen.findByRole('button', { name: 'Archive' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Move to folder…/ })).toBeNull()
  })

  it('archives the song from its Settings, and restores it from there while it is archived', async () => {
    const user = userEvent.setup()
    const { libraryStore } = await renderApp('/songs/bz5')
    await openSettings(user)
    await user.click(await screen.findByRole('button', { name: 'Archive' }))
    await confirmAsked(user, 'Archive')
    expect(placeOf(libraryStore.getState(), 'bz5')).toBe('archived')
    expect(await screen.findByText('“Still, my soul, be still” archived')).toBeInTheDocument()
    // An archived song still opens; Restore stands in place of its Folder and Archive.
    expect(screen.queryByRole('button', { name: /^Move to folder…/ })).toBeNull()
    await user.click(await screen.findByRole('button', { name: 'Restore' }))
    expect(placeOf(libraryStore.getState(), 'bz5')).toMatchObject({ folder: 'bozhe-spasibo' })
  })

  it('offers a study no place in the library: no ♡, no Move to… or Archive', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/accompaniment/studies/ex3')
    await screen.findByRole('link', { name: 'Practise' })
    expect(screen.queryByRole('button', { name: 'Add to favourites' })).toBeNull()
    await openSettings(user)
    expect(screen.queryByRole('button', { name: 'Archive' })).toBeNull()
    expect(screen.queryByRole('switch', { name: 'Favourite' })).toBeNull()
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5', {
      locale: 'ru',
      storage: kept({ ...SUNDAY, favourites: ['bz5'] }),
    })
    expect(await screen.findByRole('button', { name: 'Убрать из избранного' })).toBeInTheDocument()
    const bar = document.querySelector('[data-slot="screen-bar"]') as HTMLElement
    await user.click(within(bar).getByRole('link', { name: 'Настройки' }))
    await user.click(await screen.findByRole('button', { name: /^Переместить в папку…/ }))
    expect(await screen.findByRole('dialog', { name: 'Переместить' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
