import { placeScale, scaleKey, type ScaleKind, type SpelledNote } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun } from '@/shared/lib/schedule'
import type { ShownKeys } from './shown'

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
    shown: {
      keys: placed.map((key) => key.midi),
      marks: new Map(
        placed.map((key) => [
          key.midi,
          { tone: key.tone.role === 'root' ? 'tonic' : 'scale', label: key.tone.degree },
        ]),
      ),
    },
    music: scaleRun(placed, { rhythm: 'even', hands: 'rh', key: scaleKey(root, kind) }),
  }
}
