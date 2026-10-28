// A MusicXML file read as music on a timeline: its parts' staves and notes in ticks, its bars and
// their marks, its chord symbols, and what it holds that our music cannot, counted.

import {
  CLEF_FORMS,
  CLEFS,
  EXPRESSION_TEXT,
  EXPRESSIONS,
  DYNAMICS,
  isCompound,
  meterOf,
  signatureKey,
  type Articulation,
  type BarMarks,
  type Chord,
  type Clef,
  type Dynamic,
  type Expression,
  type Finger,
  type GraceNote,
  type Jump,
  type Key,
  type Letter,
  type Meter,
  type Midi,
  type NoteLyrics,
  type NoteMarks,
  type Ornament,
  type SpelledNote,
  type Syllable,
  type TempoUnit,
  type Tick,
} from '@/shared/lib/music'
import { readHarmony } from './harmony'
import { APP_FIELD, JUMP_WORDS } from './write'
import {
  childAt,
  childOf,
  childrenOf,
  numberAt,
  parseXml,
  textAt,
  textOf,
  type XmlElement,
} from './xml'

/** What a file holds that the music it is read as cannot, each kind counted. */
export const LEFT_OUT = [
  /** Durations that fall between our ticks (a quintuplet), rounded to the nearest. */
  'rhythms',
  /** Notes off the piano's keys, unpitched or percussion notes, cue notes. */
  'notes',
  /** A meter we do not write, or a change of time from simple to compound. */
  'meters',
  /** A key signature of more than seven, or a key of its own. */
  'keys',
  /** A tempo after the first. */
  'tempos',
  /** Dynamics we do not write (sfz, fp, ppp). */
  'dynamics',
  /** Words over the music that are no mark of ours. */
  'text',
  /** Chord symbols we cannot read. */
  'chords',
  /** Endings past the second, or one ending for several times through. */
  'endings',
  /** Ornaments, articulations and technique we do not write. */
  'marks',
] as const
export type LeftOut = (typeof LEFT_OUT)[number]

/** A note read: on a staff and in a voice, from the music's start. */
export interface ReadNote {
  /** Its staff: an index into `ReadScore.staves`. */
  readonly staff: number
  readonly voice: string
  readonly midi: Midi
  readonly spelled: SpelledNote
  readonly startTick: Tick
  readonly durationTicks: Tick
  readonly finger?: Finger
  readonly marks?: NoteMarks
  readonly lyrics?: NoteLyrics
}

/** A staff of a part: the part's staff number in it, the clef it starts in. */
export interface ReadStaff {
  readonly part: number
  readonly clef: Clef
  /** Kept and not printed (`staff-details print-object="no"`): a lead sheet's piano. */
  readonly hidden: boolean
}

export interface ReadPart {
  /** Its name where it is printed. */
  readonly name?: string
  /** Its staves, top down: indexes into `ReadScore.staves`. */
  readonly staves: readonly number[]
}

/** A measure read: where it stands and how long it is, its marks and what changes there. */
export interface ReadBar extends BarMarks {
  readonly startTick: Tick
  readonly ticks: Tick
  /** The key it changes to. */
  readonly key?: Key
  /** The meter it changes to. */
  readonly meter?: Meter
  /** The clef each staff changes to here, by the staff's index. */
  readonly clefs?: Readonly<Record<number, Clef>>
  /** A new line (system) starts here. */
  readonly lineStart?: true
  /** A rehearsal mark over it. */
  readonly rehearsal?: string
}

export interface ReadScore {
  readonly title?: string
  readonly composer?: string
  readonly lyricist?: string
  readonly key: Key
  readonly meter: Meter
  readonly timeSymbol?: true
  /** Beats of the meter's kind a minute (a dotted quarter's in compound time). */
  readonly tempo?: number
  /** The note the tempo mark counts, where not the meter's beat. */
  readonly tempoUnit?: TempoUnit
  readonly parts: readonly ReadPart[]
  readonly staves: readonly ReadStaff[]
  readonly bars: readonly ReadBar[]
  readonly notes: readonly ReadNote[]
  readonly chords: readonly { readonly startTick: Tick; readonly chord: Chord }[]
  /** The app's own data, where the file is one the app wrote. */
  readonly appData?: string
  readonly leftOut: Readonly<Partial<Record<LeftOut, number>>>
}

/** A file that is XML and no score. */
export class NotAScoreError extends Error {
  override readonly name = 'NotAScoreError'
}

const STEPS: Readonly<Record<string, number>> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const LOWEST: Midi = 21 as Midi
const HIGHEST: Midi = 108 as Midi

