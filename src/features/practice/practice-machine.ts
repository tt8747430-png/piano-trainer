import type { Performance } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import { audibleHands, type Audible, type Hands } from '@/shared/lib/schedule'
import type { BeatGroupRange } from './loop'
import { waitsForNotes, type PracticeMode } from './practice-mode'

export type Outcome = 'waiting' | 'correct' | 'wrong' | 'finished'

export interface PracticeState {
  readonly performance: Performance
  readonly mode: PracticeMode
  readonly hands: Hands
  /** The loop's beat groups; null goes through the whole piece. */
  readonly loop: BeatGroupRange | null
  /** Where the learner is. */
  readonly beatGroup: number
  /**
   * How many times a beat group has been arrived at: a loop of one beat group arrives at the same one
   * again, and the hook that plays on from it must hear that it did.
   */
  readonly arrival: number
  /** Listen: the transport runs. Wait mode: the app waits for notes. */
  readonly playing: boolean
  /**
   * Wait mode: the keys the practised hands play here, lowest first (Chordio, Metronaut: the keys, not
   * their pitch classes, so an octave doubled wants both and a key an octave off is a slip).
   */
  readonly expected: readonly Midi[]
  readonly received: readonly Midi[]
  /**
   * Wait mode: keys played before their beat group, while the app plays the other hand or a rest;
   * the app's move on counts them, a learner's move forgets them.
   */
  readonly ahead: readonly Midi[]
  readonly outcome: Outcome
  /** The last wrong key, to show. */
  readonly wrong: Midi | null
  /** Wait mode: the wrong keys already counted at this beat group: one key slips once a step. */
  readonly wrongHere: readonly Midi[]
  /** Wait mode: the steps of this pass with a slip, by bar (from 0): what its score counts. */
  readonly slips: Readonly<Partial<Record<number, number>>>
  /**
   * Wait mode: the steps of this pass that took over two beats, by bar (from 0): shown beside the
   * slips, never scored (research item 14, Chordio's time per step).
   */
  readonly pauses: Readonly<Partial<Record<number, number>>>
  /**
   * Wait mode: the passes played to their end while it played, a loop's every lap: what a piece's
   * Player records as a lesson done (ADR 0111).
   */
  readonly passes: number
  /**
   * Wait mode: the slips of the pass last counted, by bar; null before one is. Its score (a lesson
   * done from a good pass, ADR 0111) and the exercise's ladder read it.
   */
  readonly lastPassSlips: Readonly<Partial<Record<number, number>>> | null
  /** Wait mode: the pauses of the pass last counted, by bar; null before one is. */
  readonly lastPassPauses: Readonly<Partial<Record<number, number>>> | null
  /**
   * Wait mode: this pass was moved on by hand (› or a place ahead tapped), or begun part way, so it
   * is not counted as played.
   */
  readonly skipped: boolean
}

export type PracticeEvent =
  | {
      readonly type: 'configure'
      readonly performance: Performance
      readonly mode: PracticeMode
      readonly hands: Hands
      readonly loop: BeatGroupRange | null
    }
  | { readonly type: 'play' }
  | { readonly type: 'stop' }
  /** The transport arrived at a beat group. */
  | { readonly type: 'reach'; readonly beatGroup: number }
  | { readonly type: 'next' }
  /** Wait mode moves on by itself after a right answer or a rest. */
  | { readonly type: 'advance' }
  | { readonly type: 'prev' }
  /** The learner tapped a beat group. */
  | { readonly type: 'jumpToBeatGroup'; readonly beatGroup: number }
  /** A key played. */
  | { readonly type: 'noteOn'; readonly midi: Midi }
  /** Wait mode: this step took the learner over two beats. */
  | { readonly type: 'pause' }

/** The hands Wait mode waits for: the audible ones, never a staff over the piano (ADR 0097). */
export const practisedHands = (hands: Hands): Audible => ({ ...audibleHands(hands), staff: false })

/** What the app plays in Wait mode: the hands not practised, and the staves over the piano. */
export function accompanyingHands(hands: Hands): Audible {
  const practised = practisedHands(hands)
  return { rh: !practised.rh, lh: !practised.lh, staff: true }
}

function expectedAt(performance: Performance, beatGroup: number, hands: Hands): Midi[] {
  const practised = practisedHands(hands)
  const keys = new Set<Midi>()
  for (const index of performance.beatGroups[beatGroup]?.notes ?? []) {
    const played = performance.notes[index]
    if (played && practised[played.hand]) keys.add(played.midi)
  }
  return [...keys].sort((a, b) => a - b)
}

