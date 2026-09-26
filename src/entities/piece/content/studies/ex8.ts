import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex8',
  kind: 'study',
  title: 'Урок 8: Dm – Gm – A – Dm – D – Gm – A – Dm',
  titleEn: 'Lesson 8: Dm – Gm – A – Dm – D – Gm – A – Dm',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 'p51',
  note: { en: 'Use 5.1, 5.2 and 5.3.', ru: 'Используйте 5.1, 5.2 и 5.3.' },
  sections: [{ kind: 'practice', lines: ['Dm Gm A Dm', 'D Gm A Dm'] }],
})
