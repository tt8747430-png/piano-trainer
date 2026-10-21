import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex3',
  kind: 'study',
  title: 'Урок 3: C – Dm – G – C – F – C – G – C',
  titleEn: 'Lesson 3: C – Dm – G – C – F – C – G – C',
  source: { book: 'called-to-play' },
  key: 'C',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  note: {
    en: 'Play the progression once with each of the 5 ways, in order.',
    ru: 'Сыграйте последовательность по разу каждым из 5 способов, по порядку.',
  },
  sections: [{ kind: 'practice', lines: ['C Dm G C', 'F C G C'] }],
})
