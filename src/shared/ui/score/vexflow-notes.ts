import {
  Accidental,
  Annotation,
  AnnotationVerticalJustify,
  Articulation,
  Beam,
  Dot,
  Fraction,
  FretHandFinger,
  GhostNote,
  GraceNote,
  GraceNoteGroup,
  Modifier,
  Ornament,
  Stave,
  StaveNote,
  Stem,
  Stroke,
  Tremolo,
  Tuplet,
  Voice,
  VoiceMode,
} from 'vexflow/core'
import {
  isCompound,
  keySignature,
  TICKS_PER_BEAT,
  timeSignature,
  writtenOctave,
  type Accidental as Sign,
  type Articulation as ArticulationMark,
  type Key,
  type Letter,
  type Meter,
  type NoteMarks,
  type Ornament as OrnamentMark,
} from '@/shared/lib/music'
import {
  ticksOf,
  clefOf,
  type Duration,
  type Measure,
  type ScoreEvent,
  type ScoreVoice,
  type StaffId,
  type WrittenNote,
} from '@/shared/lib/notation'
import { namedHead } from './named-head'

const VALUE_CODE = { 1: 'w', 2: 'h', 4: 'q', 8: '8', 16: '16', 32: '32' } as const
const SIGN: Readonly<Record<Sign, string>> = { [-2]: 'bb', [-1]: 'b', 0: 'n', 1: '#', 2: '##' }
/** Where a rest sits: in the middle of a staff alone, above or below it beside another voice. */
const REST_KEY: Readonly<Record<StaffId, Readonly<Record<ScoreVoice['stem'], string>>>> = {
  melody: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  voice2: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  voice3: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  voice4: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  treble: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  bass: { auto: 'd/3', up: 'g/3', down: 'a/2' },
}

/** How far apart a column's fingers stand: a staff space. */
const FINGER_STEP = 10
/** Where VexFlow draws a finger's baseline from its note's head (`FretHandFinger.draw`): 7 above it, 15 under it. */
const FINGER_BASELINE = { above: -7, below: 15 } as const
/** A finger's digit, drawn at VexFlow's 9pt, stands this high over its baseline. */
const DIGIT_HEIGHT = 9

type FingerSide = keyof FingerReach

/** A voice's fingers stand on its outer side: an upper voice's over it, a lower voice's under it; a lone voice's over a treble and under the bass. */
const sideOf = (staff: StaffId, stem: ScoreVoice['stem']): FingerSide =>
  stem === 'up' ? 'above' : stem === 'down' ? 'below' : staff === 'bass' ? 'below' : 'above'

/** A staff at the origin: where VexFlow puts a note's line, from its staff's own top. */
let origin: Stave | null = null
const lineY = (line: number): number => (origin ??= new Stave(0, 0, 0)).getYForNote(line)

/** VexFlow's codes for each mark (its `Tables`): the upper mordent is its `mordent`, the lower its `mordentInverted`. */
const ARTICULATION_CODE: Readonly<Record<ArticulationMark, string>> = {
  staccato: 'a.',
  staccatissimo: 'av',
  accent: 'a>',
  tenuto: 'a-',
  marcato: 'a^',
  fermata: 'a@a',
}
/** Marks printed over the staff whichever way the stem goes; the rest stand by the notehead. */
const ALWAYS_ABOVE: ReadonlySet<ArticulationMark> = new Set(['marcato', 'fermata'])
const ORNAMENT_CODE: Readonly<Record<Exclude<OrnamentMark, 'tremolo'>, string>> = {
  trill: 'tr',
  mordent: 'mordent',
  'lower-mordent': 'mordentInverted',
  turn: 'turn',
}
/** A tremolo's strokes through the stem: three, as a measured 32nd. */
const TREMOLO_STROKES = 3

/** The letters a key signature alters and how: sharps from F, flats from B. */
const SHARPS_ORDER: readonly Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
function signatureAlter(key: Key, letter: Letter): number {
  const count = keySignature(key)
  const order = count >= 0 ? SHARPS_ORDER : [...SHARPS_ORDER].reverse()
  return order.slice(0, Math.abs(count)).includes(letter) ? Math.sign(count) : 0
}

/**
 * A note's marks drawn on it (ADR 0063): articulations by its head (marcato and a fermata over the
 * staff), an ornament or tremolo, a roll's wavy line, grace notes before it, and its dynamic under it.
 */
