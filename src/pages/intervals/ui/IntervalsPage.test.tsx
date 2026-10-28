import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { Sound } from '@/shared/lib/schedule'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

/** A row by its interval's name. */
const row = (name: string) =>
  screen.getByRole('button', { name: (said) => said.includes(name) && !said.startsWith('About') })

describe('Practice → Intervals', () => {
  it('lists a row for every interval, the tritone as A4 and d5 apart, each group folding as the learner leaves it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/intervals')
    const simple = await screen.findByRole('region', { name: 'Within the octave' })
    expect(
      within(simple)
        .getAllByRole('button', { pressed: false })
        .map((each) => each.textContent),
    ).toEqual([
      'P1UnisonSemitones: 0',
      'm2Minor secondSemitones: 1',
      'M2Major secondSemitones: 2',
      'm3Minor thirdSemitones: 3',
      'M3Major thirdSemitones: 4',
      'P4Perfect fourthSemitones: 5',
      'A4Augmented fourthSemitones: 6',
      'd5Diminished fifthSemitones: 6',
      'P5Perfect fifthSemitones: 7',
      'm6Minor sixthSemitones: 8',
      'M6Major sixthSemitones: 9',
      'm7Minor seventhSemitones: 10',
      'M7Major seventhSemitones: 11',
      'P8OctaveSemitones: 12',
    ])
    expect(screen.getByRole('img', { name: 'Minor third on the keys' })).toBeInTheDocument()
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(
      within(compound).getByRole('button', { name: /^A9 ?Augmented ninth/ }),
    ).toHaveTextContent('Semitones: 15')
    // Folded, as the other explorers' sections: saved in the settings, for every visit.
    await user.click(within(compound).getByRole('button', { name: 'Past the octave' }))
    expect(within(compound).getByRole('button', { name: 'Past the octave' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(settingsStore.getState().foldedSections).toContain('intervals.compound')
  })

  it('plays a row tapped at once, up or down as the switch says, kept in the URL, and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/intervals')
    const way = await screen.findByRole('radiogroup', { name: 'Play' })
    expect(within(way).getByRole('radio', { name: 'At once' })).toBeChecked()
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
    expect(row('Minor third')).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
    await user.click(within(way).getByRole('radio', { name: 'Up' }))
    expect(router.state.location.search).toEqual({ way: 'up' })
    await user.click(row('Minor third'))
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    await user.click(within(way).getByRole('radio', { name: 'Down' }))
    await user.click(row('Perfect fifth'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [67, 0],
      [60, 0.6],
    ])
  })

  it('names the songs that open with an interval, rising and falling, behind its ⓘ', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/intervals')
    await user.click(await screen.findByRole('button', { name: 'About Major sixth' }))
    const songs = await screen.findByRole('dialog', { name: 'Major sixth' })
    expect(within(songs).getByRole('list', { name: 'Up' })).toHaveTextContent(
      'My Bonnie Lies over the Ocean',
    )
    expect(within(songs).getByRole('list', { name: 'Down' })).toHaveTextContent(
      'Nobody Knows the Trouble I’ve Seen',
    )
    // The ⓘ opens the songs and plays nothing.
    expect(audio.played).toEqual([])
    // Past the octave no song is known by its interval.
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(within(compound).queryByRole('button', { name: /^About/ })).toBeNull()
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
    await user.click(row('Perfect fifth'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [62, 0],
      [69, 0],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/intervals', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Интервалы' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^м3 ?Малая терция/ })).toHaveTextContent('м3')
    expect(screen.getByRole('button', { name: /^ум5 ?Уменьшённая квинта/ })).toHaveTextContent(
      'ум5',
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Подробнее: Большая секста' }))
    expect(await screen.findByRole('list', { name: 'Вверх' })).toHaveTextContent(
      'В лесу родилась ёлочка',
    )
    expect(untranslated(document.body)).toEqual([])
  })
})
