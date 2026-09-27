import {
  Formatter,
  MetricsDefaults,
  Renderer,
  Stave,
  StaveConnector,
  StaveNote,
  StaveTie,
  SVGContext,
  VexFlow,
  type RenderContext,
} from 'vexflow/core'
import { keySignature, timeSignatureText, type Key, type Tick } from '@/shared/lib/music'
import { STAVES, ticksOf, type Measure, type Score, type StaffId } from '@/shared/lib/notation'
import { MUSIC_FONT, TEXT_FONT } from './music-font'
import { buildVoice, type BuiltVoice, type VexNote } from './vexflow-notes'

export interface ScoreLayout {
  /** The engraving's size in CSS pixels. */
  readonly width: number
  readonly height: number
  /** The treble staff's top line and the bass staff's bottom line. */
  readonly staffTop: number
  readonly staffBottom: number
  readonly measures: readonly {
    readonly startTick: Tick
    readonly ticks: Tick
    readonly x: number
    readonly width: number
  }[]
  /** Each written onset left to right: its tick and its first notehead's or rest's x. */
  readonly onsets: readonly { readonly tick: Tick; readonly x: number }[]
}

/** The engraving's height in VexFlow units: the treble staff at 0 (lines 40–80), the bass at 90 (130–170). */
export const SCORE_HEIGHT = 210
const STAFF_Y: Readonly<Record<StaffId, number>> = { treble: 0, bass: 90 }
/** A measure's notes are never narrower than this, and are given this much more than their least. */
const LEAST_NOTES = 80
const SPACING = 1.4
const NOTE_PADDING = 20
/** A chord symbol's room: its letters at the 17px serif, and a gap. */
const CHORD_LETTER = 10
const CHORD_GAP = 16
const END_MARGIN = 8

let setUp = false
/** VexFlow's globals, once: our faces, and every colour `currentColor` so CSS colours the staff. */
function setUpVexFlow() {
  if (setUp) return
  MetricsDefaults.Stem.strokeStyle = 'currentColor'
  MetricsDefaults.Stave.strokeStyle = 'currentColor'
  VexFlow.setFonts(MUSIC_FONT, TEXT_FONT)
  setUp = true
}

/** A key signature as VexFlow names it: the major key with as many sharps or flats. */
const MAJOR_BY_SIGNATURE = [
  'Cb',
  'Gb',
  'Db',
  'Ab',
  'Eb',
  'Bb',
  'F',
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
]
function signatureOf(key: Key): string {
  const name = MAJOR_BY_SIGNATURE[keySignature(key) + 7]
  if (!name) throw new RangeError(`No key signature has ${keySignature(key)} sharps`)
  return name
}

interface BuiltMeasure {
  readonly measure: Measure
  readonly staves: Readonly<Record<StaffId, readonly BuiltVoice[]>>
  readonly formatter: Formatter
  readonly clefs: boolean
  readonly time: boolean
  readonly width: number
}

function staveAt(staff: StaffId, x: number, width: number, built: BuiltMeasure, key: Key): Stave {
  const stave = new Stave(x, STAFF_Y[staff], width)
  if (built.clefs) stave.addClef(staff).addKeySignature(signatureOf(key))
  if (built.time) stave.addTimeSignature(timeSignatureText(built.measure.time))
  return stave
}

function buildMeasure(
  score: Score,
  measure: Measure,
  previous: Measure | undefined,
  fingers: boolean,
): BuiltMeasure {
  const build = (staff: StaffId) =>
    measure.staves[staff].map((voice) =>
      buildVoice(voice, { staff, measure, meter: score.meter, fingers }),
    )
  const staves = { treble: build('treble'), bass: build('bass') }
  const formatter = new Formatter()
  for (const staff of STAVES) formatter.joinVoices(staves[staff].map((built) => built.voice))
  const voices = STAVES.flatMap((staff) => staves[staff].map((built) => built.voice))
  const least = formatter.preCalculateMinTotalWidth(voices)
  const clefs = previous === undefined
  const time =
    !previous ||
    previous.time.count !== measure.time.count ||
    previous.time.unit !== measure.time.unit
  const probe = { measure, staves, formatter, clefs, time, width: 0 }
  const modifiers = Math.max(
    ...STAVES.map((staff) => {
      const stave = staveAt(staff, 0, LEAST_NOTES, probe, score.key)
      return stave.getNoteStartX() - stave.getX()
    }),
  )
  const chords = measure.chords.reduce(
    (sum, chord) => sum + chord.symbol.length * CHORD_LETTER + CHORD_GAP,
    0,
  )
  return {
    ...probe,
    width: modifiers + Math.max(LEAST_NOTES, least * SPACING + NOTE_PADDING, chords),
  }
}

