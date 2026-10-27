import {
  EXPRESSION_TEXT,
  keySignature,
  meterOf,
  meterSymbol,
  type Accidental,
  type Articulation,
  type Barline,
  type Clef,
  type Jump,
  type NoteLyrics,
  type NoteMarks,
  type Ornament,
  type TimeSignature,
  beatUnit,
  CLEF_FORMS,
  tempoMark,
  unitNote,
} from '@/shared/lib/music'
import {
  clefIn,
  isSingleStaff,
  type Measure,
  type Score,
  type ScoreEvent,
  type SingleStaff,
  type StaffId,
} from './types'
import { barStartOf, beamPlan } from './beams'
import { ticksOf } from './values'

/** What a Score is written as besides its music. */
export interface MeiOptions {
  /** Its title, in the header (a page's). */
  readonly title?: string
  /** The staves drawn, of those it writes, top down: every one by default. */
  readonly staves?: readonly StaffId[]
  /** Each note's finger, over the right hand's and the tune's notes, under the left's. */
  readonly fingers?: boolean
  /** The chord symbols, over the top staff (a page drawn whole; a sheet's lines say them in their own row). */
  readonly chordSymbols?: boolean
  /** The time in force before the first measure: a line that goes on prints its time only where it changes. */
  readonly timeBefore?: TimeSignature | undefined
  /**
   * What the next line starts in, its first measure's key, time and clefs: what changes there is
   * printed after this line's last barline, a courtesy signature as LilyPond and MuseScore print one.
   */
  readonly next?: NextLine | undefined
  /** The staves' names, printed at the line's head (a score's first line, ADR 0094). */
  readonly labels?: StaffLabels | undefined
}

/**
 * A staff's name as printed at a line's head (ADR 0094, 0097): the learner's, or a placeholder (the
 * editor's, for a staff with none, so it has a name to click) printed soft, in italics.
 */
export interface PrintedName {
  readonly text: string
  readonly placeholder?: boolean
}

/** The names a score's staves are printed with: each single staff's, and the piano's over its two. */
export type StaffLabels = Readonly<Partial<Record<SingleStaff | 'piano', PrintedName>>>

/** What a line starts in, as the line before it ends with a courtesy signature where it changes. */
export type NextLine = Pick<Measure, 'key' | 'time' | 'clefs'>

/**
 * A Score as MEI 5 (ADR 0078), the encoding Verovio engraves: one staff per staff drawn, the piano's
 * two braced; each measure's voices as layers, eighths and shorter beamed by the beat, triplets in
 * tuplets, ties across barlines; its key, time and clef changes, barlines, repeats and endings, the
 * signs and jumps, the tempo; each note's marks: articulations, ornaments, arpeggios, grace notes,
 * slurs, dynamics, hairpins, octave lines, the pedal, expressions and fingers; the tune's syllables as
 * verses under their notes (ADR 0093); the staves' names where asked (ADR 0094). Every measure is named
 * `m-<index>`, every chord `c-<staff>-<tick>`, note `n-<staff>-<tick>-<i>` and rest
 * `r-<staff>-<tick>`, so the drawing is read back by them: where each bar and onset stands, a bar
 * tapped, the notes chosen or playing.
 */
