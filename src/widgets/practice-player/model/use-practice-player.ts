import { useCallback, useMemo } from 'react'
import { selectPractice, useSettings } from '@/entities/settings'
import {
  loopParam,
  playerRange,
  practiceMarks,
  practisedHands,
  readLoop,
  usePractice,
  type BarRange,
  type Practice,
  type PracticeMode,
} from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { audibleHands, type Hands, type Recording } from '@/shared/lib/schedule'
import type { KeyMark } from '@/shared/ui'
import type { PracticeView } from './practice-view'
import { waitFeedback, type WaitFeedback } from './wait-feedback'

/** The staff of the hand not heard or practised. */
const MUTED: Readonly<Record<Hands, StaffId | undefined>> = {
  both: undefined,
  rh: 'bass',
  lh: 'treble',
}

export interface PracticePlayer {
  readonly practice: Practice
  /** The chosen tempo, and the piece's own. */
  readonly tempo: number
  readonly ownTempo: number
  /** The pass's tempo while speed training plays; else the chosen one. */
  readonly shownTempo: number
  readonly loop: BarRange | null
  /** The keys the Player's keyboard spans, marks and keeps in sight, and the wrong key it shows. */
  readonly range: KeyRange
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly inView: KeyRange | undefined
  readonly wrong: ReadonlySet<Midi> | undefined
  readonly feedback: WaitFeedback | null
  readonly muted: StaffId | undefined
  readonly fingers: boolean
  setMode(mode: PracticeMode): void
  setTempo(tempo: number): void
  /** Listen at a tempo: the mode and the tempo in one change of the URL. */
  listenAt(tempo: number): void
  setSpeedTraining(on: boolean): void
  setHands(hands: Hands): void
  setSwing(on: boolean): void
  /** Loops the bar the cursor is in, or removes the loop. */
  toggleLoop(): void
  setLoop(loop: BarRange): void
  /** A key tapped on the screen: an answer in Wait mode. The keyboard sounds every tap itself. */
  tapKey(key: Midi): void
}

/**
 * The Player's one hook over any Performance (spec §2.7): the URL's view and the saved switches in,
 * everything the screen shows out. A page turns its source (a piece, an exercise) into the Performance;
 * a piece's recording plays along in Listen.
 */
export function usePracticePlayer(
  performance: Performance,
  view: PracticeView,
  setView: (patch: Partial<PracticeView>) => void,
  ownTempo: number,
  recording: Recording | null = null,
): PracticePlayer {
  const toggles = useSettings(selectPractice)
  const tempo = view.tempo ?? ownTempo
  const loop = useMemo(
    () => readLoop(view.loop, performance.bars.length),
    [view.loop, performance.bars.length],
  )
  const practice = usePractice(performance, {
    mode: view.mode,
    hands: view.hands,
    tempo,
    ownTempo,
    speedTraining: view.speedTraining,
    swing: view.swing,
    loop,
    metronome: toggles.metronome,
    countIn: toggles.countIn,
    recording,
  })
  const { state, press } = practice
  const waiting = state.mode === 'wait'
  const received = waiting ? state.received : undefined
  const hands = useMemo(
    () => (waiting ? practisedHands(view.hands) : audibleHands(view.hands)),
    [waiting, view.hands],
  )
  const range = useMemo(() => playerRange(performance), [performance])
  // Stable while the beat group is, so the keyboard's memoised keys re-render only when theirs change.
  const marks = useMemo(
    () =>
      practiceMarks(performance, state.beatGroup, {
        hands,
        fingers: toggles.fingerNumbers,
        ...(received ? { received } : {}),
      }),
    [performance, state.beatGroup, hands, toggles.fingerNumbers, received],
  )
  const inView = useMemo(() => rangeOf([...marks.keys()]), [marks])
  const wrong = useMemo(
    () => (state.wrong === null ? undefined : new Set([state.wrong])),
    [state.wrong],
  )
  const tapKey = useCallback(
    (key: Midi) => {
      if (waiting) press(key)
    },
    [waiting, press],
  )
  const bar = performance.beatGroups[state.beatGroup]?.bar ?? 0

  return {
    practice,
    tempo,
    ownTempo,
    shownTempo: practice.passTempo ?? tempo,
    loop,
    range,
    marks,
    inView,
    wrong,
    feedback: waitFeedback(performance, state),
    muted: MUTED[view.hands],
    fingers: toggles.fingerNumbers,
    setMode: (mode) => setView({ mode }),
    setTempo: (next) => setView({ tempo: next === ownTempo ? undefined : next }),
    listenAt: (next) => setView({ mode: 'listen', tempo: next === ownTempo ? undefined : next }),
    setSpeedTraining: (on) => setView({ speedTraining: on }),
    setHands: (next) => setView({ hands: next }),
    setSwing: (on) => setView({ swing: on }),
    toggleLoop: () => setView({ loop: loop ? undefined : loopParam({ first: bar, last: bar }) }),
    setLoop: (next) => setView({ loop: loopParam(next) }),
    tapKey,
  }
}
