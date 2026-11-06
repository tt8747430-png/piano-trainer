import type { Angles, FingerName, Side } from './fingers'
import table from './hand-poses.json'
import { POSE_TABLE } from './pose-table'

/**
 * What a finger is doing (R36): how far across the keys from where it rests it reaches, in metres;
 * how much its key is a black one (0 a white key, 1 a black one, between while it moves from one to
 * the other); and how far down it is (0 hovering over the key, 1 pressing it to the key bed).
 */
export interface FingerAim {
  readonly dx: number
  readonly black: number
  readonly press: number
}

type Row = readonly (readonly number[])[]

/** A row of the table at a fractional place along it, each angle between its two neighbours. */
function along(row: Row, at: number, j: number): number {
  const i = Math.floor(at)
  const share = at - i
  const low = row[i]?.[j] ?? 0
  const high = row[Math.min(i + 1, row.length - 1)]?.[j] ?? low
  return low + (high - low) * share
}

const between = (a: number, b: number, share: number) => a + (b - a) * share

/**
 * A finger's angles for its aim, from the pose table solved once for the model hand
 * (`scripts/hand-poses.mjs`): between the table's offsets, between hovering and pressing, and
 * between a white key and a black one. Past the table's reach, its last offset.
 */
export function fingerAngles(side: Side, finger: FingerName, aim: FingerAim): Angles {
  const poses = table.hands[side][finger]
  const at = Math.min(
    POSE_TABLE.count - 1,
    Math.max(0, (aim.dx - POSE_TABLE.from) / POSE_TABLE.step),
  )
  const press = Math.min(1, Math.max(0, aim.press))
  const black = Math.min(1, Math.max(0, aim.black))
  const angle = (j: number) =>
    between(
      between(along(poses.white.up, at, j), along(poses.white.down, at, j), press),
      between(along(poses.black.up, at, j), along(poses.black.down, at, j), press),
      black,
    )
  return [angle(0), angle(1), angle(2)]
}
