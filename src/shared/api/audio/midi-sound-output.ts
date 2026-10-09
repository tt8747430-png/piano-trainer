import type { Midi } from '@/shared/lib/music'
import { gainVelocity, type NoteSound } from '@/shared/lib/schedule'
import type { NoteOutput } from './types'

/** A note's off after its on, where both fall in the same millisecond. */
const AFTER_MS = 1

/** The app's notes sent to a keyboard's speaker: what a Stop must let go of. */
export interface MidiSoundOutput {
  /** Sends a note to sound from `at` on the audio clock. */
  render(note: NoteSound, at: number): void
  /** Drops what is queued and lets go of every key sent: none rings on, none starts after. */
  stop(): void
}

/**
 * Notes through the piano (spec 2026-10-09 §3.3): each note's on and off sent at once, timed on the
 * page's clock (`pageTimeOf` a moment of the audio clock), at the velocity its gain was struck at.
 * A Stop clears the queue where the output can, lets go now of each key still to end, and again just
 * after a note still to start, for an output that cannot clear.
 */
export function createMidiSoundOutput(
  output: NoteOutput,
  { pageTimeOf, pageNow }: { pageTimeOf: (audioTime: number) => number; pageNow: () => number },
): MidiSoundOutput {
  /** Each key sent: when its last note starts and ends (page clock). */
  const sent = new Map<Midi, { on: number; off: number }>()
  return {
    render(note, at) {
      const on = pageTimeOf(at)
      const off = Math.max(pageTimeOf(at + note.duration), on + AFTER_MS)
      output.noteOn(note.midi, gainVelocity(note.velocity), on)
      output.noteOff(note.midi, off)
      const before = sent.get(note.midi)
      sent.set(note.midi, {
        on: Math.max(before?.on ?? on, on),
        off: Math.max(before?.off ?? off, off),
      })
    },
    stop() {
      const now = pageNow()
      output.clear()
      for (const [key, { on, off }] of sent) {
        if (off <= now) continue
        output.noteOff(key, now)
        if (on >= now) output.noteOff(key, on + AFTER_MS)
      }
      sent.clear()
    },
  }
}
