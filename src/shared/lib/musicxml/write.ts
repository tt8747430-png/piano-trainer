// A written Score as MusicXML 4.0 (partwise): what another notation app opens as the score.

import {
  CLEF_FORMS,
  EXPRESSION_TEXT,
  keySignature,
  meterOf,
  meterSymbol,
  parseChordSymbol,
  tempoMark,
  beatUnit,
  writtenOctave,
  type Clef,
  type Jump,
  type Midi,
  type SpelledNote,
  type NoteLyrics,
  type NoteMarks,
  type TempoUnit,
  type TimeSignature,
} from '@/shared/lib/music'
import {
  barStartOf,
  beamPlan,
  clefIn,
  isSingleStaff,
  ticksOf,
  type Measure,
  type Score,
  type ScoreEvent,
  type StaffId,
} from '@/shared/lib/notation'
import { harmonyXml } from './harmony'
import { tag, text } from './xml'

/** What a score is written with besides its music. */
export interface MusicXmlOptions {
  readonly title?: string
  /** Who wrote the music, and the words. */
  readonly composer?: string
  readonly lyricist?: string
  /** Each single staff's own name, top down; none prints none. */
  readonly staffNames?: readonly (string | undefined)[]
  /** The piano's part's name, printed over its brace as the app's score prints it. */
  readonly pianoName?: string
  /** The piano's staves kept and not printed: a lead sheet's (ADR 0114). */
  readonly pianoHidden?: boolean
  /** Rehearsal marks over the measures they stand at: each section's heading. */
  readonly headings?: readonly { readonly measure: number; readonly text: string }[]
  /** The measures a new line (system) starts at, past the first. */
  readonly lineStarts?: readonly number[]
  /** The app's own data, which the music cannot say, kept for the app to read the file back by. */
  readonly appData?: string
  /** The software named as the file's maker. */
  readonly software?: string
}

/** The name the app's data is kept under in the file's identification. */
export const APP_FIELD = 'piano-trainer'

const TYPES: Readonly<Record<number, string>> = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: '16th',
  32: '32nd',
}

const ARTICULATIONS: Readonly<Partial<Record<string, string>>> = {
  staccato: 'staccato',
  staccatissimo: 'staccatissimo',
  accent: 'accent',
  tenuto: 'tenuto',
  marcato: 'strong-accent',
}

const ORNAMENTS: Readonly<Record<string, string>> = {
  trill: '<trill-mark/>',
  mordent: '<inverted-mordent/>',
  'lower-mordent': '<mordent/>',
  turn: '<turn/>',
  tremolo: '<tremolo type="single">3</tremolo>',
}

/** Each jump as printed, and how a player's sound takes it. */
export const JUMP_WORDS: Readonly<Record<Jump, { text: string; sound: Record<string, string> }>> = {
  dc: { text: 'D.C.', sound: { dacapo: 'yes' } },
  'dc-fine': { text: 'D.C. al Fine', sound: { dacapo: 'yes' } },
  'dc-coda': { text: 'D.C. al Coda', sound: { dacapo: 'yes' } },
  ds: { text: 'D.S.', sound: { dalsegno: 'segno' } },
  'ds-fine': { text: 'D.S. al Fine', sound: { dalsegno: 'segno' } },
  'ds-coda': { text: 'D.S. al Coda', sound: { dalsegno: 'segno' } },
}

/** A tempo unit as a metronome mark's beat unit, a dot after it where dotted. */
const beatUnitXml = (unit: TempoUnit) =>
  text('beat-unit', TYPES[Number.parseInt(unit, 10)] ?? 'quarter') +
  (unit.endsWith('.') ? '<beat-unit-dot/>' : '')

function clefXml(clef: Clef, number?: number): string {
  const { shape, line, octaves } = CLEF_FORMS[clef]
  return tag(
    'clef',
    { number },
    text('sign', shape),
    text('line', line),
    octaves === 0 ? '' : text('clef-octave-change', octaves),
  )
}

/** A part: one single staff, or the piano's two. */
interface Part {
  readonly id: string
  readonly staves: readonly StaffId[]
  readonly name: string
  readonly printed: boolean
}

