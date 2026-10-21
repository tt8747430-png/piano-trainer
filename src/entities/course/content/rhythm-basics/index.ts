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
    en: 'Learn to count the beat and hold every note for its full length. You start with quarter, half and whole notes, then add eighths, dotted halves, 3/4, the pickup, rests and ties.',
    ru: 'Учимся считать доли и выдерживать каждую ноту полностью. Сначала четверти, половинные и целые, затем восьмые, половинные с точкой, размер 3/4, затакт, паузы и лиги.',
  },
  weeks: 4,
  lessons: [noteValues, newNoteValues, pickupAndDottedHalf, quarterRestAndTie],
  songs: ['auld-lang-syne', 'red-river-valley'],
}

export default course
