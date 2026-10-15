import type { Course } from '../../model/types'
import { arpeggioLesson, MINOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'minor-arpeggios',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Minor Arpeggios', ru: 'Минорные арпеджио' },
  summary: {
    en: 'The minor arpeggio in all twelve keys round the circle of fifths: each triad over two octaves, fingered in both hands, with its inversions.',
    ru: 'Минорные арпеджио во всех двенадцати тональностях по квинтовому кругу: каждое трезвучие на две октавы, аппликатура обеих рук и обращения.',
  },
  weeks: 13,
  lessons: [understanding, ...MINOR_TONICS.map((tonic) => arpeggioLesson({ tonic, minor: true }))],
  songs: [],
}

export default course
