import type { Course } from '../../model/types'
import accompanimentPatterns from './accompaniment-patterns'
import fourNoteChords from './four-note-chords'
import practisingImprovisation from './practising-improvisation'
import sixthAndAddNine from './sixth-and-add-nine'

const course: Course = {
  id: 'improvising-with-chords',
  shelf: 'chords',
  stage: 'intermediate',
  title: { en: 'Improvising with Chords', ru: 'Импровизация на аккордах' },
  summary: {
    en: 'Turn a song’s chords into music of your own. Play them in different accompaniment patterns, colour them with 7ths, 6ths and added 9ths, and make up a melody over a loop.',
    ru: 'Превратите аккорды песни в собственную музыку. Играйте их разными фактурами, раскрашивайте септимами, секстами и добавленной ноной и сочиняйте мелодию над гармоническим кругом.',
  },
  weeks: 4,
  lessons: [accompanimentPatterns, fourNoteChords, sixthAndAddNine, practisingImprovisation],
  songs: ['swing-low', 'kumbaya', 'michael-row'],
}

export default course
