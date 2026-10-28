import { downloadFile, midiFileName } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { performanceMidi, type PartNames } from '@/shared/lib/schedule'

/** The music as the Player plays it now, as its More exports it (ADR 0108). */
export interface PlayedMusic {
  readonly performance: Performance
  /** The Player's title: the file's name, and its first track's. */
  readonly title: string
  /** The tempo it is written at, in beats a minute: the tempo chosen, or the recording's. */
  readonly tempo: number
  /** Each part's name as the screen names it, in the learner's language: its track's. */
  readonly names: PartNames
  /** Seconds before bar 1: where a recording's bar 1 begins, time aligned to it (ADR 0107). */
  readonly lead?: number
}

/**
 * Saves the music as a Standard MIDI File named for its title and tempo (ADR 0107), as the browser
 * saves a download.
 */
export function exportMidi({ performance, title, tempo, names, lead }: PlayedMusic): void {
  downloadFile(
    performanceMidi(performance, { title, tempo, names, ...(lead === undefined ? {} : { lead }) }),
    midiFileName(title, tempo),
    'audio/midi',
  )
}
