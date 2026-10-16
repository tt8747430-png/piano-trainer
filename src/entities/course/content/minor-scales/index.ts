import type { Course } from '../../model/types'
import { minorScaleLesson, MINOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'minor-scales',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Minor Scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'All twelve minor scales round the circle of fifths, each in its natural, harmonic and melodic forms, with fingering and primary chords.',
    ru: 'Все двенадцать минорных гамм по квинтовому кругу, каждая в натуральном, гармоническом и мелодическом виде, с аппликатурой и главными трезвучиями.',
  },
  weeks: 13,
  lessons: [understanding, ...MINOR_TONICS.map((tonic) => minorScaleLesson(tonic))],
  songs: [],
}

export default course
