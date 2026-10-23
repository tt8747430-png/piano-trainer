import {
  EXPRESSION_TEXT,
  isCompound,
  keySignature,
  type Accidental,
  type Articulation,
  type Barline,
  type Jump,
  type Meter,
  type NoteMarks,
  type Ornament,
  type TimeSignature,
} from '@/shared/lib/music'
import { clefIn, type Measure, type Score, type ScoreEvent, type StaffId } from './types'
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
}

/**
 * A Score as MEI 5 (ADR 0078), the encoding Verovio engraves: one staff per staff drawn, the piano's
 * two braced; each measure's voices as layers, eighths and shorter beamed by the beat, triplets in
 * tuplets, ties across barlines; its key, time and clef changes, barlines, repeats and endings, the
 * signs and jumps, the tempo; each note's marks: articulations, ornaments, arpeggios, grace notes,
 * slurs, dynamics, hairpins, octave lines, the pedal, expressions and fingers. Every measure is named
 * `m-<index>`, every chord `c-<staff>-<tick>`, note `n-<staff>-<tick>-<i>` and rest
 * `r-<staff>-<tick>`, so the drawing is read back by them: where each bar and onset stands, a bar
 * tapped, the notes chosen or playing.
 */
export function scoreToMei(score: Score, options: MeiOptions = {}): string {
  const { title = '', timeBefore } = options
  const staves = (options.staves ?? score.staves).filter((staff) => score.staves.includes(staff))
  const number = (staff: StaffId) => staves.indexOf(staff) + 1
  const piano: readonly StaffId[] = staves.filter((staff) => staff === 'treble' || staff === 'bass')
  const sung = staves.filter((staff) => !piano.includes(staff))
  const first = score.measures[0]
  const staffDef = (staff: StaffId) =>
    `<staffDef n="${number(staff)}" lines="5" ${clefAttrs(clefIn(first ?? {}, staff))}/>`
  const time = first?.time ?? null
  const continues =
    timeBefore !== undefined &&
    time !== null &&
    timeBefore.count === time.count &&
    timeBefore.unit === time.unit
  const scoreDef = `<scoreDef ${meterAttrs(time, score.meter)}${continues ? ' meter.visible="false"' : ''} key.sig="${keySig(
    keySignature(first?.key ?? score.key),
  )}"><staffGrp>${sung.map(staffDef).join('')}${
    piano.length > 1
      ? `<staffGrp symbol="brace" bar.thru="true">${piano.map(staffDef).join('')}</staffGrp>`
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
    const changes = changedDef(score, measure, score.measures[index - 1])
    if (changes) body.push(changes)
    body.push(writer.measure(measure, index))
  })
  if (ending !== undefined) body.push('</ending>')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<mei xmlns="http://www.music-encoding.org/ns/mei" meiversion="5.0">',
    `<meiHead><fileDesc><titleStmt><title>${escape(title)}</title></titleStmt><pubStmt/></fileDesc></meiHead>`,
    '<music><body><mdiv><score>',
    scoreDef,
    `<section>${body.join('')}</section>`,
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

const keySig = (fifths: number) =>
  fifths === 0 ? '0' : `${Math.abs(fifths)}${fifths > 0 ? 's' : 'f'}`

const clefAttrs = (clef: string, prefix = 'clef.') =>
  clef === 'bass' ? `${prefix}shape="F" ${prefix}line="4"` : `${prefix}shape="G" ${prefix}line="2"`

const meterAttrs = (time: TimeSignature | null, meter: Meter) => {
  const [count, unit] = meter.split('/')
  return `meter.count="${time?.count ?? count}" meter.unit="${time?.unit ?? unit}"`
}

/** A scoreDef before a measure whose time or key is not the one before's. */
function changedDef(score: Score, measure: Measure, before: Measure | undefined): string | null {
  if (!before) return null
  const time =
    before.time.count !== measure.time.count || before.time.unit !== measure.time.unit
      ? ` ${meterAttrs(measure.time, score.meter)}`
      : ''
  const keyOf = (m: Measure) => keySignature(m.key ?? score.key)
  const key = keyOf(before) !== keyOf(measure) ? ` key.sig="${keySig(keyOf(measure))}"` : ''
  return time || key ? `<scoreDef${time}${key}/>` : null
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
      const layers = measure.staves[staff].map((voice, v) => {
        const stem = voice.stem === 'auto' ? '' : ` stem.dir="${voice.stem}"`
        const events = this.layer(voice.events, staff, `${staff} ${v}`, stem, controls)
        return `<layer n="${v + 1}">${v === 0 ? clef : ''}${events}</layer>`
      })
      // A staff the pattern plays here is typed so (a class on its drawing): drawn in soft ink.
      const played = measure.pattern?.includes(staff) ? ' type="pattern"' : ''
      return `<staff n="${this.number(staff)}"${played}>${layers.join('') || '<layer n="1"/>'}</staff>`
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
      const dots = isCompound(this.score.meter) ? ' mm.dots="1"' : ''
      controls.push(
        `<tempo staff="${top}" tstamp="1" mm="${measure.tempo}" mm.unit="4"${dots} place="above">♩ = ${measure.tempo}</tempo>`,
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

  /** A layer's events, eighths and shorter beamed by the beat, triplets in tuplets. */
  private layer(
    events: readonly ScoreEvent[],
    staff: StaffId,
    layer: string,
    stem: string,
    controls: string[],
  ): string {
    const beat = ticksOf(
      { value: 4, dots: isCompound(this.score.meter) ? 1 : 0, triplet: false },
      this.score.meter,
    )
    const out: string[] = []
    let beam: string[] = []
    let beamBeat = -1
    let tuplet: string[] = []
    const endBeam = () => {
      out.push(beam.length > 1 ? `<beam>${beam.join('')}</beam>` : beam.join(''))
      beam = []
    }
    const endTuplet = () => {
      if (tuplet.length > 0) out.push(`<tuplet num="3" numbase="2">${tuplet.join('')}</tuplet>`)
      tuplet = []
    }
    for (const event of events) {
      const written = this.event(event, staff, layer, stem, controls)
      if (event.duration.triplet) {
        endBeam()
        tuplet.push(written)
        continue
      }
      endTuplet()
      const beamable = event.kind === 'notes' && event.duration.value >= 8
      const eventBeat = Math.floor(event.tick / beat)
      if (!beamable || eventBeat !== beamBeat) endBeam()
      if (beamable) {
        beam.push(written)
        beamBeat = eventBeat
      } else {
        out.push(written)
        beamBeat = -1
      }
    }
    endBeam()
    endTuplet()
    return out.join('')
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
      return `<note ${attrs.join(' ')}${single && artics ? `>${artics}</note>` : '/>'}`
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
        : `<chord xml:id="${id}" ${dur}${stem}${tremolo(marks?.ornament)}>${notes.join('')}${artics}</chord>`)
    )
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
