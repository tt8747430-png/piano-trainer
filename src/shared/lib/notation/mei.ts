import {
  isCompound,
  keySignature,
  type Accidental,
  type Articulation,
  type Barline,
  type Meter,
} from '@/shared/lib/music'
import { clefIn, type Measure, type Score, type ScoreEvent, type StaffId } from './types'
import { ticksOf } from './values'

/**
 * A Score as MEI 5 (ADR 0078), the encoding Verovio engraves: one staff per staff the score writes,
 * the piano's two braced; each measure's voices as layers, its chords as `harm`, its tempo, barlines,
 * endings and ties; eighths and shorter beamed by the beat. Every measure is named `m-<index>`, every
 * chord `c-<staff>-<tick>` and every note `n-<staff>-<tick>-<i>`, so the drawing can be read back: a
 * bar tapped, the notes playing marked.
 */
export function scoreToMei(score: Score, { title = '' }: { title?: string } = {}): string {
  const staves = score.staves
  const number = (staff: StaffId) => staves.indexOf(staff) + 1
  const piano: readonly StaffId[] = staves.filter((staff) => staff === 'treble' || staff === 'bass')
  const sung = staves.filter((staff) => !piano.includes(staff))
  const staffDef = (staff: StaffId) =>
    `<staffDef n="${number(staff)}" lines="5" ${clefAttrs(clefIn(score.measures[0] ?? {}, staff))}/>`
  const first = score.measures[0]
  const scoreDef = `<scoreDef ${meterAttrs(first?.time ?? null, score.meter)} key.sig="${keySig(
    keySignature(score.key),
  )}"><staffGrp>${sung.map(staffDef).join('')}${
    piano.length > 0
      ? `<staffGrp symbol="brace" bar.thru="true">${piano.map(staffDef).join('')}</staffGrp>`
      : ''
  }</staffGrp></scoreDef>`

  const body: string[] = []
  // The keys each layer holds tied into the next note: a tie runs across a barline.
  const ties = new Map<string, Set<number>>()
  let ending: number | undefined
  score.measures.forEach((measure, index) => {
    const before = score.measures[index - 1]
    if (measure.ending !== ending) {
      if (ending !== undefined) body.push('</ending>')
      if (measure.ending !== undefined) body.push(`<ending n="${measure.ending}">`)
      ending = measure.ending
    }
    const changes = changedDef(score, measure, before)
    if (changes) body.push(changes)
    body.push(measureMei(score, measure, index, number, ties))
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

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const keySig = (fifths: number) =>
  fifths === 0 ? '0' : `${Math.abs(fifths)}${fifths > 0 ? 's' : 'f'}`

const clefAttrs = (clef: string) =>
  clef === 'bass' ? 'clef.shape="F" clef.line="4"' : 'clef.shape="G" clef.line="2"'

const meterAttrs = (time: Measure['time'] | null, meter: Meter) => {
  const count = time?.count ?? Number(meter.split('/')[0])
  const unit = time?.unit ?? Number(meter.split('/')[1])
  return `meter.count="${count}" meter.unit="${unit}"`
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

/** Ticks of a beat a beam groups by: a quarter's, a dotted quarter's in a compound meter. */
const beamBeat = (meter: Meter) =>
  ticksOf({ value: 4, dots: isCompound(meter) ? 1 : 0, triplet: false }, meter)

function measureMei(
  score: Score,
  measure: Measure,
  index: number,
  number: (staff: StaffId) => number,
  ties: Map<string, Set<number>>,
): string {
  const attrs = [
    `xml:id="m-${index}"`,
    `n="${index + 1}"`,
    measure.barline ? `right="${RIGHT[measure.barline]}"` : '',
    measure.repeatStart ? 'left="rptstart"' : '',
  ].filter(Boolean)
  const staves = score.staves.map((staff) => {
    const voices = measure.staves[staff]
    const before = index > 0 ? score.measures[index - 1] : undefined
    const clef =
      before && clefIn(before, staff) !== clefIn(measure, staff)
        ? `<clef ${clefAttrs(clefIn(measure, staff)).replace('clef.shape', 'shape').replace('clef.line', 'line')}/>`
        : ''
    const layers = voices.map(
      (voice, v) =>
        `<layer n="${v + 1}">${v === 0 ? clef : ''}${layerMei(voice.events, staff, score.meter, tiesOf(ties, `${staff} ${v}`))}</layer>`,
    )
    return `<staff n="${number(staff)}">${layers.join('') || '<layer n="1"/>'}</staff>`
  })
  // Over the top staff: the chord symbols and the tempo, by beat (MEI counts beats from 1).
  const unitTicks = ticksOf({ value: measure.time.unit, dots: 0, triplet: false }, score.meter)
  const at = (tick: number) => 1 + (tick - measure.startTick) / unitTicks
  const top = score.staves[0] ? number(score.staves[0]) : 1
  const harms = measure.chords.map(
    (chord) => `<harm staff="${top}" tstamp="${at(chord.tick)}">${escape(chord.symbol)}</harm>`,
  )
  const tempo =
    measure.tempo === undefined
      ? []
      : [
          `<tempo staff="${top}" tstamp="1" mm="${measure.tempo}" mm.unit="${isCompound(score.meter) ? 4 : 4}"${
            isCompound(score.meter) ? ' mm.dots="1"' : ''
          } place="above">♩ = ${measure.tempo}</tempo>`,
        ]
  return `<measure ${attrs.join(' ')}>${staves.join('')}${harms.join('')}${tempo.join('')}</measure>`
}

const tiesOf = (ties: Map<string, Set<number>>, layer: string) => {
  const held = ties.get(layer) ?? new Set<number>()
  ties.set(layer, held)
  return held
}

/** A layer's events, eighths and shorter beamed by the beat, triplets in tuplets. */
function layerMei(
  events: readonly ScoreEvent[],
  staff: StaffId,
  meter: Meter,
  tied: Set<number>,
): string {
  const beat = beamBeat(meter)
  const out: string[] = []
  let group: string[] = []
  let groupBeat = -1
  let tuplet: string[] = []
  const flushBeam = () => {
    if (group.length > 1) out.push(`<beam>${group.join('')}</beam>`)
    else out.push(...group)
    group = []
  }
  const flushTuplet = () => {
    if (tuplet.length === 0) return
    out.push(`<tuplet num="3" numbase="2">${tuplet.join('')}</tuplet>`)
    tuplet = []
  }
  for (const event of events) {
    const written = eventMei(event, staff, tied)
    if (event.duration.triplet) {
      flushBeam()
      tuplet.push(written)
      continue
    }
    flushTuplet()
    const beamable = event.kind === 'notes' && event.duration.value >= 8
    const eventBeat = Math.floor(event.tick / beat)
    if (!beamable || eventBeat !== groupBeat) flushBeam()
    if (beamable) {
      group.push(written)
      groupBeat = eventBeat
    } else {
      out.push(written)
      groupBeat = -1
    }
  }
  flushBeam()
  flushTuplet()
  return out.join('')
}

/** The tie a note takes: starting one (`i`), ending one (`t`), or both (`m`); `tied` kept for the next. */
function tieOf(midi: number, starts: boolean, tied: Set<number>): string {
  const ends = tied.delete(midi)
  if (starts) tied.add(midi)
  return starts && ends ? 'm' : starts ? 'i' : ends ? 't' : ''
}

function eventMei(event: ScoreEvent, staff: StaffId, tied: Set<number>): string {
  const dur = `dur="${event.duration.value}"${event.duration.dots > 0 ? ` dots="${event.duration.dots}"` : ''}`
  if (event.kind === 'rest') {
    tied.clear()
    return event.hidden ? `<space ${dur}/>` : `<rest xml:id="r-${staff}-${event.tick}" ${dur}/>`
  }
  const artics = (event.marks?.articulations ?? [])
    .map((artic) => ARTIC[artic])
    .filter(Boolean)
    .map((artic) => `<artic artic="${artic}"/>`)
    .join('')
  const notes = event.notes.map((written, i) => {
    const tie = tieOf(written.midi, written.tie, tied)
    const attrs = [
      `xml:id="n-${staff}-${event.tick}-${i}"`,
      `pname="${written.spelled.letter.toLowerCase()}"`,
      `oct="${written.octave}"`,
      written.accidental !== null
        ? `accid="${ACCID[written.accidental]}"`
        : written.spelled.accidental !== 0
          ? `accid.ges="${ACCID[written.spelled.accidental]}"`
          : '',
      event.notes.length === 1 ? dur : '',
      tie ? `tie="${tie}"` : '',
    ].filter(Boolean)
    return `<note ${attrs.join(' ')}${event.notes.length === 1 && artics ? `>${artics}</note>` : '/>'}`
  })
  return event.notes.length === 1
    ? (notes[0] ?? '')
    : `<chord xml:id="c-${staff}-${event.tick}" ${dur}>${notes.join('')}${artics}</chord>`
}