const TYPE_VALUES: Readonly<Record<string, string>> = {
  whole: '1',
  half: '2',
  quarter: '4',
  eighth: '8',
  '16th': '16',
}

const ARTICULATIONS: Readonly<Record<string, Articulation>> = {
  staccato: 'staccato',
  staccatissimo: 'staccatissimo',
  spiccato: 'staccatissimo',
  accent: 'accent',
  tenuto: 'tenuto',
  'strong-accent': 'marcato',
}

const ORNAMENTS: Readonly<Record<string, Ornament>> = {
  'trill-mark': 'trill',
  'inverted-mordent': 'mordent',
  mordent: 'lower-mordent',
  turn: 'turn',
  tremolo: 'tremolo',
}

/** An expression's words as other apps write them. */
const EXPRESSION_WORDS = new Map<string, Expression>([
  ...EXPRESSIONS.map(
    (expression) => [normalWords(EXPRESSION_TEXT[expression]), expression] as const,
  ),
  ...EXPRESSIONS.map((expression) => [normalWords(expression), expression] as const),
  ['espressivo', 'espressivo'],
  ['espr', 'espressivo'],
  ['ritard', 'rit'],
  ['ritardando', 'rit'],
  ['rallentando', 'rall'],
  ['accelerando', 'accel'],
])

function normalWords(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.\s]+/g, ' ')
    .trim()
}

const JUMP_BY_WORDS = new Map<string, Jump>(
  Object.entries(JUMP_WORDS).map(([jump, { text }]) => [normalWords(text), jump as Jump]),
)

/** A score-timewise file's measures as partwise parts: each part's measures in order. */
function partsOf(root: XmlElement): { id: string; measures: XmlElement[] }[] {
  if (root.name === 'score-partwise')
    return childrenOf(root, 'part').map((part) => ({
      id: part.attrs.id ?? '',
      measures: childrenOf(part, 'measure'),
    }))
  const parts = new Map<string, XmlElement[]>()
  for (const measure of childrenOf(root, 'measure'))
    for (const part of childrenOf(measure, 'part')) {
      const id = part.attrs.id ?? ''
      parts.set(id, [...(parts.get(id) ?? []), { ...part, name: 'measure', attrs: measure.attrs }])
    }
  return [...parts].map(([id, measures]) => ({ id, measures }))
}

/** A clef's element as one of our clefs, where it is one. */
function clefOf(element: XmlElement): Clef | undefined {
  const sign = textAt(element, 'sign')
  const line = numberAt(element, 'line')
  const octaves = numberAt(element, 'clef-octave-change') ?? 0
  return CLEFS.find((clef) => {
    const form = CLEF_FORMS[clef]
    return (
      form.shape === sign && (line === undefined || form.line === line) && form.octaves === octaves
    )
  })
}

/** The tempo unit a metronome mark's beat unit is, where it is one of ours. */
function tempoUnitOf(metronome: XmlElement): TempoUnit | undefined {
  const value = TYPE_VALUES[textAt(metronome, 'beat-unit') ?? '']
  if (!value) return undefined
  const unit = `${value}${childOf(metronome, 'beat-unit-dot') ? '.' : ''}`
  return ['2', '2.', '4', '4.', '8', '8.', '16'].includes(unit) ? (unit as TempoUnit) : undefined
}

/** A tempo unit's length in quarters. */
const unitQuarters = (unit: TempoUnit) =>
  (4 / Number.parseInt(unit, 10)) * (unit.endsWith('.') ? 1.5 : 1)

interface Pending {
  readonly staff: number
  readonly tick: Tick
  readonly marks: NoteMarks
}

interface Lyric {
  readonly verse: number
  readonly syllable?: Syllable
  /** Its extender: from a syllable, going on over a note, or stopping on one. */
  readonly extend?: 'start' | 'continue' | 'stop'
}

/** A note as it is read, before ties are joined and words are held. */
interface Building {
  staff: number
  voice: string
  midi: Midi
  spelled: SpelledNote
  startTick: Tick
  durationTicks: Tick
  finger?: Finger
  marks: { -readonly [K in keyof NoteMarks]: NoteMarks[K] }
  lyrics: Lyric[]
  tieStart: boolean
  tieStop: boolean
}

/**
 * Reads a MusicXML file's text (partwise or timewise): its title and makers, its first key, meter and
 * tempo, every part's staves, measures and notes, in ticks of the meter's kind (a quarter 24 in
 * simple time, 16 in compound, ADR 0097). Throws an XmlError for text that is no XML and a
 * NotAScoreError for XML that is no score.
 */
