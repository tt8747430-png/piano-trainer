import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

describe('Practice → Intervals', () => {
  it('writes a card for every interval, within the octave and past it, each group folding as the learner leaves it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/intervals')
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
    expect(third).toHaveTextContent('Semitones: 3 · Size: 1½ tones')
    expect(third).toHaveTextContent('Imperfect consonance')
    expect(screen.getByRole('article', { name: 'Tritone' })).toHaveTextContent('A4 · d5')
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(within(compound).getByRole('article', { name: 'Augmented ninth' })).toHaveTextContent(
      'In chords: #9',
    )
    // Folded, as the other explorers' sections: saved in the settings, for every visit.
    await user.click(within(compound).getByRole('button', { name: 'Past the octave' }))
    expect(within(compound).getByRole('button', { name: 'Past the octave' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(settingsStore.getState().foldedSections).toContain('intervals.compound')
  })

  it('says each size in tones as it is said: a semitone, one tone, tones', async () => {
    await renderApp('/practice/intervals')
    expect(await screen.findByRole('article', { name: 'Minor second' })).toHaveTextContent(
      'Semitones: 1 · Size: a semitone',
    )
    expect(screen.getByRole('article', { name: 'Major second' })).toHaveTextContent(
      'Semitones: 2 · Size: 1 tone ·',
    )
    expect(screen.getByRole('article', { name: 'Major third' })).toHaveTextContent(
      'Semitones: 4 · Size: 2 tones',
    )
  })

  it('says each size in tones in Russian', async () => {
    await renderApp('/practice/intervals', { locale: 'ru' })
    const simple = await screen.findByRole('region', { name: 'В пределах октавы' })
    const sizes = within(simple)
      .getAllByRole('article')
      .map((card) => /Величина: [^·]+/.exec(card.textContent)?.[0].trim())
    expect(sizes.slice(1, 7)).toEqual([
      'Величина: полутон',
      'Величина: 1 тон',
      'Величина: 1½ тона',
      'Величина: 2 тона',
      'Величина: 2½ тона',
      'Величина: 3 тона',
    ])
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
      within(await screen.findByRole('group', { name: 'Root' })).getByRole('radio', {
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