/** The beat groups the cursor may be on: the loop's, or the whole piece's. */
const bounds = (state: Pick<PracticeState, 'performance' | 'loop'>): BeatGroupRange =>
  state.loop ?? { first: 0, last: Math.max(0, state.performance.beatGroups.length - 1) }

/**
 * The beat group of `to`'s performance at the moment `from`'s cursor stands on: a new arrangement
 * (another pattern, chord size or key) may cut a bar into more or fewer beat groups.
 */
function sameMoment(from: PracticeState, to: PracticeState): number {
  if (from.performance === to.performance) return from.beatGroup
  const tick = from.performance.beatGroups[from.beatGroup]?.tick ?? 0
  return Math.max(
    0,
    to.performance.beatGroups.findLastIndex((group) => group.tick <= tick),
  )
}

const clamp = (state: PracticeState, beatGroup: number) => {
  const { first, last } = bounds(state)
  return Math.min(last, Math.max(first, beatGroup))
}

/** Arriving at a beat group: in Wait mode it sets what is expected and waits. */
function moveTo(state: PracticeState, beatGroup: number): PracticeState {
  return {
    ...state,
    beatGroup,
    // A pass begins at the start, its slips counted afresh and nothing of it skipped: a loop's lap,
    // a pass begun again.
    slips: beatGroup === bounds(state).first ? {} : state.slips,
    pauses: beatGroup === bounds(state).first ? {} : state.pauses,
    skipped: beatGroup === bounds(state).first ? false : state.skipped,
    arrival: state.arrival + 1,
    expected: waitsForNotes(state.mode)
      ? expectedAt(state.performance, beatGroup, state.hands)
      : [],
    received: [],
    ahead: [],
    outcome: 'waiting',
    wrong: null,
    wrongHere: [],
  }
}

const isComplete = (expected: readonly Midi[], received: readonly Midi[]) =>
  expected.every((key) => received.includes(key))

/** On by itself: the keys played ahead count toward the beat group arrived at, or wait through a rest. */
function advance(state: PracticeState): PracticeState {
  const moved = next(state)
  if (moved.outcome === 'finished' || state.ahead.length === 0) return moved
  if (moved.expected.length === 0) return { ...moved, ahead: state.ahead }
  const received = moved.expected.filter((key) => state.ahead.includes(key))
  return {
    ...moved,
    received,
    outcome: received.length > 0 && isComplete(moved.expected, received) ? 'correct' : 'waiting',
  }
}

export function initialPractice(
  performance: Performance,
  mode: PracticeMode,
  hands: Hands,
  loop: BeatGroupRange | null = null,
): PracticeState {
  const state: PracticeState = {
    performance,
    mode,
    hands,
    loop,
    beatGroup: 0,
    arrival: 0,
    playing: false,
    expected: [],
    received: [],
    ahead: [],
    outcome: 'waiting',
    wrong: null,
    wrongHere: [],
    slips: {},
    pauses: {},
    passes: 0,
    lastPassSlips: null,
    lastPassPauses: null,
    skipped: false,
  }
  return moveTo(state, bounds(state).first)
}

/**
 * On past the end: Listen and a loop go round; Wait mode through the whole piece finishes, stopped.
 * Wait mode counts a pass it played to the end, round a loop or finished, where nothing of it was
 * skipped.
 */
function next(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup < last) return moveTo(state, state.beatGroup + 1)
  const played = waitsForNotes(state.mode) && state.playing && !state.skipped
  const passes = played ? state.passes + 1 : state.passes
  const lastPassSlips = played ? state.slips : state.lastPassSlips
  const lastPassPauses = played ? state.pauses : state.lastPassPauses
  if (state.mode === 'listen' || state.loop)
    return { ...moveTo(state, first), passes, lastPassSlips, lastPassPauses }
  return {
    ...state,
    passes,
    lastPassSlips,
    lastPassPauses,
    playing: false,
    expected: [],
    received: [],
    ahead: [],
    outcome: 'finished',
    wrong: null,
    wrongHere: [],
  }
}

/** Back past the start: Listen goes round to the end, Wait mode stays. */
function prev(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup > first) return moveTo(state, state.beatGroup - 1)
  return moveTo(state, waitsForNotes(state.mode) ? first : last)
}

