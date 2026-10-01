import { FIGURES, type ExerciseChoice, type ExerciseId } from '@/entities/exercise'
import type { Performance } from '@/shared/lib/arrangement'
import {
  arpeggioExercise,
  arpeggiosFromTheThird,
  contraryExercise,
  dominantScale,
  dropTwoSevenths,
  fiveFinger,
  hanon,
  innerVoice,
  modes,
  rapidSwitch,
  scaleExercise,
  sequenceExercise,
  sixthDiminishedChords,
  sixthDiminishedScale,
  twoFiveOneScale,
} from '@/shared/lib/exercise'

/** Broken 3rds and 6ths: a figure of two notes, a 3rd or a 6th apart. */
const THIRDS = [0, 2] as const
const SIXTHS = [0, 5] as const

/** An exercise as the Player plays it: its rule over the learner's choice. */
export function arrangeExercise(id: ExerciseId, choice: ExerciseChoice): Performance {
  const { root } = choice
  const minor = choice.tonality === 'minor'
  switch (id) {
    case 'scale':
      return scaleExercise(choice)
    case 'thirds':
      return sequenceExercise({ ...choice, figure: THIRDS })
    case 'sixths':
      return sequenceExercise({ ...choice, figure: SIXTHS })
    case 'groups':
      return sequenceExercise({ ...choice, figure: FIGURES[choice.figure] })
    case 'contrary':
      return contraryExercise(choice)
    case 'arpeggio':
      return arpeggioExercise(choice)
    case 'sixth-diminished':
      return sixthDiminishedScale({ root, minor, octaves: choice.octaves })
    case 'sixth-diminished-chords':
      return sixthDiminishedChords({ root, minor, voicing: choice.voicing })
    case 'dominant-scale':
      return dominantScale({ root, from: choice.from })
    case 'from-third':
      return arpeggiosFromTheThird({ root })
    case 'drop-two':
      return dropTwoSevenths({ root, inversion: choice.inversion })
    case 'two-five-one-scale':
      return twoFiveOneScale({ root })
    case 'inner-voice':
      return innerVoice({ root })
    case 'modes':
      return modes({ root })
    case 'rapid-switch':
      return rapidSwitch({ root })
    case 'pattern-shifting':
      return sequenceExercise({ root, kind: 'major', octaves: 1, figure: FIGURES[choice.figure] })
    case 'five-finger':
      return fiveFinger({ root, minor })
    case 'hanon':
      return hanon({ root })
  }
}
