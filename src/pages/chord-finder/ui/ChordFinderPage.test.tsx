import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { midi } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
const key = (name: string) => within(keyboard()).getByRole('button', { name })
const name = () => screen.getAllByRole('heading', { level: 2 })[0]
const played = () => screen.getByRole('region', { name: 'Played' })

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

  it('names a chord held on the MIDI keyboard, and reads it on once it is let go', async () => {
    const { midi: piano } = await renderApp('/practice/chord-finder')
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
    await waitFor(() =>
      expect(
        within(played())
          .getAllByRole('listitem')
          .map((item) => item.textContent?.split(' ')[0]),
      ).toEqual(['C7', 'F']),
    )
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
    expect(screen.getByText('Each chord you play is written here.')).toBeInTheDocument()
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
