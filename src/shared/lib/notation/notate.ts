import {
  clefsInForce,
  HOME_CLEF,
  type Clef,
  type Hand,
  barMarksOf,
  beatsBefore,
  beatsPerBar,
  beatsToTicks,
  timeSignature,
  writtenOctave,
  writtenShift,
  type NoteLyrics,
  type NoteMarks,
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
import { clefOf, PIANO_STAVES, STAVES } from './types'
import { separateVoices, type BarChord, type BarNote, type VoiceChords } from './voices'

/**
 * A bar as its meter counts it: from its first beat, a full bar's ticks long. A pickup's bar starts
 * before the music, which starts `from` ticks in, so its values fall on the meter's beats.
 */
interface Bar {
  readonly start: Tick
  readonly ticks: Tick
  readonly from: Tick
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

const staffOf = ({ hand }: TimedNote, melodyStaff: boolean): StaffId =>
  hand === 'lh' ? 'bass' : hand === 'melody' && melodyStaff ? 'melody' : 'treble'

/** A note held into the next bar, by its staff and key. */
const heldKey = (staff: StaffId, key: number) => `${staff} ${key}`

/**
 * The notes sounding in a bar, cut at its lines, as each staff's chords (spec §2.4 steps 1–2). A note
 * from the bar before goes on from it only where that bar's writing tied it on (`tiedOn`); one written
 * cut short there starts afresh, its accidental printed. The words go under one staff alone (`sung`,
 * ADR 0093): a note's syllables elsewhere are not written.
 */
function barChords(
  notes: readonly TimedNote[],
  bar: Bar,
  tiedOn: ReadonlySet<string>,
  melodyStaff: boolean,
  sung: StaffId,
): Record<StaffId, BarChord[]> {
  const end = bar.start + bar.ticks
  const groups = new Map<string, { staff: StaffId; chord: BarChord }>()
  for (const n of notes) {
    const noteEnd = n.startTick + n.durationTicks
    if (n.startTick >= end || noteEnd <= bar.start) continue
    const start = Math.max(n.startTick, bar.start) - bar.start
    const stop = Math.min(noteEnd, end) - bar.start
    const staff = staffOf(n, melodyStaff)
    const tiedFrom = n.startTick < bar.start && tiedOn.has(heldKey(staff, n.midi))
    const written: BarNote = {
      midi: n.midi,
      spelled: n.spelled,
      tiedFrom,
      tiedTo: noteEnd > end,
      ...(n.finger ? { finger: n.finger } : {}),
      ...(n.marks ? { marks: n.marks } : {}),
      ...(n.lyrics && staff === sung ? { lyrics: n.lyrics } : {}),
    }
    const id = `${n.hand} ${start} ${stop}`
    const group = groups.get(id)
    if (!group) {
      groups.set(id, {
        staff,
        chord: { hand: n.hand, start, end: stop, notes: [written] },
      })
    } else if (!group.chord.notes.some((other) => other.midi === n.midi)) {
      group.chord = {
        ...group.chord,
        notes: [...group.chord.notes, written].sort((a, b) => a.midi - b.midi),
      }
    }
  }
  const staves = Object.fromEntries(STAVES.map((id) => [id, [] as BarChord[]])) as Record<
    StaffId,
    BarChord[]
  >
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

/**
 * A written piece's marks from its notes': all but a slur's end where a note starts, the slur's end
 * where one ends, its octave line on every piece; none where no note has a mark.
 */
function pieceMarks(notes: readonly BarNote[], first: boolean, last: boolean): NoteMarks | null {
  const marks: { -readonly [K in keyof NoteMarks]: NoteMarks[K] } = {}
  for (const n of notes) {
    if (!n.marks) continue
    const { slurEnd, octave, articulations, ...rest } = n.marks
    if (octave) marks.octave ??= octave
    if (first && !n.tiedFrom) {
      for (const [key, value] of Object.entries(rest)) {
        const field = key as keyof typeof rest
        if (marks[field] === undefined) Object.assign(marks, { [field]: value })
      }
      if (articulations)
        marks.articulations = [...new Set([...(marks.articulations ?? []), ...articulations])]
    }
    if (slurEnd && last && !n.tiedTo) marks.slurEnd = true
  }
  return Object.keys(marks).length > 0 ? marks : null
}

/**
 * What a written piece sings: its chord's one note's syllables, on the piece that starts the notes,
 * in a staff's first voice alone (a second voice under the tune sings nothing, so no syllable prints
 * twice).
 */
const pieceLyrics = (notes: readonly BarNote[], first: boolean): NoteLyrics | null =>
  (first ? notes.find((n) => n.lyrics && !n.tiedFrom)?.lyrics : undefined) ?? null

/** A voice's chords as values end to end: gaps as rests, a chord as tied pieces (spec §2.4 steps 4–5). */
function writeVoice(voice: VoiceChords, bar: Bar, second: boolean): DraftVoice {
  const grid = voiceGrid(voice.chords, bar.meter)
  const events: (DraftEvent | RestEvent)[] = []
  let at = bar.from
  for (const chord of voice.chords) {
    const start = grid.place(chord.start)
    const end = grid.place(chord.end)
    if (start >= end) continue
    if (start > at) events.push(...rests({ start: at, end: start }, bar, grid, second))
    const pieces = spellSpan({ start, end }, { meter: bar.meter, barTicks: bar.ticks, grid })
    pieces.forEach((piece, i) => {
      const last = i === pieces.length - 1
      const marks = pieceMarks(chord.notes, i === 0, last)
      const lyrics = second ? null : pieceLyrics(chord.notes, i === 0)
      events.push({
        kind: 'notes',
        tick: bar.start + piece.tick,
        duration: piece.duration,
        ...(marks ? { marks } : {}),
        ...(lyrics ? { lyrics } : {}),
        notes: chord.notes.map((n) => ({
          midi: n.midi,
          spelled: n.spelled,
          octave: writtenOctave(n.midi, n.spelled) + writtenShift(n.marks) / 12,
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
            events: rests(
              { start: bar.from, end: bar.ticks },
              bar,
              voiceGrid([], bar.meter),
              false,
            ),
            stem: 'auto',
          },
        ]
      : voices.map((voice, index) => writeVoice(voice, bar, index > 0))
  return withAccidentals(drafts, bar.key)
}

/** A staff with nothing to write: hidden rests that hold the bar's time. */
const blankStaff = (bar: Bar): ScoreVoice[] => [
  {
    events: rests({ start: bar.from, end: bar.ticks }, bar, voiceGrid([], bar.meter), true),
    stem: 'auto',
  },
]

/** The notes a bar's last chords tie into the next bar, by staff and key. */
function tiedOut(staves: Record<StaffId, ScoreVoice[]>): Set<string> {
  const held = new Set<string>()
  for (const id of STAVES) {
    for (const voice of staves[id]) {
      const last = voice.events.at(-1)
      if (last?.kind !== 'notes') continue
      for (const written of last.notes) if (written.tie) held.add(heldKey(id, written.midi))
    }
  }
  return held
}

/**
 * Timed notes as a written score: bars, a grand staff (and the tune's own staff over it where the
 * music asks), voices, values, ties and accidentals (spec §2.4). A pickup is written under the
 * meter's signature, a short first bar.
 */
/** The hands' clefs on their staves, the right's on the treble and the left's on the bass, where not their own. */
function staffClefs(clefs: Readonly<Record<Hand, Clef>>): Pick<Measure, 'clefs'> {
  const changed: Partial<Record<StaffId, Clef>> = {}
  if (clefs.rh !== clefOf('treble')) changed.treble = clefs.rh
  if (clefs.lh !== clefOf('bass')) changed.bass = clefs.lh
  return Object.keys(changed).length > 0 ? { clefs: changed } : {}
}

/** The clef a staff is in at bar `index` of timed music: a hand's as its bars change it, else its own. */
export function staffClefAt(music: TimedMusic, index: number, staff: StaffId): Clef {
  const hand = staff === 'treble' ? 'rh' : staff === 'bass' ? 'lh' : null
  return (hand && clefsInForce(music.bars)[index]?.[hand]) || clefOf(staff)
}

export function notate(music: TimedMusic): Score {
  const melodyStaff = music.melodyStaff ?? false
  const written: readonly StaffId[] = STAVES.filter(
    (id) =>
      (id === 'melody' && melodyStaff) ||
      (music.piano !== false && PIANO_STAVES.some((piano) => piano === id)),
  )
  // The words go under the staff whose notes sing them: the top one where two do (the tune's own
  // over the piano's upper, a melody pattern playing the tune), ADR 0093.
  const sung: StaffId =
    written.find((staff) =>
      music.notes.some((n) => n.lyrics !== undefined && staffOf(n, melodyStaff) === staff),
    ) ?? 'treble'
  let tiedOn = new Set<string>()
  const clefs = clefsInForce(music.bars)
  const measures = music.bars.map((placed, index): Measure => {
    const before = beatsBefore(music.bars, index, music.meter)
    const pickup = before > 0
    const from = beatsToTicks(before)
    const ticks = beatsToTicks(placed.beats)
    const bar: Bar = {
      start: placed.startTick - from,
      ticks: from + ticks,
      from,
      meter: music.meter,
      key: placed.key ?? music.key,
    }
    const chords = barChords(music.notes, bar, tiedOn, melodyStaff, sung)
    const staff = (id: StaffId) =>
      !written.includes(id)
        ? []
        : placed.blank?.includes(id)
          ? blankStaff(bar)
          : writeStaff(chords[id], bar)
    const staves = Object.fromEntries(STAVES.map((id) => [id, staff(id)])) as Record<
      StaffId,
      ScoreVoice[]
    >
    tiedOn = tiedOut(staves)
    return {
      startTick: placed.startTick,
      ticks,
      time: timeSignature(pickup ? beatsPerBar(music.meter) : placed.beats, music.meter),
      ...(placed.key ? { key: placed.key } : {}),
      ...(placed.tempo ? { tempo: placed.tempo } : {}),
      ...barMarksOf(placed),
      ...staffClefs(clefs[index] ?? HOME_CLEF),
      staves,
      chords: music.chords
        .filter(
          (chord) =>
            chord.startTick >= placed.startTick && chord.startTick < placed.startTick + ticks,
        )
        .map((chord) => ({ tick: chord.startTick, symbol: chord.symbol })),
    }
  })
  return {
    key: music.key,
    meter: music.meter,
    staves: written,
    measures,
  }
}
