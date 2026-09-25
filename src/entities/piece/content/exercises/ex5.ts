import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex5',
  kind: 'exercise',
  title: 'Урок 5: Am – Dm – E – Am – F – C – Dm – E – Am',
  titleEn: 'Lesson 5: Am – Dm – E – Am – F – C – Dm – E – Am',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 't1',
  note: {
    en: 'Use the two new right-hand techniques, ♪♩ and ♪♪♪♪.',
    ru: 'Используйте две новые техники правой руки: ♪♩ и ♪♪♪♪.',
  },
  sections: [{ kind: 'practice', lines: ['Am Dm E Am', 'F C Dm E Am'] }],
})
