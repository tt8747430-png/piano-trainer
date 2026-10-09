import {
  beatsBefore,
  beatsPerBar,
  beatsToTicks,
  timeSignature,
  writtenOctave,
  type Key,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { printedAccidentals } from './accidentals'
import { spellSpan, voiceGrid, type Span, type VoiceGrid } from './rhythm'
import type {
  Measure,
  NotesEvent,
  RestEvent,
  Score,
  ScoreVoice,
  StaffId,
  TimedMusic,
  TimedNote,
  WrittenNote,
} from './types'
import { separateVoices, type BarChord, type BarNote, type VoiceChords } from './voices'

interface Bar {
  readonly start: Tick
  readonly ticks: Tick
  readonly meter: Meter
  readonly key: Key
}

/** A note written but not yet given its accidental: whether it continues a tie. */
type Draft = Omit<WrittenNote, 'accidental'> & { readonly continued: boolean }
type DraftEvent = Omit<NotesEvent, 'notes'> & { readonly notes: readonly Draft[] }
interface DraftVoice {
  readonly events: readonly (DraftEvent | RestEvent)[]
  readonly stem: ScoreVoice['stem']
}

const staffOf = (hand: TimedNote['hand']): StaffId => (hand === 'lh' ? 'bass' : 'treble')

/** The notes sounding in a bar, cut at its lines, as each staff's chords (spec §2.4 steps 1–2). */
function barChords(notes: readonly TimedNote[], bar: Bar): Record<StaffId, BarChord[]> {
  const end = bar.start + bar.ticks
  const groups = new Map<string, { staff: StaffId; chord: BarChord }>()
  for (const n of notes) {
    const noteEnd = n.startTick + n.durationTicks
    if (n.startTick >= end || noteEnd <= bar.start) continue
    const start = Math.max(n.startTick, bar.start) - bar.start
    const stop = Math.min(noteEnd, end) - bar.start
    const tiedFrom = n.startTick < bar.start
    const written: BarNote = {
      midi: n.midi,
      spelled: n.spelled,
      tiedFrom,
      tiedTo: noteEnd > end,
      ...(n.finger ? { finger: n.finger } : {}),
    }
    const id = `${n.hand} ${start} ${stop}`
    const group = groups.get(id)
    if (!group) {
      groups.set(id, {
        staff: staffOf(n.hand),
        chord: { hand: n.hand, start, end: stop, notes: [written] },
      })
    } else if (!group.chord.notes.some((other) => other.midi === n.midi)) {
      group.chord = {
        ...group.chord,
        notes: [...group.chord.notes, written].sort((a, b) => a.midi - b.midi),
      }
    }
  }
  const staves: Record<StaffId, BarChord[]> = { treble: [], bass: [] }
  for (const { staff, chord } of groups.values()) staves[staff].push(chord)
  return staves
}

function rests(span: Span, bar: Bar, grid: VoiceGrid, hidden: boolean): RestEvent[] {
  return spellSpan(span, { meter: bar.meter, barTicks: bar.ticks, grid }).map((piece) => ({
    kind: 'rest',
    tick: bar.start + piece.tick,
    duration: piece.duration,
    hidden,
  }))
}

/** A voice's chords as values end to end: gaps as rests, a chord as tied pieces (spec §2.4 steps 4–5). */
function writeVoice(voice: VoiceChords, bar: Bar, second: boolean): DraftVoice {
  const grid = voiceGrid(voice.chords, bar.meter)
  const events: (DraftEvent | RestEvent)[] = []
  let at = 0
  for (const chord of voice.chords) {
    const start = grid.place(chord.start)
    const end = grid.place(chord.end)
    if (start >= end) continue
    if (start > at) events.push(...rests({ start: at, end: start }, bar, grid, second))
    const pieces = spellSpan({ start, end }, { meter: bar.meter, barTicks: bar.ticks, grid })
    pieces.forEach((piece, i) => {
      const last = i === pieces.length - 1
      events.push({
        kind: 'notes',
        tick: bar.start + piece.tick,
        duration: piece.duration,
        notes: chord.notes.map((n) => ({
          midi: n.midi,
          spelled: n.spelled,
          octave: writtenOctave(n.midi, n.spelled),
          tie: !last || n.tiedTo,
          continued: i > 0 || n.tiedFrom,
          ...(n.finger && i === 0 && !n.tiedFrom ? { finger: n.finger } : {}),
        })),
      })
    })
    at = end
  }
  if (at < bar.ticks) events.push(...rests({ start: at, end: bar.ticks }, bar, grid, second))
  return { events, stem: voice.stem }
}

/** A staff's voices with each note's accidental, across its voices in time order (spec §2.4 step 6). */
function withAccidentals(voices: readonly DraftVoice[], key: Key): ScoreVoice[] {
  const drafts = voices
    .flatMap((voice, v) =>
      voice.events.flatMap((event, e) =>
        event.kind === 'notes'
          ? event.notes.map((draft, i) => ({ v, e, i, tick: event.tick, draft }))
          : [],
      ),
    )
    .sort((a, b) => a.tick - b.tick)
  const printed = printedAccidentals(
    drafts.map(({ draft }) => draft),
    key,
  )
  const accidentalOf = new Map(
    drafts.map(({ v, e, i }, index) => [`${v} ${e} ${i}`, printed[index] ?? null]),
  )
  return voices.map((voice, v) => ({
    stem: voice.stem,
    events: voice.events.map((event, e) =>
      event.kind === 'rest'
        ? event
        : {
            ...event,
            notes: event.notes.map((draft, i): WrittenNote => ({
              midi: draft.midi,
              spelled: draft.spelled,
              octave: draft.octave,
              accidental: accidentalOf.get(`${v} ${e} ${i}`) ?? null,
              tie: draft.tie,
              ...(draft.finger ? { finger: draft.finger } : {}),
            })),
          },
    ),
  }))
}

function writeStaff(chords: readonly BarChord[], bar: Bar): ScoreVoice[] {
  const voices = separateVoices(chords)
  const drafts: DraftVoice[] =
    voices.length === 0
      ? [
          {
            events: rests({ start: 0, end: bar.ticks }, bar, voiceGrid([], bar.meter), false),
            stem: 'auto',
          },
        ]
      : voices.map((voice, index) => writeVoice(voice, bar, index > 0))
  return withAccidentals(drafts, bar.key)
}

/** A staff with nothing to write: hidden rests that hold the bar's time. */
const blankStaff = (bar: Bar): ScoreVoice[] => [
  {
    events: rests({ start: 0, end: bar.ticks }, bar, voiceGrid([], bar.meter), true),
    stem: 'auto',
  },
]

/**
 * Timed notes as a written score: bars, a grand staff, voices, values, ties and accidentals (spec
 * §2.4). A pickup is written under the meter's signature, a short first bar.
 */
export function notate(music: TimedMusic): Score {
  const measures = music.bars.map((written, index): Measure => {
    const pickup = beatsBefore(music.bars, index, music.meter) > 0
    const bar: Bar = {
      start: written.startTick,
      ticks: beatsToTicks(written.beats),
      meter: music.meter,
      key: music.key,
    }
    const chords = barChords(music.notes, bar)
    const staff = (id: StaffId) =>
      written.blank?.includes(id) ? blankStaff(bar) : writeStaff(chords[id], bar)
    return {
      startTick: bar.start,
      ticks: bar.ticks,
      time: timeSignature(pickup ? beatsPerBar(music.meter) : written.beats, music.meter),
      staves: { treble: staff('treble'), bass: staff('bass') },
      chords: music.chords
        .filter((chord) => chord.startTick >= bar.start && chord.startTick < bar.start + bar.ticks)
        .map((chord) => ({ tick: chord.startTick, symbol: chord.symbol })),
    }
  })
  return { key: music.key, meter: music.meter, measures }
}
