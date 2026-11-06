import { KEY } from './keys'

/**
 * The pose table's shape (R36): each finger's angles at offsets across the keys from where it rests,
 * from two and a half white keys below to as many above, a quarter of a key apart.
 */
export const POSE_TABLE = { from: -2.5 * KEY.width, step: KEY.width / 4, count: 21 } as const

/** How high a finger hovers over a key it is not pressing, its pad to the key's top. */
export const HOVER = 0.004