/**
 * A Score as MusicXML 4.0, partwise (ADR 0107): each single staff a part, the piano's grand staff
 * one part of two staves; a measure's attributes where they change (key, time, the clefs); each
 * voice's notes and rests with their values, dots, triplets, ties, beams, accidentals, fingers,
 * articulations, ornaments, arpeggios, grace notes and slurs, its words as lyrics; dynamics,
 * hairpins, octave lines, the pedal, expressions and the tempo as directions; chord symbols as
 * harmony; repeats, endings, double and final barlines, the signs and jumps; section headings as
 * rehearsal marks and each line a system.
 */
export function scoreToMusicXml(score: Score, options: MusicXmlOptions = {}): string {
  const single = score.staves.filter(isSingleStaff)
  const piano = score.staves.filter((staff) => !isSingleStaff(staff))
  const parts: Part[] = [
    ...single.map((staff, place) => {
      const name = options.staffNames?.[place]
      return { id: `P${place + 1}`, staves: [staff], name: name ?? '', printed: name !== undefined }
    }),
    ...(piano.length > 0
      ? [
          {
            id: `P${single.length + 1}`,
            staves: piano,
            name: options.pianoName ?? '',
            printed: options.pianoName !== undefined && options.pianoName !== '',
          },
        ]
      : []),
  ]
  const partList = parts
    .map((part) =>
      tag(
        'score-part',
        { id: part.id },
        part.printed
          ? text('part-name', part.name)
          : tag('part-name', { 'print-object': 'no' }, escapeText(part.name)),
        part.staves.length > 1
          ? tag('score-instrument', { id: `${part.id}-I1` }, text('instrument-name', part.name)) +
              tag(
                'midi-instrument',
                { id: `${part.id}-I1` },
                text('midi-channel', 1),
                text('midi-program', 1),
              )
          : '',
      ),
    )
    .join('')
  const creators = [
    options.composer ? tag('creator', { type: 'composer' }, escapeText(options.composer)) : '',
    options.lyricist ? tag('creator', { type: 'lyricist' }, escapeText(options.lyricist)) : '',
  ].join('')
  const identification = tag(
    'identification',
    {},
    creators,
    tag(
      'encoding',
      {},
      options.software ? text('software', options.software) : '',
      tag('supports', { element: 'accidental', type: 'yes' }),
      tag('supports', { element: 'beam', type: 'yes' }),
      tag('supports', { element: 'stem', type: 'no' }),
    ),
    options.appData === undefined
      ? ''
      : tag(
          'miscellaneous',
          {},
          tag('miscellaneous-field', { name: APP_FIELD }, escapeText(options.appData)),
        ),
  )
  const body = parts.map((part, index) => new PartWriter(score, part, index === 0, options).write())
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
    '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">',
    '<score-partwise version="4.0">',
    options.title ? tag('work', {}, text('work-title', options.title)) : '',
    options.title ? text('movement-title', options.title) : '',
    identification,
    tag('part-list', {}, partList),
    ...body,
    '</score-partwise>',
    '',
  ].join('\n')
}

const escapeText = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** What runs on past a note in a staff: a slur, a hairpin, an octave line. */
interface Open {
  slur: boolean
  hairpin: boolean
  octave: boolean
}

/** One part's measures, what runs across their barlines (ties, slurs, lines, held words) held between them. */
class PartWriter {
  /** Keys tied on from the event before, by voice. */
  private readonly tied = new Map<string, Set<number>>()
  private readonly open = new Map<StaffId, Open>()
  /** By verse, how many more notes the last syllable is held over. */
  private readonly held = new Map<number, number>()
  /** By verse, whether the last syllable's word goes on. */
  private readonly words = new Map<number, boolean>()
  /** The voice the words are sung in: the first whose notes carry them. */
  private sung: string | undefined
  /** Divisions a quarter: the score's ticks of one. */
  private readonly divisions: number

  constructor(
    private readonly score: Score,
    private readonly part: Part,
    private readonly top: boolean,
    private readonly options: MusicXmlOptions,
  ) {
    this.divisions = ticksOf({ value: 4, dots: 0, triplet: false }, score.meter)
  }

  write(): string {
    const pickup = this.isPickup()
    const measures = this.score.measures.map((measure, index) =>
      this.measure(measure, index, pickup ? index : index + 1),
    )
    return tag('part', { id: this.part.id }, ...measures)
  }

  private isPickup(): boolean {
    const first = this.score.measures[0]
    if (!first) return false
    return first.ticks < first.time.count * this.unitTicks(first.time)
  }