export function readMusicXml(source: string): ReadScore {
  const root = parseXml(source)
  if (root.name !== 'score-partwise' && root.name !== 'score-timewise')
    throw new NotAScoreError(`<${root.name}> is no score`)
  const leftOut: Partial<Record<LeftOut, number>> = {}
  const leave = (kind: LeftOut, count = 1) => {
    leftOut[kind] = (leftOut[kind] ?? 0) + count
  }
  const rawParts = partsOf(root)
  if (rawParts.length === 0 || rawParts.every((part) => part.measures.length === 0))
    throw new NotAScoreError('No measures')

  // The meter's kind, from the first time signature: the ticks a quarter has.
  const firstTime = rawParts
    .flatMap((part) => part.measures)
    .flatMap((measure) => childrenOf(measure, 'attributes'))
    .map((attributes) => childOf(attributes, 'time'))
    .find((time) => time !== undefined)
  const firstMeter = firstTime && meterOfTime(firstTime)
  if (firstTime && !firstMeter) leave('meters')
  const meter: Meter = firstMeter ?? '4/4'
  const quarter = isCompound(meter) ? 16 : 24
  const symbol = firstTime?.attrs.symbol
  const timeSymbol =
    (symbol === 'common' && meter === '4/4') || (symbol === 'cut' && meter === '2/2')

  const partNames = new Map<string, XmlElement>(
    childrenOf(childAt(root, 'part-list') ?? root, 'score-part').map((part) => [
      part.attrs.id ?? '',
      part,
    ]),
  )

  // Each measure's length: the longest any part makes it.
  const lengths: Tick[] = []
  const staves: { part: number; clef: Clef; hidden: boolean }[] = []
  const parts: ReadPart[] = []
  const notes: Building[] = []
  const pending: Pending[] = []
  const chords = new Map<Tick, Chord>()
  const bars: { -readonly [K in keyof ReadBar]?: ReadBar[K] }[] = []
  let key: Key | undefined
  let tempo: { tempo: number; unit?: TempoUnit } | undefined
  const firstKeyed = { done: false }
  const barAt = (index: number) => (bars[index] ??= {})
  let rounded = 0

  // Measures' starts come from the first pass over their lengths; read every part's measures twice:
  // once for lengths, once for notes.
  const measureTicks = (measure: XmlElement, divisions: { value: number }): Tick => {
    let at = 0
    let longest = 0
    const length = (child: XmlElement) => exact(numberAt(child, 'duration') ?? 0, divisions.value)
    for (const child of measure.children) {
      if (typeof child === 'string') continue
      if (child.name === 'attributes') {
        const value = numberAt(child, 'divisions')
        if (value) divisions.value = value
      } else if (child.name === 'note') {
        if (childOf(child, 'grace') || childOf(child, 'chord')) continue
        at += length(child)
      } else if (child.name === 'backup') at -= length(child)
      else if (child.name === 'forward') at += length(child)
      longest = Math.max(longest, at)
    }
    return Math.round(longest)
  }
  /** A duration in ticks, unrounded: positions are rounded once, so a bar's notes still fill it. */
  function exact(duration: number, divisions: number): number {
    return (duration * quarter) / divisions
  }
  const between = (position: number) => Math.abs(position - Math.round(position)) > 1e-6
  for (const part of rawParts) {
    const divisions = { value: 1 }
    part.measures.forEach((measure, index) => {
      lengths[index] = Math.max(lengths[index] ?? 0, measureTicks(measure, divisions))
    })
  }
  // An empty measure lasts its meter's bar.
  const starts: Tick[] = []
  {
    let tick = 0
    let current = meter
    rawParts[0]?.measures.forEach((measure, index) => {
      const time = childrenOf(measure, 'attributes')
        .map((attributes) => childOf(attributes, 'time'))
        .find(Boolean)
      current = (time && meterOfTime(time)) ?? current
      if (!lengths[index]) lengths[index] = Math.round(barQuarters(current) * quarter)
      starts[index] = tick
      tick += lengths[index] ?? 0
    })
  }

  rawParts.forEach((raw, p) => {
    const scorePart = partNames.get(raw.id)
    const nameElement = scorePart && childOf(scorePart, 'part-name')
    const printed = nameElement && nameElement.attrs['print-object'] !== 'no'
    const name = printed ? textOf(nameElement) : ''
    const own: number[] = []
    const staffOf = (number: number) => {
      while (own.length < number) {
        own.push(staves.length)
        staves.push({ part: p, clef: own.length === 2 ? 'bass' : 'treble', hidden: false })
      }
      return own[number - 1] ?? 0
    }
    staffOf(1)
    const divisions = { value: 1 }
    let transpose = 0
    const octave = new Map<number, '8va' | '8vb'>()
    const graces = new Map<string, GraceNote[]>()
    /** The words' verses by their numbers, in the order the part first sings them. */
    const verses = new Map<string, number>()
    /** The last note started in each voice: a chord's notes join it. */
    const last = new Map<string, Building>()
    raw.measures.forEach((measure, index) => {
      const start = starts[index] ?? 0
      let at = 0
      const bar = barAt(index)
      for (const child of measure.children) {
        if (typeof child === 'string') continue
        switch (child.name) {
          case 'attributes': {
            const value = numberAt(child, 'divisions')
            if (value) divisions.value = value
            const count = numberAt(child, 'staves')
            if (count) for (let n = 1; n <= count; n += 1) staffOf(n)
            const keyElement = childOf(child, 'key')
            if (keyElement) {
              const read = keyOf(keyElement)
              if (!read) leave('keys')
              else if (!firstKeyed.done) {
                key = read
                firstKeyed.done = true
              } else if (p === 0 && index > 0) bar.key = read
              else if (p === 0 && index === 0) key = read
            }
            const time = childOf(child, 'time')
            if (time && p === 0 && index > 0) {
              const changed = meterOfTime(time)
              if (!changed || isCompound(changed) !== isCompound(meter)) leave('meters')
              else bar.meter = changed
            }
            for (const clefElement of childrenOf(child, 'clef')) {
              const staff = staffOf(Number(clefElement.attrs.number ?? 1))
              const clef = clefOf(clefElement)
              const known = staves[staff]
              if (!clef || !known) {
                leave('notes')
                continue
              }
              if (index === 0 && at === 0) known.clef = clef
              else bar.clefs = { ...bar.clefs, [staff]: clef }
            }
            for (const details of childrenOf(child, 'staff-details')) {
              const known = staves[staffOf(Number(details.attrs.number ?? 1))]
              if (known && details.attrs['print-object'] === 'no') known.hidden = true
            }
            const shift = childOf(child, 'transpose')
            if (shift)
              transpose =
                (numberAt(shift, 'chromatic') ?? 0) + 12 * (numberAt(shift, 'octave-change') ?? 0)
            break
          }
          case 'backup':
            at -= exact(numberAt(child, 'duration') ?? 0, divisions.value)
            break
          case 'forward':
            at += exact(numberAt(child, 'duration') ?? 0, divisions.value)
            break
          case 'print':
            if (child.attrs['new-system'] === 'yes' || child.attrs['new-page'] === 'yes')
              bar.lineStart = true
            break
          case 'barline':
            readBarline(child, bar, leave)
            break
          case 'harmony': {
            const tick =
              start + Math.round(at + exact(numberAt(child, 'offset') ?? 0, divisions.value))
            const chord = readHarmony(child)
            if (!chord) {
              if (textAt(child, 'kind') !== 'none') leave('chords')
            } else if (!chords.has(tick)) chords.set(tick, chord)
            break
          }
          case 'direction': {
            const tick =
              start + Math.round(at + exact(numberAt(child, 'offset') ?? 0, divisions.value))
            const staff = staffOf(numberAt(child, 'staff') ?? 1)
            readDirection(child, {
              mark: (marks) => pending.push({ staff, tick, marks }),
              octave: (line) => (line ? octave.set(staff, line) : octave.delete(staff)),
              bar: (marks) => Object.assign(bar, marks),
              rehearsal: (text) => {
                if (p === 0) bar.rehearsal ??= text
              },
              tempo: (read) => {
                const quarters = (each: { tempo: number; unit?: TempoUnit }) =>
                  each.tempo * unitQuarters(each.unit ?? '4')
                // One tempo said twice (words with a sound, and a metronome mark) is one: the mark's.
                if (!tempo || (quarters(tempo) === quarters(read) && read.unit)) tempo = read
                else if (quarters(tempo) !== quarters(read)) leave('tempos')
              },
              leave,
            })
            break
          }
          case 'note': {
            const read = readNote(child, (duration) => exact(duration, divisions.value))
            if (read.kind === 'skip') {
              leave('notes')
              if (!read.chord && !read.grace) at += read.ticks
              break
            }
            const staff = staffOf(read.staff)
            const voice = `${staff}:${read.voice}`
            if (read.kind === 'rest') {
              at += read.ticks
              break
            }
            const midi = (read.midi + transpose) as Midi
            if (midi < LOWEST || midi > HIGHEST) {
              leave('notes')
              if (!read.chord && !read.grace) at += read.ticks
              break
            }
            if (read.grace) {
              graces.set(voice, [
                ...(graces.get(voice) ?? []),
                {
                  midi,
                  spelled: read.spelled,
                  ...(read.appoggiatura ? { appoggiatura: true as const } : {}),
                },
              ])
              break
            }
            const before = last.get(voice)
            // A note that starts or ends between ticks (a quintuplet's) is rounded to them.
            if (!read.chord && (between(at) || between(at + read.ticks))) rounded += 1
            const onset = read.chord && before ? before.startTick : start + Math.round(at)
            const ends =
              read.chord && before
                ? before.startTick + before.durationTicks
                : start + Math.round(at + read.ticks)
            if (!read.chord) at += read.ticks
            const marks: Building['marks'] = { ...read.marks }
            const line = octave.get(staff)
            if (line) marks.octave = line
            const grace = graces.get(voice)
            if (grace && !read.chord) {
              marks.grace = grace
              graces.delete(voice)
            }
            const building: Building = {
              staff,
              voice,
              midi,
              spelled: read.spelled,
              startTick: onset,
              durationTicks: ends - onset,
              ...(read.finger ? { finger: read.finger } : {}),
              marks,
              lyrics: read.lyrics.map(({ number, ...lyric }) => {
                const verse = verses.get(number) ?? verses.size
                verses.set(number, verse)
                return { verse, ...lyric }
              }),
              tieStart: read.tieStart,
              tieStop: read.tieStop,
            }
            if (read.chord && before) {
              // A chord's marks are its first note's.
              const { grace: _grace, ...shared } = before.marks
              building.marks = { ...shared, ...building.marks }
            }
            if (!read.chord) last.set(voice, building)
            notes.push(building)
            if (read.leftOut) leave('marks', read.leftOut)
            break
          }
          default:
            break
        }
      }
    })
    parts.push({ ...(name ? { name } : {}), staves: own })
  })
  if (rounded > 0) leave('rhythms', rounded)

  const joined = joinTies(notes)
  applyDirections(joined, pending)
  const read: ReadNote[] = joined.map((n) => {
    const { lyrics: _lyrics, tieStart: _start, tieStop: _stop, marks, finger, ...rest } = n
    return {
      ...rest,
      ...(finger ? { finger } : {}),
      ...(Object.keys(marks).length > 0 ? { marks } : {}),
    }
  })
  withLyrics(joined, read)

  const appData = childrenOf(
    childAt(root, 'identification', 'miscellaneous') ?? root,
    'miscellaneous-field',
  ).find((field) => field.attrs.name === APP_FIELD)
  const title =
    textAt(root, 'work', 'work-title') ||
    textAt(root, 'movement-title') ||
    childrenOf(root, 'credit')
      .map((credit) => childOf(credit, 'credit-words'))
      .find((words) => words !== undefined && textOf(words) !== '')
      ?.children.map((each) => (typeof each === 'string' ? each : textOf(each)))
      .join('') ||
    undefined
  const creator = (type: string) =>
    childrenOf(childAt(root, 'identification') ?? root, 'creator')
      .find((each) => each.attrs.type === type)
      ?.children.map((each) => (typeof each === 'string' ? each : textOf(each)))
      .join('')
      .trim() || undefined
  const composer = creator('composer')
  const lyricist = creator('lyricist')

  return {
    ...(title ? { title: title.trim() } : {}),
    ...(composer ? { composer } : {}),
    ...(lyricist ? { lyricist } : {}),
    key: key ?? signatureKey(0, false),
    meter,
    ...(timeSymbol ? { timeSymbol: true } : {}),
    ...tempoOf(tempo, meter),
    parts,
    staves,
    bars: lengths.map((ticks, index) => ({
      ...bars[index],
      startTick: starts[index] ?? 0,
      ticks,
    })),
    notes: read.sort((a, b) => a.startTick - b.startTick || a.staff - b.staff || a.midi - b.midi),
    chords: [...chords]
      .sort(([a], [b]) => a - b)
      .map(([startTick, chord]) => ({ startTick, chord })),
    ...(appData ? { appData: textOf(appData) } : {}),
    leftOut,
  }
}

