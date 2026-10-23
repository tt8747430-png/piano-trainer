import type { Clef } from './clef'

/**
 * The instruments a sung part may be played on (ADR 0070), by family: the voice, strings, woodwind,
 * brass and the guitar.
 */
export const INSTRUMENTS = [
  'voice',
  'violin',
  'cello',
  'flute',
  'oboe',
  'clarinet',
  'trumpet',
  'horn',
  'guitar',
] as const
export type Instrument = (typeof INSTRUMENTS)[number]

export const INSTRUMENT_FAMILIES = ['voices', 'strings', 'woodwind', 'brass', 'plucked'] as const
export type InstrumentFamily = (typeof INSTRUMENT_FAMILIES)[number]

/** Each instrument's family, and the clef its part is written in. */
export const INSTRUMENT_OF: Readonly<
  Record<Instrument, { readonly family: InstrumentFamily; readonly clef: Clef }>
> = {
  voice: { family: 'voices', clef: 'treble' },
  violin: { family: 'strings', clef: 'treble' },
  cello: { family: 'strings', clef: 'bass' },
  flute: { family: 'woodwind', clef: 'treble' },
  oboe: { family: 'woodwind', clef: 'treble' },
  clarinet: { family: 'woodwind', clef: 'treble' },
  trumpet: { family: 'brass', clef: 'treble' },
  horn: { family: 'brass', clef: 'treble' },
  guitar: { family: 'plucked', clef: 'treble' },
}

/** A part's instrument where none is chosen: it is sung. */
export const DEFAULT_INSTRUMENT: Instrument = 'voice'

export const isInstrument = (value: unknown): value is Instrument =>
  INSTRUMENTS.some((instrument) => instrument === value)

/** A family's instruments, in the order they are listed. */
export const instrumentsIn = (family: InstrumentFamily): Instrument[] =>
  INSTRUMENTS.filter((instrument) => INSTRUMENT_OF[instrument].family === family)
