import { TICKS_PER_BEAT, type Finger } from '@/shared/lib/music'
import type { EventFigure, Figure, FigureEvent, FigureTone, FigureToken } from './types'

const FIXED_TOKENS = new Map<string, FigureToken>([
  ['C', { kind: 'chord' }],
  ['T', { kind: 'triad', inversion: 0, octaves: 0 }],
  ['T1', { kind: 'triad', inversion: 1, octaves: 0 }],
  ['T2', { kind: 'triad', inversion: 2, octaves: 0 }],
  ['T8', { kind: 'triad', inversion: 0, octaves: 1 }],
  ['T15', { kind: 'triad', inversion: 0, octaves: 2 }],
  ['U', { kind: 'upper-voices' }],
  ['Ka', { kind: 'key-triad', triad: 'I' }],
  ['Kb', { kind: 'key-triad', triad: 'IV' }],
  ['Kc', { kind: 'key-triad', triad: 'V' }],
  ['_7', { kind: 'below-root', semitones: 1 }],
  ['_b7', { kind: 'below-root', semitones: 2 }],
  ['_6', { kind: 'below-root', semitones: 3 }],
  ['A', { kind: 'approach' }],
  ['Sh', { kind: 'shell' }],
])

/** A degree from the root (or bass) up, through three octaves: 1 to 22. */
const isDegree = (n: number) => n >= 1 && n <= 22

function readToken(text: string): FigureToken | null {
  const fixed = FIXED_TOKENS.get(text)
  if (fixed) return fixed
  const numbered = /^([vLs]?)(\d{1,2})$/.exec(text)
  if (!numbered) return null
  const n = Number(numbered[2])
  switch (numbered[1]) {
    case 'v':
      return n >= 1 ? { kind: 'voice', index: n - 1 } : null
    case 'L':
      return isDegree(n) ? { kind: 'bass-degree', degree: n } : null
    case 's':
      return { kind: 'scale-degree', degree: n }
    default:
      return isDegree(n) ? { kind: 'chord-degree', degree: n } : null
  }
}

function readTone(text: string): FigureTone | null {
  const match = /^([^^]+)(?:\^([1-5]))?$/.exec(text)
  const token = match?.[1] ? readToken(match[1]) : null
  if (!token) return null
  return match?.[2] ? { token, finger: Number(match[2]) as Finger } : { token }
}

const EVENT = /^(\d+)\/(\d+) (\S+?)(!?)$/

/**
 * Reads the figure notation: comma-separated `start/length tones` events, counted in notes `perBeat` (4,
 * 16ths, unless 3, triplet 8ths, or 6, 16ths of a compound beat); tones joined by `+`, each optionally
 * `^finger`; an event ending `!` is accented.
 */
export function parseFigure(text: string, options: { perBeat?: 3 | 4 | 6 } = {}): FigureEvent[] {
  const unit = TICKS_PER_BEAT / (options.perBeat ?? 4)
  return text.split(',').map((written) => {
    const event = written.trim()
    const match = EVENT.exec(event)
    const tones = match?.[3]?.split('+').map(readTone) ?? []
    const length = Number(match?.[2])
    if (!match || length === 0 || tones.length === 0 || tones.some((tone) => tone === null)) {
      throw new Error(`Cannot read the figure event "${event}"`)
    }
    return {
      start: Number(match[1]) * unit,
      duration: length * unit,
      tones: tones.filter((tone) => tone !== null),
      accent: match[4] === '!',
    }
  })
}

/** The event figures a figure plays: its own, or a tune figure's accompaniment. */
const eventFiguresOf = (figure: Figure): readonly EventFigure[] =>
  figure.kind === 'events'
    ? [figure]
    : figure.use === 'ends'
      ? [figure.between, figure.withoutMelody]
      : [figure.withoutMelody]

/** Every set of events a figure can play: its own and every variant. */
const eventSets = (figure: Figure): (readonly FigureEvent[])[] =>
  eventFiguresOf(figure).flatMap((each) => [
    each.events,
    each.inThree ?? [],
    each.onMajor ?? [],
    each.inCompound ?? [],
    each.inCompoundOnMajor ?? [],
    each.inSix ?? [],
  ])

/** Whether a figure plays the key's triads (`Ka` `Kb` `Kc`): only a source in a key can play it. */
export const playsKeyTriads = (figure: Figure): boolean =>
  eventSets(figure).some((events) =>
    events.some((event) => event.tones.some((tone) => tone.token.kind === 'key-triad')),
  )

/** A third of a beat: a triplet's note, which 6/8 and 12/8 divide their beat into. */
const THIRD = TICKS_PER_BEAT / 3

/**
 * Whether a figure would play inside a beat divided in two (an 8th, a 16th of simple time) in 6/8 or
 * 12/8, whose beat divides in three: one that has no compound version and plays off the triplet grid.
 * A compound version is written for compound time, and a figure in triplets (a shuffle) divides the
 * beat as it does: both play.
 */
export const splitsTheBeat = (figure: Figure): boolean =>
  eventFiguresOf(figure).some(
    (each) =>
      !each.inCompound &&
      [each.events, each.onMajor ?? []].some((events) =>
        events.some((event) => event.start % THIRD !== 0 || event.duration % THIRD !== 0),
      ),
  )
