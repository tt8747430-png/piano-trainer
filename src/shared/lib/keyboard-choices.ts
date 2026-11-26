/** The keyboard settings' choices, as the presentational keyboard takes them; the settings entity saves them. */
export const KEY_SIZES = ['piano', 'fit', 'large'] as const
/**
 * How wide the white keys are, smallest first (R34): all 88 keys fill the width and never scroll
 * (Songscription's), the music's range fills it (the default, as the canvas's Piano sheet's Range),
 * or large keys; the last two scroll to follow the music.
 */
export type KeySize = (typeof KEY_SIZES)[number]

export const SWIPES = ['scroll', 'glissando'] as const
/** What a finger sliding over the keys does: scroll the keyboard, or play each key it crosses. */
export type Swipe = (typeof SWIPES)[number]

export const NAMED_KEYS = ['c', 'all', 'none'] as const
/** Which keys carry their note's name: every C, every key, or none. */
export type NamedKeys = (typeof NAMED_KEYS)[number]

export const CHORD_LABELS = ['names', 'degrees', 'intervals', 'fingers', 'none'] as const
/**
 * What a chord's keys and the heads on its staff carry (canvas 89, 151): each note's name, its degree
 * in the chord, the interval up from the note below it, its finger, or nothing.
 */
export type ChordLabels = (typeof CHORD_LABELS)[number]

export const CHORD_RANGES = ['chord', 'two', 'four'] as const
/** How many keys a chord's piano shows (the canvas's Range): just the chord's, or two or four octaves round it. */
export type ChordRange = (typeof CHORD_RANGES)[number]

export const SONG_RANGES = ['song', '61', '76', '88'] as const
/**
 * How many keys the Player shows (its Piano sheet's Range, the canvas's): every note of the song, or
 * a keyboard's span, 61 (C2–C7), 76 (E1–G7) or the piano's 88 (A0–C8).
 */
export type SongRange = (typeof SONG_RANGES)[number]

export const CAMERA_ANGLES = ['seat', 'above'] as const
/**
 * Where a 3D piano is seen from (the Piano sheet's Angle, canvas 121): the seat, as Flowkey films,
 * or above, looking down more steeply on the keys.
 */
export type CameraAngle = (typeof CAMERA_ANGLES)[number]
