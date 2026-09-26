import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex7',
  kind: 'study',
  title: 'Урок 7: Am – Dm – E – Am – G – F – E – Am',
  titleEn: 'Lesson 7: Am – Dm – E – Am – G – F – E – Am',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 't5',
  note: {
    en: 'Use dotted chords, “3 chords” and inversions.',
    ru: 'Используйте пунктирные аккорды, «3 аккорда» и обращения.',
  },
  sections: [{ kind: 'practice', lines: ['Am Dm E Am', 'G F E Am'] }],
})
