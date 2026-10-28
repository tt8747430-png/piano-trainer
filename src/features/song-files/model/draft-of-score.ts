import type { PatternId } from '@/entities/pattern'
import { keyText, PIECE_TEMPO, type LyricsStaff } from '@/entities/piece'
import type {
  Draft,
  DraftBar,
  DraftHeading,
  DraftNote,
  DraftSection,
  DraftStaff,
} from '@/features/score-editor'
import { LEFT_OUT, type ReadBar, type ReadNote, type ReadScore } from '@/shared/lib/musicxml'
import {
  barMarksOf,
  keySignature,
  TICKS_PER_BEAT,
  type Chord,
  type Clef,
  type Key,
  type Meter,
  type Tick,
} from '@/shared/lib/music'
import { readSongFileData } from './app-data'

/** What a file holds that a song cannot, each kind counted: the reader's, and the song's own. */
export const LEFT_KINDS = [
  ...LEFT_OUT,
  /** A single staff's second voice, or its chords: a single staff is one line (ADR 0097). */
  'voices',
  /** A single staff's change of clef. */
  'clefs',
  /** Words on a staff other than the one they are kept on. */
  'lyrics',
  /** A piano part's third staff and more. */
  'staves',
  /** A tempo past what a song is written at (40–160). */
  'tempo',
] as const
export type LeftKind = (typeof LEFT_KINDS)[number]
export type LeftCounts = Readonly<Partial<Record<LeftKind, number>>>

/** The pattern an imported song plays where its file names none: a new song's (ADR 0114). */
const NEW_SONG_PATTERN: PatternId = 'r1'
/** A new song's tempo, where its file gives none. */
const NEW_SONG_TEMPO = 90
const BARS_PER_LINE = 4

/** A rehearsal mark's words as a section's heading, where they name one of a song's parts. */
const HEADING_WORDS: readonly [RegExp, DraftHeading['kind']][] = [
  [/^(intro|introduction|вступление)\b/i, 'intro'],
  [/^(verse|куплет)\b/i, 'verse'],
  [/^(chorus|refrain|припев)\b/i, 'chorus'],
  [/^(bridge|бридж)\b/i, 'bridge'],
  [/^(ending|outro|coda|окончание|кода)\b/i, 'ending'],
]
const LABEL_MAX = 12

const sameKey = (a: Key, b: Key) => keySignature(a) === keySignature(b) && a.minor === b.minor

/** Where the sections start and the lines in them, by bar index. */
interface Form {
  readonly sections: readonly { readonly start: number; readonly lines: readonly number[] }[]
  readonly headings: readonly DraftHeading[]
}

/** The file's form, from the app's data where it is the app's file and fits its bars. */
function formOf(score: ReadScore): {
  form: Form
  pattern: PatternId
  methods: Map<string, string>
  /** The app's own form: its headings say their keys and meters. */
  own: boolean
} {
  const data = readSongFileData(score.appData)
  const total = data?.sections.reduce((sum, s) => sum + s.lines.reduce((a, b) => a + b, 0), 0)
  if (data && total === score.bars.length) {
    let start = 0
    const sections = data.sections.map((section) => {
      const at = start
      start += section.lines.reduce((a, b) => a + b, 0)
      return { start: at, lines: section.lines }
    })
    return {
      form: { sections, headings: data.sections.map((section) => section.heading) },
      pattern: data.pattern,
      methods: new Map(data.methods.map(([bar, chord, method]) => [`${bar} ${chord}`, method])),
      own: true,
    }
  }
  return { form: foundForm(score), pattern: NEW_SONG_PATTERN, methods: new Map(), own: false }
}

/**
 * Another app's form: a section from each key change, each lasting change of time and each
 * rehearsal mark; its lines as its systems, else four bars a line.
 */
