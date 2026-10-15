import type { Course } from '../../model/types'
import seventhsInASong from './sevenths-in-a-song'
import ninthsInASong from './ninths-in-a-song'
import thinkingInDegrees from './thinking-in-degrees'
import chordPulse from './chord-pulse'
import melodicFiguration from './melodic-figuration'

const course: Course = {
  id: 'gorshkov',
  shelf: 'method-books',
  stage: 'advanced',
  title: { en: 'Gorshkov: a course in accompaniment', ru: 'Горшков: курс по аккомпанементу' },
  summary: {
    en: 'Vasily Gorshkov’s course on his songs: 7th and 9th chords where they sound, thinking in degrees, the chord’s pulse and the melody woven into it.',
    ru: 'Курс Василия Горшкова на его песнях: септ- и нонаккорды там, где они звучат, мышление ступенями, пульсация аккорда и вплетённая в неё мелодия.',
  },
  weeks: 5,
  lessons: [seventhsInASong, ninthsInASong, thinkingInDegrees, chordPulse, melodicFiguration],
  songs: ['romashki', 'olen', 'wafriend', 'metel'],
}

export default course
