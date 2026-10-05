import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

describe('Practice → Intervals', () => {
  it('writes a card for every interval, within the octave and past it', async () => {
    await renderApp('/practice/intervals')
    const simple = await screen.findByRole('region', { name: 'Within the octave' })
    expect(
      within(simple)
        .getAllByRole('article')
        .map((card) => within(card).getByRole('heading').textContent),
    ).toEqual([
      'Unison',
      'Minor second',
      'Major second',
      'Minor third',
      'Major third',
      'Perfect fourth',
      'Tritone',
      'Perfect fifth',
      'Minor sixth',
      'Major sixth',
      'Minor seventh',
      'Major seventh',
      'Octave',
    ])
    const third = screen.getByRole('article', { name: 'Minor third' })
    expect(third).toHaveTextContent('m3')
    expect(third).toHaveTextContent('Semitones: 3 · Tones: 1½')
    expect(third).toHaveTextContent('Imperfect consonance')
    expect(screen.getByRole('article', { name: 'Tritone' })).toHaveTextContent('A4 · d5')
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(within(compound).getByRole('article', { name: 'Augmented ninth' })).toHaveTextContent(
      'In chords: #9',
    )
  })

  it('plays an interval up, down and together, and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/intervals')
    const third = await screen.findByRole('article', { name: 'Minor third' })
    await user.click(within(third).getByRole('button', { name: 'Up' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    expect(within(third).getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
    await user.click(within(third).getByRole('button', { name: 'Down' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [63, 0],
      [60, 0.6],
    ])
    await user.click(within(third).getByRole('button', { name: 'Together' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
  })

  it('chooses the root, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/intervals')
    await user.click(
      within(await screen.findByRole('radiogroup', { name: 'Root' })).getByRole('radio', {
        name: 'D',
      }),
    )
    expect(router.state.location.search).toEqual({ root: 'D' })
    const fifth = screen.getByRole('article', { name: 'Perfect fifth' })
    await user.click(within(fifth).getByRole('button', { name: 'Together' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [62, 0],
      [69, 0],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/intervals', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Интервалы' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Малая терция' })).toHaveTextContent('м3')
  })
})