  private unitTicks(time: TimeSignature) {
    return ticksOf({ value: time.unit, dots: 0, triplet: false }, this.score.meter)
  }

  private staffNumber(staff: StaffId) {
    return this.part.staves.length > 1 ? this.part.staves.indexOf(staff) + 1 : undefined
  }

  private measure(measure: Measure, index: number, number: number): string {
    const before = this.score.measures[index - 1]
    const out: string[] = []
    if (this.options.lineStarts?.includes(index) && index > 0)
      out.push(tag('print', { 'new-system': 'yes' }))
    const ending = this.score.measures[index - 1]?.ending
    const left = [
      measure.repeatStart ? tag('bar-style', {}, 'heavy-light') : '',
      measure.ending !== undefined && measure.ending !== ending
        ? tag('ending', { number: measure.ending, type: 'start' }, `${measure.ending}.`)
        : '',
      measure.repeatStart ? tag('repeat', { direction: 'forward' }) : '',
    ].join('')
    if (left) out.push(tag('barline', { location: 'left' }, left))
    out.push(this.attributes(measure, before))
    if (this.top) out.push(...this.headDirections(measure, index))
    const staves = this.part.staves
    const voices = staves.flatMap((staff, s) =>
      (measure.staves[staff] ?? []).map((voice, v) => ({ staff, voice, number: s * 4 + v + 1 })),
    )
    voices.forEach(({ staff, voice, number }, at) => {
      out.push(...this.voice(voice.events, measure, staff, number, at === 0 && this.top))
      if (at < voices.length - 1) {
        const length = voice.events.reduce(
          (sum, event) => sum + ticksOf(event.duration, this.score.meter),
          0,
        )
        out.push(tag('backup', {}, text('duration', length)))
      }
    })
    if (this.top) out.push(...this.endDirections(measure))
    if (index === this.score.measures.length - 1) out.push(...this.closeAll())
    const next = this.score.measures[index + 1]
    const right = [
      measure.barline === 'repeat' || measure.barline === 'final'
        ? tag('bar-style', {}, 'light-heavy')
        : measure.barline === 'double'
          ? tag('bar-style', {}, 'light-light')
          : '',
      measure.ending !== undefined && next?.ending !== measure.ending
        ? tag('ending', {
            number: measure.ending,
            type: measure.barline === 'repeat' ? 'stop' : 'discontinue',
          })
        : '',
      measure.barline === 'repeat' ? tag('repeat', { direction: 'backward' }) : '',
    ].join('')
    if (right) out.push(tag('barline', { location: 'right' }, right))
    return tag('measure', { number, ...(number === 0 ? { implicit: 'yes' } : {}) }, ...out)
  }

  private attributes(measure: Measure, before: Measure | undefined): string {
    const keyOf = (m: Measure) => m.key ?? this.score.key
    const key = keyOf(measure)
    const keyXml =
      !before ||
      keySignature(keyOf(before)) !== keySignature(key) ||
      keyOf(before).minor !== key.minor
        ? tag(
            'key',
            {},
            text('fifths', keySignature(key)),
            text('mode', key.minor ? 'minor' : 'major'),
          )
        : ''
    const time = measure.time
    const timeChanged =
      !before || before.time.count !== time.count || before.time.unit !== time.unit
    const meter = meterOf(time.count, time.unit)
    const symbol = this.score.timeSymbol && meter ? meterSymbol(meter) : null
    const timeXml = timeChanged
      ? tag(
          'time',
          { symbol: symbol === 'common' ? 'common' : symbol === 'cut' ? 'cut' : undefined },
          text('beats', time.count),
          text('beat-type', time.unit),
        )
      : ''
    const clefs = this.part.staves
      .filter((staff) => !before || clefIn(before, staff) !== clefIn(measure, staff))
      .map((staff) => clefXml(clefIn(measure, staff), this.staffNumber(staff)))
      .join('')
    const hidden =
      !before && this.options.pianoHidden && this.part.staves.length > 1
        ? this.part.staves
            .map((_, s) => tag('staff-details', { number: s + 1, 'print-object': 'no' }))
            .join('')
        : ''
    if (!keyXml && !timeXml && !clefs && before) return ''
    return tag(
      'attributes',
      {},
      before ? '' : text('divisions', this.divisions),
      keyXml,
      timeXml,
      !before && this.part.staves.length > 1 ? text('staves', this.part.staves.length) : '',
      clefs,
      hidden,
    )
  }

