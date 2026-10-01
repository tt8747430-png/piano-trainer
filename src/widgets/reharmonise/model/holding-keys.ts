import { chordShown, noteOnTop } from '@/features/play-example'
import {
  midi,
  MIDDLE_C,
  noteName,
  pitchClassOf,
  placeChord,
  type HoldingChord,
  type SpelledNote,
} from '@/shared/lib/music'
import type { ShownKeys } from '@/shared/ui'

/**
 * The melody note by itself, named: what the keys show before a chord plays. On `key` where a hand
 * chose it there, else on its key from middle C.
 */
export function melodyAlone(
  melody: SpelledNote,
  key = midi(MIDDLE_C + pitchClassOf(melody)),
): ShownKeys {
  return { keys: [key], marks: new Map([[key, { tone: 'scale', label: noteName(melody) }]]) }
}

/** A chord that holds the melody, in root position from middle C, with the melody note on top. */
export function underMelody(holding: HoldingChord, melody: SpelledNote): ShownKeys {
  const { rh } = placeChord(holding.chord.tones, { inversion: 0, bothHands: false })
  const pc = pitchClassOf(melody)
  const tone = holding.chord.tones.find((each) => each.pitchClass === pc)
  return noteOnTop(chordShown(rh), pc, { tone: tone?.role ?? 'root', label: holding.degree })
}