/** The tempo in the meter's beats, and its unit where it is not the beat. */
function tempoOf(
  tempo: { tempo: number; unit?: TempoUnit } | undefined,
  meter: Meter,
): { tempo?: number; tempoUnit?: TempoUnit } {
  if (!tempo) return {}
  const beat: TempoUnit = isCompound(meter) ? '4.' : '4'
  const unit = tempo.unit ?? '4'
  const beats = (tempo.tempo * unitQuarters(unit)) / unitQuarters(beat)
  return {
    tempo: Math.round(beats * 100) / 100,
    ...(tempo.unit && tempo.unit !== beat ? { tempoUnit: tempo.unit } : {}),
  }
}

/** A bar's length in quarters. */
function barQuarters(meter: Meter): number {
  const [count = 4, unit = 4] = meter.split('/').map(Number)
  return (count * 4) / unit
}

function meterOfTime(time: XmlElement): Meter | undefined {
  if (childOf(time, 'senza-misura')) return undefined
  const beats = textAt(time, 'beats') ?? ''
  const count = beats.split('+').reduce((sum, part) => sum + Number(part), 0)
  return meterOf(count, numberAt(time, 'beat-type') ?? 0)
}

function keyOf(element: XmlElement): Key | undefined {
  const fifths = numberAt(element, 'fifths')
  if (fifths === undefined || Math.abs(fifths) > 7) return undefined
  return signatureKey(fifths, textAt(element, 'mode') === 'minor')
}

