import type { Course } from '../../model/types'
import noteValues from './note-values'
import newNoteValues from './new-note-values'
import pickupAndDottedHalf from './pickup-and-dotted-half'
import quarterRestAndTie from './quarter-rest-and-tie'

const course: Course = {
  id: 'rhythm-basics',
  shelf: 'beginner',
  stage: 'beginner',
  title: { en: 'Rhythm Basics', ru: 'Основы ритма' },
  summary: {
    en: 'Count the beat and hold each note for its value: quarters, halves and wholes, eighths and dotted halves, 3/4 and the pickup, rests and ties.',
    ru: 'Считайте доли и выдерживайте каждую длительность: четверти, половинные и целые, восьмые и половинные с точкой, размер 3/4 и затакт, паузы и лиги.',
  },
  weeks: 4,
  lessons: [noteValues, newNoteValues, pickupAndDottedHalf, quarterRestAndTie],
  songs: ['auld-lang-syne', 'red-river-valley'],
}

export default course
