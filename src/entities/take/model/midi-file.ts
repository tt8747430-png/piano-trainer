import {
  MIDI_DIVISION,
  midiFileName,
  noteEvents,
  standardMidiFile,
  type TimedMidiEvent,
} from '@/shared/lib'
import {
  beatsPerBar,
  isCompound,
  meterBeats,
  TICKS_PER_BEAT,
  timeSignature,
} from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import type { Take } from './types'

/** Each pedal's controller. */
const PEDAL_CONTROLLER: Readonly<Record<PedalKind, number>> = {
  sustain: 64,
  sostenuto: 66,
  soft: 67,
}

/** The beats each whole bar of a take holds, from its barlines: a pickup's, a short bar's, the meter's. */
function barBeats(take: Take): { readonly ms: number; readonly beats: number }[] {
  const beatMs = 60_000 / take.tempo
  // To the nearest eighth of the meter (a third of a compound beat, half a simple one): the barlines
  // are where the click fell, in milliseconds.
  const eighths = isCompound(take.meter) ? 3 : 2
  // A bar shorter than an eighth (a barline just before the take's end) is the bar before's.
  return take.bars
    .slice(0, -1)
    .map((ms, i) => ({
      ms,
      beats: Math.round((((take.bars[i + 1] ?? ms) - ms) / beatMs) * eighths) / eighths,
    }))
    .filter((bar) => bar.beats > 0)
}

/**
 * A take as a Standard MIDI File (format 0): its tempo (a compound meter's beat a dotted quarter) and
 * time signature, again at each barline where a bar's length changes (a pickup, a short bar), so a
 * DAW's bars are the piece's; each key on and off with its velocity as played, and the pedals as
 * their controllers: the sustain 64, the sostenuto 66, the soft 67.
 */
export function midiFile(take: Take): Uint8Array<ArrayBuffer> {
  // A compound meter's beat, its click, is a dotted quarter.
  const click = isCompound(take.meter) ? 1.5 : 1
  const quartersPerMinute = take.tempo * click
  const tickAt = (ms: number) => Math.round((ms / 60_000) * quartersPerMinute * MIDI_DIVISION)
  const signatureAt = (tick: number, beats: number): TimedMidiEvent => ({
    tick,
    kind: 'time',
    ...timeSignature(beats, take.meter),
    // Clicked on the meter's counted beat (ADR 0114): a half in 2/2.
    click: ((meterBeats(take.meter)[0] ?? TICKS_PER_BEAT) / TICKS_PER_BEAT) * click,
  })
  const signatures: TimedMidiEvent[] = []
  let beatsNow = beatsPerBar(take.meter)
  signatures.push(signatureAt(0, barBeats(take)[0]?.beats ?? beatsNow))
  for (const [i, bar] of barBeats(take).entries()) {
    if (i === 0) beatsNow = bar.beats
    else if (bar.beats !== beatsNow) {
      beatsNow = bar.beats
      signatures.push(signatureAt(tickAt(bar.ms), bar.beats))
    }
  }
  const events: TimedMidiEvent[] = [
    ...signatures,
    { tick: 0, kind: 'tempo', quarters: quartersPerMinute },
    ...noteEvents(
      take.notes.map((note) => ({
        key: note.midi,
        on: tickAt(note.at),
        off: tickAt(note.at + note.held),
        velocity: note.velocity,
      })),
      0,
    ),
    ...take.pedals.flatMap((press): TimedMidiEvent[] => {
      const controller = PEDAL_CONTROLLER[press.pedal]
      // As a key: a pedal let go within its own tick comes up on the next, never before it went down.
      const down = tickAt(press.down)
      const up = Math.max(tickAt(press.up), down + 1)
      return [
        { tick: down, kind: 'control', channel: 0, controller, value: 127 },
        { tick: up, kind: 'control', channel: 0, controller, value: 0 },
      ]
    }),
  ]
  return standardMidiFile([{ events, end: tickAt(take.length) }])
}

const twoDigits = (n: number) => String(n).padStart(2, '0')

/** A take's file: the piece's title and when it was made (`2026-10-05 14.07`), as `.mid`. */
export function takeFileName(title: string, made: number): string {
  const at = new Date(made)
  const day = `${at.getFullYear()}-${twoDigits(at.getMonth() + 1)}-${twoDigits(at.getDate())}`
  const time = `${twoDigits(at.getHours())}.${twoDigits(at.getMinutes())}`
  return midiFileName(`${title} ${day} ${time}`)
}