export function scoreToMei(score: Score, options: MeiOptions = {}): string {
  const { title = '', timeBefore, labels = {} } = options
  const staves = (options.staves ?? score.staves).filter((staff) => score.staves.includes(staff))
  const number = (staff: StaffId) => staves.indexOf(staff) + 1
  const piano: readonly StaffId[] = staves.filter((staff) => !isSingleStaff(staff))
  const single = staves.filter(isSingleStaff)
  const first = score.measures[0]
  // A single staff's own name; the piano's over its brace, or on its one staff drawn.
  const nameOf = (staff: StaffId) =>
    isSingleStaff(staff) ? labels[staff] : piano.length === 1 ? labels.piano : undefined
  const staffDef = (staff: StaffId) => {
    const attrs = `n="${number(staff)}" lines="5" ${clefAttrs(clefIn(first ?? {}, staff))}`
    const name = nameOf(staff)
    return name === undefined
      ? `<staffDef ${attrs}/>`
      : `<staffDef ${attrs}>${label(name)}</staffDef>`
  }
  const time = first?.time ?? null
  const continues =
    timeBefore !== undefined &&
    time !== null &&
    timeBefore.count === time.count &&
    timeBefore.unit === time.unit
  const scoreDef = `<scoreDef ${meterAttrs(time, score)}${continues ? ' meter.visible="false"' : ''} key.sig="${keySig(
    keySignature(first?.key ?? score.key),
  )}"><staffGrp>${single.map(staffDef).join('')}${
    piano.length > 1
      ? `<staffGrp symbol="brace" bar.thru="true">${
          labels.piano === undefined ? '' : label(labels.piano)
        }${piano.map(staffDef).join('')}</staffGrp>`
      : piano.length > 0
        ? piano.map(staffDef).join('')
        : ''
  }</staffGrp></scoreDef>`

  const writer = new Writer(score, staves, options)
  const body: string[] = []
  let ending: number | undefined
  score.measures.forEach((measure, index) => {
    if (measure.ending !== ending) {
      if (ending !== undefined) body.push('</ending>')
      if (measure.ending !== undefined) body.push(`<ending n="${measure.ending}">`)
      ending = measure.ending
    }
    const before = score.measures[index - 1]
    const changes = before ? changedAttrs(score, measure, before) : ''
    if (changes) body.push(`<scoreDef${changes}/>`)
    body.push(writer.measure(measure, index))
  })
  if (ending !== undefined) body.push('</ending>')
  const last = score.measures.at(-1)
  if (options.next && last) body.push(courtesy(score, last, options.next, staves))

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0">',
    `<meiHead><fileDesc><titleStmt><title>${escape(title)}</title></titleStmt><pubStmt/></fileDesc></meiHead>`,
    '<music><body><mdiv><score>',
    scoreDef,
    // The line is a system of its own (ADR 0114): Verovio lays out a justified line by its encoded
    // breaks, and warns of none where it has none.
    `<section><sb/>${body.join('')}</section>`,
    '</score></mdiv></body></music></mei>',
  ].join('\n')
}

const ACCID: Readonly<Record<Accidental, string>> = {
  [-2]: 'ff',
  [-1]: 'f',
  0: 'n',
  1: 's',
  2: 'x',
}
const ARTIC: Readonly<Partial<Record<Articulation, string>>> = {
  staccato: 'stacc',
  staccatissimo: 'stacciss',
  accent: 'acc',
  tenuto: 'ten',
  marcato: 'marc',
}
const RIGHT: Readonly<Record<Barline, string>> = { double: 'dbl', final: 'end', repeat: 'rptend' }
const JUMP_TEXT: Readonly<Record<Jump, string>> = {
  dc: 'D.C.',
  'dc-fine': 'D.C. al Fine',
  'dc-coda': 'D.C. al Coda',
  ds: 'D.S.',
  'ds-fine': 'D.S. al Fine',
  'ds-coda': 'D.S. al Coda',
}

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A staff's name as Verovio prints it at the line's head, smaller than its words; a placeholder in italics. */
const label = ({ text, placeholder }: PrintedName) =>
  `<label><rend fontsize="small"${placeholder ? ' fontstyle="italic"' : ''}>${escape(text)}</rend></label>`

const keySig = (fifths: number) =>
  fifths === 0 ? '0' : `${Math.abs(fifths)}${fifths > 0 ? 's' : 'f'}`

/** A clef's attributes (ADR 0114): its sign and line, and an octave clef's 8 or 15 above or below. */
function clefAttrs(clef: Clef, prefix = 'clef.'): string {
  const { shape, line, octaves } = CLEF_FORMS[clef]
  const dis =
    octaves === 0
      ? ''
      : ` ${prefix}dis="${Math.abs(octaves) === 2 ? 15 : 8}" ${prefix}dis.place="${octaves > 0 ? 'above' : 'below'}"`
  return `${prefix}shape="${shape}" ${prefix}line="${line}"${dis}`
}

