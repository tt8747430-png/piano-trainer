import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Practice → Scales and keys', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    await renderApp('/practice/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
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
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('4')
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
    const hands = screen.getByRole('radiogroup', { name: 'Hands' })
    await user.click(within(hands).getByRole('radio', { name: 'Left hand' }))
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

  it('links to the relative minor', async () => {
    await renderApp('/practice/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
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

  it('chooses the root among the twelve notes and the scale from a pop-up button', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await user.click(
      within(await screen.findByRole('group', { name: 'Root' })).getByRole('radio', { name: 'E' }),
    )
    await user.click(
      within(screen.getByRole('group', { name: 'Root' })).getByRole('radio', { name: 'Flat' }),
    )
    await user.click(screen.getByRole('combobox', { name: 'Scale' }))
    await user.click(await screen.findByRole('option', { name: 'Harmonic minor' }))
    expect(router.state.location.search).toMatchObject({ root: 'Eb', kind: 'harmonic' })
  })

  it('shows each degree’s numeral over its chord in Chords view', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales')
    const views = await screen.findByRole('navigation', { name: 'Scales and keys' })
    await user.click(within(views).getByRole('link', { name: 'Chords' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveTextContent('iiDm')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    // Two controls say "Chords": the one for what the keys play names itself on screen.
    expect(screen.getByText('Keys play')).toBeVisible()
  })

  it('plays a degree’s chord from its key and holds the chord’s keys down', async () => {
    const { audio } = await renderApp('/practice/scales?show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([62, 65, 69])
    expect(within(keyboard).getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })

  it('plays a chord of the list from its degree’s key', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales?root=A&show=chords&chords=4')
    await user.click(await screen.findByRole('button', { name: /^C#m7/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([73, 76, 80, 83])
  })

  it('in Notes, outlines and names the chords that hold the note a key plays', async () => {
    const { audio } = await renderApp('/practice/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([64])
    expect(screen.getByText('E is in C, Em, and Am')).toBeInTheDocument()
    for (const name of ['C4', 'E4', 'A4']) {
      expect(within(keyboard).getByRole('button', { name })).toHaveClass('ring-ring')
    }
    expect(screen.getByRole('button', { name: /^Em/ })).toHaveAttribute('data-holds')
    expect(screen.getByRole('button', { name: /^Dm/ })).not.toHaveAttribute('data-holds')
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

  it('groups the scales in the Scale pop-up', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('combobox', { name: 'Scale' }))
    expect(await screen.findByText('Modes')).toBeInTheDocument()
    await user.click(await screen.findByRole('option', { name: 'Major blues' }))
    expect(router.state.location.search).toMatchObject({ kind: 'majorBlues' })
  })

  it('fingers a scale with no taught fingering from the thumb', async () => {
    await renderApp('/practice/scales?kind=mpent&root=A')
    expect(await screen.findByRole('table')).toHaveTextContent('RH')
  })

  it('has no Chords view for a scale without seven notes', async () => {
    await renderApp('/practice/scales?kind=blues&show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(
      within(screen.getByRole('navigation', { name: 'Scales and keys' })).getAllByRole('link'),
    ).toHaveLength(1)
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('1')
  })

  it('starts the run on any note, fingered from the thumb there', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/scales?fingers=rh')
    const startOn = await screen.findByRole('radiogroup', { name: 'Start on' })
    expect(
      within(startOn)
        .getAllByRole('radio')
        .map((each) => each.textContent),
    ).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
    await user.click(within(startOn).getByRole('radio', { name: 'E' }))
    expect(router.state.location.search).toMatchObject({ start: 3 })
    const fingering = screen.getByRole('radiogroup', { name: 'Fingering' })
    expect(within(fingering).getByRole('radio', { name: 'From the thumb' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
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
    expect(screen.getByRole('button', { name: /^FMaj13#11/ })).toBeInTheDocument()
  })

  it('shows the chords in an inversion over their bass, each numeral figured', async () => {
    await renderApp('/practice/scales?show=chords&inversion=1')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('I⁶C/E')
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

  it('offers a mode the walk alone', async () => {
    await renderApp('/practice/scales?root=D&kind=dorian&show=chords')
    expect(await screen.findByRole('link', { name: 'Walk the chords' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Progressions in this key' })).toBeNull()
  })
})

describe('Practice → Scales and keys, Key view', () => {
  it('shows a key on the circle of fifths, marking its seven chords', async () => {
    await renderApp('/practice/scales?show=key')
    expect(await screen.findByRole('heading', { level: 2, name: 'C major' })).toBeInTheDocument()
    const circle = screen.getByRole('navigation', { name: 'Circle of fifths' })
    expect(within(circle).getByRole('link', { name: 'C major' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(circle).getByRole('link', { name: 'F major' })).toHaveTextContent('IV')
    expect(within(circle).getByRole('link', { name: 'B minor' })).toHaveTextContent('vii°')
    expect(within(circle).getByRole('link', { name: 'E♭ major' })).toHaveTextContent('3♭')
  })

  it('writes the key’s chords on the circle as the key spells them, and its borrowed chords plainly', async () => {
    await renderApp('/practice/scales?root=Db&show=key')
    const circle = await screen.findByRole('navigation', { name: 'Circle of fifths' })
    // IV and ii of D♭ major stand on the places the circle calls F# major and D# minor.
    expect(within(circle).getByRole('link', { name: 'F# major' })).toHaveTextContent('G♭IV')
    expect(within(circle).getByRole('link', { name: 'D# minor' })).toHaveTextContent('E♭mii')
    const borrowed = screen.getByRole('heading', { level: 3, name: 'Borrowed chords' })
    const names = within(borrowed.parentElement ?? circle)
      .getAllByRole('button')
      .map((chord) => chord.textContent)
    expect(names).toEqual(['E♭III', 'G♭miv', 'A♭VI', 'B♭VII'])
  })

  it('chooses a key on the circle, and shows its signature, notes, relative and modes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=key')
    const circle = await screen.findByRole('navigation', { name: 'Circle of fifths' })
    await user.click(within(circle).getByRole('link', { name: 'E♭ major' }))
    expect(router.state.location.search).toEqual({ root: 'Eb', show: 'key' })
    expect(await screen.findByRole('heading', { level: 2, name: 'E♭ major' })).toBeInTheDocument()
    expect(screen.getByText('B♭ E♭ A♭')).toBeInTheDocument()
    const relative = screen
      .getAllByRole('link', { name: 'C minor' })
      .filter((link) => !circle.contains(link))
    expect(relative).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'F Dorian' }).getAttribute('href')).toMatch(
      /^\/practice\/scales\?/,
    )
  })

  it('goes to a minor key as its natural minor, and keeps the minor it was on', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?show=key')
    const circle = await screen.findByRole('navigation', { name: 'Circle of fifths' })
    await user.click(within(circle).getByRole('link', { name: 'A minor' }))
    expect(router.state.location.search).toEqual({ root: 'A', kind: 'natural', show: 'key' })
    await user.click(screen.getByRole('combobox', { name: /^Scale/ }))
    await user.click(await screen.findByRole('option', { name: 'Harmonic minor' }))
    await user.click(within(circle).getByRole('link', { name: 'E minor' }))
    expect(router.state.location.search).toEqual({ root: 'E', kind: 'harmonic', show: 'key' })
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
    expect(screen.queryByRole('navigation', { name: 'Circle of fifths' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'A random key' })).not.toBeInTheDocument()
  })
})
