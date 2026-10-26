import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { PIECES_STORAGE_KEY, PIECES_VERSION } from '@/entities/piece'
import type { MusicView } from '@/entities/settings'
import { setScoreView } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'

type User = ReturnType<typeof userEvent.setup>

/** A piece in the Player with a view of the music saved, chosen once it is open. */
async function savedAs(music: MusicView, path: string, options?: Parameters<typeof renderApp>[1]) {
  const opened = await renderApp(path, options)
  await screen.findByRole('heading', { level: 1 })
  act(() => setScoreView(opened.settingsStore, { music }))
  return opened
}

/** The music's own part of the screen, under the View's parts named as its views are. */
function musicArea(): HTMLElement {
  const area = document.querySelector<HTMLElement>('[data-area="sheet"]')
  if (!area) throw new Error('the music’s area')
  return area
}

/** The device's storage holding one own song, `my-1`, its bars of no chord symbol and its tune. */
function withSongOfNoChords(): Storage {
  const storage = createMemoryStorage()
  const song = {
    id: 'my-1',
    title: 'Morning',
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['_ _'] }],
    hands: { rh: 'B4/4 | D5/4', lh: 'r/4 | r/4' },
  }
  storage.setItem(
    PIECES_STORAGE_KEY,
    JSON.stringify({ state: { songs: [song], nextSong: 2 }, version: PIECES_VERSION }),
  )
  return storage
}

/** Opens the View from the tools row, named by the view shown. */
async function openView(user: User, shown: string) {
  await user.click(await screen.findByRole('button', { name: `View: ${shown}` }))
  return screen.findByRole('dialog', { name: 'View' })
}

/** The menu's groups, top down, by name. */
const groupsOf = (menu: HTMLElement) =>
  within(menu)
    .getAllByRole('region')
    .map((group) => group.getAttribute('aria-label'))

/** A segmented choice's segments, by the name each prints, in order. */
const segmentsOf = (choice: HTMLElement) =>
  within(choice)
    .getAllByRole('radio')
    .map((segment) => segment.textContent)

/** The switches in a part of the menu are these, in order. */
function switchesAre(part: HTMLElement, ...names: (string | RegExp)[]) {
  const switches = within(part).getAllByRole('switch')
  expect(switches).toHaveLength(names.length)
  names.forEach((name, i) => expect(switches[i]).toHaveAccessibleName(name))
}

describe('the tools row (ADR 0102)', () => {
  it('stands under the bar and names the view shown, opening the View from there', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const tools = await screen.findByRole('toolbar', { name: 'Tools' })
    expect(tools.closest('[data-area="tools"]')).toBeInTheDocument()
    const view = within(tools).getByRole('button', { name: 'View: Sheet music' })
    expect(view).toHaveTextContent('Sheet music')
    expect(view).toHaveAttribute('aria-haspopup')
    await user.click(view)
    const menu = await screen.findByRole('dialog', { name: 'View' })
    await user.click(within(menu).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    expect(within(tools).getByRole('button', { name: 'View: Diagrams' })).toHaveTextContent(
      'Diagrams',
    )
  })
})

