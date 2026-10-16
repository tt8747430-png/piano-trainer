import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
const key = (name: string) => within(keyboard()).getByRole('button', { name })
const name = () => screen.getAllByRole('heading', { level: 2 })[0]
const played = () => screen.getByRole('region', { name: 'Played' })
const playedNames = () =>
  within(played())
    .getAllByRole('listitem')
    .map((item) => item.textContent?.split(' ')[0])

/** Turns on remembering the chords played, in the Chord finder's settings. */
async function remember(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Chord finder settings' }))
  await user.click(screen.getByRole('switch', { name: /Remember the chords played/ }))
  await user.click(screen.getByRole('button', { name: 'Close' }))
}

describe('Practice → Chord finder', () => {
  it('names the keys tapped, keeps them in the URL, and reads them every way they read', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Chord finder' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Play a chord on your keyboard, or tap its keys.')).toBeInTheDocument()
    for (const each of ['A3', 'C4', 'E4', 'G4']) await user.click(key(each))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ keys: '57-60-64-67' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Am7' })).toBeInTheDocument()
    const tones = screen.getByRole('list', { name: 'Its notes, from the bass up' })
    expect(
      within(tones)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['1A', '♭3C', '5E', '♭7G'])
    await user.click(screen.getByRole('button', { name: 'Read as C6/A' }))
    expect(screen.getByRole('heading', { level: 2, name: 'C6/A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Read as C6/A' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('writes only the chord down now on the staff, and nothing once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    const staff = () => screen.getByRole('region', { name: 'On the staff' })
    expect(within(staff()).getByText('The chord you play is written here.')).toBeInTheDocument()
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
    await waitFor(() =>
      expect(within(staff()).getByText('The chord you play is written here.')).toBeInTheDocument(),
    )
    expect(name()).toHaveTextContent(/^C$/)
  })

  it('remembers the chords played where asked, on the device too, and forgets them once not', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    await remember(user)
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
    await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    expect(playedNames()).toEqual(['C', 'F'])
    await user.click(screen.getByRole('button', { name: 'Chord finder settings' }))
    await user.click(screen.getByRole('switch', { name: /Remember the chords played/ }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.getByRole('region', { name: 'On the staff' })).toBeInTheDocument()
    expect(JSON.parse(storage.getItem('pt-settings') ?? '{}').state.chordFinder.chords).toEqual([])
  })

  it('keeps a chord tapped once, however often the page opens on it', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const first = await renderApp('/practice/chord-finder', { storage })
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    await remember(user)
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

  it('hides the keys a chord is in, where asked', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=60-64-67')
    expect(await screen.findByRole('region', { name: 'In these keys' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Chord finder settings' }))
    await user.click(screen.getByRole('switch', { name: 'Show the keys it is in' }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('region', { name: 'In these keys' })).not.toBeInTheDocument()
  })

  it('says an inversion, and names it by its root alone where asked', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chord-finder?keys=52-60-67')
    expect(await screen.findByRole('heading', { level: 2, name: 'C/E' })).toBeInTheDocument()
    expect(screen.getByText(/^Tapped · Major triad · 1st inversion/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Chord finder settings' }))
    await user.click(screen.getByRole('switch', { name: /^Name an inversion over its bass/ }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
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
    const user = userEvent.setup()
    const { midi: piano } = await renderApp('/practice/chord-finder')
    await screen.findByRole('heading', { level: 1, name: 'Chord finder' })
    await remember(user)
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
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
    await user.click(key('C4'))
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('keys'))
    expect(screen.getByText('The chord you play is written here.')).toBeInTheDocument()
  })

  it('opens the chord in Chords, and the keys that hold it', async () => {
    await renderApp('/practice/chord-finder?keys=60-64-67')
    const open = await screen.findByRole('link', { name: 'Open in Chords' })
    expect(open.getAttribute('href')).toMatch(/^\/practice\/chords/)
    expect(screen.getByRole('region', { name: 'In these keys' })).toBeInTheDocument()
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