  /** What stands over a measure's start: its heading, the tempo, a sign. */
  private headDirections(measure: Measure, index: number): string[] {
    const out: string[] = []
    const heading = this.options.headings?.find((each) => each.measure === index)
    if (heading) out.push(direction('above', tag('rehearsal', {}, escapeText(heading.text))))
    if (measure.tempo !== undefined) {
      const unit = this.score.tempoUnit ?? beatUnit(this.score.meter)
      const mark = tempoMark(measure.tempo, unit, this.score.meter)
      const quarters = (measure.tempo * 24) / this.divisions
      out.push(
        direction(
          'above',
          tag('metronome', {}, beatUnitXml(unit), text('per-minute', mark)),
          tag('sound', { tempo: round(quarters) }),
        ),
      )
    }
    if (measure.segno) out.push(direction('above', '<segno/>', tag('sound', { segno: 'segno' })))
    if (measure.coda) out.push(direction('above', '<coda/>', tag('sound', { coda: 'coda' })))
    return out
  }

  /** What stands at a measure's end: Fine, To Coda, a jump. */
  private endDirections(measure: Measure): string[] {
    const words = (value: string, sound: Record<string, string>) =>
      direction(
        'above',
        tag('words', { 'font-style': 'italic' }, escapeText(value)),
        tag('sound', sound),
      )
    return [
      measure.fine ? words('Fine', { fine: 'yes' }) : '',
      measure.toCoda ? words('To Coda', { tocoda: 'coda' }) : '',
      measure.jump ? words(JUMP_WORDS[measure.jump].text, JUMP_WORDS[measure.jump].sound) : '',
    ].filter(Boolean)
  }

  /** Every line still running at the music's end, stopped. */
  private closeAll(): string[] {
    const out: string[] = []
    for (const [staff, open] of this.open) {
      const number = this.staffNumber(staff)
      if (open.octave)
        out.push(
          direction(undefined, tag('octave-shift', { type: 'stop', size: 8 }), staffXml(number)),
        )
      if (open.hairpin)
        out.push(direction(undefined, tag('wedge', { type: 'stop' }), staffXml(number)))
      open.octave = false
      open.hairpin = false
    }
    return out
  }

  private voice(
    events: readonly ScoreEvent[],
    measure: Measure,
    staff: StaffId,
    voice: number,
    chords: boolean,
  ): string[] {
    const { beams, tuplets } = beamPlan(
      events,
      this.score.meter,
      measure.time,
      barStartOf(measure, this.score.meter),
    )
    const beamOf = (index: number) => {
      const beam = beams.find((group) => group.includes(index))
      if (!beam) return undefined
      return beam[0] === index ? 'begin' : beam.at(-1) === index ? 'end' : 'continue'
    }
    const tupletOf = (index: number) => {
      const tuplet = tuplets.find((group) => group.includes(index))
      if (!tuplet || tuplet.length < 2) return undefined
      return tuplet[0] === index ? 'start' : tuplet.at(-1) === index ? 'stop' : undefined
    }
    const out: string[] = []
    const harmonies = chords ? [...measure.chords] : []
    const whole = events.length === 1 && events[0]?.kind === 'rest'
    events.forEach((event, index) => {
      const length = ticksOf(event.duration, this.score.meter)
      while (harmonies[0] && harmonies[0].tick < event.tick + length) {
        const chord = harmonies.shift()
        if (!chord) break
        out.push(harmonyXml(parseChordSymbol(chord.symbol), Math.max(0, chord.tick - event.tick)))
      }
      out.push(...this.event(event, staff, voice, length, beamOf(index), tupletOf(index), whole))
    })
    return out
  }

