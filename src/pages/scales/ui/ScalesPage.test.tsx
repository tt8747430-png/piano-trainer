import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { shownText } from '@/shared/test/shown-text'
import { renderApp } from '@/app/testing/render-app'
import { setKeyboard } from '@/features/set-preference'
import type { LiveEvent } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { menuOptions, pickIn, pickMenu } from '@/shared/test/pickers'

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))
const pressed = (voice: readonly LiveEvent[]) =>
  voice.flatMap((event) => (event.kind === 'press' ? [event.midi] : []))

/** What each wedge of the circle writes, its name and its line under it. */
const wedgesOf = (circle: HTMLElement) =>
  [...circle.querySelectorAll('[data-wedge]')].map((wedge) => wedge.textContent ?? '')

describe('Practice → Scales and keys', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    await renderApp('/practice/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(await menuOptions(userEvent.setup(), 'Start on')).toContain('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('colours the scale’s keys whole: the tonic in yellow’s wash, the others in sky’s', async () => {
    await renderApp('/practice/scales')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveClass('bg-key-scale')
  })

  it('puts the playing hand’s fingers under the keys, which keep their degrees', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(shownText(within(keyboard).getByRole('button', { name: 'F4' }))).toContain('4')
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
    const hands = screen.getByRole('radiogroup', { name: 'Hands' })
    await user.click(within(hands).getByRole('radio', { name: 'Left' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('54321321')
    expect(screen.queryByRole('radiogroup', { name: 'Fingers' })).not.toBeInTheDocument()
  })

  it('has one Play, beside the scale’s name, and no card of its own for playing', async () => {
    await renderApp('/practice/scales')
    expect(await screen.findByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Play the scale' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Practice' })).not.toBeInTheDocument()
  })

  it('plays D Dorian’s vamp, Dm – G (A43)', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?root=D&kind=dorian')
    expect(await screen.findByText('Dm – G')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play the vamp: Dm – G' }))
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('opens the Drone on the mode’s tonic', async () => {
    const user = userEvent.setup()
    const { router, settingsStore } = await renderApp('/practice/scales?root=D&kind=dorian')
    await user.click(await screen.findByRole('link', { name: 'Drone on D' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/drone'))
    expect(settingsStore.getState().drone.root).toBe(2)
  })

  it('opens the scale’s exercises in the Player, each on this scale', async () => {
    await renderApp('/practice/scales?root=D&kind=dorian')
    const practise = await screen.findByRole('region', { name: 'Practise in the Player' })
    expect(
      within(practise)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      '/play/exercise/scale?root=D&kind=dorian',
      '/play/exercise/thirds?root=D&kind=dorian',
      '/play/exercise/sixths?root=D&kind=dorian',
      '/play/exercise/groups?root=D&kind=dorian',
      '/play/exercise/contrary?root=D&kind=dorian',
    ])
  })

  it('stops the run on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
  })

  it('keeps the chords on the keys while one of them sounds, its keys down', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?show=chords')
    await user.click(await screen.findByRole('button', { name: /^Dm/ }))
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 0.2))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveAttribute('data-down')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveClass('bg-key-scale')
  })

  it('presses a chord of the scale while it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?show=chords')
    const dm = await screen.findByRole('button', { name: /^Dm/ })
    await user.click(dm)
    expect(dm).toHaveAttribute('aria-pressed', 'true')
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
    expect(dm).toHaveAttribute('aria-pressed', 'false')
  })

  it('names the relative minor once, on the Key tab (A32)', async () => {
    const first = await renderApp('/practice/scales?root=G&kind=major')
    await screen.findByRole('heading', { level: 2, name: 'G major' })
    expect(screen.queryByRole('link', { name: 'E natural minor' })).not.toBeInTheDocument()
    first.unmount()
    await renderApp('/practice/scales?root=G&kind=major&show=key')
    await screen.findByRole('heading', { level: 2, name: 'G major' })
    expect(screen.getByText('Relative', { selector: 'dt' })).toBeInTheDocument()
  })

  it('plays up and down, each key going down as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    const start = audio.played[0]?.at ?? 0
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const c4 = within(keyboard).getByRole('button', { name: 'C4' })
    const d4 = within(keyboard).getByRole('button', { name: 'D4' })
    act(() => audio.setNow(start + 0.05))
    expect(c4).toHaveAttribute('data-down')
    expect(d4).not.toHaveAttribute('data-down')
    // An eighth at 80 BPM later, the run has moved on to D.
    act(() => audio.setNow(start + 0.5))
    expect(d4).toHaveAttribute('data-down')
    expect(c4).not.toHaveAttribute('data-down')
  })

  it('reads its heading as the scale’s name, two menus Tonic and Scale, and nothing called Root (R29-P8)', async () => {
    await renderApp('/practice/scales?root=B&kind=natural')
    const heading = await screen.findByRole('heading', { level: 2, name: 'B natural minor' })
    expect(within(heading).getByRole('button', { name: 'Tonic: B' })).toBeInTheDocument()
    expect(within(heading).getByRole('button', { name: /^Scale: / })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Root/ })).not.toBeInTheDocument()
  })

  it('writes Dorian’s formula 1 2 ♭3 4 5 6 ♭7, its ♭3 and ♭7 marked, and names its colour, not its degrees (R29-P10)', async () => {
    await renderApp('/practice/scales?kind=dorian')
    const formula = await screen.findByText('Formula')
    const chips = within(formula.parentElement as HTMLElement).getAllByRole('listitem')
    expect(chips.map((chip) => chip.textContent)).toEqual([
      '1',
      '2',
      '♭3 (Differs from major)',
      '4',
      '5',
      '6',
      '♭7 (Differs from major)',
    ])
    expect(screen.getByText('Minor with a raised 6th')).toBeInTheDocument()
    expect(screen.queryByText('Subdominant')).not.toBeInTheDocument()
  })

  it('chooses the tonic among the twelve notes and the scale from a pop-up button', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await pickIn(user, 'Tonic', 'E♭')
    await pickMenu(user, 'Scale', 'Harmonic minor')
    expect(router.state.location.search).toMatchObject({ root: 'Eb', kind: 'harmonic' })
  })

  it('shows each degree’s numeral over its chord in Chords view', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales')
    const views = await screen.findByRole('radiogroup', { name: 'Scales and keys' })
    await user.click(within(views).getByRole('radio', { name: 'Chords' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(shownText(within(keyboard).getByRole('button', { name: 'D4' }))).toContain('iiDm')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    // Two controls say "Chords": the one for what the keys play names itself on screen.
    expect(screen.getByText('Keys play')).toBeVisible()
  })

  it('plays a degree’s chord from its key and holds the chord’s keys down', async () => {
    const { audio } = await renderApp('/practice/scales?show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(pressed(audio.voice)).toEqual([62, 65, 69])
    expect(within(keyboard).getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })

  it('plays a chord of the list from its degree’s key', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?root=A&show=chords&chords=4')
    await user.click(await screen.findByRole('button', { name: /^C♯m7/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([73, 76, 80, 83])
  })

  it('in Notes, outlines and names the chords that hold the note a key plays', async () => {
    const { audio } = await renderApp('/practice/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    expect(pressed(audio.voice)).toEqual([64])
    expect(screen.getByText('E is in C, Em, and Am')).toBeInTheDocument()
    for (const name of ['C4', 'E4', 'A4']) {
      expect(within(keyboard).getByRole('button', { name })).toHaveClass('ring-ring')
    }
    expect(screen.getByRole('button', { name: /^Em/ })).toHaveAttribute('data-holds')
    expect(screen.getByRole('button', { name: /^Dm/ })).not.toHaveAttribute('data-holds')
  })

  it('prints the chords, and those that hold a note, as the sheets print them', async () => {
    await renderApp('/practice/scales?root=A&show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.getByRole('button', { name: /^G♯°/ })).toBeInTheDocument()
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E5' }), { pointerId: 1 })
    expect(screen.getByText('E is in A, C♯m, and E')).toBeInTheDocument()
  })

  it('in Notes, hears a MIDI key too, and says when no chord holds a note', async () => {
    const { midi: keyboard } = await renderApp('/practice/scales?show=chords&keysPlay=notes')
    await screen.findByRole('group', { name: 'Keyboard' })
    act(() => keyboard.press(midi(61)))
    expect(screen.getByText('No chord of the scale holds D♭')).toBeInTheDocument()
  })

  it('forgets the note when the chords change', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    expect(screen.getByText(/ is in /)).toBeInTheDocument()
    const sizes = await screen.findByRole('radiogroup', { name: 'Chord size' })
    await user.click(within(sizes).getByRole('radio', { name: '7ths' }))
    expect(screen.queryByText(/ is in /)).not.toBeInTheDocument()
  })

  it('keeps a note forgotten when the learner comes back to Notes, or to the same root', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    const keysPlay = screen.getByRole('radiogroup', { name: 'Keys play' })
    await user.click(within(keysPlay).getByRole('radio', { name: 'Chords' }))
    await user.click(within(keysPlay).getByRole('radio', { name: 'Notes' }))
    expect(screen.queryByText(/ is in /)).not.toBeInTheDocument()
    expect(within(keyboard).getByRole('button', { name: 'E4' })).not.toHaveClass('ring-ring')
  })

  it('says a mode is a mode of its parent major, and links to it', async () => {
    await renderApp('/practice/scales?root=D&kind=dorian')
    expect(await screen.findByRole('heading', { level: 2, name: 'D Dorian' })).toBeInTheDocument()
    expect(screen.getByText('Mode of')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'C major' })).toBeInTheDocument()
  })

  it('plays a scale up its octave as it is chosen, unless Settings turns that off', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/practice/scales')
    await pickIn(user, 'Tonic', 'D')
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([62, 64, 66, 67, 69, 71, 73, 74])
    act(() => setKeyboard(settingsStore, { autoplay: false }))
    const played = audio.played.length
    await pickIn(user, 'Tonic', 'E')
    expect(audio.played).toHaveLength(played)
  })

  it('lists the scales in a menu, keys, then modes, blues, the symmetric scales and the others', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?kind=mpent')
    await screen.findByRole('heading', { level: 2, name: 'C minor pentatonic' })
    expect(await menuOptions(user, 'Scale')).toEqual([
      'Major',
      'Natural minor',
      'Harmonic minor',
      'Melodic minor',
      'Dorian',
      'Phrygian',
      'Lydian',
      'Mixolydian',
      'Locrian',
      'Major pentatonic',
      'Minor pentatonic',
      'Major blues',
      'Minor blues',
      'Whole-tone',
      'Diminished (half-whole)',
      'Diminished (whole-half)',
      'Chromatic',
      'Harmonic major',
      'Hungarian minor',
      'Bebop major',
      'Bebop dominant',
    ])
    await pickMenu(user, 'Scale', 'Major blues')
    expect(router.state.location.search).toMatchObject({ kind: 'majorBlues' })
  })

  it('fingers a scale with no taught fingering from the thumb', async () => {
    await renderApp('/practice/scales?kind=mpent&root=A')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent(/^1/)
  })

  it('writes each hand’s fingering under the run’s notes, beside the hand drawn with its fingers numbered', async () => {
    await renderApp('/practice/scales')
    const byHand = await screen.findByRole('region', { name: 'Fingering by hand' })
    const row = (hand: string) =>
      within(within(byHand).getByRole('table', { name: hand }))
        .getAllByRole('row')
        .map((each) => each.textContent)
    // A crossing's finger says so to a screen reader: the left hand's 3 over to A, the right thumb on F.
    expect(row('Left hand')).toEqual(['NotesCDEFGABC', 'Fingers543213 (crossing)21'])
    expect(row('Right hand')).toEqual(['NotesCDEFGABC', 'Fingers1231 (crossing)2345'])
    // Each hand drawn over each of its positions, a new one where it crosses (R29-P5).
    expect(
      within(byHand)
        .getAllByRole('img')
        .map((each) => each.getAttribute('aria-label')),
    ).toEqual([
      'Left hand over the keys: C 5, D 4, E 3, F 2, G 1',
      'Left hand over the keys: A 3, B 2, C 1',
      'Right hand over the keys: C 1, D 2, E 3',
      'Right hand over the keys: F 1, G 2, A 3, B 4, C 5',
    ])
  })

  it('climbs two octaves where asked and up to four, kept in the URL (R29-P9)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    const more = await screen.findByRole('button', { name: 'More octaves' })
    await user.click(more)
    expect(router.state.location.search).toMatchObject({ octaves: 2 })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('123123412312345')
    await user.click(more)
    await user.click(more)
    expect(router.state.location.search).toMatchObject({ octaves: 4 })
    expect(more).toBeDisabled()
  })

  it('goes up alone or down alone from its Direction, and has no On the keys of its own (R29-P9)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await pickMenu(user, 'Direction', 'Up')
    expect(router.state.location.search).toMatchObject({ direction: 'up' })
    await pickMenu(user, 'Direction', 'Up and down')
    expect(router.state.location.search).not.toHaveProperty('direction')
    // What the keys carry is the on-screen piano's own toolbar's.
    expect(screen.queryByRole('radiogroup', { name: 'On the keys' })).not.toBeInTheDocument()
  })

  it('compares C major with C minor, and offers no comparison for a pentatonic (A43)', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await pickMenu(user, 'Compare with', 'C natural minor')
    expect(router.state.location.search).toMatchObject({ compare: 'natural' })
    await pickMenu(user, 'Compare with', 'None')
    expect(router.state.location.search).not.toHaveProperty('compare')
    await router.navigate({ to: '/practice/scales', search: { kind: 'pent' } })
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /^Compare with: / })).not.toBeInTheDocument(),
    )
  })

  it('opens each of the key’s chords in Chords from its card, in the key (A32, A33)', async () => {
    await renderApp('/practice/scales?show=chords')
    await screen.findByRole('heading', { level: 2, name: 'C major' })
    expect(screen.queryByRole('navigation', { name: 'Open in Chords' })).not.toBeInTheDocument()
    const links = screen.getAllByRole('link', { name: /^Open .* in Chords$/ })
    expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(
      ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'].map((chord) => `Open ${chord} in Chords`),
    )
    const href = links[1]?.getAttribute('href') ?? ''
    expect(href).toMatch(/^\/practice\/chords\?/)
    expect(new URLSearchParams(href.split('?')[1]).get('root')).toBe('D')
    expect(new URLSearchParams(href.split('?')[1]).get('key')).toBe('C')
  })

  it('names each degree on the key’s chords, the seven-degree spine (A21)', async () => {
    await renderApp('/practice/scales?root=B&show=chords')
    const chords = await screen.findByRole('region', { name: 'Chords in this scale' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual([
      'BITonic',
      'C♯miiSupertonic',
      'D♯miiiMediant',
      'EIVSubdominant',
      'F♯VDominant',
      'G♯mviSubmediant',
      'A♯°vii°Leading tone',
    ])
  })

  it('writes a minor key with the harmonic V and vii° over the natural v and VII (A21)', async () => {
    await renderApp('/practice/scales?root=Bb&kind=natural&show=chords')
    const chords = await screen.findByRole('region', { name: 'Chords in this scale' })
    expect(
      within(chords)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual([
      'B♭miTonic',
      'C°ii°Supertonic',
      'D♭IIIMediant',
      'E♭mivSubdominant',
      'FVDominant',
      'FmvDominant',
      'G♭VISubmediant',
      'A°vii°Leading tone',
      'A♭VIISubtonic',
    ])
  })

  it('has no Chords view for a scale without seven notes, and then no views control at all', async () => {
    await renderApp('/practice/scales?kind=blues&show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.queryByRole('radiogroup', { name: 'Scales and keys' })).not.toBeInTheDocument()
    expect(shownText(within(keyboard).getByRole('button', { name: 'C4' }))).toContain('1')
  })

  it('starts the run on any note, fingered from the thumb there', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/scales?fingers=rh')
    await screen.findByRole('heading', { level: 2, name: 'C major' })
    expect(await menuOptions(user, 'Start on')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    await pickMenu(user, 'Start on', 'E')
    expect(router.state.location.search).toMatchObject({ start: 3 })
    const fingering = screen.getByRole('radiogroup', { name: 'Fingering' })
    expect(within(fingering).getByRole('radio', { name: 'From the thumb' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(shownText(within(keyboard).getByRole('button', { name: 'E4' }))).toContain('3')
    await user.click(screen.getByRole('button', { name: 'Play up and down' }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])[0]).toBe(64)
  })

  it('fingers the run as the scale fingers it', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?start=3&fingers=rh')
    const fingering = await screen.findByRole('radiogroup', { name: 'Fingering' })
    await user.click(within(fingering).getByRole('radio', { name: 'As the scale' }))
    expect(router.state.location.search).toMatchObject({ start: 3, fingering: 'scale' })
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('31234123')
  })

  it('offers the blues no choice of fingering: as taught from its tonic', async () => {
    await renderApp('/practice/scales?kind=blues&fingers=rh')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.queryByRole('group', { name: 'Fingering' })).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('1234123')
  })

  it('writes the run on a staff, the other hand’s staff muted', async () => {
    await renderApp('/practice/scales')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('[data-slot="score"] svg')).toBeInTheDocument())
    expect(sheet.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'bass')
  })

  it('stacks the scale’s chords up to 13ths', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=chords')
    const sizes = await screen.findByRole('radiogroup', { name: 'Chord size' })
    await user.click(within(sizes).getByRole('radio', { name: '13ths' }))
    expect(router.state.location.search).toMatchObject({ chords: 7 })
    expect(screen.getByRole('button', { name: /^FMaj13♯11/ })).toBeInTheDocument()
  })

  it('shows the chords in an inversion over their bass, each numeral figured', async () => {
    await renderApp('/practice/scales?show=chords&inversion=1')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(shownText(within(keyboard).getByRole('button', { name: 'C4' }))).toContain('I⁶C/E')
    expect(screen.getByRole('button', { name: /^Dm\/F/ })).toBeInTheDocument()
  })

  it('keeps an inversion the smaller chords have when the size shrinks', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=chords&chords=4&inversion=3')
    const sizes = await screen.findByRole('radiogroup', { name: 'Chord size' })
    await user.click(within(sizes).getByRole('radio', { name: 'Triads' }))
    expect(router.state.location.search).toMatchObject({ inversion: 2 })
    expect(router.state.location.search).not.toHaveProperty('chords')
  })

  it('walks the chords to the tonic’s octave and back, each on the keys as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?show=chords&tempo=60')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    const sounds = audio.played.at(-1)?.sounds ?? []
    expect(notes(sounds).slice(0, 3)).toEqual([60, 64, 67])
    expect(notes(sounds).slice(21, 24)).toEqual([72, 76, 79])
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2.1))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveAttribute('data-down')
  })

  it('opens the walk in the Player and the key’s common progressions on Progressions, in this key', async () => {
    await renderApp('/practice/scales?root=D&show=chords&chords=4')
    const walk = await screen.findByRole('link', { name: 'Walk the chords' })
    expect(walk.getAttribute('href')).toMatch(/^\/play\/walk\?/)
    expect(walk.getAttribute('href')).toContain('root=D')
    expect(walk.getAttribute('href')).toContain('chordSize=sevenths')
    const inKey = screen.getByRole('region', { name: 'Progressions in this key' })
    const cadence = within(inKey).getByRole('link', { name: 'Complete cadence I–IV–V–I' })
    expect(cadence.getAttribute('href')).toBe(
      '/practice/progressions?key=D&p=I-IV-V-I&size=sevenths',
    )
    expect(within(inKey).getAllByRole('link')).toHaveLength(4)
  })

  it('walks the chords in the Player in the inversion shown, every chord in it', async () => {
    await renderApp('/practice/scales?root=D&show=chords&chords=4&inversion=1')
    const walk = await screen.findByRole('link', { name: 'Walk the chords' })
    const query = new URLSearchParams(walk.getAttribute('href')?.split('?')[1])
    expect(query.get('inversion')).toBe('1')
    expect(query.get('nearest')).toBe('false')
  })

  it('offers a mode the walk alone', async () => {
    await renderApp('/practice/scales?root=D&kind=dorian&show=chords')
    expect(await screen.findByRole('link', { name: 'Walk the chords' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Progressions in this key' })).toBeNull()
  })
})

describe('Practice → Scales and keys, its views', () => {
  it('checks only the view shown, in the page and not in its bar, each with what it holds (R29-P1, P7)', async () => {
    await renderApp('/practice/scales?kind=harmonic&show=chords')
    const views = await screen.findByRole('radiogroup', { name: 'Scales and keys' })
    expect(screen.getByRole('banner')).not.toContainElement(views)
    expect(
      within(views)
        .getAllByRole('radio')
        .map((view) => [view.textContent, view.getAttribute('aria-checked')]),
    ).toEqual([
      ['Scale7 notes', 'false'],
      ['Chordsi–vii°', 'true'],
      ['Key3 flats', 'false'],
    ])
  })
})

describe('Practice → Scales and keys, Key view', () => {
  it('shows a key on the circle of fifths, marking its seven chords', async () => {
    await renderApp('/practice/scales?show=key')
    expect(await screen.findByRole('heading', { level: 2, name: 'C major' })).toBeInTheDocument()
    // A picture (R29-P7): one image named by its key, no wedge a button; the heading chooses.
    const circle = screen.getByRole('img', { name: 'Circle of fifths: C major' })
    expect(within(circle).queryAllByRole('button')).toHaveLength(0)
    expect(within(circle).queryAllByRole('radio')).toHaveLength(0)
    expect(circle.querySelector('[data-on]')).toHaveTextContent('CI')
    const wedges = wedgesOf(circle)
    expect(wedges).toContain('FIV')
    // Its vii° stands on B minor's place, written as the chord it is.
    expect(wedges).toContain('B°vii°')
    expect(wedges).toContain('E♭3♭')
    // A key the circle names is printed as a chord is, over its signature's count and sign.
    expect(wedges).toContain('F♯m3♯')
    // A key written two ways is split, each half one spelling.
    expect(wedges).toContain('C♭7♭')
  })

  it('names a minor scale’s key and marks the notes its signature writes', async () => {
    await renderApp('/practice/scales?root=F%23&kind=harmonic&show=key')
    expect(await screen.findByRole('heading', { level: 2, name: 'F♯ minor' })).toBeInTheDocument()
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // F♯ minor's 7th as its signature writes it is E, not harmonic minor's raised E♯.
    expect(shownText(within(keyboard).getByRole('button', { name: 'E5' }))).toContain('♭7')
    expect(shownText(within(keyboard).getByRole('button', { name: 'F5' }))).not.toContain('7')
  })

  it('writes the key’s chords on the circle as the key spells them, and its borrowed chords plainly', async () => {
    await renderApp('/practice/scales?root=Db&show=key')
    const circle = await screen.findByRole('img', { name: /^Circle of fifths/ })
    // IV and ii of D♭ major stand on the split places' G♭ and E♭ minor halves, not F♯'s and D♯'s.
    expect(wedgesOf(circle)).toEqual(expect.arrayContaining(['G♭IV', 'F♯6♯', 'E♭mii']))
    const borrowed = screen.getByRole('heading', { level: 3, name: 'Borrowed chords' })
    const names = within(borrowed.parentElement ?? circle)
      .getAllByRole('button')
      .map((chord) => chord.textContent)
    expect(names).toEqual(['E♭III', 'G♭mivMinor plagal', 'A♭VI', 'B♭VII'])
  })

  it('borrows into a minor key the Picardy third and the Neapolitan, written by its letter (A43)', async () => {
    await renderApp('/practice/scales?root=Bb&kind=natural&show=key')
    const borrowed = await screen.findByRole('heading', { level: 3, name: 'Borrowed chords' })
    expect(
      within(borrowed.parentElement ?? document.body)
        .getAllByRole('button')
        .map((chord) => chord.textContent),
    ).toEqual(['B♭IPicardy third', 'C♭♭IINeapolitan · sounds as B'])
  })

  it('chooses a key by the heading’s Tonic, and shows its signature, notes, relative and modes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=key')
    const circle = await screen.findByRole('img', { name: /^Circle of fifths/ })
    await pickIn(user, 'Tonic', 'E♭')
    expect(router.state.location.search).toEqual({ root: 'Eb', show: 'key' })
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ major' })).toBeInTheDocument()
    expect(screen.getByText('3 flats: B♭ E♭ A♭')).toBeInTheDocument()
    const relative = screen
      .getAllByRole('link', { name: 'C minor' })
      .filter((link) => !circle.contains(link))
    expect(relative).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'F Dorian' }).getAttribute('href')).toMatch(
      /^\/practice\/scales\?/,
    )
  })

  it('names its parallel key, its neighbours on the circle and its other spelling', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?root=B&show=key')
    await screen.findByRole('heading', { level: 2, name: 'B major' })
    const facts = (term: string) => {
      const name = screen.getByText(term, { selector: 'dt' })
      return within(name.nextElementSibling as HTMLElement)
    }
    expect(facts('Parallel').getByRole('link')).toHaveTextContent('B minor')
    expect(facts('Also written').getByRole('link')).toHaveTextContent('C♭ major')
    expect(
      facts('Beside it on the circle')
        .getAllByRole('link')
        .map((each) => each.textContent),
    ).toEqual(['E major', 'F♯ major'])
    await user.click(facts('Parallel').getByRole('link'))
    expect(router.state.location.search).toMatchObject({ root: 'B', kind: 'natural', show: 'key' })
  })

  it('opens a mode of the key in place, on its run, keeping the other choices', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?root=Eb&show=key&hands=lh')
    await screen.findByRole('heading', { level: 2, name: 'E♭ major' })
    const entries = router.history.length
    await user.click(screen.getByRole('link', { name: 'F Dorian' }))
    // A mode has no Key view: its page opens on its run, the hands chosen kept, the entry replaced.
    expect(router.state.location.search).toEqual({ root: 'F', kind: 'dorian', hands: 'lh' })
    expect(await screen.findByRole('heading', { level: 2, name: 'F Dorian' })).toBeInTheDocument()
    expect(router.history.length).toBe(entries)
  })

  it('plays the chords the key borrows', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?show=key')
    await user.click(await screen.findByRole('button', { name: /^Fm/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([65, 68, 72])
  })

  it('writes the key’s signature on a staff', async () => {
    await renderApp('/practice/scales?root=G&show=key')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument())
  })

  it('lists the songs written in the key, and the studies apart from them', async () => {
    await renderApp('/practice/scales?root=C&show=key')
    const studies = await screen.findByRole('region', { name: 'Studies in this key' })
    expect(within(studies).getByRole('link', { name: /^Lesson 3: C – Dm/ })).toBeInTheDocument()
    const songs = screen.getByRole('region', { name: 'Songs in this key' })
    expect(within(songs).queryByRole('link', { name: /^Lesson 3: C – Dm/ })).not.toBeInTheDocument()
    expect(within(songs).getByRole('link', { name: /Ode to Joy/ })).toBeInTheDocument()
  })

  it('says so when no song is in the key', async () => {
    await renderApp('/practice/scales?root=B&show=key')
    expect(await screen.findByText('No songs are in this key.')).toBeInTheDocument()
  })

  it('harmonises a melody note in the key, its 3rd until another is chosen, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?root=G&show=key')
    const harmonise = await screen.findByRole('region', { name: 'Harmonise a melody note' })
    // B, G major's 3rd: G holds it as its 3rd, Em as its 5th.
    expect(
      within(harmonise).getByRole('button', { name: 'Gas 3 · in the key' }),
    ).toBeInTheDocument()
    expect(
      within(harmonise).getByRole('button', { name: 'Emas 5 · in the key' }),
    ).toBeInTheDocument()
    await pickIn(user, 'Melody note', 'D')
    await waitFor(() => expect(router.state.location.search).toMatchObject({ melody: 'D' }))
  })

  it('writes the note as each chord spells it, the melody’s name beside it (A43)', async () => {
    await renderApp('/practice/scales?root=Ab&show=key&melody=Db')
    const harmonise = await screen.findByRole('region', { name: 'Harmonise a melody note' })
    // D♭ in A major is its 3rd, written C♯.
    expect(
      within(harmonise).getByRole('button', { name: /^Aas 3: C♯ \(= D♭\)/ }),
    ).toBeInTheDocument()
    // In D♭ itself it is the root, written as the melody: no spelling beside it.
    expect(
      within(harmonise).getByRole('button', { name: 'D♭as 1 · in the key' }),
    ).toBeInTheDocument()
  })

  it('prints the chords that harmonise a note as the sheets print them', async () => {
    await renderApp('/practice/scales?root=E&show=key')
    const harmonise = await screen.findByRole('region', { name: 'Harmonise a melody note' })
    // G♯, E major's 3rd: C♯m holds it as its 5th.
    expect(
      within(harmonise).getByRole('button', { name: 'C♯mas 5 · in the key' }),
    ).toBeInTheDocument()
  })

  it('says so when no chord of the key holds the note, and offers the borrowed chords', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp(
      '/practice/scales?root=F%23&kind=natural&show=key&melody=A%23&onlyInKey=true',
    )
    const harmonise = await screen.findByRole('region', { name: 'Harmonise a melody note' })
    expect(within(harmonise).getByText('No chord of the key holds A♯.')).toBeInTheDocument()
    await user.click(within(harmonise).getByRole('button', { name: 'Show borrowed chords too' }))
    await waitFor(() => expect(router.state.location.search).not.toHaveProperty('onlyInKey', true))
    expect(within(harmonise).queryByText('No chord of the key holds A♯.')).not.toBeInTheDocument()
  })

  it('takes a random key from the header, staying on the Key view', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=key')
    // Any key but the one shown: after two, one of them is not C, so the URL names a root.
    await user.click(await screen.findByRole('button', { name: 'A random key' }))
    const first = router.state.location.search
    await user.click(screen.getByRole('button', { name: 'A random key' }))
    expect(router.state.location.search).toHaveProperty('show', 'key')
    expect(router.state.location.search).not.toEqual(first)
  })

  it('has no Key view, songs or random key for a scale that is not a key’s', async () => {
    await renderApp('/practice/scales?kind=dorian&show=key')
    expect(await screen.findByRole('heading', { level: 2, name: 'C Dorian' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Key' })).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /^Circle of fifths/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'A random key' })).not.toBeInTheDocument()
  })
})
