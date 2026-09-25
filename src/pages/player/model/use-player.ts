import { useCallback, useEffect, useMemo } from 'react'
import type { Piece } from '@/entities/piece'
import { useProgressStoreApi } from '@/entities/progress'
import { selectPractice, useSettings } from '@/entities/settings'
import {
  arrangePiece,
  playerRange,
  practiceMarks,
  practisedHands,
  usePractice,
  type Practice,
  type PracticeChoice,
  type PracticeMode,
} from '@/features/practice'
import { recordPractised } from '@/features/record-practised'
import type { Performance } from '@/shared/lib/arrangement'
import { rangeOf, type KeyRange, type Midi } from '@/shared/lib/music'
import { audibleHands, beatGroupSounds } from '@/shared/lib/schedule'
import { usePlay } from '@/shared/lib/services'
import type { KeyMark } from '@/shared/ui'
import type { SetupChange } from '@/widgets/player-setup'
import { resolveChoice, searchPatch, type PlayerSearch } from './player-search'
import { turnFeedback, type TurnFeedback } from './turn-feedback'

export interface Player {
  readonly choice: PracticeChoice
  readonly performance: Performance
  readonly range: KeyRange
  readonly tempo: number
  readonly practice: Practice
  /**
   * The current beat group's keys in the hands heard (in Your turn, the hands practised), by hand,
   * labelled with fingers or note names.
   */
  readonly marks: ReadonlyMap<Midi, KeyMark>
  /** The marked keys, for the keyboard to keep in sight. */
  readonly inView: KeyRange | undefined
  readonly feedback: TurnFeedback | null
  change(change: SetupChange): void
  setMode(mode: PracticeMode): void
  /** Your turn's "Hear these notes": the current beat group, both hands. */
  hear(): void
  /** A key tapped on the screen: an answer in Your turn. The keyboard sounds every tap itself. */
  tapKey(key: Midi): void
}

/** The Player's one hook (CODE_STYLE §3): the URL and the saved switches in, everything the screen shows out. */
export function usePlayer(
  piece: Piece,
  search: PlayerSearch,
  setSearch: (patch: Partial<PlayerSearch>) => void,
): Player {
  const toggles = useSettings(selectPractice)
  const progress = useProgressStoreApi()
  const play = usePlay()
  const { key, pattern, rh, lh, voicing } = search
  const choice = useMemo(
    () => resolveChoice(piece, { key, pattern, rh, lh, voicing }, toggles.melody),
    [piece, key, pattern, rh, lh, voicing, toggles.melody],
  )
  const performance = useMemo(() => arrangePiece(piece, choice), [piece, choice])
  const range = useMemo(() => playerRange(performance), [performance])
  const tempo = search.tempo ?? piece.tempo
  const practice = usePractice(performance, {
    mode: search.mode,
    hands: search.hands,
    tempo,
    metronome: toggles.metronome,
    countIn: toggles.countIn,
  })
  useEffect(() => recordPractised(progress, piece.id, new Date()), [progress, piece.id])

  const { state, press } = practice
  const turn = state.mode === 'turn'
  const received = turn ? state.received : undefined
  const hands = turn ? practisedHands(search.hands) : audibleHands(search.hands)
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
  const tapKey = useCallback(
    (tapped: Midi) => {
      if (turn) press(tapped)
    },
    [turn, press],
  )

  return {
    choice,
    performance,
    range,
    tempo,
    practice,
    marks,
    inView,
    feedback: turnFeedback(performance, state),
    change: (setup) => setSearch(searchPatch(piece, setup)),
    setMode: (mode) => setSearch({ mode }),
    hear() {
      play(beatGroupSounds(performance, state.beatGroup, { tempo, hands: audibleHands('both') }))
    },
    tapKey,
  }
}