function readBarline(
  barline: XmlElement,
  bar: { -readonly [K in keyof ReadBar]?: ReadBar[K] },
  leave: (kind: LeftOut) => void,
) {
  const left = barline.attrs.location === 'left'
  const style = textAt(barline, 'bar-style')
  const repeat = childOf(barline, 'repeat')?.attrs.direction
  if (repeat === 'forward') bar.repeatStart = true
  if (repeat === 'backward') bar.barline = 'repeat'
  else if (!left && (style === 'light-heavy' || style === 'heavy')) bar.barline ??= 'final'
  else if (!left && style === 'light-light') bar.barline ??= 'double'
  const ending = childOf(barline, 'ending')
  if (ending && ending.attrs.type === 'start') {
    const number = (ending.attrs.number ?? '').trim()
    if (number === '1' || number === '2') bar.ending = Number(number) as 1 | 2
    else leave('endings')
  }
  if (childOf(barline, 'segno')) bar.segno = true
  if (childOf(barline, 'coda')) bar.coda = true
}

interface DirectionReader {
  readonly mark: (marks: NoteMarks) => void
  readonly octave: (line: '8va' | '8vb' | undefined) => void
  readonly bar: (marks: BarMarks) => void
  readonly rehearsal: (text: string) => void
  readonly tempo: (tempo: { tempo: number; unit?: TempoUnit }) => void
  readonly leave: (kind: LeftOut) => void
}

