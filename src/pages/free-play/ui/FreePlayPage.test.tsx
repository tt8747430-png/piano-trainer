import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { midi } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
/**
 * Puts keys down at once, as a hand strikes a chord, and lifts them. The clock stands still while
 * they go down: a busy runner must not spread one strike over more than a chord's 50 ms.
 */
function strike(...names: string[]) {
  const keys = names.map((name) => within(keyboard()).getByRole('button', { name }))
  const now = vi.spyOn(performance, 'now').mockReturnValue(performance.now())
  keys.forEach((key, i) => fireEvent.pointerDown(key, { pointerId: i + 1, pointerType: 'touch' }))
  now.mockRestore()
  keys.forEach((key, i) => fireEvent.pointerUp(key, { pointerId: i + 1, pointerType: 'touch' }))
}

describe('Practice → Free play', () => {
  it('writes and names a chord struck on the keys', async () => {
    await renderApp('/practice/free-play')
    expect(await screen.findByRole('heading', { level: 1, name: 'Free play' })).toBeInTheDocument()
    expect(screen.getByText('Play, and it is written here.')).toBeInTheDocument()
    strike('C4', 'E4', 'G4')
    expect(screen.getByRole('status')).toHaveTextContent('C Major triad')
  })

  it('writes a key played on the MIDI keyboard', async () => {
    const { midi: piano } = await renderApp('/practice/free-play')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
    act(() => piano.press(midi(64), { time: performance.now() }))
    expect(screen.getByRole('status')).toHaveTextContent('E')
  })

  it('empties the trail on Clear, which waits for something to clear', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/free-play')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled()
    strike('C4')
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText('Play, and it is written here.')).toBeInTheDocument()
  })

  it('spells what is played in the key chosen', async () => {
    await renderApp('/practice/free-play?key=D')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
    strike('F sharp 4')
    expect(screen.getByRole('status')).toHaveTextContent('F#')
  })

  it('marks a diagram in two colours with fingers, into the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/free-play?mode=mark')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
    const choose = (group: string, option: string) =>
      user.click(
        within(screen.getByRole('radiogroup', { name: group })).getByRole('radio', {
          name: option,
        }),
      )
    await choose('Colour', 'Right hand')
    await choose('Finger', '1')
    strike('C4')
    await choose('Colour', 'Left hand')
    await choose('Finger', '5')
    strike('G4')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ marks: '60a1,67b5' }))
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('15')
    expect(within(keyboard()).getByRole('button', { name: 'C4' })).toHaveTextContent('R')
    expect(within(keyboard()).getByRole('button', { name: 'G4' })).toHaveTextContent('L')
    expect(screen.getByRole('status')).toHaveTextContent('Perfect fifth')
    await choose('Colour', 'Right hand')
    await choose('Finger', '1')
    strike('C4')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ marks: '67b5' }))
  })

  it('opens a diagram sent as a link, and Clear takes its marks away', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/free-play?mode=mark&marks=60a3%2C64a%2C67b5')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('35')
    expect(screen.getByRole('status')).toHaveTextContent('C Major triad')
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('marks'))
  })

  it('opens from Practice’s eighth row', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Free play/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/free-play'))
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/free-play', { locale: 'ru' })
    await screen.findByRole('heading', { level: 1, name: 'Свободная игра' })
    expect(untranslated(document.body)).toEqual([])
  })
})
