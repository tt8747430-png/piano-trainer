import { act, cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { setProgressions } from '@/features/set-preference'
import type { Sound } from '@/shared/lib/schedule'
import { loadScoreView } from '@/shared/ui'
import { pickKey } from '@/shared/test/pickers'

/** The floating bar's Play. */
const playButton = () =>
  within(screen.getByRole('toolbar', { name: 'Transport' })).getByRole('button', { name: 'Play' })
/** The progression's chords as tiles, each its numeral over its chord. */
const tiles = () => screen.getByRole('list', { name: 'What each chord does' })
/** Each chord and its numeral, as its tile shows them. */
const row = () =>
  within(tiles())
    .getAllByRole('button')
    .map((tile) => {
      const [numeral, chord] = [...tile.querySelectorAll(':scope > span')].map(
        (part) => part.textContent,
      )
      return `${chord ?? ''}${numeral ?? ''}`
    })
const rowIs = (chords: readonly string[]) => waitFor(() => expect(row()).toEqual(chords))
/** Chooses what the row plays from Play's menu: a chord size, or approach chords. */
async function plays(user: ReturnType<typeof userEvent.setup>, choice: string) {
  await user.click(screen.getByRole('button', { name: 'What it plays' }))
  await user.click(await screen.findByRole('menuitemcheckbox', { name: choice }))
}
/** A section of the page, by its heading. */
const section = (name: string) =>
  screen.getByRole('heading', { level: 3, name }).closest('section') ?? document.body
const onsets = (sounds: readonly Sound[] = []) =>
  new Set(sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.at] : []))).size

// The first renderApp of a worker imports this page and the score's engraver; under a full suite's
// load that alone took most of a test's 15 s, so it happens once here, with time of its own.
beforeAll(() => Promise.all([loadScoreView(), import('@/pages/progression')]), 30_000)

