import { voicedUnder } from '@/features/play-example'
import {
  noteParam,
  pitchClass,
  pitchClassOf,
  spellInKey,
  type HoldingChord,
  type Key,
  type NoteParam,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/** A chord that holds the melody, voiced close under it, the melody on top by its degree. */
export function underMelody(holding: HoldingChord, melody: SpelledNote): ShownKeys {
  const pc = pitchClassOf(melody)
  const tone = holding.chord.tones.find((each) => each.pitchClass === pc)
  return voicedUnder(holding.chord.tones, pc, { tone: tone?.role ?? 'root', label: holding.degree })
}

/** The melody note a key harmonises when none is chosen: its 3rd. */
export const keyThird = (key: Key): NoteParam =>
  noteParam(spellInKey(pitchClass(pitchClassOf(key.tonic) + (key.minor ? 3 : 4)), key))
