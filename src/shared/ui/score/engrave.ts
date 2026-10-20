import {
  Curve,
  Formatter,
  MetricsDefaults,
  Modifier,
  Renderer,
  Stave,
  StaveConnector,
  StaveHairpin,
  StaveNote,
  StaveTie,
  SVGContext,
  TextBracket,
  VexFlow,
  type RenderContext,
  type Voice,
} from 'vexflow/core'
import {
  keySignature,
  sameKey,
  timeSignatureText,
  type Key,
  type Tick,
  type TimeSignature,
} from '@/shared/lib/music'
import {
  clefOf,
  STAVES,
  ticksOf,
  type Measure,
  type Score,
  type StaffId,
} from '@/shared/lib/notation'
import { chordSymbolWidth } from './chord-symbols'
import { xAmong } from './layout'
import { MUSIC_FONT, TEXT_FONT } from './music-font'
import { ONE_STAFF_Y, STAFF_GAP, STAFF_HEIGHT, LAST_STAFF } from './size'
import { buildVoice, type BuiltVoice, type FingerReach, type VexNote } from './vexflow-notes'

export interface ScoreLayout {
  /** The engraving's size in CSS pixels. */
  readonly width: number
  readonly height: number
  /** The top staff's top line and the bottom staff's bottom line. */
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
/** How far a hairpin keeps from a dynamic under the note it starts or ends at. */
const DYNAMIC_ROOM = 14
/** How many times a measure is widened, at most, until its chord symbols fit. */
const WIDEN_PASSES = 6
const END_MARGIN = 8
/** The room a brace takes left of the staves it joins. */
const BRACE_ROOM = 14

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

/** The key a measure is written in: its own at a key change, else the score's. */
const keyOf = (score: Score, measure: Measure): Key => measure.key ?? score.key

interface BuiltMeasure {
  readonly measure: Measure
  /** Where the key changes at this measure, the key it leaves, whose signature is cancelled. */
  readonly keyFrom: Key | null
  readonly staves: Readonly<Record<StaffId, readonly BuiltVoice[]>>
  readonly formatter: Formatter
  readonly clefs: boolean
  readonly time: boolean
  readonly width: number
  /** What of its width its notes have, past its clef, key and time. */
  readonly notes: number
}

function staveAt(
  staff: StaffId,
  { x, y, width }: { x: number; y: number; width: number },
  built: BuiltMeasure,
  key: Key,
): Stave {
  const stave = new Stave(x, y, width)
  if (built.clefs) stave.addClef(clefOf(staff)).addKeySignature(signatureOf(key))
  else if (built.keyFrom) stave.addKeySignature(signatureOf(key), signatureOf(built.keyFrom))
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
  const stave = staveAt('treble', { x: 0, y: 0, width }, built, key).setNoteStartX(noteStart)
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
          buildVoice(voice, {
            staff,
            measure,
            meter: score.meter,
            fingers,
            names,
            key: keyOf(score, measure),
          }),
        )
      : []
  const staves = { melody: build('melody'), treble: build('treble'), bass: build('bass') }
  const formatter = new Formatter()
  for (const staff of shown) formatter.joinVoices(staves[staff].map((built) => built.voice))
  const voices = shown.flatMap((staff) => staves[staff].map((built) => built.voice))
  const least = formatter.preCalculateMinTotalWidth(voices)
  const clefs = previous === undefined
  const before = previous?.time ?? timeBefore
  const time = !before || before.count !== measure.time.count || before.unit !== measure.time.unit
  const key = keyOf(score, measure)
  const keyFrom = previous && !sameKey(keyOf(score, previous), key) ? keyOf(score, previous) : null
  const probe = { measure, keyFrom, staves, formatter, clefs, time, width: 0, notes: 0 }
  const modifiers = Math.max(
    ...shown.map((staff) => {
      const stave = staveAt(staff, { x: 0, y: 0, width: LEAST_NOTES }, probe, key)
      return stave.getNoteStartX() - stave.getX()
    }),
  )
  // The notes get what they need; then the measure widens until its chord symbols fit over them.
  let notes = Math.max(LEAST_NOTES, least * SPACING + NOTE_PADDING)
  for (let pass = 0; pass < WIDEN_PASSES; pass++) {
    const short = chordShortfall(probe, voices, {
      width: modifiers + notes,
      noteStart: modifiers,
      key,
      scale,
    })
    if (short <= 1) break
    notes = Math.max(notes + 1, Math.ceil(notes * short))
  }
  return { ...probe, width: modifiers + notes, notes }
}

