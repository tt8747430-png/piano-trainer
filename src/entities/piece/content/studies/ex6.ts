import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex6',
  kind: 'study',
  title: 'Урок 6: G – C – D – Em – Am – D – G',
  titleEn: 'Lesson 6: G – C – D – Em – Am – D – G',
  source: { book: 'called-to-play' },
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 't3',
  note: {
    en: 'Use the two new right-hand techniques: a run down to the root and a run up 1–2–3–5.',
    ru: 'Используйте две новые техники правой руки: пассаж вниз к основному тону и пассаж вверх 1–2–3–5.',
  },
  sections: [{ kind: 'practice', lines: ['G C D Em', 'Am D G'] }],
})
