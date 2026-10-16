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
    en: 'Reading drills, one hand position at a time. The right hand starts on middle C, the left hand moves across the bass staff, and mixed lines in both clefs train sight-reading.',
    ru: 'Упражнения в чтении нот, по одной позиции руки за раз. Правая рука начинает с до первой октавы, левая проходит весь басовый стан, а смешанные строки в обоих ключах тренируют чтение с листа.',
  },
  weeks: 8,
  lessons: [rhCDE, rhFG, lhCBA, lhGF, bassEDC, bassBAGF, practiceOne, practiceTwo],
  songs: [],
}

export default course
