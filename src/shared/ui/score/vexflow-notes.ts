import {
  Accidental,
  Beam,
  Dot,
  Fraction,
  FretHandFinger,
  GhostNote,
  Modifier,
  StaveNote,
  Stem,
  Stroke,
  Tuplet,
  Voice,
  VoiceMode,
} from 'vexflow/core'
import { isCompound, TICKS_PER_BEAT, type Accidental as Sign, type Meter } from '@/shared/lib/music'
import {
  ticksOf,
  type Duration,
  type Measure,
  type ScoreEvent,
  type ScoreVoice,
  type StaffId,
  type WrittenNote,
} from '@/shared/lib/notation'

const VALUE_CODE = { 1: 'w', 2: 'h', 4: 'q', 8: '8', 16: '16', 32: '32' } as const
const SIGN: Readonly<Record<Sign, string>> = { [-2]: 'bb', [-1]: 'b', 0: 'n', 1: '#', 2: '##' }
/** Where a rest sits: in the middle of a staff alone, above or below it beside another voice. */
const REST_KEY: Readonly<Record<StaffId, Readonly<Record<ScoreVoice['stem'], string>>>> = {
  treble: { auto: 'b/4', up: 'e/5', down: 'f/4' },
  bass: { auto: 'd/3', up: 'g/3', down: 'a/2' },
}

const code = (duration: Duration) => `${VALUE_CODE[duration.value]}${duration.dots ? 'd' : ''}`
const keyOf = (note: WrittenNote) => `${note.spelled.letter.toLowerCase()}/${note.octave}`

export type VexNote = StaveNote | GhostNote

/** One voice of one staff's measure, built for VexFlow: its notes (with the events they write), beams and tuplets. */
export interface BuiltVoice {
  readonly voice: Voice
  /** A lone whole-bar rest, centred in its bar: it marks no onset. */
  readonly wholeBar: boolean
  readonly notes: readonly { readonly event: ScoreEvent; readonly note: VexNote }[]
  readonly beams: readonly Beam[]
  /** Tuplets to draw: a triplet beat of a hidden rest keeps its time and draws no 3. */
  readonly tuplets: readonly Tuplet[]
}

function noteOf(
  event: ScoreEvent,
  {
    staff,
    stem,
    fingers,
    wholeBar,
  }: { staff: StaffId; stem: ScoreVoice['stem']; fingers: boolean; wholeBar: boolean },
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
  event.notes.forEach((written, index) => {
    if (written.accidental !== null)
      note.addModifier(new Accidental(SIGN[written.accidental]), index)
    if (fingers && written.finger) {
      const finger = new FretHandFinger(String(written.finger))
      finger.setPosition(staff === 'treble' ? Modifier.Position.ABOVE : Modifier.Position.BELOW)
      note.addModifier(finger, index)
    }
  })
  if (event.rolled) note.addStroke(0, new Stroke(Stroke.Type.ARPEGGIO_DIRECTIONLESS))
  if (event.duration.dots) Dot.buildAndAttach([note], { all: true })
  return note
}

/** A measure's voice for VexFlow (spec §2.5): triplets bracketed per beat, beams by the beat. */
export function buildVoice(
  voice: ScoreVoice,
  {
    staff,
    measure,
    meter,
    fingers,
  }: { staff: StaffId; measure: Measure; meter: Meter; fingers: boolean },
): BuiltVoice {
  const [only] = voice.events
  const wholeBar =
    voice.events.length === 1 &&
    only?.kind === 'rest' &&
    !only.hidden &&
    ticksOf(only.duration, meter) === measure.ticks
  const notes = voice.events.map((event) => ({
    event,
    note: noteOf(event, { staff, stem: voice.stem, fingers, wholeBar }),
  }))
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
  const built = new Voice({ numBeats: measure.time.count, beatValue: measure.time.unit })
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
  }
}