describe('while Diagrams plays (ADR 0102)', () => {
  /** The bar's two groups and the tools row. */
  const bar = () =>
    ['lead', 'actions', 'tools'].map((area) => {
      const found = document.querySelector(`[data-area="${area}"]`)
      if (!found) throw new Error(area)
      return found
    })

  it('steps the bar and the tools row aside, back at a tap on the free room or once it stops', async () => {
    const user = userEvent.setup()
    await savedAs('diagrams', '/play/bz5')
    const transport = screen.getByRole('toolbar', { name: 'Playback' })
    const dock = transport.closest('[data-area="dock"]')
    await user.click(within(transport).getByRole('button', { name: 'Play' }))
    for (const area of bar()) {
      expect(area).toHaveAttribute('data-hidden')
      expect(area).toHaveAttribute('inert')
    }
    expect(dock).not.toHaveAttribute('data-hidden')
    // A tap on the free room brings them back, and the next sends them aside with the transport.
    const title = screen.getByRole('heading', { level: 1 })
    await user.click(title)
    for (const area of bar()) expect(area).not.toHaveAttribute('data-hidden')
    await user.click(title)
    for (const area of bar()) expect(area).toHaveAttribute('data-hidden')
    expect(dock).toHaveAttribute('data-hidden')
    // Stopped (Space, the transport aside too), everything is back.
    await user.keyboard(' ')
    for (const area of bar()) expect(area).not.toHaveAttribute('data-hidden')
    expect(dock).not.toHaveAttribute('data-hidden')
  })

  it('keeps the bar in sight while another view plays', async () => {
    const user = userEvent.setup()
    await savedAs('grid', '/play/bz5')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    for (const area of bar()) expect(area).not.toHaveAttribute('data-hidden')
    await user.click(screen.getByRole('button', { name: 'Stop' }))
  })
})

describe('Ask each time a song opens (ADR 0102)', () => {
  it('opens a song’s Player with its View open, once asked to, and a walk’s as it was', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/play/silent', { storage })
    const menu = await openView(user, 'Sheet music')
    await user.click(within(menu).getByRole('switch', { name: 'Ask each time a song opens' }))
    expect(first.settingsStore.getState().scoreView.askOnOpen).toBe(true)
    first.unmount()
    const song = await renderApp('/play/bz5', { storage })
    expect(await screen.findByRole('dialog', { name: 'View' })).toBeInTheDocument()
    song.unmount()
    await renderApp('/play/walk', { storage })
    await screen.findByRole('button', { name: 'View: Sheet music' })
    expect(screen.queryByRole('dialog', { name: 'View' })).not.toBeInTheDocument()
  })

  it('opens a song’s Player with its View closed, as it is by default', async () => {
    await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'View: Sheet music' })
    expect(screen.queryByRole('dialog', { name: 'View' })).not.toBeInTheDocument()
  })
})

