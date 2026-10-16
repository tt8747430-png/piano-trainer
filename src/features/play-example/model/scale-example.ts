import {
  kindComingDown,
  ownFingering,
  placeScale,
  runFingering,
  scaleKey,
  type PlacedTone,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { scaleShown } from './marks'
import type { ShownKeys } from '@/shared/ui'

/**
 * A scale as a lesson shows it: its keys up an octave from the root, each with its degree and the
 * right hand's finger, the tonic in its own colour; and its run up and back in even 8ths, one hand,
 * fingered as taught, in the key it is written in.
 */
export function scaleExample(
  root: SpelledNote,
  kind: ScaleKind,
  /** The keys carry the right hand's fingers. */
  withFingers = true,
): { readonly shown: ShownKeys; readonly music: TimedMusic } {
  const fingered = (way: ScaleKind, notes: readonly PlacedTone[]) => {
    const keys = notes.map((key) => key.midi)
    const fingering = ownFingering(kind, 0)
    return {
      rh: runFingering(root, way, 0, keys, 'rh', fingering),
      lh: runFingering(root, way, 0, keys, 'lh', fingering),
    }
  }
  const placed = placeScale(root, kind)
  const fingers = fingered(kind, placed)
  const downKind = kindComingDown(kind)
  const down = placeScale(root, downKind)
  return {
    shown: scaleShown(placed, withFingers ? fingers.rh : undefined),
    music: scaleRun(
      { notes: placed, fingers },
      {
        rhythm: 'even',
        hands: 'rh',
        key: scaleKey(root, kind),
        down: { notes: down, fingers: fingered(downKind, down) },
      },
    ),
  }
}
