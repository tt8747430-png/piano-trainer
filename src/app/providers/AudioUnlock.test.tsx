import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, onTestFinished } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { ServicesProvider } from '@/shared/lib/services'
import { AudioUnlock } from './AudioUnlock'
import { createFakeArranger } from '@/shared/api/midi'

function renderUnlock() {
  const audio = createFakeAudio()
  render(
    <ServicesProvider services={{ audio, arranger: createFakeArranger(), midi: null }}>
      <AudioUnlock />
    </ServicesProvider>,
  )
  return audio
}

describe('AudioUnlock', () => {
  it('readies audio on every tap and key press', () => {
    const audio = renderUnlock()
    expect(audio.primes).toBe(0)
    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document.body, { key: 'a' })
    expect(audio.primes).toBe(2)
  })

  it('waits for a gesture the browser counts, where it says which', () => {
    const activation = { isActive: false }
    Object.defineProperty(navigator, 'userActivation', { value: activation, configurable: true })
    onTestFinished(() => {
      Reflect.deleteProperty(navigator, 'userActivation')
    })
    const audio = renderUnlock()
    fireEvent.pointerDown(document.body)
    expect(audio.primes).toBe(0)
    activation.isActive = true
    fireEvent.pointerUp(document.body)
    expect(audio.primes).toBe(1)
  })

  it('readies audio when a finger lifts, which is when a touch counts as a gesture', () => {
    const audio = renderUnlock()
    fireEvent.pointerUp(document.body)
    expect(audio.primes).toBe(1)
  })
})
