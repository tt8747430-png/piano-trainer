import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings as render } from '@/app/testing/render-with-settings'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { MidiControl } from './MidiControl'

describe('MidiControl', () => {
  it('says in one line when the browser cannot connect a keyboard', () => {
    render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <MidiControl />
      </ServicesProvider>,
    )
    expect(screen.getByText('This browser can’t connect a MIDI keyboard.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('connects and names the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
        <MidiControl />
      </ServicesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(await screen.findByText('Connected: Keyboard')).toBeInTheDocument()
  })

  it('offers to try again when access was blocked', async () => {
    const user = userEvent.setup()
    render(
      <ServicesProvider
        services={{ audio: createFakeAudio(), midi: createFakeMidi({ state: 'denied' }) }}
      >
        <MidiControl />
      </ServicesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(await screen.findByText('MIDI access was blocked.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('names a keyboard chosen that is away', async () => {
    const user = userEvent.setup()
    const away = { state: 'away', device: 'Piano', devices: ['Pads'] } as const
    render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi(away) }}>
        <MidiControl />
      </ServicesProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Connect a MIDI keyboard' }))
    expect(await screen.findByText('Piano is not connected.')).toBeInTheDocument()
  })
})