/** Every tied note joined to the note of its key where its value ends, on its staff. */
function drawTies(context: RenderContext, built: readonly BuiltMeasure[], meter: Score['meter']) {
  for (const staff of STAVES) {
    const at = new Map<string, { note: VexNote; index: number }>()
    for (const measure of built) {
      for (const voice of measure.staves[staff]) {
        for (const { event, note } of voice.notes) {
          if (event.kind !== 'notes') continue
          event.notes.forEach((written, index) =>
            at.set(`${event.tick} ${written.midi}`, { note, index }),
          )
        }
      }
    }
    context.openGroup(`staff-${staff}`)
    for (const measure of built) {
      for (const voice of measure.staves[staff]) {
        for (const { event, note } of voice.notes) {
          if (event.kind !== 'notes') continue
          const end = event.tick + ticksOf(event.duration, meter)
          event.notes.forEach((written, index) => {
            const next = written.tie ? at.get(`${end} ${written.midi}`) : undefined
            if (!next) return
            new StaveTie({
              firstNote: note,
              lastNote: next.note,
              firstIndexes: [index],
              lastIndexes: [next.index],
            })
              .setContext(context)
              .draw()
          })
        }
      }
    }
    context.closeGroup()
  }
}

/**
 * Engraves a score into `host` as one system of measures left to right (spec §2.5), and says where
 * everything is, in CSS pixels at `scale`.
 */
export function engrave(
  score: Score,
  host: HTMLDivElement,
  { scale, fingers }: { scale: number; fingers: boolean },
): ScoreLayout {
  setUpVexFlow()
  host.replaceChildren()
  const built = score.measures.map((measure, index) =>
    buildMeasure(score, measure, score.measures[index - 1], fingers),
  )
  const width = built.reduce((sum, measure) => sum + measure.width, 0) + END_MARGIN
  const renderer = new Renderer(host, Renderer.Backends.SVG)
  renderer.resize(width * scale, SCORE_HEIGHT * scale)
  const context = renderer.getContext()
  context.scale(scale, scale)
  context.setFillStyle('currentColor')
  context.setStrokeStyle('currentColor')
  if (context instanceof SVGContext) {
    context.svg.setAttribute('fill', 'currentColor')
    context.svg.setAttribute('stroke', 'currentColor')
  }

  const measures: ScoreLayout['measures'][number][] = []
  const onsets = new Map<Tick, number>()
  let staffTop = 0
  let staffBottom = 0
  let x = 0
  for (const measure of built) {
    const staves = {
      treble: staveAt('treble', x, measure.width, measure, score.key),
      bass: staveAt('bass', x, measure.width, measure, score.key),
    }
    const start = Math.max(staves.treble.getNoteStartX(), staves.bass.getNoteStartX())
    for (const staff of STAVES) staves[staff].setNoteStartX(start).setContext(context).draw()
    if (measure.clefs) {
      for (const type of ['brace', 'singleLeft'] as const) {
        new StaveConnector(staves.treble, staves.bass).setType(type).setContext(context).draw()
      }
    }
    new StaveConnector(staves.treble, staves.bass).setType('singleRight').setContext(context).draw()
    measure.formatter.formatToStave(
      STAVES.flatMap((staff) => measure.staves[staff].map((voice) => voice.voice)),
      staves.treble,
    )
    for (const staff of STAVES) {
      context.openGroup(`staff-${staff}`)
      for (const voice of measure.staves[staff]) {
        voice.voice.draw(context, staves[staff])
        for (const beam of voice.beams) beam.setContext(context).draw()
        for (const tuplet of voice.tuplets) tuplet.setContext(context).draw()
        for (const { event, note } of voice.notes) {
          if (voice.wholeBar || !(note instanceof StaveNote)) continue
          const at = note.getAbsoluteX() * scale
          onsets.set(event.tick, Math.min(onsets.get(event.tick) ?? at, at))
        }
      }
      context.closeGroup()
    }
    staffTop = staves.treble.getYForLine(0) * scale
    staffBottom = staves.bass.getYForLine(4) * scale
    measures.push({
      startTick: measure.measure.startTick,
      ticks: measure.measure.ticks,
      x: x * scale,
      width: measure.width * scale,
    })
    x += measure.width
  }
  drawTies(context, built, score.meter)

  return {
    width: width * scale,
    height: SCORE_HEIGHT * scale,
    staffTop,
    staffBottom,
    measures,
    onsets: [...onsets].map(([tick, at]) => ({ tick, x: at })).sort((a, b) => a.tick - b.tick),
  }
}
