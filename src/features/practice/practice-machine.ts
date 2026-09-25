import type { Performance } from '@/shared/lib/arrangement'
import { pitchClass, type Midi, type PitchClass } from '@/shared/lib/music'
import { audibleHands, type Audible, type Hands } from '@/shared/lib/schedule'

/** Listen: the app plays. Step: the learner moves through it. Your turn: the app waits for the notes. */
export type PracticeMode = 'listen' | 'step' | 'turn'
export type Outcome = 'waiting' | 'correct' | 'wrong' | 'finished'

export interface PracticeState {
  readonly performance: Performance
  readonly mode: PracticeMode
  readonly hands: Hands
  /** Where the learner is. */
  readonly beatGroup: number
  /** Listen: the transport runs. */
  readonly playing: boolean
  /** Your turn: the pitch classes the practised hands play here, lowest first. */
  readonly expected: readonly PitchClass[]
  readonly received: readonly PitchClass[]
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
    }
  | { readonly type: 'play' }
  | { readonly type: 'stop' }
  /** The transport arrived at a beat group. */
  | { readonly type: 'reach'; readonly beatGroup: number }
  | { readonly type: 'next' }
  | { readonly type: 'prev' }
  | { readonly type: 'nextBar' }
  | { readonly type: 'jumpToBar'; readonly bar: number }
  /** The learner tapped a beat group. */
  | { readonly type: 'jumpToBeatGroup'; readonly beatGroup: number }
  | { readonly type: 'noteOn'; readonly midi: Midi }
  | { readonly type: 'restart' }

/** The hands Your turn waits for: the audible ones, never the doubled tune. */
export const practisedHands = (hands: Hands): Audible => ({ ...audibleHands(hands), melody: false })

/** What the app plays in Your turn: the hands not practised, and the tune. */
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

const isBeatGroup = (state: PracticeState, beatGroup: number) =>
  Number.isInteger(beatGroup) && beatGroup >= 0 && beatGroup < state.performance.beatGroups.length

/** Arriving at a beat group: in Your turn it sets what is expected and waits. */
function moveTo(state: PracticeState, beatGroup: number): PracticeState {
  return {
    ...state,
    beatGroup,
    expected: state.mode === 'turn' ? expectedAt(state.performance, beatGroup, state.hands) : [],
    received: [],
    outcome: 'waiting',
    wrong: null,
  }
}

export function initialPractice(
  performance: Performance,
  mode: PracticeMode,
  hands: Hands,
): PracticeState {
  const state: PracticeState = {
    performance,
    mode,
    hands,
    beatGroup: 0,
    playing: false,
    expected: [],
    received: [],
    outcome: 'waiting',
    wrong: null,
  }
  return moveTo(state, 0)
}

function next(state: PracticeState): PracticeState {
  const count = state.performance.beatGroups.length
  if (count === 0) return state
  if (state.mode !== 'turn') return moveTo(state, (state.beatGroup + 1) % count)
  if (state.beatGroup + 1 < count) return moveTo(state, state.beatGroup + 1)
  return { ...state, expected: [], received: [], outcome: 'finished', wrong: null }
}

function prev(state: PracticeState): PracticeState {
  const count = state.performance.beatGroups.length
  if (count === 0) return state
  if (state.mode === 'turn') return moveTo(state, Math.max(0, state.beatGroup - 1))
  return moveTo(state, (state.beatGroup - 1 + count) % count)
}

/** The first beat group of the next bar, or of the first bar after the last. */
function nextBar(state: PracticeState): PracticeState {
  const { beatGroups } = state.performance
  const bar = beatGroups[state.beatGroup]?.bar ?? -1
  const target = beatGroups.findIndex((group) => group.bar > bar)
  return beatGroups.length === 0 ? state : moveTo(state, target < 0 ? 0 : target)
}

function noteOn(state: PracticeState, key: Midi): PracticeState {
  const done = state.outcome === 'correct' || state.outcome === 'finished'
  if (state.mode !== 'turn' || done || state.expected.length === 0) return state
  const pc = pitchClass(key)
  if (!state.expected.includes(pc)) return { ...state, outcome: 'wrong', wrong: key }
  const received = state.received.includes(pc) ? state.received : [...state.received, pc]
  const complete = state.expected.every((expected) => received.includes(expected))
  return { ...state, received, outcome: complete ? 'correct' : 'waiting', wrong: null }
}

/** Every rule of Listen, Step and Your turn; the practice hook connects it to time and sound. */
export function practiceReducer(state: PracticeState, event: PracticeEvent): PracticeState {
  switch (event.type) {
    case 'configure': {
      const count = event.performance.beatGroups.length
      const configured: PracticeState = {
        ...state,
        performance: event.performance,
        mode: event.mode,
        hands: event.hands,
        playing: state.playing && event.mode === state.mode,
      }
      return moveTo(configured, Math.max(0, Math.min(state.beatGroup, count - 1)))
    }
    case 'play':
      return state.mode === 'listen' ? { ...state, playing: true } : state
    case 'stop':
      return state.playing ? { ...state, playing: false } : state
    case 'reach':
      return state.mode === 'listen' && isBeatGroup(state, event.beatGroup)
        ? { ...state, beatGroup: event.beatGroup }
        : state
    case 'next':
      return next(state)
    case 'prev':
      return prev(state)
    case 'nextBar':
      return nextBar(state)
    case 'jumpToBar': {
      const target = state.performance.beatGroups.findIndex((group) => group.bar === event.bar)
      return target < 0 ? state : moveTo(state, target)
    }
    case 'jumpToBeatGroup':
      return isBeatGroup(state, event.beatGroup) ? moveTo(state, event.beatGroup) : state
    case 'noteOn':
      return noteOn(state, event.midi)
    case 'restart':
      return moveTo({ ...state, playing: false }, 0)
  }
}
