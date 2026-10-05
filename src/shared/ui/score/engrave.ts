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
  type Voice,
} from 'vexflow/core'
import {
  keySignature,
  timeSignatureText,
  type Key,
  type Tick,
  type TimeSignature,
} from '@/shared/lib/music'
import { STAVES, ticksOf, type Measure, type Score, type StaffId } from '@/shared/lib/notation'
import { chordSymbolWidth } from './chord-symbols'
import { xAmong } from './layout'
import { MUSIC_FONT, TEXT_FONT } from './music-font'
import { ONE_STAFF_Y, SCORE_HEIGHT, STAFF_HEIGHT } from './size'
import { buildVoice, type BuiltVoice, type FingerReach, type VexNote } from './vexflow-notes'

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
    /** Where its notes begin, after any clef, key and time signature. */
    readonly notes: number
  }[]
  /** Each staff drawn: its top and bottom lines. */
  readonly staves: Partial<Record<StaffId, { readonly top: number; readonly bottom: number }>>
  /** Each written onset left to right: its tick and its first notehead's or rest's x. */
  readonly onsets: readonly { readonly tick: Tick; readonly x: number }[]
}

const STAFF_Y: Readonly<Record<StaffId, number>> = { treble: 0, bass: 90 }
/** A staff's top and bottom lines from its own top (VexFlow keeps four spaces over the staff). */
const TOP_LINE = 40
const BOTTOM_LINE = 80
/** The least room between a column of fingers and the page's edge, or the other staff's content. */
const FINGER_MARGIN = 2
/** A measure's notes are never narrower than this, and are given this much more than their least. */
const LEAST_NOTES = 80
const SPACING = 1.4
const NOTE_PADDING = 20
/** The least space in CSS pixels between a chord symbol and the next, or its barline. */
const CHORD_GAP = 8
/** How many times a measure is widened, at most, until its chord symbols fit. */
const WIDEN_PASSES = 6
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

function staveAt(
  staff: StaffId,
  { x, y, width }: { x: number; y: number; width: number },
  built: BuiltMeasure,
  key: Key,
): Stave {
  const stave = new Stave(x, y, width)
  if (built.clefs) stave.addClef(staff).addKeySignature(signatureOf(key))
  if (built.time) stave.addTimeSignature(timeSignatureText(built.measure.time))
  return stave
}

/**
 * Each written onset's x in a formatted measure, in the engraving's units: its leftmost notehead or
 * rest. A hidden rest and a lone whole-bar rest (centred in its bar) mark none.
 */
function onsetsIn(built: BuiltMeasure): Map<Tick, number> {
  const onsets = new Map<Tick, number>()
  for (const staff of STAVES) {
    for (const voice of built.staves[staff]) {
      if (voice.wholeBar) continue
      for (const { event, note } of voice.notes) {
        if (!(note instanceof StaveNote)) continue
        const x = note.getAbsoluteX()
        onsets.set(event.tick, Math.min(onsets.get(event.tick) ?? x, x))
      }
    }
  }
  return onsets
}

/**
 * How many times wider a measure's notes must be for each chord symbol to end before the next one, or
 * before its barline for the last: the most any symbol needs over the room it has, 1 or less when all
 * fit. The measure is formatted at `width` as it will be engraved, and the symbols measured in their
 * face; `scale` turns their CSS pixels into the engraving's units.
 */
function chordShortfall(
  built: BuiltMeasure,
  voices: readonly Voice[],
  { width, noteStart, key, scale }: { width: number; noteStart: number; key: Key; scale: number },
): number {
  const { chords, startTick, ticks } = built.measure
  if (chords.length === 0) return 0
  const stave = staveAt('treble', { x: 0, y: STAFF_Y.treble, width }, built, key).setNoteStartX(
    noteStart,
  )
  built.formatter.formatToStave([...voices], stave)
  // Each note on the trial stave, so its x is read as the engraving will read it (a voice's stave
  // does not reach its notes until it is drawn).
  for (const staff of STAVES) {
    for (const voice of built.staves[staff])
      for (const { note } of voice.notes) note.setStave(stave)
  }
  const onsets = onsetsIn(built)
  // A bar with nothing written at its start (or at all) begins where its notes would.
  const opening = onsets.has(startTick) ? [] : [{ tick: startTick, x: noteStart }]
  const points = [...opening, ...[...onsets].map(([tick, x]) => ({ tick, x }))].sort(
    (a, b) => a.tick - b.tick,
  )
  const barline = { tick: startTick + ticks, x: width }
  const xOf = (tick: Tick) => xAmong([...points, barline], tick)
  return Math.max(
    ...chords.map((chord, i) => {
      const room = xOf(chords[i + 1]?.tick ?? barline.tick) - xOf(chord.tick)
      const needs = (chordSymbolWidth(chord.symbol) + CHORD_GAP) / scale
      return needs / Math.max(room, 1)
    }),
  )
}