function foundForm(score: ReadScore): Form {
  const starts: { start: number; rehearsal?: string }[] = [{ start: 0 }]
  let key = score.key
  let meter = score.meter
  const bars = score.bars
  bars.forEach((bar, index) => {
    if (index === 0) {
      if (bar.rehearsal) starts[0] = { start: 0, rehearsal: bar.rehearsal }
      return
    }
    const keyChange = bar.key !== undefined && !sameKey(bar.key, key)
    if (bar.key) key = bar.key
    // A change of time for one bar is a bar of its own length: a section only where it lasts.
    const next = bars[index + 1]
    const lasting =
      bar.meter !== undefined &&
      bar.meter !== meter &&
      (next === undefined || next.meter === undefined)
    if (bar.meter && (next === undefined || next.meter === undefined)) meter = bar.meter
    if (keyChange || lasting || bar.rehearsal)
      starts.push({ start: index, ...(bar.rehearsal ? { rehearsal: bar.rehearsal } : {}) })
  })
  const systems = bars.some((bar) => bar.lineStart)
  const sections = starts.map(({ start }, s) => {
    const end = starts[s + 1]?.start ?? bars.length
    const lines: number[] = []
    let line = 0
    for (let index = start; index < end; index += 1) {
      const breaks = systems ? bars[index]?.lineStart === true : line === BARS_PER_LINE
      if (line > 0 && breaks) {
        lines.push(line)
        line = 0
      }
      line += 1
    }
    lines.push(line)
    return { start, lines }
  })
  let letter = 0
  const headings = starts.map(({ rehearsal }): DraftHeading => {
    const words = rehearsal?.trim() ?? ''
    const kind = HEADING_WORDS.find(([pattern]) => pattern.test(words))?.[1]
    if (kind) return { kind }
    if (starts.length === 1) return { kind: 'verse' }
    const label =
      words !== '' && words.length <= LABEL_MAX ? words : String.fromCharCode(65 + letter)
    letter += 1
    return { kind: 'part', label }
  })
  return { sections, headings }
}

/** Each bar's chords, the first at its start: one that sounds on into a bar begins it again. */
function barChords(
  score: ReadScore,
  bar: ReadBar,
  index: number,
  methods: ReadonlyMap<string, string>,
  sounding: { chord?: Chord },
): DraftBar['chords'] {
  const inBar = score.chords.filter(
    (chord) => chord.startTick >= bar.startTick && chord.startTick < bar.startTick + bar.ticks,
  )
  const placed = inBar.map(({ startTick, chord }) => ({ at: startTick - bar.startTick, chord }))
  const [first] = placed
  if (first && first.at > 0) {
    if (sounding.chord) placed.unshift({ at: 0, chord: sounding.chord })
    else placed[0] = { ...first, at: 0 }
  }
  if (!first && sounding.chord) placed.push({ at: 0, chord: sounding.chord })
  sounding.chord = placed.at(-1)?.chord ?? sounding.chord
  return placed.map(({ at, chord }, place) => {
    const method = methods.get(`${index} ${place}`)
    return { at, chord, ...(method ? { method } : {}) }
  })
}

const draftNote = (n: ReadNote, end: Tick, lyrics: boolean): DraftNote => ({
  midi: n.midi,
  spelled: n.spelled,
  startTick: n.startTick,
  durationTicks: Math.min(n.durationTicks, end - n.startTick),
  ...(n.finger === undefined ? {} : { finger: n.finger }),
  ...(n.marks ? { marks: n.marks } : {}),
  ...(lyrics && n.lyrics ? { lyrics: n.lyrics } : {}),
})

/**
 * A single staff's notes as one line (ADR 0097): its first voice, a chord's top note, each note cut
 * where the next starts; how many it leaves out.
 */
function oneLine(notes: readonly ReadNote[]): { line: ReadNote[]; left: number } {
  const number = (n: ReadNote) => Number(n.voice.split(':').at(-1)) || 0
  const voice = notes.toSorted((a, b) => number(a) - number(b))[0]?.voice
  const top = new Map<Tick, ReadNote>()
  for (const n of notes) {
    if (n.voice !== voice) continue
    const held = top.get(n.startTick)
    if (!held || n.midi > held.midi) top.set(n.startTick, n)
  }
  const line = [...top.values()].sort((a, b) => a.startTick - b.startTick)
  return {
    line: line.map((n, i) => {
      const next = line[i + 1]?.startTick ?? Infinity
      return n.startTick + n.durationTicks > next ? { ...n, durationTicks: next - n.startTick } : n
    }),
    left: notes.length - line.length,
  }
}

/**
 * A file's music as the editor holds a song (ADR 0107): the first part of two staves the piano's
 * grand staff, its upper staff the right hand's and its lower the left's; every other staff a single
 * staff over it, one line; with no piano part, a lead sheet over a silent piano. Its form (sections,
 * lines, headings, the pattern) the app's where the file keeps them, else found from its key and
 * time changes, rehearsal marks and systems. The words on the staff singing most of them. Counts
 * what it leaves out.
 */
