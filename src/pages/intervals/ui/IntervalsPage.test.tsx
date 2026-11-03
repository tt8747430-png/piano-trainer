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
    const simple = await screen.findByRole('region', { name: 'Within the octave' })
    expect(
      within(simple)
        .getAllByRole('button', { pressed: false })
        .map((each) => each.textContent),
    ).toEqual([
      'P1Unison0 semitones',
      'm2Minor second1 semitone',
      'M2Major second2 semitones',
      'm3Minor third3 semitones',
      'M3Major third4 semitones',
      'P4Perfect fourth5 semitones',
      'A4Augmented fourth6 semitones',
      'd5Diminished fifth6 semitones',
      'P5Perfect fifth7 semitones',
      'm6Minor sixth8 semitones',
      'M6Major sixth9 semitones',
      'm7Minor seventh10 semitones',
      'M7Major seventh11 semitones',
      'P8Octave12 semitones',
    ])
    expect(screen.getByRole('img', { name: 'Minor third on the keys' })).toBeInTheDocument()
    const compound = screen.getByRole('region', { name: 'Past the octave' })
    expect(
      within(compound).getByRole('button', { name: /^A9 ?Augmented ninth/ }),
    ).toHaveTextContent('15 semitones')
    // Folded, as the other explorers' sections: saved in the settings, for every visit.
    await user.click(within(compound).getByRole('button', { name: 'Past the octave' }))
    expect(within(compound).getByRole('button', { name: 'Past the octave' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    expect(settingsStore.getState().foldedSections).toContain('intervals.compound')
  })

  it('plays a row tapped harmonically or melodically as the transport says, kept in the URL, and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/intervals')
    // The way it plays is the floating transport's, not a control in the page (A22).
    expect(screen.queryByRole('radiogroup', { name: 'Play' })).not.toBeInTheDocument()
    const way = await screen.findByRole('toolbar', { name: 'Transport' })
    expect(within(way).getByRole('button', { name: 'Harmonic' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
    expect(row('Minor third')).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('♭3')
    await user.click(within(way).getByRole('button', { name: 'Melodic, rising' }))
    expect(router.state.location.search).toEqual({ way: 'up' })
    await user.click(row('Minor third'))
    await user.click(row('Minor third'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0.6],
    ])
    await user.click(within(way).getByRole('button', { name: 'Melodic, falling' }))
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
    expect(await screen.findByText('Within the octave')).toBeInTheDocument()
    expect(row('Minor third').querySelector('[data-play-mark]')).not.toBeNull()
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