function buildMeasure(
  score: Score,
  measure: Measure,
  previous: Measure | undefined,
  timeBefore: TimeSignature | undefined,
  {
    fingers,
    names,
    scale,
    shown,
  }: { fingers: boolean; names: boolean; scale: number; shown: readonly StaffId[] },
): BuiltMeasure {
  const build = (staff: StaffId) =>
    shown.includes(staff)
      ? measure.staves[staff].map((voice) =>
          buildVoice(voice, { staff, measure, meter: score.meter, fingers, names }),
        )
      : []
  const staves = { treble: build('treble'), bass: build('bass') }
  const formatter = new Formatter()
  for (const staff of shown) formatter.joinVoices(staves[staff].map((built) => built.voice))
  const voices = shown.flatMap((staff) => staves[staff].map((built) => built.voice))
  const least = formatter.preCalculateMinTotalWidth(voices)
  const clefs = previous === undefined
  const before = previous?.time ?? timeBefore
  const time = !before || before.count !== measure.time.count || before.unit !== measure.time.unit
  const probe = { measure, staves, formatter, clefs, time, width: 0 }
  const modifiers = Math.max(
    ...shown.map((staff) => {
      const stave = staveAt(
        staff,
        { x: 0, y: STAFF_Y[staff], width: LEAST_NOTES },
        probe,
        score.key,
      )
      return stave.getNoteStartX() - stave.getX()
    }),
  )
  // The notes get what they need; then the measure widens until its chord symbols fit over them.
  let notes = Math.max(LEAST_NOTES, least * SPACING + NOTE_PADDING)
  for (let pass = 0; pass < WIDEN_PASSES; pass++) {
    const short = chordShortfall(probe, voices, {
      width: modifiers + notes,
      noteStart: modifiers,
      key: score.key,
      scale,
    })
    if (short <= 1) break
    notes = Math.max(notes + 1, Math.ceil(notes * short))
  }
  return { ...probe, width: modifiers + notes }
}

/**
 * Where the staves stand and how tall the engraving is: one staff at `ONE_STAFF_Y` in
 * `STAFF_HEIGHT`, or the grand staff of `STAFF_Y` and `SCORE_HEIGHT`; moved down where fingers stand
 * over the top staff, apart where they stand between the staves, and taller where they stand under
 * the bottom one.
 */
function placesOf(
  built: readonly BuiltMeasure[],
  staff: StaffId | undefined,
): {
  readonly y: Readonly<Record<StaffId, number>>
  readonly height: number
} {
  const reach = (on: StaffId, side: keyof FingerReach) =>
    built.flatMap((measure) => measure.staves[on].flatMap((voice) => voice.fingerReach[side] ?? []))
  if (staff) {
    const y = Math.max(ONE_STAFF_Y, FINGER_MARGIN - Math.min(...reach(staff, 'above')))
    const height =
      y + Math.max(STAFF_HEIGHT - ONE_STAFF_Y, Math.max(...reach(staff, 'below')) + FINGER_MARGIN)
    return { y: { treble: y, bass: y }, height }
  }
  const treble = Math.max(STAFF_Y.treble, FINGER_MARGIN - Math.min(...reach('treble', 'above')))
  const trebleFloor = Math.max(BOTTOM_LINE, ...reach('treble', 'below'))
  const bassCeiling = Math.min(TOP_LINE, ...reach('bass', 'above'))
  const bass =
    treble + Math.max(STAFF_Y.bass - STAFF_Y.treble, trebleFloor + FINGER_MARGIN - bassCeiling)
  const height =
    bass +
    Math.max(SCORE_HEIGHT - STAFF_Y.bass, Math.max(...reach('bass', 'below')) + FINGER_MARGIN)
  return { y: { treble, bass }, height }
}

