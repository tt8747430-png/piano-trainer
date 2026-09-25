import type { Finger } from '@/shared/lib/music'
import { TICKS_PER_BEAT, type FigureEvent, type FigureTone, type FigureToken } from './types'

const FIXED_TOKENS = new Map<string, FigureToken>([
  ['C', { kind: 'chord' }],
  ['T', { kind: 'triad', inversion: 0 }],
  ['T1', { kind: 'triad', inversion: 1 }],
  ['T2', { kind: 'triad', inversion: 2 }],
  ['T8', { kind: 'triad-octave' }],
  ['U', { kind: 'upper-pair' }],
  ['Ka', { kind: 'key-triad', triad: 'I' }],
  ['Kb', { kind: 'key-triad', triad: 'IV' }],
  ['Kc', { kind: 'key-triad', triad: 'V' }],
  ['_7', { kind: 'below-root', semitones: 1 }],
  ['_b7', { kind: 'below-root', semitones: 2 }],
  ['_6', { kind: 'below-root', semitones: 3 }],
])

const isDegree = (n: number) => n >= 1 && n <= 15

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

const EVENT = /^(\d+)\/(\d+) (\S+?)([!~]?)$/

/**
 * Reads the figure notation: comma-separated `start/length tones` events in 16ths (triplet 8ths with
 * `triplets`); tones joined by `+`, each optionally `^finger`; an event ending `!` is accented, `~` rolled.
 */
export function parseFigure(text: string, options: { triplets?: boolean } = {}): FigureEvent[] {
  const unit = TICKS_PER_BEAT / (options.triplets ? 3 : 4)
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
      rolled: match[4] === '~',
    }
  })
}
