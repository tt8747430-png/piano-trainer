import type { Course } from '../../model/types'
import firstSteps from './first-steps'
import rightHandSongs from './right-hand-songs'
import leftHand from './left-hand'
import newRightHandNotes from './new-right-hand-notes'

const course: Course = {
  id: 'introduction-to-the-piano',
  shelf: 'beginner',
  stage: 'beginner',
  title: { en: 'Introduction to the Piano', ru: 'Знакомство с фортепиано' },
  summary: {
    en: 'Your first weeks at the keys: posture, finger numbers and the C position, then easy tunes in each hand and the notes above G.',
    ru: 'Первые недели за инструментом: посадка, номера пальцев и позиция до, затем простые мелодии каждой рукой и ноты выше соль.',
  },
  weeks: 4,
  lessons: [firstSteps, rightHandSongs, leftHand, newRightHandNotes],
  songs: ['hot-cross-buns', 'mary-lamb', 'au-clair', 'lightly-row', 'twinkle', 'ode'],
}

export default course
