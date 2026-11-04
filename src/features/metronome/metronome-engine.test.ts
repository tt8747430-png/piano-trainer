import { describe, expect, it } from 'vitest'
import { DEFAULT_METRONOME, type MetronomeSettings } from '@/entities/settings'
import { beatSounds } from '@/shared/lib/schedule'
import { clickVoice, quickTime } from './metronome-engine'

const SET: MetronomeSettings = {
  ...DEFAULT_METRONOME,
  bpm: 96,
  meter: '3/4',
  sound: 'beep',
  levels: ['downbeat', 'silent', 'accent'],
  subdivision: '8ths',
}

describe('one Metronome engine (R29 B11)', () => {
  it('count-in, click and quick metronome read one settings object', () => {
    // The Player's count-in and click: the Metronome's sound and squares, counted in the song's time.
    const player = clickVoice(SET, '3/4')
    // The quick metronome off a song: the Metronome's own time and tempo.
    const quick = quickTime(SET, null)
    expect(player).toEqual({
      sound: 'beep',
      meter: '3/4',
      levels: ['downbeat', 'silent', 'accent'],
      subdivision: '8ths',
    })
    expect(quick.voice).toEqual(player)
    expect(quick.bpm).toBe(96)
    // The same beat sounds the same from either.
    expect(beatSounds(quick.voice, 1, 0.5)).toEqual(beatSounds(player, 1, 0.5))
  })

  it('follows a song’s tempo and time, the squares kept only where the beats match', () => {
    expect(quickTime(SET, { bpm: 72, meter: '3/4' })).toMatchObject({
      bpm: 72,
      voice: { meter: '3/4', levels: SET.levels, sound: 'beep' },
    })
    expect(quickTime(SET, { bpm: 72, meter: '4/4' })).toMatchObject({
      bpm: 72,
      voice: { meter: '4/4', levels: null },
    })
  })
})
