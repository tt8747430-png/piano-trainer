import {
  Accidental,
  Beam,
  Dot,
  Fraction,
  FretHandFinger,
  GhostNote,
  Modifier,
  Stave,
  StaveNote,
  Stem,
  Tuplet,
  Voice,
  VoiceMode,
} from 'vexflow/core'
import {
  isCompound,
  TICKS_PER_BEAT,
  timeSignature,
  type Accidental as Sign,
  type Meter,
} from '@/shared/lib/music'
import {
  ticksOf,
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

/** A voice's fingers stand on its outer side: an upper voice's over it, a lower voice's under it; a lone voice's over the treble and under the bass. */
const sideOf = (staff: StaffId, stem: ScoreVoice['stem']): FingerSide =>
  stem === 'up' ? 'above' : stem === 'down' ? 'below' : staff === 'treble' ? 'above' : 'below'

/** A staff at the origin: where VexFlow puts a note's line, from its staff's own top. */
let origin: Stave | null = null
const lineY = (line: number): number => (origin ??= new Stave(0, 0, 0)).getYForNote(line)

const code = (duration: Duration) => `${VALUE_CODE[duration.value]}${duration.dots ? 'd' : ''}`
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
  }: { staff: StaffId; stem: ScoreVoice['stem']; wholeBar: boolean; names: boolean },
): VexNote {
  if (event.kind === 'rest') {
    if (event.hidden) return new GhostNote({ duration: code(event.duration) })
    const rest = new StaveNote({
      keys: [REST_KEY[staff][stem]],
      duration: wholeBar ? 'w' : code(event.duration),
      type: 'r',
      clef: staff,
      alignCenter: wholeBar,
    })
    if (!wholeBar && event.duration.dots) Dot.buildAndAttach([rest], { all: true })
    return rest
  }
  const note = new StaveNote({
    keys: event.notes.map(keyOf),
    duration: code(event.duration),
    clef: staff,
    ...(stem === 'auto'
      ? { autoStem: true }
      : { stemDirection: stem === 'up' ? Stem.UP : Stem.DOWN }),
  })
  if (names) nameHeads(note, event.notes, event.duration.value)
  event.notes.forEach((written, index) => {
    if (written.accidental !== null)
      note.addModifier(new Accidental(SIGN[written.accidental]), index)
  })
  if (event.duration.dots) Dot.buildAndAttach([note], { all: true })
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
  }: { staff: StaffId; measure: Measure; meter: Meter; fingers: boolean; names: boolean },
): BuiltVoice {
  const [only] = voice.events
  const wholeBar =
    voice.events.length === 1 &&
    only?.kind === 'rest' &&
    !only.hidden &&
    ticksOf(only.duration, meter) === measure.ticks
  const notes = voice.events.map((event) => ({
    event,
    note: noteOf(event, { staff, stem: voice.stem, wholeBar, names }),
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