/**
 * A time signature's attributes: its figures, 4/4 as common time's C and 2/2 as cut time's ¢ where
 * the score asks (ADR 0114).
 */
const meterAttrs = (time: TimeSignature | null, score: Pick<Score, 'meter' | 'timeSymbol'>) => {
  const [count = '', unit = ''] = score.meter.split('/')
  const figures = { count: String(time?.count ?? count), unit: String(time?.unit ?? unit) }
  const meter = meterOf(Number(figures.count), Number(figures.unit))
  const symbol = score.timeSymbol && meter ? meterSymbol(meter) : null
  return `meter.count="${figures.count}" meter.unit="${figures.unit}"${symbol ? ` meter.sym="${symbol}"` : ''}`
}

/** A scoreDef's attributes for a measure whose time or key is not the one before's: none where both go on. */
function changedAttrs(score: Score, measure: NextLine, before: NextLine): string {
  const time =
    before.time.count !== measure.time.count || before.time.unit !== measure.time.unit
      ? ` ${meterAttrs(measure.time, score)}`
      : ''
  const keyOf = (m: NextLine) => keySignature(m.key ?? score.key)
  const key = keyOf(before) !== keyOf(measure) ? ` key.sig="${keySig(keyOf(measure))}"` : ''
  return `${time}${key}`
}

/**
 * The courtesy signature after a line's last barline: the key, time and clefs the next line changes
 * to. Verovio prints one only at a system's end with a measure after it, so the next line's
 * signature and an empty measure of it follow on a page of their own, which is never drawn (a line
 * is its first page).
 */
function courtesy(score: Score, last: Measure, next: NextLine, staves: readonly StaffId[]): string {
  const attrs = changedAttrs(score, next, last)
  const clefs = staves
    .map((staff, index) =>
      clefIn(last, staff) === clefIn(next, staff)
        ? ''
        : `<staffDef n="${index + 1}" ${clefAttrs(clefIn(next, staff))}/>`,
    )
    .join('')
  if (!attrs && !clefs) return ''
  const def = clefs
    ? `<scoreDef${attrs}><staffGrp>${clefs}</staffGrp></scoreDef>`
    : `<scoreDef${attrs}/>`
  const empty = staves
    .map((_, index) => `<staff n="${index + 1}"><layer n="1"><mSpace/></layer></staff>`)
    .join('')
  return `<pb/>${def}<measure xml:id="m-next" n="${score.measures.length + 1}">${empty}</measure>`
}

/** A written note's octave from its key and spelling (B♯3 is middle C's key). */
const octaveOf = (midi: number, accidental: Accidental) => Math.floor((midi - accidental) / 12) - 1

/** What a note or chord starts that runs on to a later one: a slur, a hairpin, an octave line. */
interface Open {
  slur?: string
  hairpin?: { readonly id: string; readonly form: 'cres' | 'dim' }
  octave?: { readonly id: string; readonly line: '8va' | '8vb'; last: string }
}

/** The MEI of a score's measures, one by one: what runs across barlines (ties, slurs, lines) held between them. */
class Writer {
  private readonly tied = new Map<string, Set<number>>()
  private readonly open = new Map<StaffId, Open>()
  /** By verse, whether its last syllable's word goes on: the next is its middle or end. */
  private readonly words = new Map<number, boolean>()

  constructor(
    private readonly score: Score,
    private readonly staves: readonly StaffId[],
    private readonly options: MeiOptions,
  ) {}

  private number(staff: StaffId) {
    return this.staves.indexOf(staff) + 1
  }

