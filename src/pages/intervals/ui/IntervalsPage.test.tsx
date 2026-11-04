import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { Sound } from '@/shared/lib/schedule'
import { pickIn } from '@/shared/test/pickers'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

/** A row by its interval's name. */
const row = (name: string) =>
  screen.getByRole('button', { name: (said) => said.includes(name) && !said.startsWith('About') })

describe('Practice → Intervals', () => {
  it('lists a row for every interval, the tritone as A4 and d5 apart, each group folding as the learner leaves it', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/practice/intervals')
    const simple = await screen.findByRole('region', { name: 'Simple intervals' })
    // Each row named by what it plays, its meaning under its name (R29-P12).
    expect(
      within(simple)
        .getAllByRole('button', { pressed: false })
        .map((each) => each.getAttribute('aria-label')),
    ).toEqual([
      'Play Unison',
      'Play Minor second',
      'Play Major second',
      'Play Minor third',
      'Play Major third',
      'Play Perfect fourth',
      'Play Augmented fourth',
      'Play Diminished fifth',
      'Play Perfect fifth',
      'Play Minor sixth',
      'Play Major sixth',
      'Play Minor seventh',
      'Play Major seventh',
      'Play Octave',
    ])
    expect(row('Minor third')).toHaveTextContent(
      'm3Minor thirdThe 3rd of a minor chord: darker.3 semitones',
    )
    // No keyboard of its own: the page's keys show it.
    expect(screen.queryByRole('img', { name: /on the keys$/ })).not.toBeInTheDocument()
    const compound = screen.getByRole('region', { name: 'Compound intervals' })
    expect(
      within(compound).getByRole('button', { name: 'Play Augmented ninth' }),
    ).toHaveTextContent('15 semitones')
    // Folded, as the other explorers' sections: saved in the settings, for every visit.
    await user.click(within(compound).getByRole('button', { name: 'Compound intervals' }))
    expect(within(compound).getByRole('button', { name: 'Compound intervals' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(settingsStore.getState().foldedSections).toContain('intervals.compound')
  })

  it('plays a row tapped as Play as says, Ascending · Descending · Harmonic, kept in the URL, and shows it on the keys (R29-P12)', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/intervals')
    // How every row plays, in words at the page's head; the transport holds Play all alone.
    const way = await screen.findByRole('radiogroup', { name: 'Play as' })
    expect(
      within(way)
        .getAllByRole('radio')
        .map((each) => each.textContent),
    ).toEqual(['Ascending', 'Descending', 'Harmonic'])
    expect(within(way).getByRole('radio', { name: 'Harmonic' })).toBeChecked()
    expect(
      within(screen.getByRole('toolbar', { name: 'Transport' }))
        .getAllByRole('button')
        .map((each) => each.textContent),
    ).toEqual(['Play all'])
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
    expect(row('Minor third')).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
    await user.click(within(way).getByRole('radio', { name: 'Ascending' }))
    expect(router.state.location.search).toEqual({ way: 'up' })
    await user.click(row('Minor third'))
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    await user.click(within(way).getByRole('radio', { name: 'Descending' }))
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
    const compound = screen.getByRole('region', { name: 'Compound intervals' })
    expect(within(compound).queryByRole('button', { name: /^About/ })).toBeNull()
  })

  it('plays every interval in turn from Play all, and stops on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/intervals?way=up')
    const transport = await screen.findByRole('toolbar', { name: 'Transport' })
    await user.click(within(transport).getByRole('button', { name: 'Play all' }))
    const played = timed(audio.played.at(-1)?.sounds)
    // The unison first, its key twice, then each interval in turn, the minor 2nd after it.
    expect(played.slice(0, 4)).toEqual([
      [60, 0],
      [60, 0.6],
      [60, 2],
      [61, 2.6],
    ])
    const stops = audio.stops
    await user.click(within(transport).getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBe(stops + 1)
  })

  it('marks each row as one that plays', async () => {
    await renderApp('/practice/intervals')
    expect(await screen.findByText('Simple intervals')).toBeInTheDocument()
    expect(row('Minor third').querySelector('[data-play-mark]')).not.toBeNull()
  })

  it('links to ear training in the Quiz, which owns it (A32)', async () => {
    await renderApp('/practice/intervals')
    expect(await screen.findByRole('link', { name: /^Intervals by ear/ })).toHaveAttribute(
      'href',
      '/practice/quiz/intervals',
    )
  })

  it('chooses the root, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/intervals')
    await pickIn(user, 'Root', 'D')
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
    expect(screen.getByRole('button', { name: 'Сыграть: Малая терция' })).toHaveTextContent('м3')
    expect(screen.getByRole('button', { name: 'Сыграть: Уменьшённая квинта' })).toHaveTextContent(
      'ум5',
    )
    await userEvent.setup().click(screen.getByRole('button', { name: 'Подробнее: Большая секста' }))
    expect(await screen.findByRole('list', { name: 'Вверх' })).toHaveTextContent(
      'В лесу родилась ёлочка',
    )
    expect(untranslated(document.body)).toEqual([])
  })
})
