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
    en: 'Vasily Gorshkov’s accompaniment course, taught on the songs of his lessons: 7th and 9th chords where they fit, thinking in degrees, chord pulse, and a line woven into the chords.',
    ru: 'Курс аккомпанемента Василия Горшкова на песнях из его уроков: септ- и нонаккорды там, где они уместны, мышление ступенями, аккордовая пульсация и линия, вплетённая в аккорды.',
  },
  weeks: 5,
  lessons: [seventhsInASong, ninthsInASong, thinkingInDegrees, chordPulse, melodicFiguration],
  songs: ['romashki', 'olen', 'wafriend', 'metel'],
}

export default course