/** The keys the hands not practised play at a beat group: the app's to play, not a slip. */
function accompaniedAt(performance: Performance, beatGroup: number, hands: Hands): Midi[] {
  const practised = practisedHands(hands)
  return (performance.beatGroups[beatGroup]?.notes ?? []).flatMap((index) => {
    const played = performance.notes[index]
    return played && !practised[played.hand] ? [played.midi] : []
  })
}

function noteOn(given: PracticeState, key: Midi): PracticeState {
  if (!waitsForNotes(given.mode) || given.outcome === 'finished') return given
  // Stopped, the first right key starts the music (Metronaut's "Start playing when you are ready",
  // Flat's take on its first note); any other key is only heard.
  if (!given.playing && !given.expected.includes(key)) return given
  const state = given.playing ? given : { ...given, playing: true }
  // Played while the app plays the other hand or a rest: it belongs to a beat group to come.
  if (state.outcome === 'correct' || state.expected.length === 0) {
    return state.ahead.includes(key) ? state : { ...state, ahead: [...state.ahead, key] }
  }
  if (!state.expected.includes(key)) {
    // The other hand's note here, played along, is no slip (Chordio, Metronaut): it only sounds.
    if (accompaniedAt(state.performance, state.beatGroup, state.hands).includes(key)) return state
    // The same wrong key again at this step says so again, but slips once.
    if (state.wrongHere.includes(key)) return { ...state, outcome: 'wrong', wrong: key }
    // A step slips once, whatever wrong keys fall in it: the pass's score counts clean steps.
    const bar = state.performance.beatGroups[state.beatGroup]?.bar ?? 0
    const first = state.wrongHere.length === 0
    const slips = first ? { ...state.slips, [bar]: (state.slips[bar] ?? 0) + 1 } : state.slips
    return { ...state, outcome: 'wrong', wrong: key, wrongHere: [...state.wrongHere, key], slips }
  }
  const received = state.received.includes(key) ? state.received : [...state.received, key]
  const outcome = isComplete(state.expected, received) ? 'correct' : 'waiting'
  return { ...state, received, outcome, wrong: null }
}

/** Every rule of Listen and Wait mode; the practice hook connects it to time and sound. */
export function practiceReducer(state: PracticeState, event: PracticeEvent): PracticeState {
  switch (event.type) {
    case 'configure': {
      const configured: PracticeState = {
        ...state,
        performance: event.performance,
        mode: event.mode,
        hands: event.hands,
        loop: event.loop,
        playing: state.playing && event.mode === state.mode,
        // Other music, hands or loop: the slips counted were another pass's, and a pass from here
        // on is begun part way unless it is at the start.
        slips: {},
        pauses: {},
        skipped: true,
      }
      // A finished pass starts again at the start.
      if (state.outcome === 'finished') return moveTo(configured, bounds(configured).first)
      // The cursor keeps its moment; outside a new loop it starts at the loop's start.
      const { loop } = configured
      const at = sameMoment(state, configured)
      const outside = loop !== null && (at < loop.first || at > loop.last)
      return moveTo(configured, outside ? loop.first : clamp(configured, at))
    }
    case 'play':
      return state.outcome === 'finished'
        ? { ...moveTo(state, bounds(state).first), playing: true }
        : { ...state, playing: true }
    case 'stop':
      return state.playing ? { ...state, playing: false } : state
    case 'reach': {
      const moves =
        event.beatGroup !== state.beatGroup &&
        Number.isInteger(event.beatGroup) &&
        clamp(state, event.beatGroup) === event.beatGroup
      return state.mode === 'listen' && state.playing && moves
        ? { ...state, beatGroup: event.beatGroup }
        : state
    }
    case 'next':
      // Moved on by hand: the beat group left is not played.
      return next({ ...state, skipped: true })
    case 'advance':
      return advance(state)
    case 'prev':
      return prev(state)
    case 'jumpToBeatGroup': {
      if (event.beatGroup < 0 || event.beatGroup >= state.performance.beatGroups.length)
        return state
      const to = clamp(state, event.beatGroup)
      // A place ahead leaves the beat groups between it and here unplayed; one behind plays them again.
      return moveTo({ ...state, skipped: state.skipped || to > state.beatGroup }, to)
    }
    case 'noteOn':
      return noteOn(state, event.midi)
    case 'pause': {
      if (!waitsForNotes(state.mode) || state.outcome === 'finished') return state
      const bar = state.performance.beatGroups[state.beatGroup]?.bar ?? 0
      return { ...state, pauses: { ...state.pauses, [bar]: (state.pauses[bar] ?? 0) + 1 } }
    }
  }
}
