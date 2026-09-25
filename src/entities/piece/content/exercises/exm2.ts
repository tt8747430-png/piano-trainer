import { definePiece } from '../../model/types'

export default definePiece({
  id: 'exm2',
  kind: 'exercise',
  title: 'Урок 3: новый способ на каждом аккорде (Am)',
  titleEn: 'Lesson 3: a new method on every chord (Am)',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 72,
  pattern: 'M1',
  sections: [{ kind: 'practice', lines: ['Am:1 Dm:2 E:3 Am:4', 'F:5 Dm:1 E:2 Am:3'] }],
})
