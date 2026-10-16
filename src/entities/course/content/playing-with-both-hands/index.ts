import type { Course } from '../../model/types'
import bothHandsIntro from './both-hands-intro'
import sameTime from './same-time'
import twoNotesOneHand from './two-notes-one-hand'
import firstChords from './first-chords'

const course: Course = {
  id: 'playing-with-both-hands',
  shelf: 'beginner',
  stage: 'beginner',
  title: { en: 'Playing with Both Hands', ru: 'Игра двумя руками' },
  summary: {
    en: 'Join the hands: a tune passed between them, a bass under a melody, two notes in one hand, and your first chords, C, F and G.',
    ru: 'Соедините руки: мелодия переходит из руки в руку, бас под мелодией, две ноты одной рукой и первые аккорды C, F и G.',
  },
  weeks: 4,
  lessons: [bothHandsIntro, sameTime, twoNotesOneHand, firstChords],
  songs: ['frere-jacques', 'london-bridge', 'jingle-bells', 'saints'],
}

export default course
