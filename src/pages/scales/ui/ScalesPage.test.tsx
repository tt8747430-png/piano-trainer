import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { untranslated } from '@/app/testing/untranslated'
import type { Sound } from '@/shared/lib/schedule'
import { menuOptions, pickIn, pickMenu, pickerValue } from '@/shared/test/pickers'
import { stubResizeObserver } from '@/shared/test/resize'

type User = ReturnType<typeof userEvent.setup>

const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))
/** The scale named, its Tonic and Scale pickers its heading. */
const named = (name: string) => screen.findByRole('heading', { level: 2, name })
/** A section of the page by its heading. */
const section = (name: string | RegExp) =>
  screen.getByRole('heading', { level: 3, name }).closest('section') ?? document.body

/** Opens the page's settings off its gear. */
async function openSettings(user: User) {
  await user.click(screen.getByRole('button', { name: 'Scale settings' }))
  return screen.findByRole('dialog', { name: 'Scale settings' })
}

/** Opens a row of Scale settings and chooses one of its options. */
async function pickRow(user: User, label: string, option: string) {
  await user.click(screen.getByRole('button', { name: new RegExp(`^${label}`) }))
  const list = await screen.findByRole('listbox', { name: label })
  await user.click(within(list).getByRole('option', { name: option }))
}

/** A settings row's options, read, then closed. */
async function rowOptions(user: User, label: string) {
  await user.click(screen.getByRole('button', { name: new RegExp(`^${label}`) }))
  const list = await screen.findByRole('listbox', { name: label })
  const names = within(list)
    .getAllByRole('option')
    .map((option) => option.textContent ?? '')
  await user.keyboard('{Escape}')
  return names
}

