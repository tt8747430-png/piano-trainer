import { definePiece } from '../../model/types'

export default definePiece({
  id: 'exm1',
  kind: 'exercise',
  title: 'Урок 3: новый способ на каждом аккорде (C)',
  titleEn: 'Lesson 3: a new method on every chord (C)',
  source: { book: 'called-to-play' },
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'M1',
  sections: [{ kind: 'practice', lines: ['C:1 Dm:2 G:3 C:4 F:5', 'Am:1 Em:2 G:3 F:4 C:5'] }],
})