function addMarks(note: StaveNote, marks: NoteMarks, key: Key) {
  const stemUp = note.getStemDirection() === Stem.UP
  for (const articulation of marks.articulations ?? []) {
    const mark = new Articulation(ARTICULATION_CODE[articulation])
    mark.setPosition(
      ALWAYS_ABOVE.has(articulation) || !stemUp ? Modifier.Position.ABOVE : Modifier.Position.BELOW,
    )
    note.addModifier(mark, 0)
  }
  if (marks.ornament === 'tremolo') note.addModifier(new Tremolo(TREMOLO_STROKES), 0)
  else if (marks.ornament) note.addModifier(new Ornament(ORNAMENT_CODE[marks.ornament]), 0)
  if (marks.arpeggio) note.addModifier(new Stroke(Stroke.Type.ARPEGGIO_DIRECTIONLESS), 0)
  if (marks.grace?.length) {
    const graces = marks.grace.map((grace) => {
      const graceNote = new GraceNote({
        keys: [`${grace.spelled.letter.toLowerCase()}/${writtenOctave(grace.midi, grace.spelled)}`],
        duration: marks.grace?.length === 1 ? '8' : '16',
        slash: marks.grace?.length === 1,
      })
      if (grace.spelled.accidental !== signatureAlter(key, grace.spelled.letter))
        graceNote.addModifier(new Accidental(SIGN[grace.spelled.accidental]), 0)
      return graceNote
    })
    const group = new GraceNoteGroup(graces, true)
    if (graces.length > 1) group.beamNotes()
    note.addModifier(group, 0)
  }
  if (marks.dynamic) {
    const dynamic = new Annotation(marks.dynamic)
      .setFont('serif', 12, 'bold', 'italic')
      .setVerticalJustification(AnnotationVerticalJustify.BOTTOM)
    note.addModifier(dynamic, 0)
  }
}

const code = (duration: Duration) => `${VALUE_CODE[duration.value]}${'d'.repeat(duration.dots)}`

/** A note's or a rest's dots, one by one. */
const dotted = (note: StaveNote, dots: Duration['dots']) => {
  for (let i = 0; i < dots; i++) Dot.buildAndAttach([note], { all: true })
}
const keyOf = (note: WrittenNote) => `${note.spelled.letter.toLowerCase()}/${note.octave}`

export type VexNote = StaveNote | GhostNote

/**
 * How far a voice's finger columns reach from its staff's own top: the highest point of those over
 * it, the lowest of those under it; null where it has none.
 */
export interface FingerReach {
  readonly above: number | null
  readonly below: number | null
}

/** One voice of one staff's measure, built for VexFlow: its notes (with the events they write), beams and tuplets. */
export interface BuiltVoice {
  readonly voice: Voice
  /** A lone whole-bar rest, centred in its bar: it marks no onset. */
  readonly wholeBar: boolean
  readonly notes: readonly { readonly event: ScoreEvent; readonly note: VexNote }[]
  readonly beams: readonly Beam[]
  /** Tuplets to draw: a triplet beat of a hidden rest keeps its time and draws no 3. */
  readonly tuplets: readonly Tuplet[]
  readonly fingerReach: FingerReach
}

/**
 * Each head its note's name, set on its key: VexFlow builds a note's heads again from its keys
 * whenever its stem turns (a beam turns it), so a head swapped once drawn would be lost.
 */
function nameHeads(note: StaveNote, written: readonly WrittenNote[], value: Duration['value']) {
  note.getKeyProps().forEach((props, index) => {
    const spelled = written[index]?.spelled
    const head = spelled && namedHead(spelled, value)
    if (head) props.code = head
  })
  note.reset()
}

function noteOf(
  event: ScoreEvent,
  {
    staff,
    stem,
    wholeBar,
    names,
    key,
  }: { staff: StaffId; stem: ScoreVoice['stem']; wholeBar: boolean; names: boolean; key: Key },
): VexNote {
  if (event.kind === 'rest') {
    if (event.hidden) return new GhostNote({ duration: code(event.duration) })
    const rest = new StaveNote({
      keys: [REST_KEY[staff][stem]],
      duration: wholeBar ? 'w' : code(event.duration),
      type: 'r',
      clef: clefOf(staff),
      alignCenter: wholeBar,
    })
    if (!wholeBar) dotted(rest, event.duration.dots)
    return rest
  }
  const note = new StaveNote({
    keys: event.notes.map(keyOf),
    duration: code(event.duration),
    clef: clefOf(staff),
    ...(stem === 'auto'
      ? { autoStem: true }
      : { stemDirection: stem === 'up' ? Stem.UP : Stem.DOWN }),
  })
  if (names) nameHeads(note, event.notes, event.duration.value)
  event.notes.forEach((written, index) => {
    if (written.accidental !== null)
      note.addModifier(new Accidental(SIGN[written.accidental]), index)
  })
  dotted(note, event.duration.dots)
  if (event.marks) addMarks(note, event.marks, key)
  return note
}