describe('Practice → Scales and keys', () => {
  it('reads its heading as the scale’s name, two pickers Tonic and Scale, and nothing called Root (R29-P8)', async () => {
    await renderApp('/practice/scales?root=B&kind=natural')
    // A major or minor scale is named as its key.
    const heading = await named('B minor')
    expect(within(heading).getByRole('button', { name: 'Tonic: B' })).toBeInTheDocument()
    expect(within(heading).getByRole('button', { name: /^Scale: / })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Root/ })).not.toBeInTheDocument()
  })

  it('spells E♭ harmonic minor with its C♭', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales?root=Eb&kind=harmonic')
    expect(await named('E♭ minor')).toBeInTheDocument()
    expect(pickerValue('Scale')).toBe('Harmonic minor')
    await openSettings(user)
    expect(await rowOptions(user, 'Start on')).toContain('C♭')
  })

  it('colours the scale’s keys whole: the tonic in yellow’s wash, the others in sky’s', async () => {
    await renderApp('/practice/scales')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveClass('bg-key-scale')
  })

  it('names the scale’s notes on its keys, no fingers on them (R34)', async () => {
    await renderApp('/practice/scales?root=D&kind=major')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F sharp 4' })).toHaveTextContent('F♯')
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveTextContent(/^D$/)
  })

  it('chooses the tonic among the twelve notes and the scale from a pop-up button', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await pickIn(user, 'Tonic', 'E♭')
    await pickMenu(user, 'Scale', 'Harmonic minor')
    expect(router.state.location.search).toMatchObject({ root: 'Eb', kind: 'harmonic' })
    expect(await named('E♭ minor')).toBeInTheDocument()
  })

  it('lists the scales in a menu, keys, then modes, blues, the symmetric scales and the others', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?kind=mpent')
    await named('C minor pentatonic')
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

  it('has one Play, in its floating bar beside the tempo and the hands', async () => {
    await renderApp('/practice/scales')
    const bar = await screen.findByRole('toolbar', { name: 'Transport' })
    expect(
      within(bar)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label') ?? button.textContent),
    ).toEqual(['Tempo: 72 BPM', 'Play scale', 'How it plays', 'Hands: Both hands'])
  })

  it('plays up and down, each key going down as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('button', { name: 'Play scale' }))
    const start = audio.played[0]?.at ?? 0
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const c4 = within(keyboard).getByRole('button', { name: 'C4' })
    const d4 = within(keyboard).getByRole('button', { name: 'D4' })
    act(() => audio.setNow(start + 0.05))
    expect(c4).toHaveAttribute('data-down')
    expect(d4).not.toHaveAttribute('data-down')
    // An eighth at 72 BPM later, the run has moved on to D.
    act(() => audio.setNow(start + 0.45))
    expect(d4).toHaveAttribute('data-down')
    expect(c4).not.toHaveAttribute('data-down')
  })

  it('stops the run on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('button', { name: 'Play scale' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Play scale' })).toBeInTheDocument()
  })

  it('climbs up to four octaves, up alone or down alone, from How it plays, kept in the URL (R29-P9)', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/scales?hands=rh')
    await named('C major')
    await user.click(screen.getByRole('button', { name: 'How it plays' }))
    expect(
      (await screen.findAllByRole('menuitemcheckbox')).map((each) => each.textContent),
    ).toEqual(['Up and down', 'Up', 'Down', '1 octave', '2 octaves', '3 octaves', '4 octaves'])
    await user.click(screen.getByRole('menuitemcheckbox', { name: '2 octaves' }))
    expect(router.state.location.search).toMatchObject({ octaves: 2 })
    // A tick keeps the menu open, for the direction to be ticked too.
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Up' }))
    await user.keyboard('{Escape}')
    expect(router.state.location.search).toMatchObject({ octaves: 2, direction: 'up' })
    await user.click(screen.getByRole('button', { name: 'Play scale' }))
    const run = notes(audio.played.at(-1)?.sounds)
    // The right hand, two octaves up and no way back: C4 to C6, each note higher than the last.
    expect(run[0]).toBe(60)
    expect(run.at(-1)).toBe(84)
    expect(run).toEqual([...run].sort((a, b) => a - b))
  })

  it('plays one hand from Hands, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await named('C major')
    await user.click(screen.getByRole('button', { name: 'Hands: Both hands' }))
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Left hand' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(screen.getByRole('button', { name: 'Hands: Left hand' })).toBeInTheDocument()
  })

  it('sets the tempo from its piece, kept in the URL', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await user.click(await screen.findByRole('button', { name: 'Tempo: 72 BPM' }))
    const sheet = await screen.findByRole('dialog', { name: 'Tempo' })
    await user.click(within(sheet).getByRole('button', { name: 'Faster' }))
    expect(router.state.location.search).toMatchObject({ tempo: 76 })
  })

  it('writes the run on a staff', async () => {
    stubResizeObserver({ width: 343, height: 160 })
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(343)
    await renderApp('/practice/scales')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument(), { timeout: 5000 })
  })

  it('fingers the run as the scale fingers it or from the thumb, from its settings', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales?root=F')
    await named('F major')
    const settings = await openSettings(user)
    const fingering = within(settings).getByRole('radiogroup', { name: 'Fingering' })
    expect(within(fingering).getByRole('radio', { name: 'As the scale' })).toBeChecked()
    await user.click(within(fingering).getByRole('radio', { name: 'From the thumb' }))
    expect(router.state.location.search).toMatchObject({ fingering: 'thumb' })
  })

  it('says a scale with no taught fingering has none, and offers it no choice', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/scales?kind=wholeTone')
    expect(await screen.findByText('No standard fingering for this scale')).toBeInTheDocument()
    const settings = await openSettings(user)
    expect(within(settings).queryByRole('radiogroup', { name: 'Fingering' })).toBeNull()
  })

  it('starts the run on any note of the scale, from its settings', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/scales')
    await named('C major')
    await openSettings(user)
    await pickRow(user, 'Start on', 'E')
    expect(router.state.location.search).toMatchObject({ start: 3 })
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play scale' }))
    expect(notes(audio.played.at(-1)?.sounds)[0]).toBe(52)
  })

  it('compares C major with C minor, and offers no comparison for a pentatonic (A43)', async () => {
    const user = userEvent.setup()
    const first = await renderApp('/practice/scales')
    await named('C major')
    await openSettings(user)
    await pickRow(user, 'Compare with', 'C natural minor')
    expect(first.router.state.location.search).toMatchObject({ compare: 'natural' })
    first.unmount()
    await renderApp('/practice/scales?kind=pent')
    await named('C major pentatonic')
    await openSettings(user)
    expect(screen.queryByRole('button', { name: /^Compare with/ })).toBeNull()
    expect(screen.getByRole('button', { name: /^Rhythm/ })).toBeInTheDocument()
  })

  it('plays the run in the rhythm chosen in its settings', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/scales')
    await named('C major')
    await openSettings(user)
    await pickRow(user, 'Rhythm', 'Long, short')
    expect(router.state.location.search).toMatchObject({ rhythm: 'long-short' })
  })

  it('names the chords in the scale, each played from its tile, pressed while it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/scales')
    await named('C major')
    const chords = within(section('Chords in C major')).getAllByRole('button')
    expect(chords.map((chord) => chord.getAttribute('aria-label'))).toEqual([
      'C, I',
      'Dm, ii',
      'Em, iii',
      'F, IV',
      'G, V',
      'Am, vi',
      'B°, vii°',
    ])
    const dm = screen.getByRole('button', { name: 'Dm, ii' })
    await user.click(dm)
    expect(dm).toHaveAttribute('aria-pressed', 'true')
    expect(notes(audio.played.at(-1)?.sounds).map((key) => key % 12)).toEqual([2, 5, 9])
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
    await waitFor(() => expect(dm).toHaveAttribute('aria-pressed', 'false'))
  })

  it('places a key on the circle of fifths: its neighbours and its relative, each opening its page', async () => {
    await renderApp('/practice/scales?root=G&kind=major')
    await named('G major')
    expect(screen.getByRole('link', { name: 'On the circle of fifths' })).toHaveAttribute(
      'href',
      '/practice/circle-of-fifths?key=G',
    )
    expect(screen.getByRole('link', { name: 'G major' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'E minor' })).toHaveAttribute(
      'href',
      '/practice/scales?root=E&kind=natural',
    )
    expect(screen.getByRole('link', { name: 'D major' })).toHaveAttribute(
      'href',
      '/practice/scales?root=D',
    )
  })

  it('opens the scale’s exercises in the Player, each on this scale; the routine is a major or minor’s', async () => {
    await renderApp('/practice/scales?root=D&kind=dorian')
    await named('D Dorian')
    expect(
      within(section('Practise D Dorian in the Player'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual([
      '/play/exercise/scale?root=D&kind=dorian',
      '/play/exercise/thirds?root=D&kind=dorian',
      '/play/exercise/sixths?root=D&kind=dorian',
      '/play/exercise/groups?root=D&kind=dorian',
      '/play/exercise/contrary?root=D&kind=dorian',
    ])
    expect(pickerValue('Tonic')).toBe('D')
  })

  it('offers a major scale its daily routine too', async () => {
    await renderApp('/practice/scales?root=C&kind=major')
    await named('C major')
    expect(
      within(section('Practise C major in the Player'))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
        .at(-1),
    ).toBe('/play/exercise/scale-routine?root=C&kind=major')
  })

  it('reads in Russian, with nothing left in English', async () => {
    await renderApp('/practice/scales', { locale: 'ru' })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Гаммы и тональности' }),
    ).toBeInTheDocument()
    expect(untranslated(document.body)).toEqual([])
  })
})
