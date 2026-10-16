import type { Course } from '../../model/types'
import { majorScaleLesson, MAJOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'major-scales',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Major Scales', ru: 'Мажорные гаммы' },
  summary: {
    en: 'All twelve major scales, one key at a time round the circle of fifths. For each key, learn its notes and key signature, the fingering for each hand and its three primary chords.',
    ru: 'Все двенадцать мажорных гамм, по одной тональности, по квинтовому кругу. В каждой вы выучите ноты и ключевые знаки, аппликатуру каждой руки и три главных трезвучия.',
  },
  weeks: 13,
  lessons: [understanding, ...MAJOR_TONICS.map((tonic) => majorScaleLesson(tonic))],
  songs: [],
}

export default course
