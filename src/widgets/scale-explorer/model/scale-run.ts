import {
  fingeringsOf,
  noteFromParam,
  ownFingering,
  placeScale,
  runFingering,
  scaleKey,
  type Finger,
  type Fingering,
  type Hand,
  type PlacedTone,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import type { ScaleView } from './scale-view'

/** Scale view's run: its keys from the start note, how it is fingered, and the run as it plays and is written. */
export interface ScaleRun {
  readonly placed: readonly PlacedTone[]
  /** The fingering it takes, its start's own, and the ones it may take. */
  readonly fingering: Fingering
  readonly own: Fingering
  readonly fingerings: readonly Fingering[]
  readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
  readonly music: TimedMusic
}

/** The run a Scale view shows: from its start note, fingered as chosen or as its start is. */
export function scaleRunOf(
  view: Pick<ScaleView, 'root' | 'kind' | 'start' | 'fingering' | 'rhythm' | 'hands'>,
): ScaleRun {
  const root = noteFromParam(view.root)
  const start = view.start - 1
  const placed = placeScale(root, view.kind, start)
  const keys = placed.map((key) => key.midi)
  const own = ownFingering(view.kind, start)
  const fingering = view.fingering ?? own
  const fingers = {
    rh: runFingering(root, view.kind, start, keys, 'rh', fingering),
    lh: runFingering(root, view.kind, start, keys, 'lh', fingering),
  }
  return {
    placed,
    fingering,
    own,
    fingerings: fingeringsOf(view.kind, start),
    fingers,
    music: scaleRun(placed, {
      rhythm: view.rhythm,
      hands: view.hands,
      key: scaleKey(root, view.kind),
      fingers,
    }),
  }
}
