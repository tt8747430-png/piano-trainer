import type { Course } from '../../model/types'
import rhCDE from './rh-c-d-e'
import rhFG from './rh-f-g'
import lhCBA from './lh-c-b-a'
import lhGF from './lh-g-f'
import bassEDC from './bass-e-d-c'
import bassBAGF from './bass-b-a-g-f'
import practiceOne from './practice-one'
import practiceTwo from './practice-two'

const course: Course = {
  id: 'music-reading-training',
  shelf: 'technique',
  stage: 'beginner',
  title: { en: 'Music Reading Training', ru: 'Тренировка чтения нот' },
  summary: {
    en: 'Reading drills by hand position: the right hand from middle C, the left hand across the bass staff, then mixed lines in both clefs to read on sight.',
    ru: 'Упражнения в чтении по позициям руки: правая рука от до первой октавы, левая по всему басовому стану, затем смешанные строки в обоих ключах для чтения с листа.',
  },
  weeks: 8,
  lessons: [rhCDE, rhFG, lhCBA, lhGF, bassEDC, bassBAGF, practiceOne, practiceTwo],
  songs: [],
}

export default course
