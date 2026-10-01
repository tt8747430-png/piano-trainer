import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { MidiButton } from './MidiButton'

const renderButton = (midi: FakeMidi | null) =>
  render(
    <ServicesProvider services={{ audio: createFakeAudio(), midi }}>
      <MidiButton />
    </ServicesProvider>,
  )

describe('MidiButton', () => {
  it('is hidden where the browser cannot connect a keyboard', () => {
    renderButton(null)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('says in its name when a keyboard is connected, not by the dot’s colour alone', async () => {
    const midi = createFakeMidi()
    renderButton(midi)
    expect(screen.getByRole('button', { name: 'MIDI keyboard' })).toBeInTheDocument()
    await act(() => midi.connect())
    expect(screen.getByRole('button', { name: 'MIDI keyboard, connected' })).toBeInTheDocument()
  })

  it('opens the connect control', async () => {
    const user = userEvent.setup()
    renderButton(createFakeMidi())
    await user.click(screen.getByRole('button', { name: 'MIDI keyboard' }))
    expect(await screen.findByRole('dialog', { name: 'MIDI keyboard' })).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Connect a MIDI keyboard' }),
    ).toBeInTheDocument()
  })
})
