import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

const row = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map((button) =>
      [...button.children]
        .filter((part) => !part.hasAttribute('data-detail'))
        .map((part) => part.textContent)
        .join(''),
    )
/** How the row plays each chord, as the line under its numeral says. */
const positions = () =>
  within(screen.getByRole('list', { name: 'Chords' }))
    .getAllByRole('button')
    .map((button) => button.querySelector('[data-detail]')?.textContent)
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

  it('reads a 6th chord typed', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Dm7 G7 C6')
    expect(router.state.location.search).toEqual({ p: 'ii7-V7-I6' })
    expect(row()).toEqual(['Dm7ii7', 'G7V7', 'C6I6'])
  })

  it('opens on a line whose chords a URL escapes', async () => {
    await renderApp(`/practice/progressions?p=${encodeURIComponent('I6/9-V7#9-III+')}`)
    await screen.findByRole('list', { name: 'Chords' })
    expect(row()).toEqual(['C6/9I6/9', 'G7#9V7#9', 'E+III+'])
  })

  it('reads an applied chord, the ii–V of another chord of the key, typed and in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'ii°/vi V/vi vi')
    await user.click(screen.getByRole('radio', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ p: 'ii°/vi-V/vi-vi' })
    expect(row()).toEqual(['Bm7♭5ii°/vi', 'E7V/vi', 'Am7vi'])
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

  it('leaves the chord size out of reach for a line whose chords are all written out', async () => {
    await renderApp('/practice/progressions?p=ii7-V7-IMaj7')
    const size = within(await screen.findByRole('radiogroup', { name: 'Chord size' }))
    for (const radio of size.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('aria-disabled', 'true')
    }
    expect(row()).toEqual(['Dm7ii7', 'G7V7', 'CMaj7IMaj7'])
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

  it('takes a progression in the key’s mode, at its own chord size: in A minor the minor ii–V–i', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?key=Am')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    const jazz = within(await screen.findByRole('group', { name: 'Jazz' }))
    expect(jazz.getByRole('option', { name: /^Jazz cadence/ })).toHaveTextContent('ii°–V–i')
    await user.click(jazz.getByRole('option', { name: /^Jazz cadence/ }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Am',
        p: 'ii°-V-i',
        size: 'sevenths',
      }),
    )
    expect(row()).toEqual(['Bm7♭5ii°', 'E7V', 'Am7i'])
  })

  it('takes a progression of one mode in the key of the same tonic and that mode', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?key=A')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^Andalusian cadence/ }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ key: 'Am', p: 'i-VII-VI-V' }),
    )
    expect(row()).toEqual(['Ami', 'GVII', 'FVI', 'EV'])
  })

  it('shows the jazz cadence’s minor line when the key turns minor, and back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const mode = within(await screen.findByRole('radiogroup', { name: 'Mode' }))
    await user.click(mode.getByRole('radio', { name: 'Minor' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Cm',
        p: 'ii°-V-i',
        size: 'sevenths',
      }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    expect(row()).toEqual(['Dm7♭5ii°', 'G7V', 'Cm7i'])
    await user.click(mode.getByRole('radio', { name: 'Major' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ p: 'ii-V-I', size: 'sevenths' }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    expect(row()).toEqual(['Dm7ii', 'G7V', 'CMaj7I'])
  })

  it('leads into each chord by its own ii–V, kept in the URL, played and sent to the Player', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=I-ii&size=sevenths')
    const lead = within(await screen.findByRole('radiogroup', { name: 'Lead into each chord' }))
    expect(lead.getByRole('radio', { name: 'No' })).toBeChecked()
    await user.click(lead.getByRole('radio', { name: 'By its ii–V' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ lead: 'ii-v' }))
    expect(row()).toEqual([...['Dm7ii', 'G7V', 'CMaj7I'], ...['Em7♭5ii°/ii', 'A7V/ii', 'Dm7ii']])
    expect(screen.getByRole('textbox', { name: 'Numerals or chords' })).toHaveValue('I ii')
    const practise = screen.getByRole('link', { name: 'In C major' })
    expect(decodeURIComponent(practise.getAttribute('href') ?? '')).toMatch(
      /p=ii-V-I-ii°\/ii-V\/ii-ii/,
    )
  })

  it('leads into each chord of the key by its own dominant: the secondary dominants', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions?p=I-ii-iii-IV-V-vi-vii°&size=sevenths')
    const lead = within(await screen.findByRole('radiogroup', { name: 'Lead into each chord' }))
    await user.click(lead.getByRole('radio', { name: 'By its V' }))
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent(
      'The chords of the key',
    )
    expect(row().slice(0, 6)).toEqual(['G7V', 'CMaj7I', 'A7V/ii', 'Dm7ii', 'B7V/iii', 'Em7iii'])
  })

  it('lists each progression once, never again for the minor key', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    const names = (await screen.findAllByRole('option')).map((option) => option.textContent)
    expect(names.filter((name) => name?.startsWith('Jazz cadence'))).toHaveLength(1)
    expect(screen.queryByRole('group', { name: 'Minor keys' })).not.toBeInTheDocument()
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

  it('lists every walk through the keys as a row into the Player, and the key alone', async () => {
    await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const walks = within(
      await screen.findByRole('region', { name: 'Through the keys' }),
    ).getAllByRole('link')
    expect(walks.map((link) => link.textContent)).toEqual([
      'Up by semitones',
      'Down by semitones',
      'Up by whole tones',
      'Down by whole tones',
      'Down the circle of fifths: C F B♭',
      'Up the circle of fifths: C G D',
      'Up by minor thirds',
      'Up by major thirds',
    ])
    expect(
      walks.map((link) => /walk=([a-z-]+)/.exec(link.getAttribute('href') ?? '')?.[1]),
    ).toEqual([
      'semitones-up',
      'semitones-down',
      'tones-up',
      'tones-down',
      'fifths',
      'fifths-up',
      'minor-thirds',
      'major-thirds',
    ])
    for (const link of walks)
      expect(link.getAttribute('href')).toMatch(/^\/play\/progression\?.*p=ii-V-I/)
    expect(screen.getByRole('link', { name: 'In C major' }).getAttribute('href')).not.toMatch(
      /walk=/,
    )
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

  it('starts the row in the inversion chosen, each chord after it nearest or all in it', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/progressions?p=I-IV-V-I')
    await user.click(await screen.findByRole('radio', { name: '2nd' }))
    expect(router.state.location.search).toMatchObject({ inversion: 2 })
    const lowestHands = async () => {
      const before = audio.played.length
      await user.click(screen.getByRole('button', { name: 'Play' }))
      await waitFor(() => expect(audio.played.length).toBeGreaterThan(before))
      const sounds = audio.played.at(-1)?.sounds ?? []
      const starts = [...new Set(sounds.flatMap((s) => (s.kind === 'note' ? [s.at] : [])))]
      await user.click(screen.getByRole('button', { name: 'Stop' }))
      // Each chord's keys, the bass first: the hand's lowest is the second.
      return starts.map((at) => {
        const keys = sounds
          .flatMap((s) => (s.kind === 'note' && s.at === at ? [s.midi] : []))
          .toSorted((a, b) => a - b)
        return (keys[1] ?? 0) % 12
      })
    }
    expect((await lowestHands())[0]).toBe(7) // G: C from its 5th
    await user.click(screen.getByRole('switch', { name: /Nearest/ }))
    expect(router.state.location.search).toMatchObject({ inversion: 2, nearest: false })
    expect(await lowestHands()).toEqual([7, 0, 2, 7]) // every chord from its 5th
  })

  it('says under each chord the inversion the row plays it in', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions?p=I-IV-V-I')
    await screen.findByRole('list', { name: 'Chords' })
    expect(positions()[0]).toBe('Root')
    await user.click(screen.getByRole('radio', { name: '1st' }))
    await user.click(screen.getByRole('switch', { name: /Nearest/ }))
    expect(positions()).toEqual(['1st', '1st', '1st', '1st'])
  })

  it('opens the Player in the position shown, not one kept from an earlier visit', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(
      '/play/progression?p=I-V-vi-IV&key=C&inversion=2&nearest=false',
    )
    await screen.findByRole('button', { name: 'Setup' })
    await router.navigate({ to: '/practice/progressions' })
    await user.click(await screen.findByRole('link', { name: 'In C major' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/progression'))
    expect(router.state.location.search).toMatchObject({ inversion: 0, nearest: true })
  })
})
