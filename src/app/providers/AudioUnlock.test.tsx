import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, onTestFinished } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { ServicesProvider } from '@/shared/lib/services'
import { AudioUnlock } from './AudioUnlock'

function renderUnlock() {
  const audio = createFakeAudio()
  render(
    <ServicesProvider services={{ audio, midi: null }}>
      <AudioUnlock />
    </ServicesProvider>,
  )
  return audio
}

describe('AudioUnlock', () => {
  it('unlocks audio on every tap and key press, so audio the browser suspends again comes back', () => {
    const audio = renderUnlock()
    expect(audio.unlocks).toBe(0)
    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document.body, { key: 'a' })
    expect(audio.unlocks).toBe(2)
  })

  it('waits for a gesture the browser counts, where it says which', () => {
    const activation = { isActive: false }
    Object.defineProperty(navigator, 'userActivation', { value: activation, configurable: true })
    onTestFinished(() => {
      Reflect.deleteProperty(navigator, 'userActivation')
    })
    const audio = renderUnlock()
    fireEvent.pointerDown(document.body)
    expect(audio.unlocks).toBe(0)
    activation.isActive = true
    fireEvent.pointerUp(document.body)
    expect(audio.unlocks).toBe(1)
  })

  it('unlocks audio when a finger lifts, which is when a touch counts as a gesture', () => {
    const audio = renderUnlock()
    fireEvent.pointerUp(document.body)
    expect(audio.unlocks).toBe(1)
  })
})
