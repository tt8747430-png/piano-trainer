import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { Sound } from '@/shared/lib/schedule'
import { pickIn } from '@/shared/test/pickers'
import { stubResizeObserver } from '@/shared/test/resize'

const timed = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [[sound.midi, sound.at]] : []))

/** The tiles, one choice across both groups. */
const tiles = (label = 'Interval') => screen.getByRole('group', { name: label })
/** A tile by its interval's name. */
const tile = (name: string, label?: string) => within(tiles(label)).getByRole('button', { name })
/** The floating bar: From, Play with Play as, Play all. */
const transport = () => screen.getByRole('toolbar', { name: 'Transport' })

describe('Practice → Intervals', () => {
  it('lists a tile for every interval in its group, the tritone as A4 and d5 apart, the 5th chosen at first', async () => {
    await renderApp('/practice/intervals')
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    const simple = within(tiles()).getByRole('region', { name: 'Simple' })
    expect(
      within(simple)
        .getAllByRole('button')
        .map((each) => each.getAttribute('aria-label')),
    ).toEqual([
      'Unison',
      'Minor second',
      'Major second',
      'Minor third',
      'Major third',
      'Perfect fourth',
      'Augmented fourth',
      'Diminished fifth',
      'Perfect fifth',
      'Minor sixth',
      'Major sixth',
      'Minor seventh',
      'Major seventh',
      'Octave',
    ])
    // Each tile its short name over its semitones.
    expect(tile('Minor third')).toHaveTextContent('m33')
    const compound = within(tiles()).getByRole('region', { name: 'Compound' })
    expect(within(compound).getAllByRole('button')).toHaveLength(13)
    expect(within(compound).getByRole('button', { name: 'Minor tenth' })).toHaveTextContent('m1015')
    expect(tile('Perfect fifth')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'Perfect fifth' })).toBeInTheDocument()
  })

  it('chooses and plays a tile tapped, kept in the URL, and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/intervals')
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    await user.click(tile('Minor third'))
    expect(router.state.location.search).toEqual({ iv: 'm3' })
    expect(tile('Minor third')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'Minor third' })).toBeInTheDocument()
    // Ascending at first: the lower note, then the upper.
    const [low, high] = timed(audio.played.at(-1)?.sounds)
    expect(low).toEqual([60, 0])
    expect(high?.[0]).toBe(63)
    expect(high?.[1]).toBeGreaterThan(0)
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('C')
    expect(within(keyboard).getByRole('button', { name: 'D sharp 4' })).toHaveTextContent('E♭')
  })

  it('plays as Play as says, Ascending · Descending · Harmonic, kept in the URL (R29-P12)', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/intervals?iv=m3')
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    await user.click(within(transport()).getByRole('button', { name: 'Play as' }))
    expect(
      (await screen.findAllByRole('menuitemcheckbox')).map((each) => each.textContent),
    ).toEqual(['Ascending', 'Descending', 'Harmonic'])
    expect(screen.getByRole('menuitemcheckbox', { name: 'Ascending' })).toBeChecked()
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Harmonic' }))
    expect(router.state.location.search).toEqual({ iv: 'm3', way: 'together' })
    await user.click(within(transport()).getByRole('button', { name: 'Play m3' }))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [60, 0],
      [63, 0],
    ])
  })

  it('says what the interval sounds like, and behind its ⓘ the song it falls in and what it inverts to', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/intervals?iv=M6')
    const hero = (await screen.findByRole('heading', { level: 2, name: 'Major sixth' })).closest(
      'section',
    )
    if (!hero) throw new Error('the chosen interval')
    expect(hero).toHaveTextContent('Sounds like')
    expect(hero).toHaveTextContent('My Bonnie Lies over the Ocean')
    await user.click(within(hero).getByRole('button', { name: 'About Major sixth' }))
    const about = await screen.findByRole('dialog', { name: 'Major sixth' })
    expect(about).toHaveTextContent('Nobody Knows the Trouble I’ve Seen')
    expect(about).toHaveTextContent('Inverts toMinor third')
    // The ⓘ opens its facts and plays nothing.
    expect(audio.played).toEqual([])
  })

  it('plays every interval in turn from Play all, and stops when pressed again', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/intervals')
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    const all = within(transport()).getByRole('button', { name: 'Play all' })
    await user.click(all)
    expect(all).toHaveAttribute('aria-pressed', 'true')
    const played = timed(audio.played.at(-1)?.sounds)
    // The unison first, its key twice, then the minor 2nd.
    expect(played.slice(0, 4).map(([key]) => key)).toEqual([60, 60, 60, 61])
    const stops = audio.stops
    await user.click(all)
    expect(audio.stops).toBe(stops + 1)
    expect(all).toHaveAttribute('aria-pressed', 'false')
  })

  it('plays from the root chosen in From, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/intervals?way=together')
    await screen.findByRole('heading', { level: 1, name: 'Intervals' })
    await pickIn(user, 'From', 'D')
    expect(router.state.location.search).toEqual({ root: 'D', way: 'together' })
    await user.click(tile('Perfect fifth'))
    expect(timed(audio.played.at(-1)?.sounds)).toEqual([
      [62, 0],
      [69, 0],
    ])
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/intervals', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 1, name: 'Интервалы' })).toBeInTheDocument()
    expect(tile('Малая терция', 'Интервал')).toHaveTextContent('м3')
    expect(tile('Уменьшённая квинта', 'Интервал')).toHaveTextContent('ум5')
    expect(untranslated(document.body)).toEqual([])
  })

  it('writes the interval chosen on a staff, the way it plays (A22)', async () => {
    // The staff is drawn at the width its column gives it.
    stubResizeObserver({ width: 343, height: 147 })
    await renderApp('/practice/intervals')
    const sheet = await screen.findByRole('region', { name: 'The interval written' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument(), { timeout: 5000 })
  })
})
