import { scaleShown } from '@/features/play-example'
import {
  fingeringsOf,
  midi,
  kindComingDown,
  noteFromParam,
  ownFingering,
  placeScale,
  runFingering,
  scaleKey,
  type Finger,
  type Fingering,
  type Hand,
  type PlacedTone,
  type ScaleKind,
} from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { scaleRun, type Hands } from '@/shared/lib/schedule'
import type { ShownKeys } from '@/shared/ui'
import type { RunKeyShow, ScaleView } from './scale-view'

/** Scale view's run: its keys from the start note, how it is fingered, and the run as it plays and is written. */
interface ScaleRun {
  readonly placed: readonly PlacedTone[]
  /** The fingering it takes, its start's own, and the ones it may take. */
  readonly fingering: Fingering
  readonly own: Fingering
  readonly fingerings: readonly Fingering[]
  readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
  /** The run coming down, where its kind comes down otherwise (melodic minor's natural 6th and 7th). */
  readonly down: {
    readonly placed: readonly PlacedTone[]
    readonly fingers: Readonly<Record<Hand, readonly Finger[]>>
  }
  readonly music: TimedMusic
}

/** The run a Scale view shows: from its start note, fingered as chosen or as its start is. */
export function scaleRunOf(
  view: Pick<ScaleView, 'root' | 'kind' | 'start' | 'fingering' | 'rhythm' | 'hands'>,
): ScaleRun {
  const root = noteFromParam(view.root)
  const start = view.start - 1
  const placed = placeScale(root, view.kind, start)
  const own = ownFingering(view.kind, start)
  const fingering = view.fingering ?? own
  /** A way of the run as it is fingered: each hand's finger on each of its keys. */
  const fingered = (kind: ScaleKind, notes: readonly PlacedTone[]) => {
    const keys = notes.map((key) => key.midi)
    return {
      rh: runFingering(root, kind, start, keys, 'rh', fingering),
      lh: runFingering(root, kind, start, keys, 'lh', fingering),
    }
  }
  const fingers = fingered(view.kind, placed)
  const downKind = kindComingDown(view.kind)
  const downNotes = placeScale(root, downKind, start)
  const down = { placed: downNotes, fingers: fingered(downKind, downNotes) }
  return {
    placed,
    fingering,
    own,
    fingerings: fingeringsOf(view.kind, start),
    fingers,
    down,
    music: scaleRun(
      { notes: placed, fingers },
      {
        rhythm: view.rhythm,
        hands: view.hands,
        key: scaleKey(root, view.kind),
        down: { notes: down.placed, fingers: down.fingers },
      },
    ),
  }
}

/**
 * The keys a run shows: every key it plays, marked by degree, with a hand's fingers where `show` names
 * a hand, where that hand plays them (the left an octave down where both hands play); its notes alone,
 * the playing hand's place, where `show` is notes. The keys coming down are marked too: melodic
 * minor's natural 6th and 7th are no blank keys.
 */
export function runShown(run: ScaleRun, hands: Hands, show: RunKeyShow): ShownKeys {
  const hand: Hand = show === 'notes' ? (hands === 'lh' ? 'lh' : 'rh') : show
  const octave = hand === 'lh' && hands !== 'rh' ? -12 : 0
  const played = (notes: readonly PlacedTone[]) =>
    notes.map((note) => ({ ...note, midi: midi(note.midi + octave) }))
  const fingers = (of: ScaleRun['fingers']) => (show === 'notes' ? undefined : of[hand])
  return {
    keys: run.music.notes.map((note) => note.midi),
    marks: new Map([
      ...scaleShown(played(run.down.placed), fingers(run.down.fingers)).marks,
      ...scaleShown(played(run.placed), fingers(run.fingers)).marks,
    ]),
  }
}
