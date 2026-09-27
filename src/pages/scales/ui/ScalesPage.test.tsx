import { act, fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'

const notes = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('Learn → Scales', () => {
  it('spells E♭ harmonic minor with its C♭ and names its structure', async () => {
    await renderApp('/learn/scales?root=Eb&kind=harmonic')
    expect(
      await screen.findByRole('heading', { level: 2, name: 'E♭ harmonic minor' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('table')).toHaveTextContent('C♭')
    expect(screen.getByText('W H W W H W+H H')).toBeInTheDocument()
  })

  it('colours the scale’s keys whole: the tonic in yellow’s wash, the others in sky’s', async () => {
    await renderApp('/learn/scales')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveClass('bg-key-scale')
  })

  it('puts a hand’s fingers under the keys, which keep their degrees', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales')
    const fingers = await screen.findByRole('group', { name: 'Fingers' })
    await user.click(within(fingers).getByRole('button', { name: 'Right hand' }))
    expect(router.state.location.search).toMatchObject({ fingers: 'rh' })
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'F4' })).toHaveTextContent('4')
    expect(document.querySelector('[data-slot="finger-row"]')).toHaveTextContent('12312345')
  })

  it('titles its practice card as playing the scale, not as the Practice place', async () => {
    await renderApp('/learn/scales')
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Play the scale' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Practice' })).not.toBeInTheDocument()
  })

  it('stops the run on Stop', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales')
    await user.click(await screen.findByRole('button', { name: 'Play up and down' }))
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Play up and down' })).toBeInTheDocument()
  })

  it('keeps the chords on the keys while one of them sounds, its keys down', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales?show=chords')
    await user.click(await screen.findByRole('button', { name: /^Dm/ }))
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 0.2))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveAttribute('data-down')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    expect(within(keyboard).getByRole('button', { name: 'E4' })).toHaveClass('bg-key-scale')
  })

  it('presses a chord of the scale while it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales?show=chords')
    const dm = await screen.findByRole('button', { name: /^Dm/ })
    await user.click(dm)
    expect(dm).toHaveAttribute('aria-pressed', 'true')
    act(() => audio.setNow((audio.played.at(-1)?.at ?? 0) + 2))
    expect(dm).toHaveAttribute('aria-pressed', 'false')
  })

  it('links to the relative minor', async () => {
    await renderApp('/learn/scales?root=G&kind=major')
    expect(await screen.findByRole('link', { name: 'E natural minor' })).toBeInTheDocument()
  })

  it('plays up and down, each key going down as it sounds', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales')
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

  it('chooses the root and the scale from pop-up buttons', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/learn/scales')
    await user.click(await screen.findByRole('combobox', { name: 'Root' }))
    await user.click(await screen.findByRole('option', { name: 'E♭' }))
    await user.click(screen.getByRole('combobox', { name: 'Scale' }))
    await user.click(await screen.findByRole('option', { name: 'Harmonic minor' }))
    expect(router.state.location.search).toMatchObject({ root: 'Eb', kind: 'harmonic' })
  })

  it('shows each degree’s numeral over its chord in Chords view', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/scales')
    const show = await screen.findByRole('group', { name: 'Show' })
    await user.click(within(show).getByRole('button', { name: 'Chords' }))
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    expect(within(keyboard).getByRole('button', { name: 'D4' })).toHaveTextContent('iiDm')
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveClass('bg-key-tonic')
    // Two controls say "Chords": the one for what the keys play names itself on screen.
    expect(screen.getByText('Keys play')).toBeVisible()
  })

  it('plays a degree’s chord from its key and holds the chord’s keys down', async () => {
    const { audio } = await renderApp('/learn/scales?show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'D4' }), { pointerId: 1 })
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([62, 65, 69])
    expect(within(keyboard).getByRole('button', { name: 'A4' })).toHaveAttribute('data-down')
  })

  it('plays a chord of the list from its degree’s key', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/learn/scales?root=A&show=chords&chords=4')
    await user.click(await screen.findByRole('button', { name: /^C#m7/ }))
    expect(notes(audio.played.at(-1)?.sounds ?? [])).toEqual([73, 76, 80, 83])
  })

  it('in Notes, outlines and names the chords that hold the note a key plays', async () => {
    const { audio } = await renderApp('/learn/scales?show=chords&keysPlay=notes')
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
    const { midi: keyboard } = await renderApp('/learn/scales?show=chords&keysPlay=notes')
    await screen.findByRole('group', { name: 'Keyboard' })
    act(() => keyboard.press(midi(61)))
    expect(screen.getByText('No chord of the scale holds C#')).toBeInTheDocument()
  })

  it('forgets the note when the chords change', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    expect(screen.getByText(/ is in /)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '7ths' }))
    expect(screen.queryByText(/ is in /)).not.toBeInTheDocument()
  })

  it('keeps a note forgotten when the learner comes back to Notes, or to the same root', async () => {
    const user = userEvent.setup()
    await renderApp('/learn/scales?show=chords&keysPlay=notes')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    fireEvent.pointerDown(within(keyboard).getByRole('button', { name: 'E4' }), { pointerId: 1 })
    const keysPlay = screen.getByRole('group', { name: 'Keys play' })
    await user.click(within(keysPlay).getByRole('button', { name: 'Chords' }))
    await user.click(within(keysPlay).getByRole('button', { name: 'Notes' }))
    expect(screen.queryByText(/ is in /)).not.toBeInTheDocument()
    expect(within(keyboard).getByRole('button', { name: 'E4' })).not.toHaveClass('ring-ring')
  })

  it('has no Chords view for a scale without seven notes', async () => {
    await renderApp('/learn/scales?kind=blues&show=chords')
    const keyboard = await screen.findByRole('group', { name: 'Keyboard' })
    expect(screen.queryByRole('group', { name: 'Show' })).not.toBeInTheDocument()
    expect(within(keyboard).getByRole('button', { name: 'C4' })).toHaveTextContent('1')
  })
})
