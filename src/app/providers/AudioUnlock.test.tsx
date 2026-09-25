import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
  it('unlocks audio on the first tap, and only then', () => {
    const audio = renderUnlock()
    expect(audio.unlocks).toBe(0)
    fireEvent.pointerDown(document.body)
    fireEvent.pointerDown(document.body)
    fireEvent.keyDown(document.body, { key: 'a' })
    expect(audio.unlocks).toBe(1)
  })

  it('unlocks audio on the first key press', () => {
    const audio = renderUnlock()
    fireEvent.keyDown(document.body, { key: 'Enter' })
    expect(audio.unlocks).toBe(1)
  })
})
