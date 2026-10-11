/**
 * The beats a bar a metronome counts, its first accented: what a URL may hold, kept here so the
 * router's validators read it without the metronome's controls.
 */
export const METRONOME_BEATS = [2, 3, 4, 6] as const
export type MetronomeBeats = (typeof METRONOME_BEATS)[number]