/** Every tied note joined to the note of its key where its value ends, on its staff. */
function drawTies(
  context: RenderContext,
  built: readonly BuiltMeasure[],
  meter: Score['meter'],
  shown: readonly StaffId[],
) {
  for (const staff of shown) {
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
 * Each drawn chord or note named by its staff and tick (`data-staff`, `data-tick`), so what lies over
 * the engraving can mark the notes chosen without engraving again.
 */
function tagNotes(host: HTMLDivElement, voice: BuiltVoice, staff: StaffId) {
  for (const { event, note } of voice.notes) {
    if (event.kind !== 'notes') continue
    // By the document's own index of ids: a long score has thousands of notes to name.
    const group = host.ownerDocument.getElementById(`vf-${note.getAttribute('id')}`)
    group?.setAttribute('data-staff', staff)
    group?.setAttribute('data-tick', String(event.tick))
  }
}

/**
 * Engraves a score into `host` as one system of measures left to right (spec §2.5), on the grand
 * staff or on `staff` alone, and says where everything is, in CSS pixels at `scale`.
 */
export function engrave(
  score: Score,
  host: HTMLDivElement,
  {
    scale,
    fingers,
    names,
    staff,
    timeBefore,
  }: {
    scale: number
    fingers: boolean
    names: boolean
    staff?: StaffId | undefined
    /** The time signature in force before the first measure: a line that continues prints it only where it changes. */
    timeBefore?: TimeSignature | undefined
  },
): ScoreLayout {
  setUpVexFlow()
  host.replaceChildren()
  const shown: readonly StaffId[] = staff ? [staff] : STAVES
  const built = score.measures.map((measure, index) =>
    buildMeasure(score, measure, score.measures[index - 1], timeBefore, {
      fingers,
      names,
      scale,
      shown,
    }),
  )
  const width = built.reduce((sum, measure) => sum + measure.width, 0) + END_MARGIN
  const places = placesOf(built, staff)
  const renderer = new Renderer(host, Renderer.Backends.SVG)
  renderer.resize(width * scale, places.height * scale)
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
  const staves: { -readonly [S in StaffId]?: { top: number; bottom: number } } = {}
  let x = 0
  for (const measure of built) {
    const drawn = shown.map((on) => ({
      staff: on,
      stave: staveAt(on, { x, y: places.y[on], width: measure.width }, measure, score.key),
    }))
    const [top] = drawn
    const bottom = drawn.at(-1)
    if (!top || !bottom) throw new RangeError('A score is engraved on at least one staff')
    const start = Math.max(...drawn.map(({ stave }) => stave.getNoteStartX()))
    for (const { stave } of drawn) stave.setNoteStartX(start).setContext(context).draw()
    // The grand staff's two staves are joined; one staff's own barlines close it.
    if (top !== bottom) {
      if (measure.clefs) {
        for (const type of ['brace', 'singleLeft'] as const) {
          new StaveConnector(top.stave, bottom.stave).setType(type).setContext(context).draw()
        }
      }
      new StaveConnector(top.stave, bottom.stave).setType('singleRight').setContext(context).draw()
    }
    measure.formatter.formatToStave(
      shown.flatMap((on) => measure.staves[on].map((voice) => voice.voice)),
      top.stave,
    )
    for (const { staff: on, stave } of drawn) {
      context.openGroup(`staff-${on}`)
      for (const voice of measure.staves[on]) {
        voice.voice.draw(context, stave)
        for (const beam of voice.beams) beam.setContext(context).draw()
        for (const tuplet of voice.tuplets) tuplet.setContext(context).draw()
        tagNotes(host, voice, on)
      }
      context.closeGroup()
    }
    for (const [tick, at] of onsetsIn(measure)) onsets.set(tick, at * scale)
    staffTop = top.stave.getYForLine(0) * scale
    staffBottom = bottom.stave.getYForLine(4) * scale
    for (const { staff: on, stave } of drawn) {
      staves[on] = { top: stave.getYForLine(0) * scale, bottom: stave.getYForLine(4) * scale }
    }
    measures.push({
      startTick: measure.measure.startTick,
      ticks: measure.measure.ticks,
      x: x * scale,
      width: measure.width * scale,
      notes: start * scale,
    })
    x += measure.width
  }
  drawTies(context, built, score.meter, shown)

  return {
    width: width * scale,
    height: places.height * scale,
    staffTop,
    staffBottom,
    staves,
    measures,
    onsets: [...onsets].map(([tick, at]) => ({ tick, x: at })).sort((a, b) => a.tick - b.tick),
  }
}
