import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex6',
  kind: 'exercise',
  title: 'Урок 6: G – C – D – Em – Am – D – G',
  titleEn: 'Lesson 6: G – C – D – Em – Am – D – G',
  source: { book: 'called-to-play' },
  key: 'G',
  meter: '4/4',
  tempo: 72,
  pattern: 't3',
  note: {
    en: 'Use techniques 3 and 4: runs down and a fast arpeggio up.',
    ru: 'Используйте техники 3 и 4: пассажи вниз и быстрое арпеджио вверх.',
  },
  sections: [{ kind: 'practice', lines: ['G C D Em', 'Am D G'] }],
})
