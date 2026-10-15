import type { Course } from '../../model/types'
import coordinationBasics from './coordination-basics'
import simpleHarmonies from './simple-harmonies'
import handIndependence from './hand-independence'

const course: Course = {
  id: 'first-exercises-for-both-hands',
  shelf: 'technique',
  stage: 'beginner',
  title: { en: 'First Exercises for Both Hands', ru: 'Первые упражнения для двух рук' },
  summary: {
    en: 'Daily drills that teach the hands to work together and apart: five-finger patterns, a tune over simple chords, and Hanon.',
    ru: 'Ежедневные упражнения, которые учат руки играть вместе и независимо: позиция пяти пальцев, мелодия над простыми аккордами и Ганон.',
  },
  weeks: 3,
  lessons: [coordinationBasics, simpleHarmonies, handIndependence],
  songs: [],
}

export default course
