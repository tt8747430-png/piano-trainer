import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const row = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map((button) => button.textContent)
const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

describe('Practice → Progressions', () => {
  it('writes a progression’s chords in the key, each over its numeral', async () => {
    await renderApp('/practice/progressions')
    await screen.findByRole('list', { name: 'Chords' })
    expect(row()).toEqual(['CI', 'GV', 'Amvi', 'FIV'])
  })

  it('reads chords typed as numerals, kept in the URL, and says when it cannot', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    expect(router.state.location.search).toEqual({ p: 'vi-IV-I-V' })
    await user.clear(field)
    await user.type(field, 'Qx')
    expect(screen.getByText('This progression can’t be read.')).toBeInTheDocument()
  })

  it('writes typed chords as numerals again once the key changes, as the row plays them', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    await user.click(
      within(screen.getByRole('group', { name: 'Key' })).getByRole('radio', { name: 'G' }),
    )
    expect(row()).toEqual(['Emvi', 'CIV', 'GI', 'DV'])
    expect(field).toHaveValue('vi IV I V')
  })

  it('grows the chords with the chord size, and plays the row', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('radio', { name: '7ths' }))
    expect(row()).toEqual(['CMaj7I', 'G7V', 'Am7vi', 'FMaj7IV'])
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
  })

  it('names the library’s progression it shows, and takes another from the pop-up by style', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const choice = await screen.findByRole('combobox', { name: 'Progression' })
    expect(choice).toHaveTextContent('Axis of Awesome')
    await user.click(choice)
    const blues = await screen.findByRole('group', { name: 'Blues' })
    await user.click(within(blues).getByRole('option', { name: /^12-bar blues/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({
        p: expect.stringMatching(/^I7-I7-I7-I7-IV7/),
      }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('12-bar blues')
    expect(screen.getByText('Great with the blues scale on top.')).toBeInTheDocument()
  })

  it('keeps the progression chosen while the key turns minor and major again', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^12-bar blues/ }))
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent(
        '12-bar blues',
      ),
    )
    const mode = within(screen.getByRole('radiogroup', { name: 'Mode' }))
    await user.click(mode.getByRole('radio', { name: 'Minor' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ key: 'Cm' }))
    await user.click(mode.getByRole('radio', { name: 'Major' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('key'))
    expect(router.state.location.search).toMatchObject({
      p: expect.stringMatching(/^I7-I7-I7-I7-IV7/),
    })
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('12-bar blues')
  })

  it('offers no row that chooses in place: the library is one pop-up, never a list of links', async () => {
    await renderApp('/practice/progressions')
    await screen.findByRole('combobox', { name: 'Progression' })
    const links = within(screen.getByRole('main'))
      .getAllByRole('link')
      .map((link) => link.getAttribute('href') ?? '')
    expect(links.filter((href) => href.startsWith('/practice/progressions?'))).toEqual([])
  })

  it('takes a minor progression in the minor key of the same tonic, at its own chord size', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?key=A')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^Minor ii–V–i/ }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Am',
        p: 'iiø7-V7b9-i',
        size: 'ninths',
      }),
    )
    expect(row()).toEqual(['Bm7♭5iiø7', 'E7♭9V7♭9', 'Am9i'])
  })

  it('takes the jazz cadence to its minor version when the key turns minor, and back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const mode = within(await screen.findByRole('radiogroup', { name: 'Mode' }))
    await user.click(mode.getByRole('radio', { name: 'Minor' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Cm',
        p: 'iiø7-V7b9-i',
        size: 'sevenths',
      }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Minor ii–V–i')
    expect(row()).toEqual(['Dm7♭5iiø7', 'G7♭9V7♭9', 'Cm7i'])
    await user.click(mode.getByRole('radio', { name: 'Major' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ p: 'ii-V-I', size: 'sevenths' }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    expect(row()).toEqual(['Dm7ii', 'G7V', 'CMaj7I'])
  })

  it('takes a library progression in place of a typed line, and closes its pop-up', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=I-I-IV')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^Jazz cadence/ }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ p: 'ii-V-I', size: 'sevenths' }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
  })

  it('says a typed line is the learner’s own', async () => {
    await renderApp('/practice/progressions?p=I-I-IV')
    expect(await screen.findByRole('combobox', { name: 'Progression' })).toHaveTextContent('I–I–IV')
  })

  it('opens the progression in the Player, in its key and chord size', async () => {
    await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const inPlayer = await screen.findByRole('region', { name: 'Practise in the Player' })
    const practise = within(inPlayer).getByRole('link', { name: 'In C major' })
    const href = practise.getAttribute('href') ?? ''
    expect(href).toMatch(/^\/play\/progression\?/)
    expect(href).toMatch(/p=ii-V-I/)
    expect(href).toMatch(/chordSize=sevenths/)
    expect(href).toMatch(/pattern=jazz/)
  })

  it('opens it through the keys, round the circle of fifths', async () => {
    await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const through = await screen.findByRole('link', { name: /^Through the keys/ })
    expect(through.getAttribute('href')).toMatch(/^\/play\/progression\?.*walk=fifths/)
  })

  it('is the first of Progressions’ three tabs, each a page', async () => {
    await renderApp('/practice/progressions')
    const tabs = within(
      await screen.findByRole('navigation', { name: 'Progressions' }),
    ).getAllByRole('link')
    expect(tabs.map((tab) => [tab.textContent, tab.getAttribute('href')])).toEqual([
      ['Progression', '/practice/progressions'],
      ['Passing chords', '/practice/progressions/passing'],
      ['Reharmonise', '/practice/progressions/reharmonise'],
    ])
    expect(tabs[0]).toHaveAttribute('aria-current', 'page')
  })

  it('takes a library progression in place: Back then leaves for Practice', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    await user.click(await screen.findByRole('link', { name: /^Progressions / }))
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^12-bar blues/ }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ p: expect.stringMatching(/^I7/) }),
    )
    await user.click(screen.getByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice'))
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/progressions', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Последовательности' }),
    ).toBeInTheDocument()
  })
})
