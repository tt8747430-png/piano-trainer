import type { Course } from '../../model/types'
import { minorScaleLesson, MINOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'minor-scales',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Minor Scales', ru: 'Минорные гаммы' },
  summary: {
    en: 'All twelve minor scales, one key at a time round the circle of fifths. Play each in its natural, harmonic and melodic forms, with the fingering for each hand and its primary chords.',
    ru: 'Все двенадцать минорных гамм, по одной тональности, по квинтовому кругу. Каждую вы сыграете в натуральном, гармоническом и мелодическом виде, с аппликатурой каждой руки и главными трезвучиями.',
  },
  weeks: 13,
  lessons: [understanding, ...MINOR_TONICS.map((tonic) => minorScaleLesson(tonic))],
  songs: [],
}

export default course
