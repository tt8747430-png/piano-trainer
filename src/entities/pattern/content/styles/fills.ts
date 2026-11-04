/**
 * Fills and grooves the styles share (R29 CP3), written by us for this app; no other app's patterns
 * are copied. A grid is a 4/4 bar of 16 steps (`X` accent, `x` stroke, `o` ghost, `.` silent); a 3/4
 * one 12.
 */
import type { WrittenGrid } from '../../model/style-types'

/** Snare 16ths into the next bar's downbeat. */
export const SNARE_RUN: WrittenGrid = {
  kick: 'X.....x.X.......',
  snare: '....X.....x.XxXx',
  hatClosed: 'x.x.x.x.x.x.....',
}
/** Down the toms on beat 4. */
export const TOM_FILL: WrittenGrid = {
  kick: 'X.....x.X.......',
  snare: '....X.......X...',
  tomHigh: '........X.x.....',
  tomMid: '............X.x.',
  tomFloor: '..............x.',
}
/** The last two beats in 8ths on the snare and the toms. */
export const ROCK_FILL: WrittenGrid = {
  kick: 'X.x.....X.......',
  snare: '....X...X.X.....',
  tomMid: '............X.X.',
  tomFloor: '..............X.',
  crash: 'X...............',
}
/** A soft fill: the ride keeps time, the snare picks up beat 4. */
export const SOFT_FILL: WrittenGrid = {
  ride: 'x...x...x...x...',
  rim: '....x.......x...',
  snare: '..........o.x.x.',
}
/** A jazz fill: the snare's triplets on 3 and 4 (swung), the hi-hat's foot on 2 and 4. */
export const JAZZ_FILL: WrittenGrid = {
  ride: 'x...x.x.x.......',
  hatPedal: '....x.......x...',
  snare: '........x.x.x.x.',
  kick: '..............x.',
}
/** A 3/4 bar's fill: the toms on beat 3. */
export const WALTZ_FILL: WrittenGrid = {
  kick: 'X...........',
  snare: '....x.......',
  tomHigh: '........x.x.',
  tomFloor: '...........x',
}
