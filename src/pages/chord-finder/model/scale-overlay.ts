import {
  midi,
  noteName,
  PIANO,
  pitchClass,
  pitchClassOf,
  spellScale,
  type Key,
  type Midi,
} from '@/shared/lib/music'
import type { KeyMark } from '@/shared/ui'

/**
 * The key's scale over the whole piano, as the reference app's Show scale paints it: each of its
 * keys in every octave marked with its note, the tonic as the tonic. A chord played marks its own
 * keys over these.
 */
export function scaleOverlay(key: Key): Map<Midi, KeyMark> {
  const tones = spellScale(key.tonic, key.minor ? 'natural' : 'major')
  const byClass = new Map(tones.map((tone, at) => [pitchClassOf(tone.note), { tone, at }] as const))
  const marks = new Map<Midi, KeyMark>()
  for (let each: number = PIANO.from; each <= PIANO.to; each += 1) {
    const found = byClass.get(pitchClass(each))
    if (found)
      marks.set(midi(each), {
        tone: found.at === 0 ? 'tonic' : 'scale',
        label: noteName(found.tone.note),
      })
  }
  return marks
}
