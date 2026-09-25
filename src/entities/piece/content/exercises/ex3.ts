import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex3',
  kind: 'exercise',
  title: 'Урок 3: C – Dm – G – C – F – C – G – C',
  titleEn: 'Lesson 3: C – Dm – G – C – F – C – G – C',
  source: { book: 'called-to-play' },
  key: 'C',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  note: {
    en: 'Play the progression with each of the 5 methods in turn.',
    ru: 'Сыграйте последовательность каждым из 5 способов по очереди.',
  },
  sections: [{ kind: 'practice', lines: ['C Dm G C', 'F C G C'] }],
})
