import { definePiece } from '../../model/types'

export default definePiece({
  id: 'potoki',
  kind: 'song',
  title: 'Благословений потоки',
  titleEn: 'Showers of Blessing',
  source: { book: 'called-to-play-2', page: 33 },
  key: 'A',
  meter: '4/4',
  tempo: 84,
  pattern: 'M5',
  sections: [
    { kind: 'verse', lines: ['A:5-E A:5', 'E:5 A:5', 'D:5 A:5', 'B:5.1 E:5.1'] },
    { kind: 'chorus', lines: ['A:5 A:inv', 'A:inv E:5.1', 'A:5-D:5 A:5', 'E:5 A:3'] },
  ],
})
