import { PIECE_TEMPO, readSharedSong, type SharedSong } from '@/entities/piece'
import { quantise, takeGrids, type QuantisedNote, type Take } from '@/entities/take'
import { writeDraft, type Draft, type DraftNote } from '@/features/score-editor'
import { readMidiFile, type MidiPart } from '@/shared/lib/read-midi-file'
import {
  barTicks,
  isCompound,
  meterOf,
  pitchClass,
  pitchClassOf,
  signatureKey,
  spellInKey,
  TICKS_PER_BEAT,
  type Key,
  type Meter,
  type Midi,
  type Pedal,
  type Tick,
} from '@/shared/lib/music'
import { ticksOf } from '@/shared/lib/notation'
import type { LeftKind } from './draft-of-score'
import { MOST_NOTES, SongFileError, titleOf, type ReadSong } from './song-of-music-xml'

/** A track's name that says it is the piano's. */
const PIANO_NAME = /piano|pno|klav|keyboard|right hand|left hand|фортеп|рояль|пианино|правая|левая/i
/** Where a piano part played on one track is split between the hands: middle C and up the right's. */
const SPLIT: Midi = 60 as Midi
const LOWEST = 21
const HIGHEST = 108
/** MIDI's own tempo where a file says none: 120 quarters a minute. */
const MIDI_TEMPO = 120
const BARS_PER_LINE = 4

/** Krumhansl and Kessler's key profiles: how strongly each degree of a major and a minor key is heard. */
const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]

/** Every key a signature writes, one a tonic and mode: D♭ to F♯ major, B♭ to D♯ minor. */
const KEYS: readonly Key[] = [false, true].flatMap((minor) =>
  Array.from({ length: 12 }, (_, at) => signatureKey(at - 5, minor)),
)

const correlation = (a: readonly number[], b: readonly number[]) => {
  const mean = (values: readonly number[]) => values.reduce((s, v) => s + v, 0) / values.length
  const [ma, mb] = [mean(a), mean(b)]
  let top = 0
  let da = 0
  let db = 0
  a.forEach((value, i) => {
    const x = value - ma
    const y = (b[i] ?? 0) - mb
    top += x * y
    da += x * x
    db += y * y
  })
  return da === 0 || db === 0 ? 0 : top / Math.sqrt(da * db)
}

/** The key notes are most likely in (Krumhansl–Schmuckler): their time on each pitch class against each key's profile. */
export function keyOfNotes(
  notes: readonly { readonly key: number; readonly length: number }[],
): Key {
  const weights = Array.from({ length: 12 }, () => 0)
  for (const n of notes) weights[pitchClass(n.key)] = (weights[pitchClass(n.key)] ?? 0) + n.length
  let best = KEYS[0] ?? signatureKey(0, false)
  let score = -Infinity
  for (const key of KEYS) {
    const profile = key.minor ? MINOR : MAJOR
    const tonic = pitchClassOf(key.tonic)
    const rotated = profile.map((_, pc) => profile[pitchClass(pc - tonic)] ?? 0)
    const fit = correlation(weights, rotated)
    if (fit > score) {
      score = fit
      best = key
    }
  }
  return best
}

/** A part's notes as a take, timed at the file's first tempo, so the takes' quantise snaps them. */
function takeOf(parts: readonly MidiPart[], msPerTick: number, tempo: number, meter: Meter): Take {
  const notes = parts
    .flatMap((part) => part.notes)
    .map((n) => ({
      midi: n.key as Midi,
      at: n.on * msPerTick,
      held: (n.off - n.on) * msPerTick,
      velocity: n.velocity,
    }))
    .sort((a, b) => a.at - b.at)
  return {
    id: 'take-1',
    pieceId: 'import',
    made: 0,
    tempo,
    meter,
    fromBar: 1,
    notes,
    pedals: [],
    length: notes.reduce((end, n) => Math.max(end, n.at + n.held), 0),
    bars: [],
  }
}

/** How far a take's onsets fall from a grid's steps, in ticks. */
function gridError(take: Take, step: Tick): number {
  return take.notes.reduce((sum, n) => {
    const tick = (n.at / 1000) * (take.tempo / 60) * TICKS_PER_BEAT
    return sum + Math.abs(tick - Math.round(tick / step) * step)
  }, 0)
}

