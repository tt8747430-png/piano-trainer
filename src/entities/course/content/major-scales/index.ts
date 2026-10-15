import type { Course } from '../../model/types'
import { majorScaleLesson, MAJOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'major-scales',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Major Scales', ru: 'Мажорные гаммы' },
  summary: {
    en: 'All twelve major scales round the circle of fifths: each key’s notes, signature, fingering in both hands and primary chords.',
    ru: 'Все двенадцать мажорных гамм по квинтовому кругу: ноты каждой тональности, ключевые знаки, аппликатура обеих рук и главные трезвучия.',
  },
  weeks: 13,
  lessons: [understanding, ...MAJOR_TONICS.map((tonic) => majorScaleLesson(tonic))],
  songs: [],
}

export default course
