import { render, screen } from '@testing-library/react'
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

  it('opens the connect control', async () => {
    const user = userEvent.setup()
    renderButton(createFakeMidi())
    await user.click(screen.getByRole('button', { name: 'MIDI keyboard' }))
    expect(
      await screen.findByRole('button', { name: 'Connect a MIDI keyboard' }),
    ).toBeInTheDocument()
  })
})
