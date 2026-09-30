import type { Performance } from '@/shared/lib/arrangement'
import { pitchClass, type Midi, type PitchClass } from '@/shared/lib/music'
import { audibleHands, type Audible, type Hands } from '@/shared/lib/schedule'
import type { BeatGroupRange } from './loop'

/** Listen: the app plays at a tempo. Wait mode: the app waits for your notes (spec §2.7). */
export const PRACTICE_MODES = ['listen', 'wait'] as const
export type PracticeMode = (typeof PRACTICE_MODES)[number]
export type Outcome = 'waiting' | 'correct' | 'wrong' | 'finished'

export interface PracticeState {
  readonly performance: Performance
  readonly mode: PracticeMode
  readonly hands: Hands
  /** The loop's beat groups; null goes through the whole piece. */
  readonly loop: BeatGroupRange | null
  /** Where the learner is. */
  readonly beatGroup: number
  /** Listen: the transport runs. Wait mode: the app waits for notes. */
  readonly playing: boolean
  /** Wait mode: the pitch classes the practised hands play here, lowest first. */
  readonly expected: readonly PitchClass[]
  readonly received: readonly PitchClass[]
  /**
   * Wait mode: keys played before their beat group, while the app plays the other hand or a rest;
   * the app's move on counts them, a learner's move forgets them.
   */
  readonly ahead: readonly PitchClass[]
  readonly outcome: Outcome
  /** The last wrong key, to show. */
  readonly wrong: Midi | null
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
  | { readonly type: 'jumpToBar'; readonly bar: number }
  /** The learner tapped a beat group. */
  | { readonly type: 'jumpToBeatGroup'; readonly beatGroup: number }
  | { readonly type: 'noteOn'; readonly midi: Midi }

/** The hands Wait mode waits for: the audible ones, never the doubled tune. */
export const practisedHands = (hands: Hands): Audible => ({ ...audibleHands(hands), melody: false })

/** What the app plays in Wait mode: the hands not practised, and the tune. */
export function accompanyingHands(hands: Hands): Audible {
  const practised = practisedHands(hands)
  return { rh: !practised.rh, lh: !practised.lh, melody: true }
}

function expectedAt(performance: Performance, beatGroup: number, hands: Hands): PitchClass[] {
  const practised = practisedHands(hands)
  const pcs = new Set<PitchClass>()
  for (const index of performance.beatGroups[beatGroup]?.notes ?? []) {
    const played = performance.notes[index]
    if (played && practised[played.hand]) pcs.add(pitchClass(played.midi))
  }
  return [...pcs].sort((a, b) => a - b)
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
    expected: state.mode === 'wait' ? expectedAt(state.performance, beatGroup, state.hands) : [],
    received: [],
    ahead: [],
    outcome: 'waiting',
    wrong: null,
  }
}

const isComplete = (expected: readonly PitchClass[], received: readonly PitchClass[]) =>
  expected.every((pc) => received.includes(pc))

/** On by itself: the keys played ahead count toward the beat group arrived at, or wait through a rest. */
function advance(state: PracticeState): PracticeState {
  const moved = next(state)
  if (moved.outcome === 'finished' || state.ahead.length === 0) return moved
  if (moved.expected.length === 0) return { ...moved, ahead: state.ahead }
  const received = moved.expected.filter((pc) => state.ahead.includes(pc))
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
    playing: false,
    expected: [],
    received: [],
    ahead: [],
    outcome: 'waiting',
    wrong: null,
  }
  return moveTo(state, bounds(state).first)
}

/** On past the end: Listen and a loop go round; Wait mode through the whole piece finishes, stopped. */
function next(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup < last) return moveTo(state, state.beatGroup + 1)
  if (state.mode === 'listen' || state.loop) return moveTo(state, first)
  return {
    ...state,
    playing: false,
    expected: [],
    received: [],
    ahead: [],
    outcome: 'finished',
    wrong: null,
  }
}

/** Back past the start: Listen goes round to the end, Wait mode stays. */
function prev(state: PracticeState): PracticeState {
  if (state.performance.beatGroups.length === 0) return state
  const { first, last } = bounds(state)
  if (state.beatGroup > first) return moveTo(state, state.beatGroup - 1)
  return moveTo(state, state.mode === 'wait' ? first : last)
}

function noteOn(state: PracticeState, key: Midi): PracticeState {
  if (state.mode !== 'wait' || !state.playing || state.outcome === 'finished') return state
  const pc = pitchClass(key)
  // Played while the app plays the other hand or a rest: it belongs to a beat group to come.
  if (state.outcome === 'correct' || state.expected.length === 0) {
    return state.ahead.includes(pc) ? state : { ...state, ahead: [...state.ahead, pc] }
  }
  if (!state.expected.includes(pc)) return { ...state, outcome: 'wrong', wrong: key }
  const received = state.received.includes(pc) ? state.received : [...state.received, pc]
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
      }
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
      return next(state)
    case 'advance':
      return advance(state)
    case 'prev':
      return prev(state)
    case 'jumpToBar': {
      const target = state.performance.beatGroups.findIndex((group) => group.bar === event.bar)
      return target < 0 ? state : moveTo(state, clamp(state, target))
    }
    case 'jumpToBeatGroup':
      return event.beatGroup >= 0 && event.beatGroup < state.performance.beatGroups.length
        ? moveTo(state, clamp(state, event.beatGroup))
        : state
    case 'noteOn':
      return noteOn(state, event.midi)
  }
}
