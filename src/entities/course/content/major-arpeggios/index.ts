import type { Course } from '../../model/types'
import { arpeggioLesson, MAJOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'major-arpeggios',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Major Arpeggios', ru: 'Мажорные арпеджио' },
  summary: {
    en: 'The major arpeggio in all twelve keys round the circle of fifths: each triad over two octaves, fingered in both hands, with its inversions.',
    ru: 'Мажорные арпеджио во всех двенадцати тональностях по квинтовому кругу: каждое трезвучие на две октавы, аппликатура обеих рук и обращения.',
  },
  weeks: 13,
  lessons: [understanding, ...MAJOR_TONICS.map((tonic) => arpeggioLesson({ tonic, minor: false }))],
  songs: [],
}

export default course