/** A take snapped to the finest grid it needs: a 16th, or an eighth triplet in x/4 where it fits better. */
function snapped(take: Take): QuantisedNote[] {
  const grids = takeGrids(take.meter)
  const sixteenth = grids.find((grid) => grid.value === 16 && !grid.triplet)
  const triplet = grids.find((grid) => grid.triplet)
  if (!sixteenth) return []
  const plain = gridError(take, ticksOf(sixteenth, take.meter))
  const three = triplet ? gridError(take, ticksOf(triplet, take.meter)) : Infinity
  return quantise(take, three < plain / 2 ? (triplet ?? sixteenth) : sixteenth)
}

/** A single staff's notes as one line: each onset's top note, cut where the next starts. */
function oneLine(notes: readonly QuantisedNote[]): QuantisedNote[] {
  const top = new Map<Tick, QuantisedNote>()
  for (const n of notes) {
    const held = top.get(n.startTick)
    if (!held || n.midi > held.midi) top.set(n.startTick, n)
  }
  const line = [...top.values()].sort((a, b) => a.startTick - b.startTick)
  return line.map((n, i) => {
    const next = line[i + 1]?.startTick ?? Infinity
    return n.startTick + n.durationTicks > next ? { ...n, durationTicks: next - n.startTick } : n
  })
}

/** Which parts are the piano's hands, and which single staves. */
function placeParts(parts: readonly MidiPart[]): {
  rh: MidiPart[]
  lh: MidiPart[]
  split: MidiPart[]
  staves: MidiPart[]
} {
  const mean = (part: MidiPart) =>
    part.notes.reduce((sum, n) => sum + n.key, 0) / Math.max(1, part.notes.length)
  const named = parts.filter((part) => PIANO_NAME.test(part.name ?? ''))
  const piano = named.length > 0 ? named : parts.length <= 2 ? parts : []
  const others = parts.filter((part) => !piano.includes(part))
  if (piano.length === 1) return { rh: [], lh: [], split: [...piano], staves: others }
  const [high, low] = piano.toSorted((a, b) => mean(b) - mean(a))
  return {
    rh: high ? [high] : [],
    lh: low ? [low] : [],
    // A third piano track and on are played on the grand staff, split between the hands.
    split: piano.toSorted((a, b) => mean(b) - mean(a)).slice(2),
    staves: others,
  }
}

/**
 * A Standard MIDI File as a song (ADR 0107): its first meter, tempo and key signature (else the key
 * its notes are most likely in); its notes snapped to the meter's grid by the takes' quantise; the
 * piano's tracks its two hands (two of them by pitch, one split at middle C), each other track a
 * single staff, a lead sheet where none is the piano's; the sustain pedal as pedal marks. Counts
 * what it leaves out: drums, notes off the piano, later tempos and meters.
 */
