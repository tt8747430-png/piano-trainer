import { describe, expect, it, vi } from 'vitest'
import { createServices } from './composition-root'

describe('createServices', () => {
  it('builds audio without creating an AudioContext, and no MIDI where the browser has none', () => {
    const AudioContext = vi.fn()
    vi.stubGlobal('AudioContext', AudioContext)
    const services = createServices()
    expect(services.audio.now()).toBe(0)
    expect(services.midi).toBeNull()
    expect(AudioContext).not.toHaveBeenCalled()
  })

  it('builds a MIDI input where the browser has Web MIDI', () => {
    vi.stubGlobal('navigator', { ...navigator, requestMIDIAccess: vi.fn() })
    expect(createServices().midi).not.toBeNull()
  })
})
