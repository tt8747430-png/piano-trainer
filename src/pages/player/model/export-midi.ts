import { downloadFile, midiFileName } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { performanceMidi, type PartNames } from '@/shared/lib/schedule'

/** The music as the Player plays it now, as its More exports it (ADR 0099). */
export interface PlayedMusic {
  readonly performance: Performance
  /** The Player's title: the file's name, and its first track's. */
  readonly title: string
  /** The tempo chosen, in beats a minute. */
  readonly tempo: number
  /** Each part's name as the screen names it, in the learner's language: its track's. */
  readonly names: PartNames
}

/** Saves the music as a Standard MIDI File named for its title, as the browser saves a download. */
export function exportMidi({ performance, title, tempo, names }: PlayedMusic): void {
  downloadFile(
    performanceMidi(performance, { title, tempo, names }),
    midiFileName(title),
    'audio/midi',
  )
}
