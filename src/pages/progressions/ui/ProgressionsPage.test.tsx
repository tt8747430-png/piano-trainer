import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

/** The row's own Play, floating at the screen's foot. */
const playButton = () =>
  within(
    document.querySelector<HTMLElement>('[data-slot="floating-actions"]') ?? document.body,
  ).getByRole('button', { name: 'Play' })
/** The progression's own row: the first on the page, before the rows Between shows. */
const rowStaff = () => screen.getAllByRole('group', { name: 'Chords' })[0] ?? document.body
/** Each bar's chord and numeral, as its band names it, once the staff is engraved. */
const row = () =>
  within(rowStaff())
    .queryAllByRole('button', { name: /^Play bar \d+, / })
    .map((bar) => bar.textContent)
/** The row once engraved: a staff takes a while under a full run. */
const rowIs = (chords: readonly string[]) =>
  waitFor(() => expect(row()).toEqual(chords), { timeout: 5000 })
const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

describe('Practice → Progressions', () => {
  it('writes a progression’s chords in the key, each over its numeral', async () => {
    await renderApp('/practice/progressions')
    await screen.findAllByRole('group', { name: 'Chords' })
    await rowIs(['CI', 'GV', 'Amvi', 'FIV'])
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

  it('says when typed numerals are a major key’s in a minor key, and plays them in its major', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?key=F%23m')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'ii V I')
    expect(screen.getByText('These numerals are a major key’s.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play them in F# major' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ key: 'F#', p: 'ii-V-I' }),
    )
    expect(screen.queryByText('These numerals are a major key’s.')).not.toBeInTheDocument()
  })

  it('reads a 6th chord typed', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Dm7 G7 C6')
    expect(router.state.location.search).toEqual({ p: 'ii7-V7-I6' })
    await rowIs(['Dm7ii7', 'G7V7', 'C6I6'])
  })

  it('opens on a line whose chords a URL escapes, each printed as the sheets print it', async () => {
    await renderApp(`/practice/progressions?p=${encodeURIComponent('I6/9-V7#9-III+')}`)
    await screen.findAllByRole('group', { name: 'Chords' })
    await rowIs(['C6/9I6/9', 'G7♯9V7♯9', 'E+III+'])
    expect(within(rowStaff()).getByRole('button', { name: 'Play bar 2, G7♯9' })).toBeInTheDocument()
  })

  it('prints the row’s chords, the passing chords and the walks through the keys with ♯ and ♭', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions?key=E')
    await screen.findAllByRole('group', { name: 'Chords' })
    await rowIs(['EI', 'BV', 'C♯mvi', 'AIV'])
    const between = screen.getByRole('region', { name: 'Between two chords' })
    expect(
      within(between).getByRole('combobox', { name: 'From chord to chord' }),
    ).toHaveTextContent('E → B')
    // The dominant of B, F♯7, leads into it.
    expect(within(between).getByRole('article', { name: 'Secondary dominant' })).toHaveTextContent(
      'F♯7 is the V7 of B',
    )
    await user.click(within(between).getByRole('combobox', { name: 'From chord to chord' }))
    expect(await screen.findByRole('option', { name: 'B → C♯m' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Down by whole tones/ })).toHaveTextContent(
      /E B C♯m A · D A Bm G …/,
    )
  })

  it('reads an applied chord, the ii–V of another chord of the key, typed and in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'ii°/vi V/vi vi')
    await user.click(screen.getByRole('radio', { name: '7ths' }))
    expect(router.state.location.search).toMatchObject({ p: 'ii°/vi-V/vi-vi' })
    await rowIs(['Bm7♭5ii°/vi', 'E7V/vi', 'Am7vi'])
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
    await rowIs(['Emvi', 'CIV', 'GI', 'DV'])
    expect(field).toHaveValue('vi IV I V')
  })

  it('grows the chords with the chord size, and plays the row', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions')
    await user.click(await screen.findByRole('radio', { name: '7ths' }))
    await rowIs(['CMaj7I', 'G7V', 'Am7vi', 'FMaj7IV'])
    await user.click(playButton())
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
  })

  it('leaves the chord size out of reach for a line whose chords are all written out', async () => {
    await renderApp('/practice/progressions?p=ii7-V7-IMaj7')
    const size = within(await screen.findByRole('radiogroup', { name: 'Chord size' }))
    for (const radio of size.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('aria-disabled', 'true')
    }
    await rowIs(['Dm7ii7', 'G7V7', 'CMaj7IMaj7'])
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
    expect(
      screen.getByText(
        'The most common blues form: twelve bars of I7, IV7 and V7. Try the blues scale on top.',
      ),
    ).toBeInTheDocument()
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
    const mode = within(screen.getByRole('radiogroup', { name: 'Major or minor' }))
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
    await rowIs(['Bm7♭5ii°', 'E7V', 'Am7i'])
  })

  it('takes a progression of one mode in the key of the same tonic and that mode', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?key=A')
    await user.click(await screen.findByRole('combobox', { name: 'Progression' }))
    await user.click(await screen.findByRole('option', { name: /^Andalusian cadence/ }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ key: 'Am', p: 'i-VII-VI-V' }),
    )
    await rowIs(['Ami', 'GVII', 'FVI', 'EV'])
  })

  it('shows the jazz cadence’s minor line when the key turns minor, and back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const mode = within(await screen.findByRole('radiogroup', { name: 'Major or minor' }))
    await user.click(mode.getByRole('radio', { name: 'Minor' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Cm',
        p: 'ii°-V-i',
        size: 'sevenths',
      }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    await rowIs(['Dm7♭5ii°', 'G7V', 'Cm7i'])
    await user.click(mode.getByRole('radio', { name: 'Major' }))
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ p: 'ii-V-I', size: 'sevenths' }),
    )
    expect(screen.getByRole('combobox', { name: 'Progression' })).toHaveTextContent('Jazz cadence')
    await rowIs(['Dm7ii', 'G7V', 'CMaj7I'])
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
    // Each row is its walk's name, then the chords it plays first.
    expect(walks.map((link) => link.textContent)).toEqual(
      [
        'Up by semitones',
        'Down by semitones',
        'Up and down by semitones',
        'Up by whole tones',
        'Down by whole tones',
        'Down the circle of fifths: C F B♭',
        'Up the circle of fifths: C G D',
        'Up by minor thirds',
        'Up by major thirds',
      ].map((name) => expect.stringMatching(new RegExp(`^${name} Dm7 G7 CMaj7 · `))),
    )
    expect(
      walks.map((link) => /walk=([a-z-]+)/.exec(link.getAttribute('href') ?? '')?.[1]),
    ).toEqual([
      'semitones-up',
      'semitones-down',
      'semitones-up-down',
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

  it('says the chords each walk plays first: the sheet’s Шаг 2 is the ii–V–I down by whole tones', async () => {
    await renderApp('/practice/progressions?p=ii-V-I&size=sevenths')
    const walks = within(await screen.findByRole('region', { name: 'Through the keys' }))
    expect(walks.getByRole('link', { name: /^Down by whole tones/ })).toHaveTextContent(
      'Dm7 G7 CMaj7 · Cm7 F7 B♭Maj7 …',
    )
    expect(walks.getByRole('link', { name: /^Down the circle of fifths/ })).toHaveTextContent(
      'Dm7 G7 CMaj7 · Gm7 C7 FMaj7 …',
    )
  })

  it('is one page: its tools are on it, not tabs beside it', async () => {
    await renderApp('/practice/progressions')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Progressions' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Progressions' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Between two chords' })).toBeInTheDocument()
  })

  it('reads a song’s chords in the key they are in, and plays them in any (ADR 0052)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Dm7 Gm9 Asus4 Dm7')
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ key: 'Dm', p: 'i7-iv9-Vsus4-i7' }),
    )
    await rowIs(['Dm7i7', 'Gm9iv9', 'Asus4Vsus4', 'Dm7i7'])
  })

  it('shows the passing chords between two chords of the row, the pair kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=I-IV-V&key=G')
    const between = await screen.findByRole('region', { name: 'Between two chords' })
    expect(within(between).getByRole('article', { name: 'Secondary dominant' })).toHaveTextContent(
      /G7/,
    )
    await user.click(within(between).getByRole('combobox', { name: 'From chord to chord' }))
    await user.click(await screen.findByRole('option', { name: 'C → D' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ between: 1 }))
    expect(within(between).getByRole('article', { name: 'Secondary dominant' })).toHaveTextContent(
      /A7/,
    )
  })

  it('keeps In the key only in the URL, and shows only the ways in the key', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions?p=I-IV-V&key=G')
    const between = await screen.findByRole('region', { name: 'Between two chords' })
    await user.click(within(between).getByRole('button', { name: 'In the key only' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ inKey: true }))
    for (const way of within(between).getAllByRole('article'))
      expect(way).toHaveTextContent('In the key')
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
      await user.click(playButton())
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

  it('draws its chords as the Player’s diagrams, each once, each opening its sheet', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions?key=G&p=I-IV-I-V')
    const summary = await screen.findByRole('list', { name: 'Chords' })
    const chords = within(summary).getAllByRole('button')
    expect(chords.map((chord) => chord.textContent)).toEqual(['G', 'C', 'D'])
    expect(within(summary).getByRole('img', { name: 'G: G B D' })).toBeInTheDocument()
    await user.click(chords[1] ?? document.body)
    expect(await screen.findByRole('dialog', { name: 'C chord' })).toBeInTheDocument()
  })

  /** The songs a progression is heard in, every one of them shown. */
  const everySong = async () => {
    const songs = await screen.findByRole('region', { name: 'Songs with this progression' })
    const all = within(songs).queryByRole('button', { name: /^Show all/ })
    if (all) await userEvent.setup().click(all)
    return songs
  }

  it('lists the songs it is heard in, each opening the Player looping its bars', async () => {
    await renderApp('/practice/progressions?key=G&p=I-IV-I')
    const amazing = within(await everySong()).getByRole('link', { name: /Amazing Grace/ })
    expect(amazing).toHaveTextContent('bars 1–4')
    expect(amazing).toHaveTextContent('G G7 C G')
    const href = new URL(amazing.getAttribute('href') ?? '', 'http://x')
    expect(href.pathname).toBe('/play/amazing')
    expect(Object.fromEntries(href.searchParams)).toEqual({ bar: '1', loop: '1-4' })
  })

  it('finds the songs in their own keys, whatever key it is shown in', async () => {
    await renderApp('/practice/progressions?key=Eb&p=I-IV-I')
    const songs = await everySong()
    expect(within(songs).getByRole('link', { name: /Amazing Grace/ })).toBeInTheDocument()
  })

  it('shows a few songs, and every one when asked', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions?key=C&p=I-V-I')
    const songs = await screen.findByRole('region', { name: 'Songs with this progression' })
    const few = within(songs).getAllByRole('link').length
    await user.click(within(songs).getByRole('button', { name: /^Show all \d+ songs$/ }))
    expect(within(songs).getAllByRole('link').length).toBeGreaterThan(few)
  })

  it('says when no song uses it yet', async () => {
    await renderApp('/practice/progressions?key=C&p=ii7-bII7-IMaj7')
    const songs = await screen.findByRole('region', { name: 'Songs with this progression' })
    expect(within(songs).getByText('No song uses it yet')).toBeInTheDocument()
  })
})
