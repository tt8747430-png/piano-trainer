import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { noteEvents, standardMidiFile, type MidiTrack } from '@/shared/lib/standard-midi-file'
import { keyOfNotes, songOfMidi } from './song-of-midi'
import { SongFileError } from './song-of-music-xml'

const Q = 480
const track = (name: string, notes: [number, number, number][], channel = 0): MidiTrack => ({
  events: [
    { tick: 0, kind: 'name', text: name },
    ...noteEvents(
      notes.map(([key, on, off]) => ({ key, on, off, velocity: 80 })),
      channel,
    ),
  ],
  end: Math.max(...notes.map(([, , off]) => off)),
})
const conductor: MidiTrack = {
  events: [
    { tick: 0, kind: 'name', text: 'Waltz' },
    { tick: 0, kind: 'time', count: 3, unit: 4, click: 1 },
    { tick: 0, kind: 'tempo', quarters: 90 },
  ],
  end: 0,
}

describe('songOfMidi', () => {
  it('reads the hands’ tracks and a voice’s, snapped to the meter, in the key their notes are in', () => {
    // Played a little off the beat, as a performance is.
    const bytes = standardMidiFile([
      conductor,
      track('Voice', [
        [76, 10, 470],
        [74, 480, 950],
        [72, 965, 1440],
      ]),
      track(
        'Right hand',
        [
          [67, 0, 1430],
          [72, 0, 1430],
        ],
        1,
      ),
      track('Left hand', [[48, 5, 1440]], 2),
    ])
    const { song, leftOut } = songOfMidi(bytes, 'waltz.mid')
    expect(song.title).toBe('Waltz')
    expect(song.music).toMatchObject({
      key: 'C',
      meter: '3/4',
      tempo: 90,
      sections: [{ kind: 'verse', lines: ['_'] }],
      staves: [{ name: 'Voice', notes: 'E5/1 D5/1 C5/1' }],
      hands: { rh: 'G4+C5/3', lh: 'C3/3' },
    })
    expect(song.music).not.toHaveProperty('leadSheet')
    expect(leftOut).toEqual({})
  })

  it('splits one piano track between the hands at middle C', () => {
    const bytes = standardMidiFile([
      track('Piano', [
        [60, 0, Q * 4],
        [64, 0, Q * 4],
        [43, 0, Q * 4],
      ]),
    ])
    expect(songOfMidi(bytes, 'one.mid').song.music.hands).toEqual({ rh: 'C4+E4/4', lh: 'G2/4' })
  })

  it('finds a key from the notes where the file names none', () => {
    const minor = [57, 60, 64, 57, 62, 65, 56, 59, 64, 57].map((key) => ({ key, length: 1 }))
    expect(keyOfNotes(minor)).toEqual({ tonic: note('A'), minor: true })
    const major = [65, 69, 72, 70, 67, 64, 65, 72, 65].map((key) => ({ key, length: 1 }))
    expect(keyOfNotes(major)).toEqual({ tonic: note('F'), minor: false })
  })

  it('refuses a file with no notes to play', () => {
    expect(() => songOfMidi(standardMidiFile([conductor]), 'x.mid')).toThrow(SongFileError)
  })
})
