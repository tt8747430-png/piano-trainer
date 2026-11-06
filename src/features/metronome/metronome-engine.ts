import type { MetronomeSettings } from '@/entities/settings'
import { beatsOf, type MetronomeVoice } from '@/shared/lib/schedule'

/**
 * How every click sounds (R29 B11, A35, A39): the Metronome's sound, squares and what falls between
 * the beats, counted in `meter`, its squares kept only where it has as many beats. The Player's
 * count-in and click, the quick metronome and the Metronome's page all read this one object.
 */
export function clickVoice(metronome: MetronomeSettings, meter: string): MetronomeVoice {
  const levels =
    metronome.levels && metronome.levels.length === beatsOf(meter) ? metronome.levels : null
  return { sound: metronome.sound, meter, levels, subdivision: metronome.subdivision }
}
