import { render, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { MidiReconnect } from './MidiReconnect'

const renderWith = (allowed: boolean) => {
  const midi = createFakeMidi(undefined, { allowed })
  render(
    <ServicesProvider services={{ audio: createFakeAudio(), midi }}>
      <MidiReconnect />
    </ServicesProvider>,
  )
  return midi
}

describe('MidiReconnect', () => {
  it('connects to a keyboard the learner allowed before, as the app opens', async () => {
    const midi = renderWith(true)
    await waitFor(() =>
      expect(midi.current()).toEqual({ state: 'connected', devices: ['Keyboard'] }),
    )
  })

  it('asks nothing where the learner has not allowed one yet', async () => {
    const midi = renderWith(false)
    await Promise.resolve()
    expect(midi.current()).toBeNull()
  })

  it('renders nothing without Web MIDI', () => {
    const { container } = render(
      <ServicesProvider services={{ audio: createFakeAudio(), midi: null }}>
        <MidiReconnect />
      </ServicesProvider>,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