  private event(
    event: ScoreEvent,
    staff: StaffId,
    voice: number,
    length: number,
    beam: string | undefined,
    tuplet: 'start' | 'stop' | undefined,
    whole: boolean,
  ): string[] {
    const number = this.staffNumber(staff)
    const key = `${staff} ${voice}`
    const tied = this.tied.get(key) ?? new Set<number>()
    this.tied.set(key, tied)
    const type = TYPES[event.duration.value] ?? 'quarter'
    const dots = '<dot/>'.repeat(event.duration.dots)
    const modification = event.duration.triplet
      ? tag('time-modification', {}, text('actual-notes', 3), text('normal-notes', 2))
      : ''
    if (event.kind === 'rest') {
      tied.clear()
      const measureRest = whole && !event.hidden
      return [
        tag(
          'note',
          { 'print-object': event.hidden ? 'no' : undefined },
          measureRest ? tag('rest', { measure: 'yes' }) : '<rest/>',
          text('duration', length),
          text('voice', voice),
          measureRest ? '' : text('type', type) + dots,
          modification,
          number === undefined ? '' : text('staff', number),
          tuplet ? tag('notations', {}, tag('tuplet', { type: tuplet, bracket: 'yes' })) : '',
        ),
      ]
    }
    const marks = event.marks
    const out: string[] = [...this.directions(marks, staff)]
    for (const grace of marks?.grace ?? [])
      out.push(
        tag(
          'note',
          {},
          tag('grace', grace.appoggiatura ? {} : { slash: 'yes' }),
          pitchXml(grace.midi, grace.spelled),
          text('voice', voice),
          text('type', 'eighth'),
          grace.spelled.accidental === 0 ? '' : accidentalXml(grace.spelled.accidental),
          number === undefined ? '' : text('staff', number),
        ),
      )
    // A note tied on from the one before sings nothing and holds no syllable on.
    const continued = event.notes.every((written) => tied.has(written.midi))
    if (event.lyrics) this.sung ??= key
    const lyrics = event.lyrics
      ? this.lyrics(event.lyrics)
      : this.sung === key && !continued
        ? this.heldOn()
        : ''
    event.notes.forEach((written, i) => {
      const ends = tied.delete(written.midi)
      if (written.tie) tied.add(written.midi)
      const first = i === 0
      const notations = [
        ends ? tag('tied', { type: 'stop' }) : '',
        written.tie ? tag('tied', { type: 'start' }) : '',
        first ? this.slurs(marks, staff, number) : '',
        first && tuplet ? tag('tuplet', { type: tuplet, bracket: 'yes' }) : '',
        first && marks?.ornament ? tag('ornaments', {}, ORNAMENTS[marks.ornament] ?? '') : '',
        written.finger === undefined ? '' : tag('technical', {}, text('fingering', written.finger)),
        first ? articulationsXml(marks) : '',
        first && marks?.articulations?.includes('fermata')
          ? tag('fermata', { type: 'upright' })
          : '',
        marks?.arpeggio ? '<arpeggiate/>' : '',
      ].join('')
      out.push(
        tag(
          'note',
          {},
          first ? '' : '<chord/>',
          pitchXml(written.midi, written.spelled),
          text('duration', length),
          ends ? tag('tie', { type: 'stop' }) : '',
          written.tie ? tag('tie', { type: 'start' }) : '',
          text('voice', voice),
          text('type', type),
          dots,
          written.accidental === null ? '' : accidentalXml(written.accidental),
          modification,
          number === undefined ? '' : text('staff', number),
          first && beam ? tag('beam', { number: 1 }, beam) : '',
          notations ? tag('notations', {}, notations) : '',
          first ? lyrics : '',
        ),
      )
    })
    return out
  }

