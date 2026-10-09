/** The MIDI keyboard's settings' choices, as the MIDI port takes them; the settings entity saves them. */
export const OCTAVE_SHIFTS = [-2, -1, 0, 1, 2] as const
/** How many octaves a small keyboard's keys are moved. */
export type OctaveShift = (typeof OCTAVE_SHIFTS)[number]

export const PEDAL_WAYS = ['normal', 'reversed'] as const
/** Which way round a pedal reads: `reversed` for one that sends up when pressed. */
export type PedalWay = (typeof PEDAL_WAYS)[number]