  measure(measure: Measure, index: number): string {
    const before = this.score.measures[index - 1]
    const attrs = [
      `xml:id="m-${index}"`,
      `n="${index + 1}"`,
      measure.barline ? `right="${RIGHT[measure.barline]}"` : '',
      measure.repeatStart ? 'left="rptstart"' : '',
    ].filter(Boolean)
    const controls: string[] = []
    const staves = this.staves.map((staff) => {
      const clef =
        before && clefIn(before, staff) !== clefIn(measure, staff)
          ? `<clef ${clefAttrs(clefIn(measure, staff), '')}/>`
          : ''
      const layers = (measure.staves[staff] ?? []).map((voice, v) => {
        const stem = voice.stem === 'auto' ? '' : ` stem.dir="${voice.stem}"`
        const events = this.layer(voice.events, measure, staff, `${staff} ${v}`, stem, controls)
        return `<layer n="${v + 1}">${v === 0 ? clef : ''}${events}</layer>`
      })
      return `<staff n="${this.number(staff)}">${layers.join('') || '<layer n="1"/>'}</staff>`
    })
    const top = this.number(this.staves[0] ?? 'treble')
    const unitTicks = ticksOf(
      { value: measure.time.unit, dots: 0, triplet: false },
      this.score.meter,
    )
    const at = (tick: number) => 1 + (tick - measure.startTick) / unitTicks
    const end = 1 + measure.ticks / unitTicks
    if (this.options.chordSymbols)
      for (const chord of measure.chords)
        controls.push(
          `<harm staff="${top}" tstamp="${at(chord.tick)}">${escape(chord.symbol)}</harm>`,
        )
    if (measure.tempo !== undefined) {
      // The mark in its own unit (ADR 0114): ♪ = 180, a tempo of 90 in 4/4.
      const unit = this.score.tempoUnit ?? beatUnit(this.score.meter)
      const mark = tempoMark(measure.tempo, unit, this.score.meter)
      const dots = unit.endsWith('.') ? ' mm.dots="1"' : ''
      const value = unit.replace('.', '')
      controls.push(
        `<tempo staff="${top}" tstamp="1" mm="${mark}" mm.unit="${value}"${dots} place="above">${unitNote(unit)} = ${mark}</tempo>`,
      )
    }
    if (measure.segno) controls.push(`<dir staff="${top}" tstamp="1" place="above">𝄋</dir>`)
    if (measure.coda) controls.push(`<dir staff="${top}" tstamp="1" place="above">𝄌</dir>`)
    const ending = (text: string) =>
      `<dir staff="${top}" tstamp="${end - 0.01}" place="above"><rend halign="right" fontstyle="italic">${text}</rend></dir>`
    if (measure.fine) controls.push(ending('Fine'))
    if (measure.toCoda) controls.push(ending('To Coda 𝄌'))
    if (measure.jump) controls.push(ending(JUMP_TEXT[measure.jump]))
    // The score's last measure closes an octave line still running.
    if (index === this.score.measures.length - 1)
      for (const [staff, open] of this.open)
        if (open.octave) {
          controls.push(
            `<octave staff="${this.number(staff)}" startid="#${open.octave.id}" endid="#${open.octave.last}" dis="8" dis.place="${open.octave.line === '8va' ? 'above' : 'below'}"/>`,
          )
          open.octave = undefined
        }
    return `<measure ${attrs.join(' ')}>${staves.join('')}${controls.join('')}</measure>`
  }

  /** A layer's events, beamed by the meter and each beat of triplets a tuplet (`beamPlan`, ADR 0084). */
  private layer(
    events: readonly ScoreEvent[],
    measure: Measure,
    staff: StaffId,
    layer: string,
    stem: string,
    controls: string[],
  ): string {
    const { beams, tuplets } = beamPlan(
      events,
      this.score.meter,
      measure.time,
      barStartOf(measure, this.score.meter),
    )
    const opens = (groups: readonly (readonly number[])[], index: number) =>
      groups.some((group) => group[0] === index)
    const closes = (groups: readonly (readonly number[])[], index: number) =>
      groups.some((group) => group.at(-1) === index)
    return events
      .map((event, index) => {
        const written = this.event(event, staff, layer, stem, controls)
        return [
          opens(tuplets, index) ? '<tuplet num="3" numbase="2">' : '',
          opens(beams, index) ? '<beam>' : '',
          written,
          closes(beams, index) ? '</beam>' : '',
          closes(tuplets, index) ? '</tuplet>' : '',
        ].join('')
      })
      .join('')
  }

