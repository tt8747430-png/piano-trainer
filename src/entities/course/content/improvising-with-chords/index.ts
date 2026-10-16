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
    en: 'Turn a song’s chords into music of your own: accompaniment patterns, 7th, 6th and add9 colours, and a melody made up over a loop.',
    ru: 'Превратите аккорды песни в собственную музыку: фактуры аккомпанемента, краски септаккордов, сексты и add9 и мелодия, сочинённая над гармоническим кругом.',
  },
  weeks: 4,
  lessons: [accompanimentPatterns, fourNoteChords, sixthAndAddNine, practisingImprovisation],
  songs: ['swing-low', 'kumbaya', 'michael-row'],
}

export default course
