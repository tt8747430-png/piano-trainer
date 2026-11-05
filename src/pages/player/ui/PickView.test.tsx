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

/** Opens Pick your view from the foot bar, named by the view shown. */
async function openView(user: User, shown: string) {
  await user.click(await screen.findByRole('button', { name: `View: ${shown}` }))
  return screen.findByRole('dialog', { name: 'Pick your view' })
}

/** Opens the Player's Settings › Display: the view shown's own. */
async function openDisplay(user: User, settings = 'Player settings', display = 'Display') {
  await user.click(await screen.findByRole('button', { name: settings }))
  const sheet = await screen.findByRole('dialog', { name: settings })
  await user.click(within(sheet).getByRole('button', { name: display }))
  return screen.findByRole('dialog', { name: display })
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

/** The chips in a part of the menu (ADR 0115) are these, in order. */
function chipsAre(part: HTMLElement, ...names: string[]) {
  const chips = within(part)
    .getAllByRole('button')
    .filter((button) => button.hasAttribute('aria-pressed'))
  expect(chips.map((chip) => chip.lastElementChild?.textContent)).toEqual(names)
}

/** A chip of the menu, by its name. */
const chip = (part: HTMLElement, name: string) => within(part).getByRole('button', { name })

describe('the foot bar’s View (ADR 0108, R31-P)', () => {
  it('stands in the foot bar and names the view shown, opening Pick your view from there (R29)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const tools = await screen.findByRole('toolbar', { name: 'Practice tools' })
    expect(tools.closest('[data-area="foot"]')).toBeInTheDocument()
    const view = within(tools).getByRole('button', { name: 'View: Sheet' })
    expect(view).toHaveTextContent('Sheet')
    expect(view).toHaveAttribute('aria-haspopup')
    await user.click(view)
    const panel = await screen.findByRole('dialog', { name: 'Pick your view' })
    expect(
      segmentsOf(within(panel).getByRole('radiogroup', { name: 'Show the music as' })),
    ).toEqual(['Sheet', 'Grid', 'Diagrams', 'Lyrics'])
    await user.click(within(panel).getByRole('radio', { name: 'Diagrams' }))
    expect(settingsStore.getState().scoreView.music).toBe('diagrams')
    // A picture of the view chosen.
    expect(panel.querySelector('[data-view-picture="diagrams"]')).toBeInTheDocument()
    expect(within(tools).getByRole('button', { name: 'View: Diagrams' })).toHaveTextContent(
      'Diagrams',
    )
    await user.click(within(panel).getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('dialog', { name: 'Pick your view' })).not.toBeInTheDocument()
  })
})

