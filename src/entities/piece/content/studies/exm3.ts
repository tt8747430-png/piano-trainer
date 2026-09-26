import { definePiece } from '../../model/types'

export default definePiece({
  id: 'exm3',
  kind: 'study',
  title: 'Урок 3: новый способ на каждом аккорде (Dm)',
  titleEn: 'Lesson 3: a new method on every chord (Dm)',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 72,
  pattern: 'M1',
  sections: [
    { kind: 'practice', lines: ['Dm:3 Gm:1 A:4 Dm:2 D:5 Gm:3', 'C:4 F:2 Dm:1 Gm:5 A:4 Dm:3'] },
  ],
})
