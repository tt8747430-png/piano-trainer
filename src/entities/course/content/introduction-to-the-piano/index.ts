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
    en: 'Your first weeks at the keys. Learn how to sit, number your fingers and find the C position. Then play easy tunes with each hand and reach the notes above G.',
    ru: 'Первые недели за инструментом. Вы научитесь сидеть, узнаете номера пальцев и позицию до. Потом сыграете простые мелодии каждой рукой и освоите ноты выше соль.',
  },
  weeks: 4,
  lessons: [firstSteps, rightHandSongs, leftHand, newRightHandNotes],
  songs: ['hot-cross-buns', 'mary-lamb', 'au-clair', 'lightly-row', 'twinkle', 'ode'],
}

export default course
