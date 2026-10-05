import {
  circleKey,
  keyMode,
  noteFromParam,
  pitchClassOf,
  type Key,
  type NoteParam,
  type ScaleKind,
} from '@/shared/lib/music'

/** The key a major or minor scale is the scale of, as the circle of fifths spells it; null for any other scale. */
export function keyOfScale(root: NoteParam, kind: ScaleKind): Key | null {
  const mode = keyMode(kind)
  return mode === null ? null : circleKey(pitchClassOf(noteFromParam(root)), mode === 'minor')
}