  /** A note's marks that stand under or over it as directions, before it. */
  private directions(marks: NoteMarks | undefined, staff: StaffId): string[] {
    const number = this.staffNumber(staff)
    const open = this.open.get(staff) ?? { slur: false, hairpin: false, octave: false }
    this.open.set(staff, open)
    const out: string[] = []
    const below = 'below'
    if (open.octave && marks?.octave === undefined) {
      out.push(
        direction(undefined, tag('octave-shift', { type: 'stop', size: 8 }), staffXml(number)),
      )
      open.octave = false
    }
    if (marks?.octave && !open.octave) {
      // 8va writes the notes an octave below where they sound: MusicXML's shift down.
      out.push(
        direction(
          marks.octave === '8va' ? 'above' : 'below',
          tag('octave-shift', { type: marks.octave === '8va' ? 'down' : 'up', size: 8 }),
          staffXml(number),
        ),
      )
      open.octave = true
    }
    if (!marks) return out
    if (marks.dynamic)
      out.push(direction(below, tag('dynamics', {}, `<${marks.dynamic}/>`), staffXml(number)))
    if (marks.hairpin) {
      if (open.hairpin) out.push(direction(below, tag('wedge', { type: 'stop' }), staffXml(number)))
      if (marks.hairpin !== 'end')
        out.push(
          direction(
            below,
            tag('wedge', { type: marks.hairpin === 'cresc' ? 'crescendo' : 'diminuendo' }),
            staffXml(number),
          ),
        )
      open.hairpin = marks.hairpin !== 'end'
    }
    if (marks.expression)
      out.push(
        direction(
          'above',
          tag('words', { 'font-style': 'italic' }, escapeText(EXPRESSION_TEXT[marks.expression])),
          staffXml(number),
        ),
      )
    if (marks.pedal)
      out.push(
        direction(
          'below',
          tag('pedal', {
            type: marks.pedal === 'down' ? 'start' : marks.pedal === 'up' ? 'stop' : 'change',
            line: 'yes',
          }),
          staffXml(number),
        ),
      )
    return out
  }

  private slurs(marks: NoteMarks | undefined, staff: StaffId, number: number | undefined): string {
    const open = this.open.get(staff)
    if (!open || !marks) return ''
    const out: string[] = []
    const n = number ?? 1
    if (marks.slurEnd && open.slur) {
      out.push(tag('slur', { type: 'stop', number: n }))
      open.slur = false
    }
    if (marks.slurStart) {
      out.push(tag('slur', { type: 'start', number: n }))
      open.slur = true
    }
    return out.join('')
  }

  /**
   * A note's syllables as lyrics, by verse: each with its place in its word, an extender from one
   * held over the notes after it.
   */
  private lyrics(lyrics: NoteLyrics): string {
    const verses = Math.max(lyrics.length, ...[...this.held.keys()].map((verse) => verse + 1))
    return Array.from({ length: verses }, (_, verse) => {
      const syllable = lyrics[verse] ?? null
      if (!syllable) return this.extended(verse)
      const open = this.words.get(verse) ?? false
      this.words.set(verse, syllable.hyphen)
      this.held.set(verse, syllable.held)
      const syllabic = open
        ? syllable.hyphen
          ? 'middle'
          : 'end'
        : syllable.hyphen
          ? 'begin'
          : 'single'
      return tag(
        'lyric',
        { number: verse + 1 },
        text('syllabic', syllabic),
        text('text', syllable.text),
        syllable.held > 0 ? tag('extend', { type: 'start' }) : '',
      )
    }).join('')
  }

  /** The extenders a note under held syllables carries, where it sings none. */
  private heldOn(): string {
    return [...this.held.keys()].map((verse) => this.extended(verse)).join('')
  }

  private extended(verse: number): string {
    const left = this.held.get(verse) ?? 0
    if (left <= 0) return ''
    this.held.set(verse, left - 1)
    return tag(
      'lyric',
      { number: verse + 1 },
      tag('extend', { type: left === 1 ? 'stop' : 'continue' }),
    )
  }
}

const round = (value: number) => Math.round(value * 100) / 100

const staffXml = (number: number | undefined) => (number === undefined ? '' : text('staff', number))

function direction(
  placement: 'above' | 'below' | undefined,
  type: string,
  ...rest: string[]
): string {
  return tag('direction', { placement }, tag('direction-type', {}, type), ...rest)
}

function pitchXml(midi: Midi, spelled: SpelledNote): string {
  return tag(
    'pitch',
    {},
    text('step', spelled.letter),
    spelled.accidental === 0 ? '' : text('alter', spelled.accidental),
    text('octave', writtenOctave(midi, spelled)),
  )
}

const ACCIDENTALS: Readonly<Record<number, string>> = {
  [-2]: 'flat-flat',
  [-1]: 'flat',
  0: 'natural',
  1: 'sharp',
  2: 'double-sharp',
}

const accidentalXml = (accidental: number) =>
  text('accidental', ACCIDENTALS[accidental] ?? 'natural')

function articulationsXml(marks: NoteMarks | undefined): string {
  const written = (marks?.articulations ?? []).flatMap((articulation) => {
    const name = ARTICULATIONS[articulation]
    return name ? [`<${name}/>`] : []
  })
  return written.length > 0 ? tag('articulations', {}, ...written) : ''
}