/**
 * A chord's fingers in one column on its voice's outer side, the top note's finger on top (as
 * printed piano music stacks them), all on the chord's outermost note so they clear its heads.
 * VexFlow would draw each at its own note, over the chord's other heads. Says where the column
 * ends, from the staff's own top: its highest point over the chord, or its lowest under it.
 */
function fingerColumn(
  note: StaveNote,
  written: readonly WrittenNote[],
  side: FingerSide,
): number | null {
  const fingered = written.flatMap((each) =>
    each.finger ? [{ finger: each.finger, midi: each.midi }] : [],
  )
  if (fingered.length === 0) return null
  const lines = note.getKeyProps().map((props) => props.line)
  const outer = side === 'above' ? Math.max(...lines) : Math.min(...lines)
  // Nearest the chord: the lowest note's finger over it, the highest note's under it.
  const nearestFirst = [...fingered].sort((a, b) =>
    side === 'above' ? a.midi - b.midi : b.midi - a.midi,
  )
  nearestFirst.forEach(({ finger }, rank) => {
    const mark = new FretHandFinger(String(finger))
    mark.setPosition(side === 'above' ? Modifier.Position.ABOVE : Modifier.Position.BELOW)
    mark.setOffsetY((side === 'above' ? -rank : rank) * FINGER_STEP)
    note.addModifier(mark, lines.indexOf(outer))
  })
  const far = (fingered.length - 1) * FINGER_STEP
  return side === 'above'
    ? lineY(outer) + FINGER_BASELINE.above - far - DIGIT_HEIGHT
    : lineY(outer) + FINGER_BASELINE.below + far
}

/** A measure's voice for VexFlow (spec §2.5): triplets bracketed per beat, beams by the beat. */
export function buildVoice(
  voice: ScoreVoice,
  {
    staff,
    measure,
    meter,
    fingers,
    names,
    key,
  }: {
    staff: StaffId
    measure: Measure
    meter: Meter
    fingers: boolean
    names: boolean
    key: Key
  },
): BuiltVoice {
  const [only] = voice.events
  const wholeBar =
    voice.events.length === 1 &&
    only?.kind === 'rest' &&
    !only.hidden &&
    ticksOf(only.duration, meter) === measure.ticks
  const notes = voice.events.map((event) => ({
    event,
    note: noteOf(event, { staff, stem: voice.stem, wholeBar, names, key }),
  }))
  const side = sideOf(staff, voice.stem)
  const ends = fingers
    ? notes.flatMap(({ event, note }) =>
        event.kind === 'notes' && note instanceof StaveNote
          ? (fingerColumn(note, event.notes, side) ?? [])
          : [],
      )
    : []
  const fingerReach: FingerReach = {
    above: side === 'above' && ends.length > 0 ? Math.min(...ends) : null,
    below: side === 'below' && ends.length > 0 ? Math.max(...ends) : null,
  }
  const byBeat = new Map<number, VexNote[]>()
  for (const { event, note } of notes) {
    if (!event.duration.triplet) continue
    const beat = Math.floor((event.tick - measure.startTick) / TICKS_PER_BEAT)
    byBeat.set(beat, [...(byBeat.get(beat) ?? []), note])
  }
  // A tuplet is made before its notes join a voice: it sets their ticks.
  const tuplets = [...byBeat.values()].map((group) => ({
    drawn: group.every((note) => note instanceof StaveNote),
    tuplet: new Tuplet(group, { numNotes: 3, notesOccupied: 2 }),
  }))
  // As long as the measure is: a pickup is shorter than the signature it is written under.
  const length = timeSignature(measure.ticks / TICKS_PER_BEAT, meter)
  const built = new Voice({ numBeats: length.count, beatValue: length.unit })
  if (wholeBar) built.setMode(VoiceMode.SOFT)
  built.addTickables(notes.map(({ note }) => note))
  // Every note, a hidden rest's too: VexFlow counts the beat through it and breaks the beam at it.
  const beams = Beam.generateBeams(
    notes.map(({ note }) => note),
    {
      groups: [isCompound(meter) ? new Fraction(3, 8) : new Fraction(1, 4)],
      maintainStemDirections: voice.stem !== 'auto',
      beamRests: false,
    },
  )
  return {
    voice: built,
    wholeBar,
    notes,
    beams,
    tuplets: tuplets.filter(({ drawn }) => drawn).map(({ tuplet }) => tuplet),
    fingerReach,
  }
}
