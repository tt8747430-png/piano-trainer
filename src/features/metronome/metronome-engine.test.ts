import { describe, expect, it } from 'vitest'
import { DEFAULT_METRONOME, type MetronomeSettings } from '@/entities/settings'
import { clickVoice } from './metronome-engine'

const SET: MetronomeSettings = {
  ...DEFAULT_METRONOME,
  bpm: 96,
  meter: '3/4',
  sound: 'beep',
  levels: ['downbeat', 'silent', 'accent'],
  subdivision: '8ths',
}

describe('one Metronome engine (R29 B11)', () => {
  it('the click and count-in read the Metronome’s sound and squares, counted in the music’s time', () => {
    expect(clickVoice(SET, '3/4')).toEqual({
      sound: 'beep',
      meter: '3/4',
      levels: ['downbeat', 'silent', 'accent'],
      subdivision: '8ths',
    })
    // The squares kept only where the beats match.
    expect(clickVoice(SET, '4/4')).toMatchObject({ meter: '4/4', levels: null, sound: 'beep' })
  })
})
