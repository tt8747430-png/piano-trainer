import { noteOnTop, type ShownKeys } from '@/features/play-example'
import {
  midi,
  MIDDLE_C,
  noteName,
  pitchClassOf,
  placeChord,
  type HoldingChord,
  type SpelledNote,
} from '@/shared/lib/music'

/** The melody note by itself, named, on its key from middle C: what the keys show before a chord plays. */
export function melodyAlone(melody: SpelledNote): ShownKeys {
  const key = midi(MIDDLE_C + pitchClassOf(melody))
  return { keys: [key], marks: new Map([[key, { tone: 'scale', label: noteName(melody) }]]) }
}

/** A chord that holds the melody, in root position from middle C, with the melody note on top. */
export function underMelody(holding: HoldingChord, melody: SpelledNote): ShownKeys {
  const { rh } = placeChord(holding.chord.tones, { inversion: 0, bothHands: false })
  const pc = pitchClassOf(melody)
  const tone = holding.chord.tones.find((each) => each.pitchClass === pc)
  return noteOnTop(
    {
      keys: rh.map((placed) => placed.midi),
      marks: new Map(
        rh.map((placed) => [placed.midi, { tone: placed.tone.role, label: placed.tone.degree }]),
      ),
    },
    pc,
    { tone: tone?.role ?? 'root', label: holding.degree },
  )
}