export function songOfMidi(bytes: Uint8Array, fileName: string): ReadSong {
  const file = readMidiFile(bytes)
  const leftOut: Partial<Record<LeftKind, number>> = {}
  const leave = (kind: LeftKind, count = 1) => {
    if (count > 0) leftOut[kind] = (leftOut[kind] ?? 0) + count
  }
  leave('notes', file.drums)
  const played = file.parts
    .map((part) => {
      const notes = part.notes.filter((n) => n.key >= LOWEST && n.key <= HIGHEST)
      leave('notes', part.notes.length - notes.length)
      return { ...part, notes }
    })
    .filter((part) => part.notes.length > 0)
  if (played.length === 0) throw new SongFileError('not-a-score')
  if (played.reduce((sum, part) => sum + part.notes.length, 0) > MOST_NOTES)
    throw new SongFileError('too-large')

  const [time, ...times] = file.times
  const meter = (time && meterOf(time.count, time.unit)) ?? '4/4'
  if (time && !meterOf(time.count, time.unit)) leave('meters')
  leave(
    'meters',
    times.filter((each) => each.count !== time?.count || each.unit !== time.unit).length,
  )
  const [first, ...tempos] = file.tempos
  const quarters = first?.quarters ?? MIDI_TEMPO
  leave('tempos', tempos.filter((each) => Math.abs(each.quarters - quarters) > 0.5).length)
  // The song's beat is a quarter, or a dotted quarter in compound time.
  const beats = quarters / (isCompound(meter) ? 1.5 : 1)
  const msPerTick = 60_000 / quarters / file.division
  const [signature] = file.keys
  const key =
    signature && Math.abs(signature.fifths) <= 7
      ? signatureKey(signature.fifths, signature.minor)
      : keyOfNotes(
          played.flatMap((part) => part.notes.map((n) => ({ key: n.key, length: n.off - n.on }))),
        )

  const { rh, lh, split, staves } = placeParts(played)
  const notesOf = (parts: readonly MidiPart[]) =>
    parts.length === 0 ? [] : snapped(takeOf(parts, msPerTick, beats, meter))
  const both = notesOf(split)
  const hands = {
    rh: [...notesOf(rh), ...both.filter((n) => n.midi >= SPLIT)],
    lh: [...notesOf(lh), ...both.filter((n) => n.midi < SPLIT)],
  }
  const single = staves.map((part) => {
    const all = notesOf([part])
    const line = oneLine(all)
    leave('voices', all.length - line.length)
    return { part, notes: line }
  })
  const spelled = (n: QuantisedNote): DraftNote => ({
    midi: n.midi,
    spelled: spellInKey(pitchClass(n.midi), key),
    startTick: n.startTick,
    durationTicks: n.durationTicks,
  })
  const handNotes = { rh: hands.rh.map(spelled), lh: hands.lh.map(spelled) }
  withPedals(handNotes, [...rh, ...lh, ...split], msPerTick, beats, meter)

  const end = [...hands.rh, ...hands.lh, ...single.flatMap((each) => each.notes)].reduce(
    (latest, n) => Math.max(latest, n.startTick + n.durationTicks),
    0,
  )
  const bar = barTicks(meter)
  const count = Math.max(1, Math.ceil(end / bar))
  const bars = Array.from({ length: count }, () => ({ ticks: bar, chords: [] }))
  const tempo = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, beats))
  if (tempo !== beats) leave('tempo')
  const draft: Draft = {
    key,
    meter,
    tempo: Math.round(tempo * TICKS_PER_BEAT) / TICKS_PER_BEAT,
    pattern: 'r1',
    sections: [
      {
        heading: { kind: 'verse' },
        lines: Array.from({ length: Math.ceil(count / BARS_PER_LINE) }, (_, i) =>
          bars.slice(i * BARS_PER_LINE, (i + 1) * BARS_PER_LINE),
        ),
      },
    ],
    staves: single.map(({ part, notes }) => ({
      ...(part.name ? { name: part.name.slice(0, 40) } : {}),
      clef:
        notes.length > 0 && notes.reduce((s, n) => s + n.midi, 0) / notes.length < SPLIT
          ? 'bass'
          : 'treble',
      notes: notes.map(spelled),
    })),
    leadSheet: rh.length + lh.length + split.length === 0 && single.length > 0,
    lyricsOn: 'rh',
    hands: handNotes,
  }
  let song: SharedSong | null
  try {
    song = readSharedSong({ ...writeDraft(draft), title: titleOf(file.title, fileName) })
  } catch {
    song = null
  }
  if (!song) throw new SongFileError('broken')
  return { song, leftOut }
}

/** The piano's sustain pedal as marks on the hands' notes: pressed and let up at the notes nearest after. */
function withPedals(
  hands: { rh: DraftNote[]; lh: DraftNote[] },
  parts: readonly MidiPart[],
  msPerTick: number,
  beats: number,
  meter: Meter,
) {
  const step = ticksOf({ value: 16, dots: 0, triplet: false }, meter)
  const toTick = (fileTick: number) =>
    Math.round((((fileTick * msPerTick) / 60_000) * beats * TICKS_PER_BEAT) / step) * step
  const notes = [...hands.lh, ...hands.rh].sort((a, b) => a.startTick - b.startTick)
  const marks = new Map<DraftNote, Pedal>()
  const mark = (tick: Tick, pedal: Pedal) => {
    const n = notes.find((each) => each.startTick >= tick)
    if (!n) return
    const held = marks.get(n)
    marks.set(n, held && held !== pedal ? 'change' : pedal)
  }
  for (const press of parts.flatMap((part) => part.pedals)) {
    mark(toTick(press.down), 'down')
    mark(toTick(press.up), 'up')
  }
  for (const hand of ['rh', 'lh'] as const)
    hands[hand] = hands[hand].map((n) => {
      const pedal = marks.get(n)
      return pedal ? { ...n, marks: { ...n.marks, pedal } } : n
    })
}
