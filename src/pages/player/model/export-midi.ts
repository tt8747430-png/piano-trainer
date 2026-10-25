import { downloadFile, midiFileName } from '@/shared/lib'
import type { Performance } from '@/shared/lib/arrangement'
import { performanceMidi } from '@/shared/lib/schedule'

/** The music as the Player plays it now, as its More exports it (ADR 0099). */
export interface PlayedMusic {
  readonly performance: Performance
  /** The Player's title: the file's name, and its first track's. */
  readonly title: string
  /** The tempo chosen, in beats a minute. */
  readonly tempo: number
  /** Each single staff's name as the screen names it, top down; none where a staff has none. */
  readonly staves?: readonly (string | undefined)[]
}

/** Saves the music as a Standard MIDI File named for its title, as the browser saves a download. */
export function exportMidi({ performance, title, tempo, staves }: PlayedMusic): void {
  downloadFile(
    performanceMidi(performance, { title, tempo, staves }),
    midiFileName(title),
    'audio/midi',
  )
}
