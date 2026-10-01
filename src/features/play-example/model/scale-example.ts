import {
  kindComingDown,
  placeScale,
  scaleKey,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import { scaleShown } from './marks'
import type { ShownKeys } from '@/shared/ui'

/**
 * A scale as a lesson shows it: its keys up an octave from the root, each with its degree, the tonic
 * in its own colour; and its run up and back in even 8ths, one hand, in the key it is written in.
 */
export function scaleExample(
  root: SpelledNote,
  kind: ScaleKind,
): { readonly shown: ShownKeys; readonly music: TimedMusic } {
  const placed = placeScale(root, kind)
  return {
    shown: scaleShown(placed),
    music: scaleRun(
      { notes: placed },
      {
        rhythm: 'even',
        hands: 'rh',
        key: scaleKey(root, kind),
        down: { notes: placeScale(root, kindComingDown(kind)) },
      },
    ),
  }
}
