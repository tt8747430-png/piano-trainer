import type { Meter } from '@/shared/lib/music'
import { LEVEL_GAIN, parseMeter, type BeatLevel } from './meter'
import type { MetronomeMeter, MetronomeSound } from './metronome'
import type { ClickSound } from './schedule'

/**
 * How the Player's click sounds (A35, A39: one metronome engine): the Metronome's sound, and its beat
 * squares where they were set for the music's own meter.
 */
export interface ClickVoicing {
  readonly sound: MetronomeSound
  readonly meter: MetronomeMeter
  readonly levels: readonly BeatLevel[] | null
}

/**
 * A counted beat's level: the Metronome's square for it where its squares were set for this meter;
 * else the bar's first beat the downbeat, a group's first an accent, the rest plain.
 */
export function clickLevel(
  beat: number,
  accent: boolean,
  meter: Meter,
  squares: Pick<ClickVoicing, 'meter' | 'levels'> | null,
): BeatLevel {
  const set = squares && parseMeter(squares.meter) === meter ? squares.levels : null
  const own = beat === 0 ? 'downbeat' : accent ? 'accent' : 'normal'
  return set?.[beat] ?? own
}

/**
 * A beat's click at its level in the Metronome's sound: a click or a beep as loud as its level; the
 * drums' kick on the bar's first beat, the snare on the others, a softer hat over each.
 */
export function voicedClick(
  at: number,
  level: Exclude<BeatLevel, 'silent'>,
  sound: MetronomeSound,
): ClickSound[] {
  const accent = level === 'downbeat' || level === 'accent'
  const gain = LEVEL_GAIN[level]
  if (sound !== 'drum')
    return [{ kind: 'click', at, accent, gain, ...(sound === 'click' ? {} : { voice: sound }) }]
  return [
    { kind: 'click', at, accent, gain, voice: level === 'downbeat' ? 'kick' : 'snare' },
    { kind: 'click', at, accent: false, gain: LEVEL_GAIN.sub, voice: 'hat' },
  ]
}