  private event(
    event: ScoreEvent,
    staff: StaffId,
    layer: string,
    stem: string,
    controls: string[],
  ): string {
    const tied = this.tied.get(layer) ?? new Set<number>()
    this.tied.set(layer, tied)
    const dots = event.duration.dots > 0 ? ` dots="${event.duration.dots}"` : ''
    const dur = `dur="${event.duration.value}"${dots}`
    if (event.kind === 'rest') {
      tied.clear()
      // A hidden rest is laid out as one (an empty bar has its onsets) and drawn by none: `score.css`.
      return event.hidden
        ? `<rest xml:id="h-${staff}-${event.tick}" ${dur} type="hidden"/>`
        : `<rest xml:id="r-${staff}-${event.tick}" ${dur}/>`
    }
    const marks = event.marks
    const artics = (marks?.articulations ?? [])
      .flatMap((artic) => (ARTIC[artic] ? [`<artic artic="${ARTIC[artic]}"/>`] : []))
      .join('')
    const single = event.notes.length === 1
    const id = single ? `n-${staff}-${event.tick}-0` : `c-${staff}-${event.tick}`
    const below = staff === 'bass'
    const verses = event.lyrics ? this.verses(event.lyrics, `${staff}-${event.tick}`) : ''
    const inside = artics + verses
    const notes = event.notes.map((written, i) => {
      const ends = tied.delete(written.midi)
      if (written.tie) tied.add(written.midi)
      const tie = written.tie && ends ? 'm' : written.tie ? 'i' : ends ? 't' : ''
      const noteId = `n-${staff}-${event.tick}-${i}`
      if (this.options.fingers && written.finger !== undefined)
        controls.push(
          `<fing startid="#${noteId}" place="${below ? 'below' : 'above'}">${written.finger}</fing>`,
        )
      const attrs = [
        `xml:id="${noteId}"`,
        `pname="${written.spelled.letter.toLowerCase()}"`,
        `oct="${written.octave}"`,
        written.accidental !== null
          ? `accid="${ACCID[written.accidental]}"`
          : written.spelled.accidental !== 0
            ? `accid.ges="${ACCID[written.spelled.accidental]}"`
            : '',
        single ? `${dur}${stem}${tremolo(marks?.ornament)}` : '',
        tie ? `tie="${tie}"` : '',
      ].filter(Boolean)
      return `<note ${attrs.join(' ')}${single && inside ? `>${inside}</note>` : '/>'}`
    })
    this.marks(marks, id, staff, controls)
    const graces = (marks?.grace ?? [])
      .map(
        (grace) =>
          `<note grace="acc" dur="8" stem.mod="1slash" pname="${grace.spelled.letter.toLowerCase()}" oct="${octaveOf(
            grace.midi,
            grace.spelled.accidental,
          )}"${grace.spelled.accidental !== 0 ? ` accid="${ACCID[grace.spelled.accidental]}"` : ''}/>`,
      )
      .join('')
    return (
      graces +
      (single
        ? (notes[0] ?? '')
        : `<chord xml:id="${id}" ${dur}${stem}${tremolo(marks?.ornament)}>${notes.join('')}${inside}</chord>`)
    )
  }

