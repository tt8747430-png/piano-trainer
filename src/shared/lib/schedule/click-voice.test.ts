import { describe, expect, it } from 'vitest'
import { clickLevel, voicedClick } from './click-voice'

describe('the Player’s click in the Metronome’s voice (A35, A39)', () => {
  it('sounds a beat at its level: a click, a beep, or the groove’s drums', () => {
    expect(voicedClick(1, 'downbeat', 'click')).toEqual([
      { kind: 'click', at: 1, accent: true, gain: 1 },
    ])
    expect(voicedClick(1, 'normal', 'beep')).toEqual([
      { kind: 'click', at: 1, accent: false, gain: 0.6, voice: 'beep' },
    ])
    expect(voicedClick(2, 'downbeat', 'drum').map((click) => click.voice)).toEqual(['kick', 'hat'])
    expect(voicedClick(2, 'normal', 'drum').map((click) => click.voice)).toEqual(['snare', 'hat'])
  })

  it('takes the Metronome’s squares where its meter is the music’s, else the music’s own accents', () => {
    const squares = { meter: '4/4', levels: ['downbeat', 'silent', 'accent', 'normal'] as const }
    expect(clickLevel(1, false, '4/4', squares)).toBe('silent')
    expect(clickLevel(2, false, '4/4', squares)).toBe('accent')
    expect(clickLevel(0, true, '3/4', squares)).toBe('downbeat')
    expect(clickLevel(1, false, '3/4', squares)).toBe('normal')
    expect(clickLevel(1, true, '6/8', null)).toBe('accent')
  })
})
