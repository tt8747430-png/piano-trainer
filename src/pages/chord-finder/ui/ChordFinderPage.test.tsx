import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { SETTINGS_STORAGE_KEY, SETTINGS_VERSION } from '@/entities/settings'
import { setChordFinder } from '@/features/set-preference'
import { createMemoryStorage, SHORTEST_PRESS_MS } from '@/shared/lib'
import { keyParam, midi, note } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
const key = (name: string) => within(keyboard()).getByRole('button', { name })
const name = () => screen.getAllByRole('heading', { level: 2 })[0]
/** What the chord is, in words, under its name. */
const about = () => name()?.nextElementSibling?.textContent
/** The chords played before the one on the page, each by its symbol; none while there are none. */
const playedNames = () => {
  const played = screen.queryByRole('region', { name: 'Played' })
  return played ? [...played.querySelectorAll('[aria-label]')].map((chip) => chip.textContent) : []
}
/** A key let go stays down for the shortest press: past it, the chord is the one played last. */
const pastShortestPress = () =>
  act(() => new Promise((done) => setTimeout(done, SHORTEST_PRESS_MS + 50)))
/** Opens the Chord finder's settings off its gear. */
async function openSettings(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Chord finder settings' }))
  return screen.findByRole('dialog', { name: 'Chord finder settings' })
}

/** A device whose Chord finder remembers the chords played, as its Settings page saves it (A24). */
function remembering() {
  const storage = createMemoryStorage()
  storage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({ state: { chordFinder: { remember: true } }, version: SETTINGS_VERSION }),
  )
  return storage
}