export function draftOfScore(score: ReadScore): { draft: Draft; leftOut: LeftCounts } {
  const leftOut: Partial<Record<LeftKind, number>> = { ...score.leftOut }
  const leave = (kind: LeftKind, count = 1) => {
    if (count > 0) leftOut[kind] = (leftOut[kind] ?? 0) + count
  }
  const { form, pattern, methods, own } = formOf(score)
  const pianoPart = score.parts.find((part) => part.staves.length >= 2)
  const [rhStaff, lhStaff, ...more] = pianoPart?.staves ?? []
  for (const extra of more)
    leave('staves', score.notes.filter((n) => n.staff === extra).length || 1)
  const single = score.parts.filter((part) => part !== pianoPart).flatMap((part) => part.staves)
  const end = score.bars.reduce((sum, bar) => sum + bar.ticks, 0)

  // The staff that sings most: its words are kept.
  const sung = new Map<number, number>()
  for (const n of score.notes)
    if (n.lyrics && n.lyrics.some(Boolean)) sung.set(n.staff, (sung.get(n.staff) ?? 0) + 1)
  const singer = [...sung].sort(([, a], [, b]) => b - a)[0]?.[0]
  const lyricsOn: LyricsStaff =
    singer !== undefined && single.includes(singer) ? single.indexOf(singer) : 'rh'
  const keeps = (staff: number) => staff === singer && (single.includes(staff) || staff === rhStaff)
  for (const [staff, count] of sung) if (!keeps(staff)) leave('lyrics', count)

  const notesOn = (staff: number | undefined) =>
    staff === undefined ? [] : score.notes.filter((n) => n.staff === staff && n.startTick < end)
  const staves: DraftStaff[] = single.map((staff) => {
    const { line, left } = oneLine(notesOn(staff))
    leave('voices', left)
    const read = score.staves[staff]
    const name =
      score.parts[read?.part ?? -1]?.staves.length === 1
        ? score.parts[read?.part ?? -1]?.name
        : undefined
    if (score.bars.some((bar) => bar.clefs?.[staff] !== undefined)) leave('clefs')
    return {
      ...(name ? { name } : {}),
      clef: read?.clef ?? 'treble',
      notes: line.map((n) => draftNote(n, end, keeps(staff))),
    }
  })

  // The hands' clefs where they are not the grand staff's own.
  const handClef = (staff: number | undefined, bar: ReadBar, index: number): Clef | undefined =>
    staff === undefined
      ? undefined
      : (bar.clefs?.[staff] ?? (index === 0 ? score.staves[staff]?.clef : undefined))
  let key = score.key
  let meter: Meter = score.meter
  const sounding: { chord?: Chord } = {}
  const sections: DraftSection[] = form.sections.map((section, s) => {
    const heading = form.headings[s] ?? { kind: 'verse' }
    const firstBar = score.bars[section.start]
    if (firstBar?.key) key = firstBar.key
    if (firstBar?.meter) meter = firstBar.meter
    const ownKey = !sameKey(key, score.key) ? { key: keyText(key) } : {}
    const ownMeter = meter !== score.meter ? { meter } : {}
    const { key: _key, meter: _meter, ...named } = heading
    let index = section.start
    const lines = section.lines.map((count) =>
      Array.from({ length: count }, (): DraftBar => {
        const bar = score.bars[index]
        const at = index
        index += 1
        if (!bar) return { ticks: 0, chords: [] }
        const rh = handClef(rhStaff, bar, at)
        const lh = handClef(lhStaff, bar, at)
        const clefs = {
          ...(rh && (at > 0 || rh !== 'treble') ? { rh } : {}),
          ...(lh && (at > 0 || lh !== 'bass') ? { lh } : {}),
        }
        return {
          ticks: bar.ticks,
          chords: barChords(score, bar, at, methods, sounding),
          ...barMarksOf(bar),
          ...(Object.keys(clefs).length > 0 ? { clefs } : {}),
        }
      }),
    )
    // The app's own file says its sections' keys and meters; another's are found where they change.
    return { heading: own ? heading : { ...named, ...ownKey, ...ownMeter }, lines }
  })

  const tempo = score.tempo ?? NEW_SONG_TEMPO
  const kept = Math.min(PIECE_TEMPO.max, Math.max(PIECE_TEMPO.min, tempo))
  if (kept !== tempo) leave('tempo')
  const draft: Draft = {
    key: score.key,
    meter: score.meter,
    ...(score.timeSymbol ? { timeSymbol: true } : {}),
    ...(score.tempoUnit ? { tempoUnit: score.tempoUnit } : {}),
    tempo: Math.round(kept * TICKS_PER_BEAT) / TICKS_PER_BEAT,
    pattern,
    sections,
    staves,
    leadSheet:
      staves.length > 0 &&
      (!pianoPart || pianoPart.staves.every((staff) => score.staves[staff]?.hidden)),
    lyricsOn,
    hands: {
      rh: notesOn(rhStaff).map((n) => draftNote(n, end, keeps(rhStaff ?? -1))),
      lh: notesOn(lhStaff).map((n) => draftNote(n, end, false)),
    },
  }
  return { draft, leftOut }
}