function readDirection(direction: XmlElement, read: DirectionReader) {
  const sound = childOf(direction, 'sound')
  let tempoRead = false
  for (const type of childrenOf(direction, 'direction-type')) {
    for (const child of type.children) {
      if (typeof child === 'string') continue
      switch (child.name) {
        case 'dynamics': {
          for (const each of child.children) {
            if (typeof each === 'string') continue
            if ((DYNAMICS as readonly string[]).includes(each.name))
              read.mark({ dynamic: each.name as Dynamic })
            else read.leave('dynamics')
          }
          break
        }
        case 'wedge': {
          const kind = child.attrs.type
          read.mark({
            hairpin: kind === 'crescendo' ? 'cresc' : kind === 'diminuendo' ? 'dim' : 'end',
          })
          break
        }
        case 'octave-shift': {
          const kind = child.attrs.type
          const size = Number(child.attrs.size ?? 8)
          if (kind === 'stop' || kind === 'continue') read.octave(undefined)
          else if (size !== 8) read.leave('marks')
          else read.octave(kind === 'down' ? '8va' : '8vb')
          break
        }
        case 'pedal': {
          const kind = child.attrs.type
          if (kind === 'start' || kind === 'resume') read.mark({ pedal: 'down' })
          else if (kind === 'stop' || kind === 'discontinue') read.mark({ pedal: 'up' })
          else if (kind === 'change') read.mark({ pedal: 'change' })
          break
        }
        case 'words': {
          const words = normalWords(textOf(child))
          if (words === '') break
          const expression = EXPRESSION_WORDS.get(words)
          const jump = JUMP_BY_WORDS.get(words)
          if (expression) read.mark({ expression })
          else if (jump) read.bar({ jump })
          else if (words === 'fine') read.bar({ fine: true })
          else if (words === 'to coda') read.bar({ toCoda: true })
          else read.leave('text')
          break
        }
        case 'rehearsal':
          read.rehearsal(textOf(child))
          break
        case 'segno':
          read.bar({ segno: true })
          break
        case 'coda':
          read.bar({ coda: true })
          break
        case 'metronome': {
          const unit = tempoUnitOf(child)
          const perMinute = numberAt(child, 'per-minute')
          if (unit && perMinute) {
            read.tempo({ tempo: perMinute, unit })
            tempoRead = true
          }
          break
        }
        default:
          break
      }
    }
  }
  const quarters = Number(sound?.attrs.tempo)
  if (!tempoRead && Number.isFinite(quarters) && quarters > 0) read.tempo({ tempo: quarters })
}

