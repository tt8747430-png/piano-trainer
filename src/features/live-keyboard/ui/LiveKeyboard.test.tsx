import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { chordSounds } from '@/shared/lib/schedule'
import { ServicesProvider } from '@/shared/lib/services'
import { LiveKeyboard } from './LiveKeyboard'

const ONE_OCTAVE = { from: midi(60), to: midi(71) }

function setUp(onKeyPress?: (key: number) => void) {
  const audio = createFakeAudio()
  const midiKeyboard = createFakeMidi()
  render(
    <ServicesProvider services={{ audio, midi: midiKeyboard }}>
      <LiveKeyboard range={ONE_OCTAVE} {...(onKeyPress ? { onKeyPress } : {})} />
    </ServicesProvider>,
  )
  return { audio, midiKeyboard }
}

describe('LiveKeyboard', () => {
  it('sounds a tapped key on top of what plays, then does what the screen asks', async () => {
    const user = userEvent.setup()
    const onKeyPress = vi.fn()
    const { audio } = setUp(onKeyPress)
    await user.click(screen.getByRole('button', { name: 'F sharp 4' }))
    expect(audio.played.flatMap((play) => play.sounds)).toMatchObject([{ kind: 'note', midi: 66 }])
    expect(audio.stops).toBe(0)
    expect(onKeyPress).toHaveBeenCalledWith(66)
  })

  it('puts down the keys the app sounds, as they sound', () => {
    const { audio } = setUp()
    act(() => audio.play(chordSounds([midi(60), midi(64)], { arpeggio: true }), 0))
    act(() => audio.setNow(0.1))
    expect(screen.getByRole('button', { name: 'C4' })).toHaveAttribute('data-down')
    expect(screen.getByRole('button', { name: 'E4' })).not.toHaveAttribute('data-down')
    act(() => audio.setNow(0.3))
    expect(screen.getByRole('button', { name: 'E4' })).toHaveAttribute('data-down')
  })

  it('puts down the keys held on a MIDI keyboard', () => {
    const { midiKeyboard } = setUp()
    act(() => midiKeyboard.press(midi(67)))
    expect(screen.getByRole('button', { name: 'G4' })).toHaveAttribute('data-down')
    act(() => midiKeyboard.release(midi(67)))
    expect(screen.getByRole('button', { name: 'G4' })).not.toHaveAttribute('data-down')
  })
})
