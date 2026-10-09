import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex9',
  kind: 'study',
  title: 'Урок 9: Dm – Gm – A – Dm – D – Gm – A – Dm',
  titleEn: 'Lesson 9: Dm – Gm – A – Dm – D – Gm – A – Dm',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 's6u',
  note: {
    en: 'Use the two new right-hand techniques: sixths up and sixths down.',
    ru: 'Используйте две новые техники правой руки: сексты вверх и сексты вниз.',
  },
  sections: [{ kind: 'practice', lines: ['Dm Gm A Dm', 'D Gm A Dm'] }],
})