type NoteRead =
  | { kind: 'skip'; ticks: Tick; chord: boolean; grace: boolean }
  | { kind: 'rest'; ticks: Tick; staff: number; voice: string }
  | {
      kind: 'note'
      ticks: Tick
      staff: number
      voice: string
      chord: boolean
      grace: boolean
      /** A grace note written unslashed. */
      appoggiatura: boolean
      midi: number
      spelled: SpelledNote
      finger?: Finger
      marks: NoteMarks
      lyrics: { number: string; syllable?: Syllable; extend?: Lyric['extend'] }[]
      tieStart: boolean
      tieStop: boolean
      leftOut: number
    }

/** Reads one `<note>`, its duration in ticks (unrounded) by `toTicks`. */
function readNote(note: XmlElement, toTicks: (duration: number) => number): NoteRead {
  const chord = childOf(note, 'chord') !== undefined
  const graceElement = childOf(note, 'grace')
  const grace = graceElement !== undefined
  const ticks = grace ? 0 : toTicks(numberAt(note, 'duration') ?? 0)
  const staff = numberAt(note, 'staff') ?? 1
  const voice = textAt(note, 'voice') ?? '1'
  if (childOf(note, 'cue') || childOf(note, 'unpitched'))
    return { kind: 'skip', ticks, chord, grace }
  if (childOf(note, 'rest')) return { kind: 'rest', ticks, staff, voice }
  const pitch = childOf(note, 'pitch')
  const step = pitch && textAt(pitch, 'step')
  const octave = pitch && numberAt(pitch, 'octave')
  if (!pitch || !step || STEPS[step] === undefined || octave === undefined)
    return { kind: 'skip', ticks, chord, grace }
  const alter = Math.round(numberAt(pitch, 'alter') ?? 0)
  const accidental = Math.max(-2, Math.min(2, alter)) as SpelledNote['accidental']
  const midi = (octave + 1) * 12 + (STEPS[step] ?? 0) + alter
  const marks: { -readonly [K in keyof NoteMarks]: NoteMarks[K] } = {}
  let finger: Finger | undefined
  let leftOut = 0
  const ties = childrenOf(note, 'tie').map((tie) => tie.attrs.type)
  let tieStart = ties.includes('start')
  let tieStop = ties.includes('stop')
  for (const notations of childrenOf(note, 'notations')) {
    for (const child of notations.children) {
      if (typeof child === 'string') continue
      switch (child.name) {
        case 'tied':
          if (child.attrs.type === 'start') tieStart = true
          if (child.attrs.type === 'stop') tieStop = true
          break
        case 'slur':
          if (child.attrs.type === 'start') marks.slurStart = true
          if (child.attrs.type === 'stop') marks.slurEnd = true
          break
        case 'articulations':
          for (const each of child.children) {
            if (typeof each === 'string') continue
            const articulation = ARTICULATIONS[each.name]
            if (articulation)
              marks.articulations = [...new Set([...(marks.articulations ?? []), articulation])]
            else if (each.name !== 'breath-mark') leftOut += 1
          }
          break
        case 'fermata':
          marks.articulations = [...new Set([...(marks.articulations ?? []), 'fermata' as const])]
          break
        case 'ornaments':
          for (const each of child.children) {
            if (typeof each === 'string' || each.name === 'accidental-mark') continue
            const ornament = ORNAMENTS[each.name]
            if (ornament && !marks.ornament) marks.ornament = ornament
            else if (each.name !== 'wavy-line') leftOut += 1
          }
          break
        case 'technical':
          for (const each of child.children) {
            if (typeof each === 'string') continue
            const value = Number(textOf(each))
            if (each.name === 'fingering' && value >= 1 && value <= 5 && finger === undefined)
              finger = value as Finger
            else leftOut += 1
          }
          break
        case 'arpeggiate':
          marks.arpeggio = true
          break
        default:
          break
      }
    }
  }
  const lyrics = childrenOf(note, 'lyric').flatMap((lyric) => {
    const number = lyric.attrs.number ?? '1'
    const words = childrenOf(lyric, 'text').map(textOf).join('')
    const syllabic = textAt(lyric, 'syllabic')
    const extendElement = childOf(lyric, 'extend')
    const extend: Lyric['extend'] =
      extendElement === undefined
        ? undefined
        : extendElement.attrs.type === 'stop'
          ? 'stop'
          : extendElement.attrs.type === 'continue'
            ? 'continue'
            : 'start'
    if (words === '' && extend === undefined) return []
    return [
      {
        number,
        ...(words === ''
          ? {}
          : {
              syllable: {
                text: words,
                hyphen: syllabic === 'begin' || syllabic === 'middle',
                held: 0,
              },
            }),
        ...(extend ? { extend: words === '' ? extend : ('start' as const) } : {}),
      },
    ]
  })
  return {
    kind: 'note',
    ticks,
    staff,
    voice,
    chord,
    grace,
    appoggiatura: grace && graceElement.attrs.slash !== 'yes',
    midi,
    spelled: { letter: step as Letter, accidental },
    ...(finger ? { finger } : {}),
    marks,
    lyrics,
    tieStart,
    tieStop,
    leftOut,
  }
}

