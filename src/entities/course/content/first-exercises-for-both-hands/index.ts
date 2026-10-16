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
    en: 'Short daily drills that teach the hands to play together and on their own: five-finger patterns, a tune over simple chords, and Hanon.',
    ru: 'Короткие ежедневные упражнения, которые учат руки играть вместе и независимо: позиция пяти пальцев, мелодия над простыми аккордами и Ганон.',
  },
  weeks: 3,
  lessons: [coordinationBasics, simpleHarmonies, handIndependence],
  songs: [],
}

export default course
