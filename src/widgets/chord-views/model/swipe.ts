/**
 * The Diagrams view's pair swiped (ADR 0108), as an iOS carousel reads a finger: pure, so every
 * threshold is tested without one. An offset is the finger's way along, in px, to the left below 0;
 * a velocity its speed that way, in px a millisecond.
 */

/** How hard a drag past an end pulls back: iOS's scroll views' 0.55. */
const RUBBER = 0.55
/** How far along a diagram a drag goes to go on to the next or back to the one before. */
const COMMIT = 1 / 3
/** A flick: the speed that goes on, however short the drag, in px a millisecond. */
export const FLICK = 0.35
/** How far a touch moves before it can be a flick: less is a tap shaking. */
const STIRRED = 8

/**
 * How far a drag `over` past an end is drawn, in a `room` of its size: one to one at first, giving
 * less and less the further it goes, never as far as the room (iOS's rubber band).
 */
export function rubberBand(over: number, room: number): number {
  if (over === 0 || room <= 0) return 0
  const given = (1 - 1 / ((Math.abs(over) * RUBBER) / room + 1)) * room
  return Math.sign(over) * given
}

/** Whether there is a chord to go back to, and one to go on to. */
export interface PairEnds {
  readonly before: boolean
  readonly after: boolean
}

/**
 * How far the pair is drawn along, as a share of a diagram's `width`, the next coming in above 0:
 * one to one with the finger up to a whole diagram, a rubber band past it, and from the first
 * towards an end with no chord.
 */
export function pairSwipe(offset: number, width: number, { before, after }: PairEnds): number {
  if (width <= 0) return 0
  const along = -offset / width
  const free = along > 0 ? after : before
  if (!free) return rubberBand(along, 1)
  const whole = Math.sign(along)
  return Math.abs(along) <= 1 ? along : whole + rubberBand(along - whole, 1)
}

/**
 * Where the pair goes as the finger lets go: on to the next chord (1), back to the one before (-1),
 * or back where it was (0). It goes past a third of a diagram, or with a flick the way the drag went;
 * a flick turned back against the drag, or towards an end with no chord, springs back.
 */
export function pairRelease({
  offset,
  velocity,
  width,
  before,
  after,
}: PairEnds & { offset: number; velocity: number; width: number }): -1 | 0 | 1 {
  if (offset === 0) return 0
  const way = offset < 0 ? 1 : -1
  const along = Math.sign(-velocity) === way
  const flicked = Math.abs(velocity) >= FLICK && Math.abs(offset) >= STIRRED
  if (flicked && !along) return 0
  if (!flicked && Math.abs(offset) < width * COMMIT) return 0
  if (way === 1 ? !after : !before) return 0
  return way
}
