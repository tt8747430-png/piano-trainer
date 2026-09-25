import { definePiece } from '../../model/types'

export default definePiece({
  id: 'ex9',
  kind: 'exercise',
  title: 'Урок 9: сексты вверх и вниз (Dm)',
  titleEn: 'Lesson 9: sixths up and down (Dm)',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 's6u',
  sections: [{ kind: 'practice', lines: ['Dm Gm A Dm', 'D Gm A Dm'] }],
})