describe('while Diagrams plays (ADR 0108)', () => {
  // The score's bar, one surface holding its buttons (ADR 0115, R31-P).
  const bar = () => {
    const found = document.querySelector('header[data-area="bar"]')
    if (!found) throw new Error('bar')
    return [found]
  }

  it('steps the bar aside, the transport and foot staying, back at a tap on the free room or once it stops', async () => {
    const user = userEvent.setup()
    await savedAs('diagrams', '/play/bz5')
    const transport = screen.getByRole('toolbar', { name: 'Playback' })
    // The transport is docked in its own row, never floating: it does not step aside (R31-P).
    const dock = transport.closest('[data-area="transport"]')
    expect(dock).toBeInTheDocument()
    await user.click(within(transport).getByRole('button', { name: 'Play' }))
    for (const area of bar()) {
      expect(area).toHaveAttribute('data-hidden')
      expect(area).toHaveAttribute('inert')
    }
    expect(dock).not.toHaveAttribute('data-hidden')
    // A tap on the free room brings the bar back, and the next sends it aside again.
    const title = screen.getByRole('heading', { level: 1 })
    await user.click(title)
    for (const area of bar()) expect(area).not.toHaveAttribute('data-hidden')
    await user.click(title)
    for (const area of bar()) expect(area).toHaveAttribute('data-hidden')
    expect(dock).not.toHaveAttribute('data-hidden')
    // Stopped (Space), everything is back.
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

describe('Show this when opening a song (ADR 0108, R29)', () => {
  it('opens a song’s Player with Pick your view open, once asked to, and a walk’s as it was', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/play/silent', { storage })
    // A setting, so on the Player's Settings › Display, never in the popover (A4).
    await openView(user, 'Sheet')
    expect(screen.queryByRole('checkbox', { name: 'Show this when opening a song' })).toBeNull()
    act(() => setScoreView(first.settingsStore, { askOnOpen: true }))
    first.unmount()
    const song = await renderApp('/play/bz5', { storage })
    expect(await screen.findByRole('dialog', { name: 'Pick your view' })).toBeInTheDocument()
    song.unmount()
    await renderApp('/play/walk', { storage })
    await screen.findByRole('button', { name: 'View: Sheet' })
    expect(screen.queryByRole('dialog', { name: 'Pick your view' })).not.toBeInTheDocument()
  })

  it('opens a song’s Player with Pick your view closed, as it is by default', async () => {
    await renderApp('/play/bz5')
    await screen.findByRole('button', { name: 'View: Sheet' })
    expect(screen.queryByRole('dialog', { name: 'Pick your view' })).not.toBeInTheDocument()
  })
})

describe('Pick your view greys a view the music cannot show (ADR 0108)', () => {
  it('greys Lyrics where the music has no words, saying why, and shows Diagrams in its place', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/bz5')
    expect(within(musicArea()).getByRole('region', { name: 'Diagrams' })).toBeInTheDocument()
    const panel = await openView(user, 'Diagrams')
    const lyrics = within(panel).getByRole('radio', { name: 'Lyrics' })
    expect(lyrics).toHaveAttribute('aria-disabled', 'true')
    expect(lyrics).toHaveAttribute('title', 'Needs words')
    expect(lyrics).toHaveAccessibleDescription('Needs words')
    // Said in the panel too, for a phone, which shows no tooltip.
    expect(panel).toHaveTextContent('Lyrics: Needs words')
    expect(within(panel).getByRole('radio', { name: 'Diagrams' })).toBeChecked()
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
    const panel = await openView(user, 'Sheet')
    for (const view of ['Lyrics', 'Diagrams', 'Grid']) {
      const segment = within(panel).getByRole('radio', { name: view })
      expect(segment).toHaveAttribute('aria-disabled', 'true')
      expect(segment).toHaveAccessibleDescription('Needs chord symbols')
    }
    expect(within(panel).getByRole('radio', { name: 'Sheet' })).toBeChecked()
    expect(settingsStore.getState().scoreView.music).toBe('grid')
  })

  it('reads in Russian, its chip, its views and what a greyed one needs', async () => {
    const user = userEvent.setup()
    await savedAs('lyrics', '/play/bz5', { locale: 'ru' })
    await user.click(screen.getByRole('button', { name: 'Вид: Схемы' }))
    const panel = await screen.findByRole('dialog', { name: 'Выберите вид' })
    expect(within(panel).getByRole('radio', { name: 'Текст' })).toHaveAttribute(
      'title',
      'Нужен текст',
    )
    expect(untranslated(document.body)).toEqual([])
  })
})

describe('Settings › Display, the view shown’s own (ADR 0108, R29)', () => {
  it('holds the sheet music’s own: its Layout first, then what it shows', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Sheet music'])
    const sheet = within(page).getByRole('region', { name: 'Sheet music' })
    const layout = within(sheet).getByRole('radiogroup', { name: 'Layout' })
    expect(segmentsOf(layout)).toEqual(['Page view', 'Vertical scroll', 'Panorama'])
    expect(within(layout).getByRole('radio', { name: 'Vertical scroll' })).toBeChecked()
    await user.click(within(layout).getByRole('radio', { name: 'Panorama' }))
    expect(settingsStore.getState().scoreView.layout).toBe('panorama')
    expect(within(sheet).queryByRole('radiogroup', { name: 'Mode' })).not.toBeInTheDocument()
    chipsAre(
      within(sheet).getByRole('group', { name: 'Show' }),
      'Chord symbols',
      'Chord positions',
      'Lyrics',
      'Finger numbers',
      'Note names',
    )
    await user.click(within(sheet).getByRole('button', { name: 'About Layout' }))
    expect(await screen.findByRole('dialog', { name: 'Layout' })).toHaveTextContent(
      'Panorama: the whole song in one line, scrolled across.',
    )
  })

  it('holds Diagrams’ own: its Mode, then its Lyrics, and nothing of the sheet music’s', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('diagrams', '/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Diagrams'])
    const diagrams = within(page).getByRole('region', { name: 'Diagrams' })
    const mode = within(diagrams).getByRole('radiogroup', { name: 'Mode' })
    expect(segmentsOf(mode)).toEqual(['Animated', 'Summary'])
    expect(within(mode).getByRole('radio', { name: 'Animated' })).toBeChecked()
    chipsAre(diagrams, 'Lyrics')
    expect(within(page).queryByRole('radiogroup', { name: 'Layout' })).not.toBeInTheDocument()
    await user.click(within(mode).getByRole('radio', { name: 'Summary' }))
    expect(settingsStore.getState().scoreView.diagrams).toBe('summary')
    await user.click(within(diagrams).getByRole('button', { name: 'About Mode' }))
    expect(await screen.findByRole('dialog', { name: 'Mode' })).toHaveTextContent(
      'Animated: the chord sounding and the next, moving with the music. Summary: the song’s chords all at once, the one sounding marked.',
    )
  })

  it('holds Chords over lyrics’ own: its diagrams pinned and its text size', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent')
    const page = await openDisplay(user)
    expect(groupsOf(page)).toEqual(['Chords over lyrics'])
    const lyrics = within(page).getByRole('region', { name: 'Chords over lyrics' })
    chipsAre(lyrics, 'Diagrams pinned')
    await user.click(chip(lyrics, 'Diagrams pinned'))
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

  it('holds the Grid’s own: its Lyrics, the words under its beats', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/silent')
    const page = await openDisplay(user)
    const grid = within(page).getByRole('region', { name: 'Grid' })
    chipsAre(grid, 'Lyrics')
    // The music under the sheet, out of reach while it is open.
    const bar = (name: string | RegExp) =>
      within(musicArea()).getByRole('button', { name, hidden: true })
    expect(bar(/^Bar 1: C · Silent$/)).toBeInTheDocument()
    await user.click(chip(grid, 'Lyrics'))
    expect(settingsStore.getState().scoreView.lyrics).toBe(false)
    expect(bar('Bar 1: C')).toBeInTheDocument()
  })

  it('greys the Lyrics of a song of no words, saying why in its tooltip', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('grid', '/play/bz5')
    const page = await openDisplay(user)
    const lyrics = chip(page, 'Lyrics')
    expect(lyrics).toBeDisabled()
    expect(lyrics).toHaveAttribute('title', 'The music has no words')
    act(() => setScoreView(settingsStore, { music: 'diagrams' }))
    expect(chip(page, 'Lyrics')).toBeDisabled()
  })

  it('reads in Russian', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await savedAs('lyrics', '/play/silent', { locale: 'ru' })
    const page = await openDisplay(user, 'Настройки плеера', 'Отображение')
    expect(within(page).getByRole('group', { name: 'Размер текста' })).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
    act(() => setScoreView(settingsStore, { music: 'grid' }))
    expect(chip(page, 'Текст')).toHaveAttribute('aria-pressed')
    act(() => setScoreView(settingsStore, { music: 'sheet' }))
    const layout = within(page).getByRole('radiogroup', { name: 'Расположение' })
    expect(segmentsOf(layout)).toEqual(['Страницы', 'Прокрутка вниз', 'Панорама'])
    expect(untranslated(document.body)).toEqual([])
  })
})
