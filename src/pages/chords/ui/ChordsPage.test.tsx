import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import type { Sound } from '@/shared/lib/schedule'

describe('Practice → Chords', () => {
  it('keeps the scroll when a choice changes the chord', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    await user.click(await screen.findByRole('radio', { name: 'Root' }))
    vi.mocked(window.scrollTo).mockClear()
    await user.click(screen.getByRole('radio', { name: '1st' }))
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('shows C major by default, named, its keys labelled by degree', async () => {
    await renderApp('/practice/chords')
    expect(await screen.findByRole('heading', { level: 2, name: 'C' })).toBeInTheDocument()
    expect(screen.getByText('Major triad')).toBeInTheDocument()
    const triads = screen.getByRole('radiogroup', { name: 'Triad' })
    expect(within(triads).getByRole('radio', { name: 'Major' })).toBeChecked()
    const sizes = screen.getByRole('radiogroup', { name: 'Chord size' })
    expect(within(sizes).getByRole('radio', { name: 'Triad' })).toBeChecked()
    expect(
      within(screen.getByRole('radiogroup', { name: 'Root' })).getAllByRole('radio'),
    ).toHaveLength(12)
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveTextContent('3')
  })

  it('builds a chord part by part through the URL, sounding each choice', async () => {
    const user = userEvent.setup()
    const { router, audio } = await renderApp('/practice/chords?root=G&size=7')
    expect(await screen.findByRole('heading', { level: 2, name: 'G7' })).toBeInTheDocument()
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Triad' })).getByRole('radio', {
        name: 'Minor',
      }),
    )
    expect(router.state.location.search).toMatchObject({ root: 'G', triad: 'min', size: 7 })
    expect(await screen.findByRole('heading', { level: 2, name: 'Gm7' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '11th' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'Gm11' })).toBeInTheDocument()
    expect(audio.played.length).toBeGreaterThan(1)
  })

  it('offers a 7th chord its 7th, and a dominant its alterations', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chords?size=9')
    await user.click(await screen.findByRole('radio', { name: 'Major 7th' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'CMaj9' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Minor 7th' }))
    const alterations = await screen.findByRole('combobox', { name: 'Alterations' })
    expect(alterations).toHaveTextContent('None')
    await user.click(alterations)
    await user.click(await screen.findByRole('option', { name: '#11' }))
    expect(router.state.location.search).toMatchObject({ size: 9, alter: 's11' })
    expect(await screen.findByRole('heading', { level: 2, name: 'C9#11' })).toBeInTheDocument()
  })

  it('adds a tone to a triad, and names a chord the table lacks by rule', async () => {
    await renderApp('/practice/chords?triad=min&added=add9')
    expect(await screen.findByRole('heading', { level: 2, name: 'Cm(add9)' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Added tone' })).toHaveTextContent('add9')
    const written = screen.getByText('Written')
    expect(written.parentElement).toHaveTextContent(/^WrittenCm\(add9\)$/)
  })

  it('writes the chord on a staff', async () => {
    await renderApp('/practice/chords?triad=dim&size=7&seventh=diminished')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument())
  })

  it('keeps the chord written while it plays, engraving it once', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords')
    const sheet = await screen.findByRole('region', { name: 'Sheet music' })
    await waitFor(() => expect(sheet.querySelector('svg')).toBeInTheDocument())
    const engraved = sheet.querySelector('svg')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(sheet.querySelector('svg')).toBe(engraved)
  })

  it('stacks a suspended chord only as far as it goes', async () => {
    await renderApp('/practice/chords?triad=sus4&size=13')
    expect(await screen.findByRole('heading', { level: 2, name: 'C13sus4' })).toBeInTheDocument()
    const sizes = screen.getByRole('radiogroup', { name: 'Chord size' })
    expect(
      within(sizes)
        .getAllByRole('radio')
        .map((option) => option.textContent),
    ).toEqual(['Triad', '7th', '9th', '13th'])
  })

  it('rolls an arpeggio, putting down only the key struck last, every chord tone kept', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Arpeggio' }))
    const start = audio.played.at(-1)?.at ?? 0
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    const [c4, e4, g4] = ['C4', 'E4', 'G4'].map((name) =>
      within(keyboard).getByRole('button', { name }),
    )
    act(() => audio.setNow(start + 0.05))
    expect(c4).toHaveAttribute('data-down')
    expect(e4).not.toHaveAttribute('data-down')
    act(() => audio.setNow(start + 0.5))
    expect(g4).toHaveAttribute('data-down')
    expect(g4).toHaveClass('bg-role-5th')
    for (const key of [c4, e4]) expect(key).not.toHaveAttribute('data-down')
    expect(c4).toHaveClass('bg-role-root-wash')
    expect(e4).toHaveClass('bg-role-3rd-wash')
  })

  it('turns Play into Stop while the chord sounds, and back when it ends', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const start = audio.played.at(-1)?.at ?? 0
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
    act(() => audio.setNow(start + 1.7))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('stops the chord on Stop, and Arpeggio takes over from Play', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    await user.click(screen.getByRole('button', { name: 'Arpeggio' }))
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
    const stops = audio.stops
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBe(stops + 1)
    expect(screen.getByRole('button', { name: 'Arpeggio' })).toBeInTheDocument()
  })

  it('sounds a tapped key', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    await user.click(within(keyboard).getByRole('button', { name: 'A4' }))
    expect(audio.played.at(-1)?.sounds).toMatchObject([{ kind: 'note', midi: 69 }])
  })

  it('offers only the inversions the chord has', async () => {
    await renderApp('/practice/chords')
    const inversions = await screen.findByRole('radiogroup', { name: 'Inversion' })
    expect(
      within(inversions)
        .getAllByRole('radio')
        .map((b) => b.textContent),
    ).toEqual(['Root', '1st', '2nd'])
  })

  it('opened from a path step, offers its check and its learned toggle', async () => {
    const user = userEvent.setup()
    const { progressStore } = await renderApp(
      '/practice/chords?size=7&seventh=major&step=chords:sev',
    )
    const check = await screen.findByRole('link', { name: 'Check yourself' })
    expect(check.getAttribute('href')).toMatch(/^\/check\?of=chords(%3A|:)sev$/)
    await user.click(screen.getByRole('button', { name: 'Learned' }))
    expect(progressStore.getState().learned['chords:sev']).toBeDefined()
  })

  it('chooses the root among the twelve notes', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chords?triad=min')
    const roots = await screen.findByRole('radiogroup', { name: 'Root' })
    await user.click(within(roots).getByRole('radio', { name: 'E' }))
    expect(router.state.location.search).toMatchObject({ root: 'E', triad: 'min' })
    expect(await screen.findByRole('heading', { level: 2, name: 'Em' })).toBeInTheDocument()
  })

  it('writes the chord every way it is written', async () => {
    await renderApp('/practice/chords?triad=min&size=7')
    const written = await screen.findByText('Written')
    expect(written.parentElement).toHaveTextContent(/Cm7 · C/)
  })

  it('is the first of Chords’ two tabs, under a header with a way back', async () => {
    await renderApp('/practice/chords')
    expect(await screen.findByRole('heading', { level: 1, name: 'Chords' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    const tabs = within(screen.getByRole('navigation', { name: 'Chords' })).getAllByRole('link')
    expect(tabs.map((tab) => [tab.textContent, tab.getAttribute('href')])).toEqual([
      ['Build', '/practice/chords'],
      ['Find', '/practice/chords/find'],
    ])
    expect(tabs[0]).toHaveAttribute('aria-current', 'page')
  })

  it('names every choice on screen, in the order a chord is built', async () => {
    await renderApp('/practice/chords?size=7')
    await screen.findByRole('heading', { level: 2, name: 'C7' })
    expect(
      screen.getAllByRole('radiogroup').map((group) => group.getAttribute('aria-label')),
    ).toEqual(['Root', 'Triad', 'Chord size', '7th', 'Inversion', 'Hands'])
  })

  it('walks a chord the table names chromatically in the Player, from its root', async () => {
    await renderApp('/practice/chords?root=G&triad=min&size=9')
    expect(await screen.findByRole('heading', { level: 2, name: 'Gm9' })).toBeInTheDocument()
    const href = screen.getByRole('link', { name: 'Chromatic walk' }).getAttribute('href') ?? ''
    const [path, query] = href.split('?')
    expect(path).toBe('/play/chromatic')
    expect(new URLSearchParams(query).get('chords')).toBe('m9')
    expect(new URLSearchParams(query).get('root')).toBe('G')
  })

  it('offers no chromatic walk for a chord the table does not name', async () => {
    await renderApp('/practice/chords?triad=sus4&size=13')
    expect(await screen.findByRole('heading', { level: 2, name: 'C13sus4' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Chromatic walk' })).not.toBeInTheDocument()
  })

  it('opens the chord’s arpeggio in the Player, on this chord', async () => {
    await renderApp('/practice/chords?root=E&triad=min&size=7')
    await screen.findByRole('heading', { level: 2, name: 'Em7' })
    const practise = screen.getByRole('region', { name: 'Practise in the Player' })
    expect(within(practise).getByRole('link', { name: /^Arpeggio / })).toHaveAttribute(
      'href',
      '/play/exercise/arpeggio?root=E&quality=m7',
    )
  })
})

const notes = (sounds: readonly Sound[] = []) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))
const chips = (group: string) =>
  within(screen.getByRole('region', { name: group }))
    .getAllByRole('button')
    .map((chip) => chip.textContent)

describe('Practice → Chords, a 7th chord’s tensions', () => {
  it('groups the notes over C7 as the owner’s table does', async () => {
    await renderApp('/practice/chords?size=7')
    await screen.findByRole('region', { name: 'Available tensions' })
    expect(chips('Weak')).toEqual(['1 C', '5 G'])
    expect(chips('Strong')).toEqual(['3 E', '♭7 B♭'])
    expect(chips('Tensions')).toEqual(['♭9 D♭', '9 D', '#9 D#', '#11 F#', '♭13 A♭', '13 A'])
    expect(chips('Avoid')).toEqual(['11 F', '7 B'])
  })

  it('shows them only under a chord that takes them', async () => {
    await renderApp('/practice/chords')
    await screen.findByRole('heading', { level: 2, name: 'C' })
    expect(screen.queryByRole('region', { name: 'Available tensions' })).not.toBeInTheDocument()
  })

  it('plays the chord with a note on top and shows it on the keys', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chords?size=7')
    const ninth = await screen.findByRole('button', { name: '9 D' })
    await user.click(ninth)
    expect(notes(audio.played.at(-1)?.sounds)).toEqual([60, 64, 67, 70, 74])
    expect(ninth).toHaveAttribute('aria-pressed', 'true')
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).toHaveTextContent('9')
  })

  it('drops the note shown over the last chord when the chord changes', async () => {
    const user = userEvent.setup()
    await renderApp('/practice/chords?size=7')
    await user.click(await screen.findByRole('button', { name: '9 D' }))
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Triad' })).getByRole('radio', {
        name: 'Minor',
      }),
    )
    expect(chips('Strong')).toEqual(['♭3 E♭', '♭7 B♭'])
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D5' })).not.toHaveTextContent('9')
    expect(screen.getByRole('button', { name: '9 D' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reads in Russian', async () => {
    await renderApp('/practice/chords?size=7', { locale: 'ru' })
    expect(await screen.findByRole('region', { name: 'Избегаемые' })).toBeInTheDocument()
  })
})