describe('Practice → Progressions', () => {
  it('writes a progression’s chords in the key, each over its numeral', async () => {
    await renderApp('/practice/progressions/line')
    await screen.findByRole('list', { name: 'What each chord does' })
    await rowIs(['CI', 'GV', 'Amvi', 'FIV'])
  })

  it('reads chords typed as numerals, kept in the URL, and says when it cannot', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line')
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
    const { router } = await renderApp('/practice/progressions/line?key=F%23m')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'ii V I')
    expect(screen.getByText('These numerals are a major key’s.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play them in F♯ major' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ key: 'F#', p: 'ii-V-I' }),
    )
    expect(screen.queryByText('These numerals are a major key’s.')).not.toBeInTheDocument()
  })

  it('reads a 6th chord typed', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Dm7 G7 C6')
    expect(router.state.location.search).toEqual({ p: 'ii7-V7-I6' })
    await rowIs(['Dm7ii7', 'G7V7', 'C6I6'])
  })

  it('opens on a line whose chords a URL escapes, each printed as the sheets print it', async () => {
    await renderApp(`/practice/progressions/line?p=${encodeURIComponent('I6/9-V7#9-III+')}`)
    await screen.findByRole('list', { name: 'What each chord does' })
    await rowIs(['C6/9I6/9', 'G7♯9V7♯9', 'E+III+'])
  })

  it('prints the row’s chords, the passing chords and the walks through the keys with ♯ and ♭', async () => {
    await renderApp('/practice/progressions/line?key=E')
    await screen.findByRole('list', { name: 'What each chord does' })
    await rowIs(['EI', 'BV', 'C♯mvi', 'AIV'])
    expect(screen.getByRole('link', { name: /^In whole steps, rising/ })).toHaveTextContent(
      /E B C♯m A · F♯ C♯ D♯m B …/,
    )
    // From the row's first change, E into B: B's own dominant, F♯7, leads into it.
    expect(
      within(section('Passing chords')).getByRole('button', { name: /^F♯7 into B/ }),
    ).toHaveTextContent('F♯7 is the V7 of B')
  })

  it('reads an applied chord, the ii–V of another chord of the key, typed and in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'ii°/vi V/vi vi')
    await plays(user, '7ths')
    expect(router.state.location.search).toMatchObject({ p: 'ii°/vi-V/vi-vi' })
    await rowIs(['Bm7♭5ii°/vi', 'E7V/vi', 'Am7vi'])
  })

  it('writes typed chords as numerals again once the key changes, as the row plays them', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions/line')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Am F C G')
    await pickKey(user, 'G major')
    await rowIs(['Emvi', 'CIV', 'GI', 'DV'])
    expect(field).toHaveValue('vi IV I V')
  })

  it('grows the chords with the chord size, and plays the row', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/line')
    await screen.findByRole('list', { name: 'What each chord does' })
    await plays(user, '7ths')
    await rowIs(['Cmaj7I', 'G7V', 'Am7vi', 'Fmaj7IV'])
    await user.click(playButton())
    expect(onsets(audio.played.at(-1)?.sounds)).toBe(4)
  })

  it('offers no chord size for a line whose chords are all written out (R30)', async () => {
    await renderApp('/practice/progressions/line?p=ii7-V7-IMaj7')
    await rowIs(['Dm7ii7', 'G7V7', 'Cmaj7Imaj7'])
    expect(screen.queryByRole('radiogroup', { name: 'Chord size' })).not.toBeInTheDocument()
  })

  it('draws why it works on its chords: each one’s role, and how the root moves to the next (A23)', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/line')
    const roles = await screen.findByRole('list', { name: 'What each chord does' })
    const chords = within(roles).getAllByRole('button')
    expect(chords.map((chip) => chip.getAttribute('aria-label'))).toEqual([
      'I, Tonic',
      'V, Dominant',
      'vi, Tonic, sad',
      'IV, Predominant',
    ])
    // The first at rest, its keys shown; each root's move after its chord.
    expect(chords[0]).toHaveAttribute('aria-pressed', 'true')
    expect(
      within(roles)
        .getAllByRole('listitem')
        .map((each) => each.textContent),
    ).toEqual(['IC5th up →', 'VG2nd up →', 'viAm3rd down →', 'IVF5th up →'])
    await user.click(chords[1] ?? document.body)
    expect(chords[1]).toHaveAttribute('aria-pressed', 'true')
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('names the library’s progression a line is, and how it sounds and its style', async () => {
    await renderApp('/practice/progressions/line')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Axis of Awesome' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Bright and singable, the sound of a thousand hits · Pop'),
    ).toBeInTheDocument()
  })

  it('shows a library progression on its own page, with how it sounds', async () => {
    await renderApp('/practice/progressions/twelve-bar')
    expect(
      await screen.findByRole('heading', { level: 2, name: '12-bar blues' }),
    ).toBeInTheDocument()
    expect(screen.getByText('The blues itself, twelve bars long · Blues')).toBeInTheDocument()
  })

  it('keeps the progression shown while the key turns minor and major again', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/jazz-cadence')
    await screen.findByRole('heading', { level: 2, name: 'Jazz cadence' })
    await pickKey(user, 'C minor')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ key: 'Cm' }))
    await rowIs(['Dm7♭5ii°', 'G7V', 'Cm7i'])
    await pickKey(user, 'C major')
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('key'))
    expect(screen.getByRole('heading', { level: 2, name: 'Jazz cadence' })).toBeInTheDocument()
  })

  it('shows a progression in the key’s mode, at its own chord size: in A minor the minor ii–V–i', async () => {
    await renderApp('/practice/progressions/jazz-cadence?key=Am')
    await rowIs(['Bm7♭5ii°', 'E7V', 'Am7i'])
  })

  it('shows a progression of one mode in the key of the same tonic and that mode', async () => {
    await renderApp('/practice/progressions/andalusian?key=A')
    await rowIs(['Ami', 'GVII', 'FVI', 'EV'])
  })

  it('shows the jazz cadence’s minor line when the key turns minor, and back', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line?p=ii-V-I&size=sevenths')
    await pickKey(user, 'C minor')
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        key: 'Cm',
        p: 'ii°-V-i',
        size: 'sevenths',
      }),
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Jazz cadence' })).toBeInTheDocument()
    await rowIs(['Dm7♭5ii°', 'G7V', 'Cm7i'])
    await pickKey(user, 'C major')
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ p: 'ii-V-I', size: 'sevenths' }),
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Jazz cadence' })).toBeInTheDocument()
    await rowIs(['Dm7ii', 'G7V', 'Cmaj7I'])
  })

  it('leads into each chord by its own ii–V, kept in the URL, played and sent to the Player', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line?p=I-ii&size=sevenths')
    await screen.findByRole('list', { name: 'What each chord does' })
    await user.click(screen.getByRole('button', { name: 'What it plays' }))
    expect(await screen.findByRole('menuitemcheckbox', { name: 'None' })).toBeChecked()
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'ii–V' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ lead: 'ii-v' }))
    await rowIs([...['Dm7ii', 'G7V', 'Cmaj7I'], ...['Em7♭5ii°/ii', 'A7V/ii', 'Dm7ii']])
    expect(screen.getByRole('textbox', { name: 'Numerals or chords' })).toHaveValue('I ii')
    const practise = screen.getByRole('link', { name: /^In C major/ })
    expect(decodeURIComponent(practise.getAttribute('href') ?? '')).toMatch(
      /p=ii-V-I-ii°\/ii-V\/ii-ii/,
    )
  })

  it('leads into each chord of the key by its own dominant: the secondary dominants', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions/line?p=I-ii-iii-IV-V-vi-vii°&size=sevenths')
    await screen.findByRole('list', { name: 'What each chord does' })
    await plays(user, 'Secondary dominants')
    expect(
      screen.getByRole('heading', { level: 2, name: 'The chords of the key' }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(row().slice(0, 6)).toEqual(['G7V', 'Cmaj7I', 'A7V/ii', 'Dm7ii', 'B7V/iii', 'Em7iii']),
    )
  })

  it('names a typed line by its numerals', async () => {
    await renderApp('/practice/progressions/line?p=I-I-IV')
    expect(await screen.findByRole('heading', { level: 2, name: 'I – I – IV' })).toBeInTheDocument()
  })

  it('opens the progression in the Player, in its key and chord size', async () => {
    await renderApp('/practice/progressions/line?p=ii-V-I&size=sevenths')
    await screen.findByRole('heading', { level: 3, name: 'Practise in the Player' })
    const practise = within(section('Practise in the Player')).getByRole('link', {
      name: /^In C major/,
    })
    const href = practise.getAttribute('href') ?? ''
    expect(href).toMatch(/^\/play\/progression\?/)
    expect(href).toMatch(/p=ii-V-I/)
    expect(href).toMatch(/chordSize=sevenths/)
    expect(href).toMatch(/pattern=jazz/)
  })

  it('lists the board’s walks through the keys as rows into the Player, after the key alone', async () => {
    await renderApp('/practice/progressions/line?p=ii-V-I&size=sevenths')
    await screen.findByRole('heading', { level: 3, name: 'Practise in the Player' })
    const [alone, ...walks] = within(section('Practise in the Player')).getAllByRole('link')
    expect(alone).toHaveTextContent('In C major')
    expect(alone?.getAttribute('href')).not.toMatch(/walk=/)
    // Each row is its walk's name, then the chords it plays first.
    expect(walks.map((link) => link.textContent)).toEqual(
      [
        'Chromatically, rising',
        'Chromatically, falling',
        'In whole steps, rising',
        'Circle of fifths, falling',
        'In minor thirds',
      ].map((name) => expect.stringMatching(new RegExp(`^${name}Dm7 G7 Cmaj7 · `))),
    )
    expect(
      walks.map((link) => /walk=([a-z-]+)/.exec(link.getAttribute('href') ?? '')?.[1]),
    ).toEqual(['semitones-up', 'semitones-down', 'tones-up', 'fifths', 'minor-thirds'])
    for (const link of walks)
      expect(link.getAttribute('href')).toMatch(/^\/play\/progression\?.*p=ii-V-I/)
  })

  it('says the chords each walk plays first: the ii–V–I up by whole tones and round the fifths', async () => {
    await renderApp('/practice/progressions/line?p=ii-V-I&size=sevenths')
    await screen.findByRole('heading', { level: 3, name: 'Practise in the Player' })
    const walks = within(section('Practise in the Player'))
    expect(walks.getByRole('link', { name: /^In whole steps, rising/ })).toHaveTextContent(
      'Dm7 G7 Cmaj7 · Em7 A7 Dmaj7 …',
    )
    expect(walks.getByRole('link', { name: /^Circle of fifths, falling/ })).toHaveTextContent(
      'Dm7 G7 Cmaj7 · Gm7 C7 Fmaj7 …',
    )
  })

  it('reads a song’s chords in the key they are in, and plays them in any (ADR 0052)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line')
    const field = await screen.findByRole('textbox', { name: 'Numerals or chords' })
    await user.clear(field)
    await user.type(field, 'Dm7 Gm9 Asus4 Dm7')
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ key: 'Dm', p: 'i7-iv9-Vsus4-i7' }),
    )
    await rowIs(['Dm7i7', 'Gm9iv9', 'Asus4Vsus4', 'Dm7i7'])
  })

  it('shows the passing chords into the row’s first change of chord, each played on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/progressions/line?p=I-IV-V&key=G')
    await screen.findByRole('heading', { level: 3, name: 'Passing chords' })
    // G into C: C's own dominant, G7, leads into it.
    const dominant = within(section('Passing chords')).getByRole('button', { name: /^G7 into C/ })
    expect(dominant).toHaveTextContent('G7 is the V7 of C')
    await user.click(dominant)
    expect(dominant).toHaveAttribute('aria-pressed', 'true')
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('opens a progression from the library, and Back goes up to its style', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice')
    // The phone's list and the laptop's cards both stand in jsdom: the first is the list's.
    const [progressions] = await screen.findAllByRole('link', { name: /^Progressions/ })
    await user.click(progressions ?? document.body)
    const blues = await screen.findByRole('region', { name: /^Blues\d+$/ })
    const twelveBar = within(blues)
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '/practice/progressions/twelve-bar')
    await user.click(twelveBar ?? blues)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/practice/progressions/twelve-bar'),
    )
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/progressions'))
  })

  it('goes up from a progression opened directly to its style in the library', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/twelve-bar')
    await user.click(await screen.findByRole('button', { name: 'Back' }))
    await waitFor(() => expect(router.state.location.search).toMatchObject({ place: 'blues' }))
  })

  it('speaks Russian', async () => {
    await renderApp('/practice/progressions/line?p=I-I-IV', { locale: 'ru' })
    expect(await screen.findByRole('heading', { level: 2, name: 'I – I – IV' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Ступени или аккорды' })).toBeInTheDocument()
  })

  it('starts the row in the inversion its Settings choose, or plays it as blocks (A24)', async () => {
    const user = userEvent.setup()
    const { router, audio, settingsStore } = await renderApp(
      '/practice/progressions/line?p=I-IV-V-I',
    )
    await rowIs(['CI', 'FIV', 'GV', 'CI'])
    act(() => setProgressions(settingsStore, { inversion: 2 }))
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
    act(() => setProgressions(settingsStore, { voicing: 'block' }))
    expect(await lowestHands()).toEqual([0, 5, 7, 0]) // every chord from its root
    expect(router.state.location.search).toEqual({ p: 'I-IV-V-I' })
  })

  it('opens the Player in the position shown, not one kept from an earlier visit', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(
      '/play/progression?p=I-V-vi-IV&key=C&inversion=2&nearest=false',
    )
    await screen.findByRole('dialog', { name: 'Setup' })
    await router.navigate({ to: '/practice/progressions/line' })
    await user.click(await screen.findByRole('link', { name: /^In C major/ }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/play/progression'))
    expect(router.state.location.search).toMatchObject({ inversion: 0, nearest: true })
  })

  /** The songs a progression is heard in, every one of them shown. */
  const everySong = async () => {
    const songs = await screen.findByRole('region', { name: 'Songs with this progression' })
    const all = within(songs).queryByRole('button', { name: /^Show all/ })
    if (all) await userEvent.setup().click(all)
    return songs
  }

  it('lists the songs it is heard in, each opening the Player looping its bars', async () => {
    await renderApp('/practice/progressions/line?key=G&p=I-IV-I')
    const amazing = within(await everySong()).getByRole('link', { name: /Amazing Grace/ })
    expect(amazing).toHaveTextContent('bars 1–4')
    const href = new URL(amazing.getAttribute('href') ?? '', 'http://x')
    expect(href.pathname).toBe('/play/amazing')
    // Its pickup is the score's first measure: printed bar 1 is the Player's measure 2.
    expect(Object.fromEntries(href.searchParams)).toEqual({ bar: '2', loop: '2-5' })
  })

  it('finds the songs in their own keys, whatever key it is shown in', async () => {
    await renderApp('/practice/progressions/line?key=Eb&p=I-IV-I')
    const songs = await everySong()
    expect(within(songs).getByRole('link', { name: /Amazing Grace/ })).toBeInTheDocument()
  })

  it('hears a line read in a mode only where a song comes back round to its first chord', async () => {
    // Aura Lee's I–II7–V7–I passes through II on its way to V.
    await renderApp('/practice/progressions/line?key=C&p=I-II')
    expect(within(await everySong()).getByRole('link', { name: /Aura Lee/ })).toBeInTheDocument()
    cleanup()
    await renderApp('/practice/progressions/line?key=C&p=I-II&mode=lydian')
    await rowIs(['CI', 'DII'])
    const songs = screen.queryByRole('region', { name: 'Songs with this progression' })
    expect(songs && within(songs).queryByRole('link', { name: /Aura Lee/ })).toBeNull()
  })

  it('shows a few songs, and every one when asked', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/progressions/line?key=C&p=I-V-I')
    const songs = await screen.findByRole('region', { name: 'Songs with this progression' })
    const few = within(songs).getAllByRole('link').length
    await user.click(within(songs).getByRole('button', { name: /^Show all \d+ songs$/ }))
    expect(within(songs).getAllByRole('link').length).toBeGreaterThan(few)
  })

  it('has no songs section where no song uses it (A23)', async () => {
    await renderApp('/practice/progressions/line?key=C&p=ii7-bII7-IMaj7')
    await rowIs(['Dm7ii7', 'D♭7♭II7', 'Cmaj7Imaj7'])
    expect(
      screen.queryByRole('region', { name: 'Songs with this progression' }),
    ).not.toBeInTheDocument()
  })
})

describe('Practice → Progressions, read and played other ways', () => {
  it('names its chords by Nashville numbers or by the chords alone, as its Settings write them', async () => {
    const { router, settingsStore } = await renderApp('/practice/progressions/line')
    await rowIs(['CI', 'GV', 'Amvi', 'FIV'])
    act(() => setProgressions(settingsStore, { names: 'nashville' }))
    await rowIs(['C1', 'G5', 'Am6m', 'F4'])
    expect(router.state.location.search).toEqual({})
    act(() => setProgressions(settingsStore, { names: 'chords' }))
    await rowIs(['C', 'G', 'Am', 'F'])
  })

  it('reads its numerals in a church mode on the key’s tonic, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/progressions/line?key=D&p=I-IV-V')
    await user.click(await screen.findByRole('combobox', { name: 'Mode' }))
    await user.click(await screen.findByRole('option', { name: 'Dorian' }))
    expect(router.state.location.search).toMatchObject({ key: 'Dm', mode: 'dorian' })
    await rowIs(['Dmi', 'GIV', 'Amv'])
    expect(screen.getByText('D Dorian')).toBeInTheDocument()
  })

  it('opens a modal vamp from the library in its mode', async () => {
    await renderApp('/practice/progressions/mixolydian-vamp?key=A')
    await rowIs(['AI', 'G♭VII'])
  })
})
