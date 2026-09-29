import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { melodyOf, pieceById, PIECES } from '@/entities/piece'
import { setPracticeToggle } from '@/features/set-preference'
import { midi, parseNoteName, pitchClassOf } from '@/shared/lib/music'
import { stubFonts } from '@/shared/test/fonts'

describe('Player', () => {
  it('plays «Ромашковые поля»’s recording along in Listen, from bar 1, slowed to the chart’s tempo', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki')
    const play = await screen.findByRole('button', { name: 'Play' })
    expect(audio.loadedRecordings).toHaveLength(1)
    await user.click(play)
    const [first] = audio.recordings
    // Sung at 73 over a chart at 72.
    expect(first?.play.rate).toBe(72 / 73)
    expect(first?.play.offset).toBe(pieceById('romashki')?.recording?.start)
  })

  it('plays the recording at half the chart’s tempo at 50%', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?tempo=36')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings[0]?.play.rate).toBe(36 / 73)
  })

  it('plays no recording in another key, and says why in the Setup', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?key=E')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    // Base UI's switch is a span: disabled is aria-disabled.
    expect(await screen.findByRole('switch', { name: /Recording/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    expect(screen.getByText('Only in D minor')).toBeInTheDocument()
  })

  it('plays no recording in Wait mode', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?mode=wait')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('plays no recording with the switch off, and saves the switch', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('switch', { name: /Recording/ }))
    expect(settingsStore.getState().practice.recording).toBe(false)
    await user.keyboard('{Escape}')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })

  it('opens a song with its title, tempo, hands and sheet music, and records it as practised', async () => {
    const { progressStore } = await renderApp('/play/bz5')
    expect(
      await screen.findByRole('heading', { name: 'Still, my soul, be still' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hands: Both hands' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Bar 1: G' })).toBeInTheDocument()
    expect(progressStore.getState().practised.bz5).toBeDefined()
  })

  it('reads a stale URL as the piece’s own setup', async () => {
    const { router } = await renderApp('/play/bz5?key=H&tempo=999&mode=step&loop=9-3&swing=yes')
    expect(await screen.findByRole('button', { name: 'Tempo: 100%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Loop' })).toHaveAttribute('aria-pressed', 'false')
    expect(router.state.location.search).toEqual({})
  })

  it('plays in Listen and stops', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
  })

  it('steps with Back and Next, sounding each beat group', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Next' }))
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(audio.played).toHaveLength(2)
  })

  it('chooses Wait mode and a speed from the tempo popover', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Tempo: 100%' }))
    await user.click(await screen.findByRole('button', { name: 'Wait mode' }))
    expect(router.state.location.search).toMatchObject({ mode: 'wait' })
    await user.click(screen.getByRole('button', { name: 'Tempo: Wait' }))
    await user.click(await screen.findByRole('button', { name: '50% speed' }))
    expect(router.state.location.search).toEqual({ tempo: 36 })
  })

  it('waits for the notes in Wait mode once playing, says a wrong key, and takes the right ones from MIDI', async () => {
    const user = userEvent.setup()
    // The song's pattern opens with the left hand alone, so the left hand has notes to play at once.
    const { midi: midiKeyboard } = await renderApp('/play/bz5?mode=wait&hands=lh')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const prompt = await screen.findByText(/^Play /)
    const notes = prompt.textContent?.replace(/^Play /, '').split(' ') ?? []
    const keyboard = screen.getByRole('group', { name: 'Keyboard' })
    // C sharp is outside G major's first chord (G B D).
    await user.click(within(keyboard).getByRole('button', { name: 'C sharp 4' }))
    expect(await screen.findByText(/^Not C/)).toBeInTheDocument()
    act(() => {
      for (const name of notes) {
        const spelled = parseNoteName(name)
        if (!spelled) throw new Error(name)
        midiKeyboard.press(midi(60 + pitchClassOf(spelled)))
      }
    })
    expect(await screen.findByText('Right')).toBeInTheDocument()
  })

  it('chooses a hand, muting the other staff', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Hands: Both hands' }))
    await user.click(await screen.findByRole('button', { name: 'Left hand' }))
    expect(router.state.location.search).toMatchObject({ hands: 'lh' })
    expect(document.querySelector('[data-slot="score"]')).toHaveAttribute('data-muted', 'treble')
  })

  it('loops the bar the cursor is in, and removes the loop', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).toMatchObject({ loop: '1-1' })
    expect(await screen.findByRole('slider', { name: 'Loop end' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Loop' }))
    expect(router.state.location.search).not.toHaveProperty('loop')
  })

  it('changes the key and swing in the Setup sheet', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('combobox', { name: 'Key' }))
    await user.click(await screen.findByRole('option', { name: 'A major' }))
    expect(router.state.location.search).toMatchObject({ key: 'A' })
    await user.click(screen.getByRole('switch', { name: 'Swing' }))
    expect(router.state.location.search).toMatchObject({ key: 'A', swing: true })
  })

  it('names the key on the Setup’s pop-up, and shows Melody only for a piece with a tune', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('combobox', { name: 'Key' })).toHaveTextContent('G major')
    expect(screen.queryByRole('switch', { name: 'Melody' })).not.toBeInTheDocument()
  })

  it('shows Melody in the Setup of a piece with a tune', async () => {
    const withTune = PIECES.find((piece) => melodyOf(piece) !== undefined)
    if (!withTune) throw new Error('no piece has a tune')
    const user = userEvent.setup()
    await renderApp(`/play/${withTune.id}`)
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('switch', { name: 'Melody' })).toBeInTheDocument()
  })

  it('puts the fingers under the keys with Finger numbers', async () => {
    const { settingsStore } = await renderApp('/play/bz5')
    await screen.findByRole('group', { name: 'Keyboard' })
    expect(document.querySelector('[data-slot="finger-row"]')).not.toBeInTheDocument()
    act(() => setPracticeToggle(settingsStore, 'fingerNumbers', true))
    expect(document.querySelector('[data-slot="finger-row"]')).toBeInTheDocument()
  })

  it('names the notes on the staff with Named notes, and saves the switch', async () => {
    // SMuFL's note name noteheads, U+E150–U+E1AF.
    const namedHeads = () =>
      [...(document.querySelector('[data-slot="score"] svg')?.textContent ?? '')].filter(
        (glyph) => glyph >= '\uE150' && glyph <= '\uE1AF',
      ).length
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    await waitFor(() => expect(document.querySelector('[data-slot="score"] svg')).not.toBeNull())
    expect(namedHeads()).toBe(0)
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('switch', { name: 'Named notes' }))
    expect(settingsStore.getState().practice.namedNotes).toBe(true)
    await waitFor(() => expect(namedHeads()).toBeGreaterThan(0))
  })

  it('still plays when the music font does not load', async () => {
    stubFonts({ loads: false })
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/bz5')
    expect(await screen.findByText('The music can’t be shown.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.played).toHaveLength(1)
  })
})