describe('Practice → Chord finder', () => {
  it('offers chords to try while empty, and names the one tried (R32)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(screen.getByRole('heading', { level: 2, name: 'Play a chord' })).toBeInTheDocument()
    expect(screen.getByText('Hold three or more keys, here or on your piano')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Spelled in: C major/ })).toBeInTheDocument()
    const tries = screen.getByRole('list', { name: 'Try a chord' })
    await user.click(within(tries).getByRole('button', { name: 'A minor 7th' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ keys: '57-60-64-67' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Am7' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Try a chord' })).toBeNull()
  })

  it('names the keys tapped, keeps them in the URL, and reads them every way they read', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    for (const each of ['A3', 'C4', 'E4', 'G4']) await user.click(key(each))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ keys: '57-60-64-67' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Am7' })).toBeInTheDocument()
    expect(about()).toBe('A minor 7th')
    // Each key says its part of the chord and its note; each note a tile with its part.
    expect(['A3', 'C4', 'E4', 'G4'].map((each) => key(each).textContent)).toEqual([
      'Root, A',
      '3rd, C',
      '5th, E',
      '7th, G',
    ])
    expect(
      within(screen.getByRole('list', { name: 'The chord’s notes' }))
        .getAllByRole('listitem')
        .map((tile) => tile.textContent),
    ).toEqual(['Aroot · bass', 'C3rd', 'E5th', 'G7th'])
    const readings = screen.getByRole('region', { name: 'Also read as' })
    await user.click(within(readings).getByRole('button', { name: 'Read as C6/A' }))
    expect(screen.getByRole('heading', { level: 2, name: 'C6/A' })).toBeInTheDocument()
    // The reading shown leaves the others; the first is offered back.
    expect(within(readings).queryByRole('button', { name: 'Read as C6/A' })).toBeNull()
    expect(within(readings).getByRole('button', { name: 'Read as Am7' })).toBeInTheDocument()
  })

  it('names a chord played on the MIDI keyboard, and keeps it named once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    act(() => {
      for (const each of [48, 52, 55]) piano.press(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent(/^C$/))
    act(() => {
      for (const each of [48, 52, 55]) piano.release(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent(/^C$/))
    // Nothing is remembered unless asked.
    expect(playedNames()).toEqual([])
  })

  it('remembers the chords played where asked, on the device too, and forgets them once not', async () => {
    const storage = remembering()
    const first = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    for (const chord of [[48, 52, 55], [60], [53, 57, 60]]) {
      act(() => {
        for (const each of chord) first.midi.press(midi(each))
      })
      act(() => {
        for (const each of chord) first.midi.release(midi(each))
      })
      await pastShortestPress()
    }
    // The newest is the chord on the page; Played is what came before it.
    await waitFor(() => expect(name()).toHaveTextContent(/^F$/))
    await waitFor(() => expect(playedNames()).toEqual(['C']))
    first.unmount()
    const second = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(playedNames()).toEqual(['C'])
    act(() => setChordFinder(second.settingsStore, { remember: false }))
    expect(playedNames()).toEqual([])
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([])
  })

  it('keeps a chord tapped once, however often the page opens on it', async () => {
    const user = userEvent.setup()
    const storage = remembering()
    const first = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    for (const each of ['C4', 'E4', 'G4']) await user.click(key(each))
    await waitFor(() => expect(name()).toHaveTextContent(/^C$/))
    first.unmount()
    for (let visit = 0; visit < 2; visit++) {
      const again = await renderApp('/practice/chord-finder?keys=60-64-67', { storage })
      await screen.findByRole('heading', { level: 2, name: 'C' })
      expect(playedNames()).toEqual([])
      again.unmount()
    }
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([
      [60, 64, 67],
    ])
  })

  it('hides its keys from the bar’s Piano and brings them back, remembered (R34)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=60-64-67')
    await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(screen.getByRole('button', { name: 'Piano' }))
    await user.click(await screen.findByRole('switch', { name: 'Show the piano' }))
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(screen.queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument(),
    )
    expect(settingsStore.getState().keyboard.folded).toBe(true)
    expect(screen.getByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Piano' }))
    await user.click(await screen.findByRole('switch', { name: 'Show the piano' }))
    await user.keyboard('{Escape}')
    expect(await screen.findByRole('group', { name: 'Keyboard' })).toBeInTheDocument()
    expect(settingsStore.getState().keyboard.folded).toBe(false)
  })

  it('holds its Settings and Piano in its bar, naming no chord there: its stage names it', async () => {
    await renderApp('/practice/chord-finder?keys=60-64-67')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.getByRole('button', { name: 'Chord finder settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Piano' })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="held-chord"]')).toBeNull()
  })

  it('asks for MIDI with the keys folded and nothing tapped', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder')
    await screen.findByRole('group', { name: 'Keyboard' })
    act(() =>
      settingsStore.setState((state) => ({ keyboard: { ...state.keyboard, folded: true } })),
    )
    expect(
      screen.getByText('Play it on a connected piano, or show the keyboard to tap one.'),
    ).toBeInTheDocument()
  })

  it('hides the keys a chord is in, where asked', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=60-64-67')
    expect(await screen.findByRole('button', { name: /^In these keys/ })).toBeInTheDocument()
    act(() => setChordFinder(settingsStore, { inKeys: false }))
    expect(screen.queryByRole('button', { name: /^In these keys/ })).not.toBeInTheDocument()
  })

  it('paints the key’s scale on the keys where asked, the chord’s own keys over it', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=60-64-67&key=G')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F sharp 4' })).not.toHaveTextContent('F♯')
    act(() => setChordFinder(settingsStore, { scale: true }))
    expect(within(keyboard).getByRole('button', { name: 'F sharp 4' })).toHaveTextContent('F♯')
    expect(within(keyboard).getByRole('button', { name: 'F sharp 2' })).toHaveTextContent('F♯')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('Root, C')
  })

  it('says an inversion, and names it by its root alone where asked', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=52-60-67')
    expect(await screen.findByRole('heading', { level: 2, name: 'C/E' })).toBeInTheDocument()
    expect(about()).toMatch(/^C major triad, 1st inversion/)
    act(() => setChordFinder(settingsStore, { slash: false }))
    expect(screen.getByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(about()).toMatch(/^C major triad, 1st inversion/)
  })

  it('says how the keys are laid out: drop 2, a shell, stacked 4ths', async () => {
    const { router } = await renderApp('/practice/chord-finder?keys=48-55-59-64')
    await waitFor(() => expect(about()).toMatch(/ · Drop 2$/))
    await act(() => router.navigate({ to: '/practice/chord-finder', search: { keys: '48-64-70' } }))
    await waitFor(() => expect(about()).toMatch(/ · Shell voicing$/))
    await act(() =>
      router.navigate({ to: '/practice/chord-finder', search: { keys: '50-55-60-65' } }),
    )
    await waitFor(() => expect(about()).toMatch(/Stacked 4ths$/))
  })

  it('names an altered dominant as a chart writes it', async () => {
    await renderApp('/practice/chord-finder?keys=48-64-70-73-75-80')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    await waitFor(() => expect(about()).toMatch(/Altered dominant: C7alt$/))
  })

  it('names a chord held on the MIDI keyboard, and reads it on once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder', { storage: remembering() })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    act(() => {
      for (const each of [48, 52, 55, 58]) piano.press(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent('C7'))
    act(() => piano.release(midi(48)))
    expect(name()).toHaveTextContent('C7')
    act(() => {
      for (const each of [52, 55, 58]) piano.release(midi(each))
    })
    await pastShortestPress()
    expect(name()).toHaveTextContent('C7')
    act(() => {
      for (const each of [53, 57, 60]) piano.press(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent(/^F$/))
    await waitFor(() => expect(playedNames()).toEqual(['C7']))
  })

  it('reads each chord played under the sustain pedal on its own', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder', { storage: remembering() })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    act(() => piano.pedal(true))
    for (const chord of [
      [48, 52, 55],
      [53, 57, 60],
    ]) {
      act(() => {
        for (const each of chord) piano.press(midi(each))
      })
      act(() => {
        for (const each of chord) piano.release(midi(each))
      })
      await pastShortestPress()
    }
    await waitFor(() => expect(name()).toHaveTextContent(/^F$/))
    await waitFor(() => expect(playedNames()).toEqual(['C']))
  })

  it('prints the chord, its readings and the key with ♯ and ♭, as the sheets print them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder?keys=61-64-68-71&key=C%23m')
    expect(await screen.findByRole('heading', { level: 2, name: 'C♯m7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /in: C♯ minor$/ })).toHaveTextContent('C♯')
    await user.click(screen.getByRole('button', { name: 'Read as E6/C♯' }))
    expect(screen.getByRole('heading', { level: 2, name: 'E6/C♯' })).toBeInTheDocument()
    // What the URL holds keeps its ASCII.
    expect(router.state.location.search).toMatchObject({ keys: '61-64-68-71', key: 'C#m' })
    const key = keyParam({ tonic: note('C', 1), minor: true })
    const tap = (keys: string) =>
      act(() => router.navigate({ to: '/practice/chord-finder', search: { keys, key } }))
    await tap('54-61')
    expect(await screen.findByRole('heading', { level: 2, name: 'F♯5' })).toBeInTheDocument()
    await tap('54')
    expect(await screen.findByRole('heading', { level: 2, name: 'F♯' })).toBeInTheDocument()
  })

  it('names a 5th as its power chord', async () => {
    await renderApp('/practice/chord-finder?keys=43-50')
    expect(await screen.findByRole('heading', { level: 2, name: 'G5' })).toBeInTheDocument()
    expect(screen.getByText(/Power chord · Perfect fifth/)).toBeInTheDocument()
  })

  it('spells the keys in the key chosen', async () => {
    await renderApp('/practice/chord-finder?keys=54-58-61&key=G%E2%99%AD')
    expect(await screen.findByRole('heading', { level: 2, name: 'G♭' })).toBeInTheDocument()
  })

  it('clears the keys from its floating bar, offered only once there is something to clear', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(screen.queryByRole('button', { name: 'Clear the keys' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument()
    await user.click(key('C4'))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear the keys' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('keys'))
    // The floating bar's pieces leave as they go.
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Clear the keys' })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Play a chord' })).toBeInTheDocument()
  })

  it('lets the whole chord go at a tap on its root, and a key of another note alone', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder?keys=60-64-67-71')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    await user.click(key('E4'))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ keys: '60-67-71' }))
    await user.click(key('C4'))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('keys'))
  })

  it('forgets the chords played from its Settings, on the device too, with Undo, and keeps remembering after', async () => {
    const user = userEvent.setup()
    const storage = remembering()
    const { midi: piano } = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    const play = async (chord: number[]) => {
      act(() => {
        for (const each of chord) piano.press(midi(each))
        for (const each of chord) piano.release(midi(each))
      })
      await pastShortestPress()
    }
    await play([48, 52, 55])
    await play([53, 57, 60])
    await waitFor(() => expect(playedNames()).toEqual(['C']))
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('button', { name: 'Forget the chords played' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(playedNames()).toEqual([]))
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([])
    expect(await screen.findByText('Chords played forgotten')).toBeInTheDocument()
    await play([55, 59, 62])
    await play([57, 61, 64])
    await waitFor(() => expect(playedNames()).toEqual(['G']))
  })

  it('opens the chord in Chords, and the keys that hold it', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=60-64-67')
    const open = await screen.findByRole('link', { name: 'Open in Chords' })
    expect(open.getAttribute('href')).toMatch(/^\/practice\/chords/)
    await user.click(screen.getByRole('button', { name: /^In these keys/ }))
    expect(await screen.findByRole('dialog', { name: 'In these keys' })).toBeInTheDocument()
  })

  it('opens an inversion in Chords over its bass, and never a chord Chords cannot show over it', async () => {
    await renderApp('/practice/chord-finder?keys=52-60-67')
    expect(
      (await screen.findByRole('link', { name: 'Open in Chords' })).getAttribute('href'),
    ).toMatch(/inversion=1/)
  })

  it('offers no way into Chords for a chord of five notes over a bass it cannot keep', async () => {
    await renderApp('/practice/chord-finder?keys=40-58-62-67-72')
    expect(await screen.findByRole('heading', { level: 2, name: 'C9/E' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Open in Chords' })).not.toBeInTheDocument()
  })

  it('opens from Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    // The phone's list and the laptop's cards both stand in jsdom: the first is the list's.
    const [row] = await screen.findAllByRole('link', { name: /^Chord finder/ })
    await user.click(row ?? document.body)
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/chord-finder'))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/chord-finder?keys=60-64-67', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Определитель аккордов' })
    expect(untranslated(document.body)).toEqual([])
  })
})
