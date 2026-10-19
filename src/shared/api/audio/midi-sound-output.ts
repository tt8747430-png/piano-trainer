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

/** A note's off is sent this soon before it is due: until then a later note on its key may end it sooner. */
const OFF_AHEAD_MS = 100
/** How often the offs still held are looked at. */
const OFF_EVERY_MS = 25

/**
 * Notes through the piano (spec 2026-10-09 §3.3): each note's on sent at once, timed on the page's
 * clock (`pageTimeOf` a moment of the audio clock), at the velocity its gain was struck at; its off
 * held until shortly before it is due. A key has one voice on a keyboard, so a note struck again
 * before the last one on its key ends ends that one just before it, and the last one's off goes:
 * it would cut the new note short. A Stop clears the queue where the output can, lets go now of each
 * key still to end, and again just after a note still to start, for an output that cannot clear.
 */
export function createMidiSoundOutput(
  output: NoteOutput,
  { pageTimeOf, pageNow }: { pageTimeOf: (audioTime: number) => number; pageNow: () => number },
): MidiSoundOutput {
  /** Each key sent: when its last note starts and ends (page clock). */
  const sent = new Map<Midi, { on: number; off: number }>()
  /** Each key's off not sent yet (page clock). */
  const held = new Map<Midi, number>()
  let timer: ReturnType<typeof setInterval> | null = null
  const sendDue = () => {
    const now = pageNow()
    const until = now + OFF_AHEAD_MS
    for (const [key, off] of held) {
      if (off > until) continue
      output.noteOff(key, off)
      held.delete(key)
    }
    // A key whose last note has ended is nothing a Stop must let go of. One whose off is only queued
    // stays: a Stop's clear drops that off, and it must be sent again.
    for (const [key, { off }] of sent) if (off <= now) sent.delete(key)
    if (held.size === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }
  return {
    render(note, at) {
      const on = pageTimeOf(at)
      const off = Math.max(pageTimeOf(at + note.duration), on + AFTER_MS)
      const last = held.get(note.midi)
      // The note before on this key: ended just before this one where it would ring into it.
      if (last !== undefined) output.noteOff(note.midi, Math.min(last, Math.max(on - AFTER_MS, 0)))
      output.noteOn(note.midi, gainVelocity(note.velocity), on)
      held.set(note.midi, off)
      const before = sent.get(note.midi)
      sent.set(note.midi, {
        on: Math.max(before?.on ?? on, on),
        off: Math.max(before?.off ?? off, off),
      })
      sendDue()
      if (held.size > 0) timer ??= setInterval(sendDue, OFF_EVERY_MS)
    },
    stop() {
      const now = pageNow()
      output.clear()
      held.clear()
      if (timer !== null) clearInterval(timer)
      timer = null
      for (const [key, { on, off }] of sent) {
        if (off <= now) continue
        output.noteOff(key, now)
        if (on >= now) output.noteOff(key, on + AFTER_MS)
      }
      sent.clear()
    },
  }
}
