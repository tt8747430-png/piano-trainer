import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import { midi } from '@/shared/lib/music'

const keyboard = () => screen.getByRole('group', { name: 'Keyboard' })
/** Puts keys down at once, as a hand strikes a chord, and lifts them. */
function strike(...names: string[]) {
  const keys = names.map((name) => within(keyboard()).getByRole('button', { name }))
  keys.forEach((key, i) => fireEvent.pointerDown(key, { pointerId: i + 1, pointerType: 'touch' }))
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

  it('empties the trail on Clear', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/free-play')
    await screen.findByRole('heading', { level: 1, name: 'Free play' })
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
