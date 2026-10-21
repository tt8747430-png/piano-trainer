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
    en: 'Bring the hands together in four steps: pass a tune from hand to hand, play a tune over a bass, play two notes in one hand, then your first chords, C, F and G.',
    ru: 'Соединяем руки за четыре шага: мелодия переходит из руки в руку, мелодия звучит над басом, одна рука берёт две ноты, и, наконец, первые аккорды C, F и G.',
  },
  weeks: 4,
  lessons: [bothHandsIntro, sameTime, twoNotesOneHand, firstChords],
  songs: ['frere-jacques', 'london-bridge', 'jingle-bells', 'saints'],
}

export default course