  /**
   * A note's syllables as verses (MEI 5): each named by its note's staff and tick and its verse
   * (`v-<staff>-<tick>-<verse>`, where a sheet finds it printed, ADR 0096), with its place in its word
   * (`wordpos`: its start, middle or end, none for a whole word) and what joins it to the next note
   * (`con`: a dash to its word's next syllable, an underscore while it is held).
   */
  private verses(lyrics: NoteLyrics, at: string): string {
    return lyrics
      .map((syllable, verse) => {
        if (!syllable) return ''
        const open = this.words.get(verse) ?? false
        this.words.set(verse, syllable.hyphen)
        const wordpos = open ? (syllable.hyphen ? 'm' : 't') : syllable.hyphen ? 'i' : null
        const con = syllable.hyphen ? 'd' : syllable.held > 0 ? 'u' : null
        const attrs = [wordpos ? ` wordpos="${wordpos}"` : '', con ? ` con="${con}"` : ''].join('')
        return `<verse xml:id="v-${at}-${verse}" n="${verse + 1}"><syl${attrs}>${escape(syllable.text)}</syl></verse>`
      })
      .join('')
  }

  /** A note's or chord's marks as MEI's control events, the spans among them closed where they end. */
  private marks(marks: NoteMarks | undefined, id: string, staff: StaffId, controls: string[]) {
    const open = this.open.get(staff) ?? {}
    this.open.set(staff, open)
    const n = this.number(staff)
    const ref = `startid="#${id}"`
    const above = staff !== 'bass'
    // An octave line runs over every note under it: it ends at the last such note before one without.
    if (open.octave && marks?.octave !== open.octave.line) {
      controls.push(
        `<octave staff="${n}" startid="#${open.octave.id}" endid="#${open.octave.last}" dis="8" dis.place="${open.octave.line === '8va' ? 'above' : 'below'}"/>`,
      )
      open.octave = undefined
    }
    if (marks?.octave) {
      if (open.octave) open.octave.last = id
      else open.octave = { id, line: marks.octave, last: id }
    }
    if (!marks) return
    if (marks.slurEnd && open.slur) {
      controls.push(`<slur staff="${n}" startid="#${open.slur}" endid="#${id}"/>`)
      open.slur = undefined
    }
    if (marks.slurStart) open.slur = id
    if (marks.hairpin) {
      if (open.hairpin)
        controls.push(
          `<hairpin staff="${n}" form="${open.hairpin.form}" startid="#${open.hairpin.id}" endid="#${id}"/>`,
        )
      open.hairpin =
        marks.hairpin === 'end'
          ? undefined
          : { id, form: marks.hairpin === 'cresc' ? 'cres' : 'dim' }
    }
    if (marks.dynamic)
      controls.push(`<dynam staff="${n}" ${ref} place="below">${marks.dynamic}</dynam>`)
    if (marks.expression)
      controls.push(
        `<dir staff="${n}" ${ref} place="${above ? 'above' : 'below'}"><rend fontstyle="italic">${escape(
          EXPRESSION_TEXT[marks.expression],
        )}</rend></dir>`,
      )
    if (marks.pedal)
      controls.push(
        `<pedal staff="${n}" ${ref} dir="${marks.pedal === 'change' ? 'bounce' : marks.pedal}"/>`,
      )
    if (marks.articulations?.includes('fermata'))
      controls.push(`<fermata staff="${n}" ${ref} place="${above ? 'above' : 'below'}"/>`)
    if (marks.arpeggio) controls.push(`<arpeg staff="${n}" plist="#${id}"/>`)
    const ornament = ornamentOf(marks.ornament, n, ref)
    if (ornament) controls.push(ornament)
  }
}

/** A tremolo is written on the stem; the other ornaments over the note. */
const tremolo = (ornament: Ornament | undefined) =>
  ornament === 'tremolo' ? ' stem.mod="3slash"' : ''

function ornamentOf(ornament: Ornament | undefined, staff: number, ref: string): string | null {
  switch (ornament) {
    case 'trill':
      return `<trill staff="${staff}" ${ref}/>`
    case 'mordent':
      return `<mordent staff="${staff}" ${ref} form="upper"/>`
    case 'lower-mordent':
      return `<mordent staff="${staff}" ${ref} form="lower"/>`
    case 'turn':
      return `<turn staff="${staff}" ${ref}/>`
    default:
      return null
  }
}
