import type { SharedSong } from '@/entities/piece'
import { midiFile, type FreeTake } from '@/entities/take'
import { songOfMidi } from './song-of-midi'

/**
 * A recording made a song (R29 B11, the Recorder's Make a song from it): the take as a MIDI file, read
 * as an imported one is (ADR 0107), so its notes are snapped to its meter's grid at its tempo by the
 * takes' quantise and split between the hands at middle C, its sustain pedal its pedal line, titled
 * `title`.
 */
export function songOfTake(take: FreeTake, title: string): SharedSong {
  return songOfMidi(midiFile(take), `${title}.mid`).song
}
