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
  summary: {
    en: 'Build any major or minor chord on all twelve roots by counting semitones, then play each in its three positions and reach the nearest one.',
    ru: 'Стройте любой мажорный и минорный аккорд от всех двенадцати нот, считая полутоны, затем играйте каждый в трёх видах и находите ближайший.',
  },
  weeks: 4,
  lessons: [buildMajorChords, buildMinorChords, majorInversions, minorInversions],
  songs: [],
}

export default course