describe('the View, by view (ADR 0102)', () => {
  it('names each view in a line beside Show the music as, over the tiles and Ask each time', async () => {
    const user = userEvent.setup()
    await renderApp('/play/silent')
    const menu = await openView(user, 'Sheet music')
    const views = within(menu).getByRole('region', { name: 'Show the music as' })
    expect(within(views).getAllByRole('radio')).toHaveLength(4)
    switchesAre(views, 'Ask each time a song opens')
    await user.click(within(views).getByRole('button', { name: 'About Show the music as' }))
    const about = await screen.findByRole('dialog', { name: 'Show the music as' })
    expect(about).toHaveTextContent('Sheet music: the score, as printed')
    expect(about).toHaveTextContent('Chords over lyrics: each line’s chords over its words')
    expect(about).toHaveTextContent('Diagrams: the chord sounding on the keys, the next beside it')
    expect(about).toHaveTextContent('Grid: every bar’s chords, beat by beat')
  })

  it('heads the sheet music’s own with its name: its Layout first, then its staves and what it shows', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const menu = await openView(user, 'Sheet music')
    expect(groupsOf(menu)).toEqual(['Show the music as', 'Sheet music', 'Every view'])
    const sheet = within(menu).getByRole('region', { name: 'Sheet music' })
    const layout = within(sheet).getByRole('radiogroup', { name: 'Layout' })
    expect(segmentsOf(layout)).toEqual(['Pages', 'Scroll down', 'Scroll across'])
    expect(within(layout).getByRole('radio', { name: 'Scroll down' })).toBeChecked()
    await user.click(within(layout).getByRole('radio', { name: 'Scroll across' }))
    expect(settingsStore.getState().scoreView.layout).toBe('horizontal')
    expect(within(sheet).getByRole('group', { name: 'Staves' })).toBeInTheDocument()
    expect(within(sheet).queryByRole('radiogroup', { name: 'Mode' })).not.toBeInTheDocument()
    switchesAre(within(menu).getByRole('region', { name: 'Every view' }), 'Keys')
    await user.click(within(sheet).getByRole('button', { name: 'About Layout' }))
    expect(await screen.findByRole('dialog', { name: 'Layout' })).toHaveTextContent(
      'On A4 pages as printed; in lines one under the other, scrolled down; or in one line, scrolled across',
    )
  })

  it('heads Diagrams’ own with its name: its Mode, then its Lyrics, and nothing of the sheet music’s', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    act(() => setScoreView(settingsStore, { music: 'diagrams' }))
    const menu = await openView(user, 'Diagrams')
    expect(groupsOf(menu)).toEqual(['Show the music as', 'Diagrams', 'Every view'])
    const diagrams = within(menu).getByRole('region', { name: 'Diagrams' })
    const mode = within(diagrams).getByRole('radiogroup', { name: 'Mode' })
    expect(segmentsOf(mode)).toEqual(['Animated', 'Summary'])
    expect(within(mode).getByRole('radio', { name: 'Animated' })).toBeChecked()
    switchesAre(diagrams, 'Lyrics')
    expect(within(menu).queryByRole('radiogroup', { name: 'Layout' })).not.toBeInTheDocument()
    expect(within(menu).queryByRole('group', { name: 'Staves' })).not.toBeInTheDocument()
    await user.click(within(mode).getByRole('radio', { name: 'Summary' }))
    expect(settingsStore.getState().scoreView.diagrams).toBe('summary')
    await user.click(within(diagrams).getByRole('button', { name: 'About Mode' }))
    expect(await screen.findByRole('dialog', { name: 'Mode' })).toHaveTextContent(
      'Animated: the chord sounding and the next, moving with the music. Summary: the song’s chords all at once, the one sounding marked.',
    )
  })

  it('greys Chords over lyrics where the music has no words, saying why, and shows Diagrams in its place', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/bz5')
    expect(within(musicArea()).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
    const menu = await openView(user, 'Diagrams')
    const lyrics = within(menu).getByRole('radio', { name: 'Chords over lyrics' })
    expect(lyrics).toHaveAttribute('aria-disabled', 'true')
    expect(lyrics).toHaveAttribute('title', 'Needs words')
    expect(lyrics).toHaveAccessibleDescription('Needs words')
    expect(within(menu).getByRole('radio', { name: 'Diagrams' })).toBeChecked()
    expect(groupsOf(menu)).toEqual(['Show the music as', 'Diagrams', 'Every view'])
    await user.click(lyrics)
    // The view saved stays, for the songs that have words.
    expect(settingsStore.getState().scoreView.music).toBe('lyrics')
    expect(within(musicArea()).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
  })

  it('greys the chord views where the music has no chord symbols, and shows its sheet music', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/my-1', {
      storage: withSongOfNoChords(),
    })
    expect(within(musicArea()).getByRole('region', { name: 'Sheet music' })).toBeInTheDocument()
    const menu = await openView(user, 'Sheet music')
    for (const view of ['Chords over lyrics', 'Diagrams', 'Grid']) {
      const tile = within(menu).getByRole('radio', { name: view })
      expect(tile).toHaveAttribute('aria-disabled', 'true')
      expect(tile).toHaveAccessibleDescription('Needs chord symbols')
    }
    expect(within(menu).getByRole('radio', { name: 'Sheet music' })).toBeChecked()
    expect(settingsStore.getState().scoreView.music).toBe('grid')
  })

  it('reads in Russian, its tools row, each view’s part and what each greyed view needs', async () => {
    const user = userEvent.setup()
    await savedAs('lyrics', '/play/bz5', { locale: 'ru' })
    await user.click(screen.getByRole('button', { name: 'Вид: Схемы аккордов' }))
    const menu = await screen.findByRole('dialog', { name: 'Вид' })
    expect(within(menu).getByRole('radio', { name: 'Аккорды над текстом' })).toHaveAttribute(
      'title',
      'Нужен текст',
    )
    expect(untranslated(document.body)).toEqual([])
    await user.click(within(menu).getByRole('button', { name: 'Подробнее: Режим' }))
    await screen.findByRole('dialog', { name: 'Режим' })
    expect(untranslated(document.body)).toEqual([])
    await user.keyboard('{Escape}')
    await user.click(within(menu).getByRole('radio', { name: 'Ноты' }))
    const layout = within(menu).getByRole('radiogroup', { name: 'Расположение' })
    expect(segmentsOf(layout)).toEqual(['Страницы', 'Прокрутка вниз', 'Прокрутка вбок'])
    await user.click(within(menu).getByRole('button', { name: 'Подробнее: Как показывать музыку' }))
    await screen.findByRole('dialog', { name: 'Как показывать музыку' })
    expect(untranslated(document.body)).toEqual([])
  })

  it('heads Chords over lyrics’ own with its name: its diagrams pinned and its text size (ADR 0108)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent')
    const menu = await openView(user, 'Chords over lyrics')
    expect(groupsOf(menu)).toEqual(['Show the music as', 'Chords over lyrics', 'Every view'])
    const lyrics = within(menu).getByRole('region', { name: 'Chords over lyrics' })
    switchesAre(lyrics, 'Diagrams pinned')
    await user.click(within(lyrics).getByRole('switch', { name: 'Diagrams pinned' }))
    expect(settingsStore.getState().scoreView.pinned).toBe(false)
    const size = within(lyrics).getByRole('group', { name: 'Text size' })
    expect(size).toHaveTextContent('100%')
    const larger = within(size).getByRole('button', { name: 'Larger text' })
    for (const step of [115, 130, 150]) {
      await user.click(larger)
      expect(settingsStore.getState().scoreView.textSize).toBe(step)
      expect(size).toHaveTextContent(`${step}%`)
    }
    expect(larger).toBeDisabled()
    const smaller = within(size).getByRole('button', { name: 'Smaller text' })
    for (let i = 0; i < 5; i++) await user.click(smaller)
    expect(settingsStore.getState().scoreView.textSize).toBe(80)
    expect(smaller).toBeDisabled()
    // The song's words take it, its chords with them.
    expect(document.querySelector('[data-line="0"]')?.parentElement).toHaveStyle({
      fontSize: '80%',
    })
  })

  it('heads the Grid’s own with its name: its Lyrics, the words under its beats (ADR 0108)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/silent')
    const menu = await openView(user, 'Grid')
    expect(groupsOf(menu)).toEqual(['Show the music as', 'Grid', 'Every view'])
    const grid = within(menu).getByRole('region', { name: 'Grid' })
    switchesAre(grid, 'Lyrics')
    expect(within(musicArea()).getByRole('button', { name: /^Bar 1: C · Silent$/ })).toBeVisible()
    await user.click(within(grid).getByRole('switch', { name: 'Lyrics' }))
    expect(settingsStore.getState().scoreView.lyrics).toBe(false)
    expect(within(musicArea()).getByRole('button', { name: 'Bar 1: C' })).toBeInTheDocument()
  })

  it('greys the Lyrics of a song of no words, saying why in its ⓘ (ADR 0108)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/bz5')
    const menu = await openView(user, 'Grid')
    const lyrics = within(menu).getByRole('switch', { name: 'Lyrics' })
    expect(lyrics).toHaveAttribute('aria-disabled', 'true')
    await user.click(within(menu).getByRole('button', { name: 'About Lyrics' }))
    expect(await screen.findByRole('dialog', { name: 'Lyrics' })).toHaveTextContent(
      'The music has no words',
    )
    await user.keyboard('{Escape}')
    await user.click(within(menu).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    expect(within(menu).getByRole('switch', { name: 'Lyrics' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('reads Chords over lyrics’ and the Grid’s own in Russian', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent', { locale: 'ru' })
    await user.click(screen.getByRole('button', { name: 'Вид: Аккорды над текстом' }))
    const menu = await screen.findByRole('dialog', { name: 'Вид' })
    expect(within(menu).getByRole('group', { name: 'Размер текста' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    expect(within(menu).getByRole('switch', { name: 'Текст' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