/**
 * Where the staves stand and how tall the engraving is: one staff at `ONE_STAFF_Y` in
 * `STAFF_HEIGHT`, or several `STAFF_GAP` apart with `LAST_STAFF` under the last; moved down where
 * fingers stand over the top staff, apart where they stand between two, and taller where they stand
 * under the bottom one.
 */
function placesOf(
  built: readonly BuiltMeasure[],
  shown: readonly StaffId[],
): {
  readonly y: Readonly<Partial<Record<StaffId, number>>>
  readonly height: number
} {
  const reach = (on: StaffId, side: keyof FingerReach) =>
    built.flatMap((measure) => measure.staves[on].flatMap((voice) => voice.fingerReach[side] ?? []))
  const [only] = shown
  if (shown.length === 1 && only) {
    const y = Math.max(ONE_STAFF_Y, FINGER_MARGIN - Math.min(...reach(only, 'above')))
    const height =
      y + Math.max(STAFF_HEIGHT - ONE_STAFF_Y, Math.max(...reach(only, 'below')) + FINGER_MARGIN)
    return { y: { [only]: y }, height }
  }
  const y: Partial<Record<StaffId, number>> = {}
  let at = 0
  shown.forEach((staff, index) => {
    const above = shown[index - 1]
    if (above === undefined) at = Math.max(0, FINGER_MARGIN - Math.min(...reach(staff, 'above')))
    else {
      const floor = Math.max(BOTTOM_LINE, ...reach(above, 'below'))
      const ceiling = Math.min(TOP_LINE, ...reach(staff, 'above'))
      at += Math.max(STAFF_GAP, floor + FINGER_MARGIN - ceiling)
    }
    y[staff] = at
  })
  const last = shown.at(-1)
  const below = last ? Math.max(...reach(last, 'below')) + FINGER_MARGIN : 0
  return { y, height: at + Math.max(LAST_STAFF, below) }
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

/** The written note it is drawn as, of each of a staff's chords along the line, in time order. */
function chordsAlong(built: readonly BuiltMeasure[], staff: StaffId) {
  return built
    .flatMap((measure) => measure.staves[staff].flatMap((voice) => voice.notes))
    .flatMap(({ event, note }) =>
      event.kind === 'notes' && note instanceof StaveNote ? [{ event, note }] : [],
    )
    .sort((a, b) => a.event.tick - b.event.tick)
}

/**
 * What spans notes, on each staff (ADR 0063): a slur from the chord that starts one to the next that
 * ends one (from or to the line's edge where it goes on past it), a hairpin to the next dynamic or
 * hairpin's end, and an octave line over (8va) or under (8vb) each run of chords under it.
 */
function drawSpans(
  context: RenderContext,
  built: readonly BuiltMeasure[],
  shown: readonly StaffId[],
) {
  for (const staff of shown) {
    const chords = chordsAlong(built, staff)
    context.openGroup(`staff-${staff}`)
    const slurs: (StaveNote | undefined)[] = []
    let hairpin: { from: StaveNote; type: number; afterDynamic: boolean } | null = null
    // A hairpin starts clear of a dynamic under its first note and stops short of one under its last.
    const drawHairpin = (to: StaveNote, toDynamic = false) => {
      if (!hairpin || hairpin.from === to) return
      new StaveHairpin({ firstNote: hairpin.from, lastNote: to }, hairpin.type)
        .setRenderOptions({
          height: 10,
          yShift: 0,
          leftShiftPx: hairpin.afterDynamic ? DYNAMIC_ROOM : 0,
          rightShiftPx: toDynamic ? -DYNAMIC_ROOM : 0,
          leftShiftTicks: 0,
          rightShiftTicks: 0,
        })
        .setPosition(Modifier.Position.BELOW)
        .setContext(context)
        .draw()
      hairpin = null
    }
    // A holder, so the line drawn and the line read share one run.
    const run: { octave: { line: '8va' | '8vb'; from: StaveNote; to: StaveNote } | null } = {
      octave: null,
    }
    const drawOctave = () => {
      const octave = run.octave
      if (!octave) return
      new TextBracket({
        start: octave.from,
        stop: octave.to,
        text: '8',
        superscript: octave.line === '8va' ? 'va' : 'vb',
        position: octave.line === '8va' ? TextBracket.Position.TOP : TextBracket.Position.BOTTOM,
      })
        .setContext(context)
        .draw()
      run.octave = null
    }
    for (const { event, note } of chords) {
      const marks = event.marks
      if (marks?.slurEnd) {
        new Curve(slurs.pop(), note, {}).setContext(context).draw()
      }
      if (marks?.slurStart) slurs.push(note)
      if (marks?.dynamic || marks?.hairpin) drawHairpin(note, marks.dynamic !== undefined)
      if (marks?.hairpin === 'cresc' || marks?.hairpin === 'dim') {
        hairpin = {
          from: note,
          afterDynamic: marks.dynamic !== undefined,
          type: marks.hairpin === 'cresc' ? StaveHairpin.type.CRESC : StaveHairpin.type.DECRESC,
        }
      }
      const line = marks?.octave
      if (run.octave && run.octave.line !== line) drawOctave()
      if (line)
        run.octave = run.octave ? { ...run.octave, to: note } : { line, from: note, to: note }
    }
    for (const from of slurs) new Curve(from, undefined, {}).setContext(context).draw()
    const last = chords.at(-1)?.note
    if (last) drawHairpin(last)
    drawOctave()
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

/** A line shorter than this share of the width it may fill is left as it is: a lone bar is not a page's width. */
const LEAST_SPREAD = 0.4

/**
 * The measures' notes given room alike, each by its share, so the line runs to `width` (VexFlow
 * units) as a printed system is justified; the clef, key and time keep their room. A line already as
 * wide, or far shorter, is left as it is.
 */
function spread(built: BuiltMeasure[], width: number | undefined): BuiltMeasure[] {
  const natural = built.reduce((sum, measure) => sum + measure.width, 0)
  const notes = built.reduce((sum, measure) => sum + measure.notes, 0)
  const room = width === undefined ? 0 : width - END_MARGIN
  if (notes <= 0 || room <= natural || natural < room * LEAST_SPREAD) return built
  const extra = room - natural
  return built.map((measure) => {
    const more = (extra * measure.notes) / notes
    return { ...measure, width: measure.width + more, notes: measure.notes + more }
  })
}

export interface EngraveOptions {
  readonly scale: number
  readonly fingers: boolean
  readonly names: boolean
  readonly staff?: StaffId | undefined
  /** The staves drawn, of the score's, top down (some hidden): all of them unless `staff` names one. */
  readonly staves?: readonly StaffId[] | undefined
  /** The time signature in force before the first measure: a line that continues prints it only where it changes. */
  readonly timeBefore?: TimeSignature | undefined
  /** A width in CSS pixels the line is spread to, its measures widened alike (`spread`). */
  readonly fill?: number | undefined
}

/** How many measures are built, or drawn, between two chances for the browser to do something else. */
const MEASURES_A_STEP = 8

/**
 * Engraves a score into `host` as one system of measures left to right (spec §2.5), on the grand
 * staff or on `staff` alone, and says where everything is, in CSS pixels at `scale`.
 */
export function engrave(score: Score, host: HTMLDivElement, options: EngraveOptions): ScoreLayout {
  const { next } = startEngraving(score, host, options)
  for (;;) {
    const step = next()
    if (step.done) return step.value
  }
}

/**
 * `engrave` a step at a time, the browser given its turn between steps that took `budget` ms, so a
 * long score never holds a tap back. Stopped by `signal`, it leaves what was there and says null; the
 * score appears whole once it is all drawn.
 */
export async function engraveInSteps(
  score: Score,
  host: HTMLDivElement,
  options: EngraveOptions,
  { signal, budget = 12 }: { signal: AbortSignal; budget?: number },
): Promise<ScoreLayout | null> {
  const { next, stop } = startEngraving(score, host, options)
  let since = performance.now()
  for (;;) {
    if (signal.aborted) {
      stop()
      return null
    }
    const step = next()
    if (step.done) return step.value
    if (performance.now() - since >= budget) {
      await new Promise((resolve) => setTimeout(resolve, 0))
      since = performance.now()
    }
  }
}

/**
 * The engraving, a few measures a step. It draws into a sheet of its own inside `host`, unseen, and
 * puts the drawing in place of what was there only once it is done; `stop` takes the sheet away, the
 * old drawing left as it was. One that fails clears the host.
 */
function startEngraving(score: Score, host: HTMLDivElement, options: EngraveOptions) {
  setUpVexFlow()
  // Laid out though unseen: VexFlow measures its text in the drawing.
  const sheet = host.ownerDocument.createElement('div')
  sheet.style.cssText = 'position:absolute;inset:0;visibility:hidden'
  host.append(sheet)
  const steps = drawn(score, host, sheet, options)
  return {
    // A score that cannot be engraved leaves nothing drawn: not the old drawing under its error.
    next: (): IteratorResult<void, ScoreLayout> => {
      try {
        return steps.next()
      } catch (error) {
        host.replaceChildren()
        throw error
      }
    },
    stop: () => sheet.remove(),
  }
}

function* drawn(
  score: Score,
  host: HTMLDivElement,
  sheet: HTMLDivElement,
  { scale: asked, fingers, names, staff, staves: chosen, timeBefore, fill }: EngraveOptions,
): Generator<void, ScoreLayout, void> {
  const written = score.staves.length > 0 ? score.staves : STAVES
  const shown: readonly StaffId[] = staff
    ? [staff]
    : (chosen?.filter((each) => written.includes(each)) ?? written)
  if (shown.length === 0) throw new RangeError('A score is engraved on at least one staff')
  // The grand staff's brace stands left of its staves: room for it before the first measure.
  const lead = shown.includes('treble') && shown.includes('bass') ? BRACE_ROOM : 0
  const lineWidth = (measures: readonly BuiltMeasure[]) =>
    lead + measures.reduce((sum, measure) => sum + measure.width, 0) + END_MARGIN
  function* naturalAt(scale: number): Generator<void, BuiltMeasure[], void> {
    const natural: BuiltMeasure[] = []
    for (const [index, measure] of score.measures.entries()) {
      natural.push(
        buildMeasure(score, measure, score.measures[index - 1], timeBefore, {
          fingers,
          names,
          scale,
          shown,
        }),
      )
      if ((index + 1) % MEASURES_A_STEP === 0) yield
    }
    return natural
  }
  let scale = asked
  let natural = yield* naturalAt(scale)
  // A line wider than the width it may fill is drawn smaller to fit it, never wider than the screen:
  // built again at that size, as its chord names keep their own size and need more of its room.
  if (fill !== undefined && lineWidth(natural) * scale > fill) {
    scale = fill / lineWidth(natural)
    natural = yield* naturalAt(scale)
    scale = Math.min(scale, fill / lineWidth(natural))
  }
  const built = spread(natural, fill === undefined ? undefined : fill / scale - lead)
  const width = lineWidth(built)
  const places = placesOf(built, shown)
  const renderer = new Renderer(sheet, Renderer.Backends.SVG)
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
  let x = lead
  for (const [index, measure] of built.entries()) {
    if (index > 0 && index % MEASURES_A_STEP === 0) yield
    const drawn = shown.map((on) => ({
      staff: on,
      stave: staveAt(
        on,
        { x, y: places.y[on] ?? 0, width: measure.width },
        measure,
        keyOf(score, measure.measure),
      ),
    }))
    const [top] = drawn
    const bottom = drawn.at(-1)
    if (!top || !bottom) throw new RangeError('A score is engraved on at least one staff')
    const start = Math.max(...drawn.map(({ stave }) => stave.getNoteStartX()))
    for (const { stave } of drawn) stave.setNoteStartX(start).setContext(context).draw()
    // A system's staves are joined at its left; the grand staff's two by a brace and their barlines,
    // the tune's staff over it keeping its own, as a song's piano part is printed.
    const treble = drawn.find((each) => each.staff === 'treble')
    const bass = drawn.find((each) => each.staff === 'bass')
    if (top !== bottom && measure.clefs) {
      new StaveConnector(top.stave, bottom.stave).setType('singleLeft').setContext(context).draw()
    }
    if (treble && bass) {
      if (measure.clefs)
        new StaveConnector(treble.stave, bass.stave).setType('brace').setContext(context).draw()
      new StaveConnector(treble.stave, bass.stave).setType('singleRight').setContext(context).draw()
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
  drawSpans(context, built, shown)
  host.replaceChildren(...sheet.childNodes)

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
