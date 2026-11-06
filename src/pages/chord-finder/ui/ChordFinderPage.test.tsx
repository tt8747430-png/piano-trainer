import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { shownText } from '@/shared/test/shown-text'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { SETTINGS_STORAGE_KEY, SETTINGS_VERSION } from '@/entities/settings'
import { setChordFinder } from '@/features/set-preference'
import { createMemoryStorage } from '@/shared/lib'
import { keyParam, midi, note } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
const key = (name: string) => within(keyboard()).getByRole('button', { name })
const name = () => screen.getAllByRole('heading', { level: 2 })[0]
const played = () => screen.getByRole('region', { name: 'Played' })
/** The staff's chords: none where the staff is not drawn, as while nothing has been played (R32). */
const staffItems = () => {
  const staff = screen.queryByRole('region', { name: /^(On the staff|Played)$/ })
  return staff ? within(staff).queryAllByRole('listitem') : []
}
const playedNames = () =>
  within(played())
    .getAllByRole('listitem')
    .map((item) => item.textContent?.split(' ')[0])

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
  it('offers chords to try while empty, with no empty staff, and names the one tried (R32)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(screen.queryByRole('region', { name: 'On the staff' })).toBeNull()
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
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Chord finder' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Hold three or more keys; the chord is named as you play.'),
    ).toBeInTheDocument()
    for (const each of ['A3', 'C4', 'E4', 'G4']) await user.click(key(each))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ keys: '57-60-64-67' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Am7' })).toBeInTheDocument()
    // Each key says its degree and, under it, its note.
    expect(['A3', 'C4', 'E4', 'G4'].map((each) => shownText(key(each)))).toEqual([
      expect.stringMatching(/1A$/),
      expect.stringMatching(/♭3C$/),
      expect.stringMatching(/5E$/),
      expect.stringMatching(/♭7G$/),
    ])
    await user.click(screen.getByRole('button', { name: 'Read as C6/A' }))
    expect(screen.getByRole('heading', { level: 2, name: 'C6/A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Read as C6/A' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    // The staff writes the chord as it is read.
    await waitFor(() =>
      expect(
        within(screen.getByRole('region', { name: 'On the staff' })).getByRole('listitem'),
      ).toHaveTextContent(/^C6\/A/),
    )
  })

  it('writes only the chord down now on the staff, and nothing once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    const staff = () => screen.getByRole('region', { name: 'On the staff' })
    // Nothing played: no staff yet.
    expect(staffItems()).toHaveLength(0)
    act(() => {
      for (const each of [48, 52, 55]) piano.press(midi(each))
    })
    await waitFor(() =>
      expect(
        within(staff())
          .getAllByRole('listitem')
          .map((item) => item.textContent),
      ).toEqual(['C Major triad']),
    )
    act(() => {
      for (const each of [48, 52, 55]) piano.release(midi(each))
    })
    await waitFor(() => expect(staffItems()).toHaveLength(0))
    expect(name()).toHaveTextContent(/^C$/)
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
      await waitFor(() => expect(screen.queryByText(/^Held/)).not.toBeInTheDocument())
    }
    await waitFor(() => expect(playedNames()).toEqual(['C', 'F']))
    first.unmount()
    const second = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(playedNames()).toEqual(['C', 'F'])
    act(() => setChordFinder(second.settingsStore, { remember: false }))
    expect(staffItems()).toHaveLength(0)
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([])
  })

  it('keeps a chord tapped once, however often the page opens on it', async () => {
    const user = userEvent.setup()
    const storage = remembering()
    const first = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    for (const each of ['C4', 'E4', 'G4']) await user.click(key(each))
    await waitFor(() => expect(playedNames()).toEqual(['C']))
    first.unmount()
    for (let visit = 0; visit < 2; visit++) {
      const again = await renderApp('/practice/chord-finder?keys=60-64-67', { storage })
      await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
      expect(playedNames()).toEqual(['C'])
      again.unmount()
    }
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([
      [60, 64, 67],
    ])
  })

  it('hides its keys from the bar’s Keyboard and brings them back, remembered, nothing floating (R34)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=60-64-67')
    await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(screen.getByRole('button', { name: 'Keyboard' }))
    expect(screen.queryByRole('group', { name: 'Keyboard' })).not.toBeInTheDocument()
    expect(settingsStore.getState().keyboard.folded).toBe(true)
    expect(screen.getByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Keys' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Keyboard' }))
    expect(keyboard()).toBeInTheDocument()
    expect(settingsStore.getState().keyboard.folded).toBe(false)
  })

  it('holds Sustain and Keyboard in its bar, naming no chord there: its stage names it', async () => {
    await renderApp('/practice/chord-finder?keys=60-64-67')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.getByRole('button', { name: /^Sustain pedal/ })).toBeInTheDocument()
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
    expect(await screen.findByRole('region', { name: 'In these keys' })).toBeInTheDocument()
    act(() => setChordFinder(settingsStore, { inKeys: false }))
    expect(screen.queryByRole('region', { name: 'In these keys' })).not.toBeInTheDocument()
  })

  it('paints the key’s scale on the keys where asked, the chord’s own keys over it', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=60-64-67&key=G')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F sharp 4' })).not.toHaveTextContent('F♯')
    act(() => setChordFinder(settingsStore, { scale: true }))
    expect(within(keyboard).getByRole('button', { name: 'F sharp 4' })).toHaveTextContent('F♯')
    expect(within(keyboard).getByRole('button', { name: 'F sharp 2' })).toHaveTextContent('F♯')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('1')
  })

  it('says an inversion, and names it by its root alone where asked', async () => {
    const { settingsStore } = await renderApp('/practice/chord-finder?keys=52-60-67')
    expect(await screen.findByRole('heading', { level: 2, name: 'C/E' })).toBeInTheDocument()
    expect(screen.getByText(/^Tapped · Major triad · 1st inversion/)).toBeInTheDocument()
    act(() => setChordFinder(settingsStore, { slash: false }))
    expect(screen.getByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.getByText(/^Tapped · Major triad · 1st inversion/)).toBeInTheDocument()
  })

  it('says how the keys are laid out: drop 2, a shell, stacked 4ths', async () => {
    const { router } = await renderApp('/practice/chord-finder?keys=48-55-59-64')
    expect(await screen.findByText(/^Tapped · Major 7th · Drop 2$/)).toBeInTheDocument()
    await act(() => router.navigate({ to: '/practice/chord-finder', search: { keys: '48-64-70' } }))
    expect(await screen.findByText(/^Tapped · .*Shell voicing$/)).toBeInTheDocument()
    await act(() =>
      router.navigate({ to: '/practice/chord-finder', search: { keys: '50-55-60-65' } }),
    )
    expect(await screen.findByText(/^Tapped · .*Stacked 4ths$/)).toBeInTheDocument()
  })

  it('names an altered dominant as a chart writes it', async () => {
    await renderApp('/practice/chord-finder?keys=48-64-70-73-75-80')
    expect(await screen.findByText(/^Tapped · .*Altered dominant: C7alt$/)).toBeInTheDocument()
  })

  it('names a chord held on the MIDI keyboard, and reads it on once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder', { storage: remembering() })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    act(() => {
      for (const each of [48, 52, 55, 58]) piano.press(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent('C7'))
    expect(screen.getByText(/^Held/)).toBeInTheDocument()
    act(() => piano.release(midi(48)))
    expect(name()).toHaveTextContent('C7')
    act(() => {
      for (const each of [52, 55, 58]) piano.release(midi(each))
    })
    // A key let go stays down for the shortest press: then the chord is the one played last.
    await waitFor(() => expect(screen.getByText(/^Last played/)).toBeInTheDocument())
    expect(name()).toHaveTextContent('C7')
    act(() => {
      for (const each of [53, 57, 60]) piano.press(midi(each))
    })
    await waitFor(() => expect(name()).toHaveTextContent(/^F$/))
    await waitFor(() => expect(playedNames()).toEqual(['C7', 'F']))
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
      await waitFor(() => expect(screen.queryByText(/^Held/)).not.toBeInTheDocument())
    }
    await waitFor(() => expect(playedNames()).toEqual(['C', 'F']))
    expect(name()).toHaveTextContent(/^F$/)
  })

  it('prints the chord, its readings, the staff’s names and the key with ♯ and ♭, as the sheets print them', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder?keys=61-64-68-71&key=C%23m')
    expect(await screen.findByRole('heading', { level: 2, name: 'C♯m7' })).toBeInTheDocument()
    await waitFor(() =>
      expect(
        within(screen.getByRole('region', { name: 'On the staff' })).getByRole('listitem'),
      ).toHaveTextContent(/^C♯m7/),
    )
    expect(screen.getByRole('button', { name: /^Spelled in/ })).toHaveTextContent('C♯')
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

  it('clears the keys and the chords played, and waits for something to clear', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(screen.queryByRole('button', { name: 'More actions' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play' })).not.toBeInTheDocument()
    await user.click(key('C4'))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'More actions' }))
    await user.click(screen.getByRole('button', { name: 'Clear the keys' }))
    expect(screen.queryByRole('button', { name: 'Clear the keys' })).not.toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('keys'))
    expect(staffItems()).toHaveLength(0)
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

  it('forgets the chords played, on the device too, and keeps remembering after', async () => {
    const user = userEvent.setup()
    const storage = remembering()
    const { midi: piano } = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    const play = async (chord: number[]) => {
      act(() => {
        for (const each of chord) piano.press(midi(each))
      })
      act(() => {
        for (const each of chord) piano.release(midi(each))
      })
      await waitFor(() => expect(screen.queryByText(/^Held/)).not.toBeInTheDocument())
    }
    await play([48, 52, 55])
    await waitFor(() => expect(playedNames()).toEqual(['C']))
    await user.click(screen.getByRole('button', { name: 'More actions' }))
    await user.click(screen.getByRole('button', { name: 'Forget the chords played' }))
    expect(staffItems()).toHaveLength(0)
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([])
    await play([53, 57, 60])
    await waitFor(() => expect(playedNames()).toEqual(['F']))
  })

  it('opens the chord in Chords, and the keys that hold it', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=60-64-67')
    await user.click(await screen.findByRole('button', { name: 'More actions' }))
    const open = screen.getByRole('link', { name: 'Open in Chords' })
    expect(open.getAttribute('href')).toMatch(/^\/practice\/chords/)
    expect(screen.getByRole('region', { name: 'In these keys' })).toBeInTheDocument()
  })

  it('opens an inversion in Chords over its bass, and never a chord Chords cannot show over it', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=52-60-67')
    await user.click(await screen.findByRole('button', { name: 'More actions' }))
    expect(screen.getByRole('link', { name: 'Open in Chords' }).getAttribute('href')).toMatch(
      /inversion=1/,
    )
  })

  it('offers no way into Chords for a chord of five notes over a bass it cannot keep', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=40-58-62-67-72')
    expect(await screen.findByRole('heading', { level: 2, name: 'C9/E' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'More actions' }))
    expect(screen.queryByRole('link', { name: 'Open in Chords' })).not.toBeInTheDocument()
  })

  it('opens from Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Chord finder/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/chord-finder'))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/chord-finder?keys=60-64-67', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Определитель аккордов' })
    expect(untranslated(document.body)).toEqual([])
  })
})
