import type { Course } from '../../model/types'
import { arpeggioLesson, MINOR_TONICS } from '../scale-lessons'
import understanding from './understanding'

const course: Course = {
  id: 'minor-arpeggios',
  shelf: 'technique',
  stage: 'intermediate',
  title: { en: 'Minor Arpeggios', ru: 'Минорные арпеджио' },
  summary: {
    en: 'The minor arpeggio in all twelve keys, in circle-of-fifths order. Each lesson takes one triad over two octaves, with both hands’ fingering and its inversions.',
    ru: 'Минорные арпеджио во всех двенадцати тональностях, по квинтовому кругу. В каждом уроке одно трезвучие на две октавы: аппликатура обеих рук и обращения.',
  },
  weeks: 13,
  lessons: [understanding, ...MINOR_TONICS.map((tonic) => arpeggioLesson({ tonic, minor: true }))],
  songs: [],
}

export default course
