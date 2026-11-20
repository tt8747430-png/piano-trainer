import type { Course } from '../../model/types'
import buildMajorChords from './build-major-chords'
import buildMinorChords from './build-minor-chords'
import majorInversions from './major-inversions'
import minorInversions from './minor-inversions'

const course: Course = {
  id: 'mastering-chords',
  shelf: 'chords',
  stage: 'intermediate',
  title: { en: 'Mastering Chords', ru: 'Аккорды в совершенстве' },
  line: { en: 'Any triad, in every position', ru: 'Любое трезвучие во всех обращениях' },
  summary: {
    en: 'Build a major or minor chord on any of the twelve roots by counting semitones. Then play each chord in its three positions and learn to reach the nearest one.',
    ru: 'Стройте мажорное и минорное трезвучие от любой из двенадцати нот, считая полутоны. Затем играйте каждое в трёх видах и находите ближайший.',
  },
  weeks: 4,
  lessons: [buildMajorChords, buildMinorChords, majorInversions, minorInversions],
  songs: [],
}

export default course