/** Notes tied on joined into the note they go on from: one note held their length. */
function joinTies(notes: readonly Building[]): Building[] {
  const open = new Map<string, Building>()
  const kept: Building[] = []
  for (const n of [...notes].sort((a, b) => a.startTick - b.startTick)) {
    const id = `${n.staff} ${n.midi}`
    const from = open.get(id)
    if (n.tieStop && from && from.startTick + from.durationTicks === n.startTick) {
      from.durationTicks += n.durationTicks
      if (n.marks.slurEnd) from.marks.slurEnd = true
      if (!n.tieStart) open.delete(id)
      continue
    }
    kept.push(n)
    if (n.tieStart) open.set(id, n)
    else open.delete(id)
  }
  return kept
}

/** Each direction's marks on the first note on its staff from where it stands; the chord's notes alike. */
function applyDirections(notes: readonly Building[], pending: readonly Pending[]) {
  const byStaff = new Map<number, Building[]>()
  for (const n of notes) byStaff.set(n.staff, [...(byStaff.get(n.staff) ?? []), n])
  for (const { staff, tick, marks } of pending) {
    const onStaff = byStaff.get(staff) ?? []
    const first = onStaff.find((n) => n.startTick >= tick)
    if (!first) continue
    for (const n of onStaff)
      if (n.startTick === first.startTick && n.voice === first.voice) Object.assign(n.marks, marks)
  }
}

/**
 * The syllables onto the notes that sing them, by verse: a syllable's extender held over the notes
 * that carry its extender on, or, in a file that writes none, over the notes after it that sing nothing.
 */
function withLyrics(notes: readonly Building[], read: ReadNote[]) {
  const sings = notes.map((n, i) => ({ n, i })).filter(({ n }) => n.lyrics.length > 0)
  if (sings.length === 0) return
  const explicit = notes.some((n) =>
    n.lyrics.some((lyric) => lyric.extend === 'continue' || lyric.extend === 'stop'),
  )
  const byVoice = new Map<string, number[]>()
  notes.forEach((n, i) => {
    const onsets = byVoice.get(n.voice) ?? []
    const lastAt = onsets.at(-1)
    if (lastAt === undefined || notes[lastAt]?.startTick !== n.startTick) onsets.push(i)
    else if (n.lyrics.length > 0) onsets[onsets.length - 1] = i
    byVoice.set(n.voice, onsets)
  })
  for (const onsets of byVoice.values()) {
    if (!onsets.some((i) => (notes[i]?.lyrics.length ?? 0) > 0)) continue
    const verses = Math.max(
      ...onsets.flatMap((i) => notes[i]?.lyrics.map((lyric) => lyric.verse + 1) ?? []),
    )
    onsets.forEach((i, place) => {
      const n = notes[i]
      if (!n || !n.lyrics.some((lyric) => lyric.syllable)) return
      const lyrics: (Syllable | null)[] = Array.from({ length: verses }, () => null)
      for (const lyric of n.lyrics) {
        if (!lyric.syllable) continue
        let held = 0
        if (lyric.extend === 'start') {
          let end = n.startTick + n.durationTicks
          for (const next of onsets.slice(place + 1)) {
            const on = notes[next]
            const at = on?.lyrics.find((each) => each.verse === lyric.verse)
            if (!on || at?.syllable) break
            if (at?.extend === 'continue') held += 1
            else if (at?.extend === 'stop') {
              held += 1
              break
            } else if (explicit || on.startTick > end) break
            else {
              // An extender of no end: over the notes of its slur, up to a rest.
              held += 1
              if (on.marks.slurEnd) break
            }
            end = on.startTick + on.durationTicks
          }
        }
        lyrics[lyric.verse] = { ...lyric.syllable, held }
      }
      while (lyrics.length > 0 && lyrics.at(-1) === null) lyrics.pop()
      const target = read[i]
      if (target && lyrics.length > 0) read[i] = { ...target, lyrics }
    })
  }
}
