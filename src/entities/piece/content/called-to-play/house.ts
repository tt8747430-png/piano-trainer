import { definePiece } from '../../model/types'

export default definePiece({
  id: 'house',
  kind: 'song',
  title: 'A Three-Story Old House',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    {
      kind: 'verse',
      lines: [
        'Dm:3 Dm:6u',
        'Dm:5.2 Gm:t4',
        'Gm:inv Dm:t3',
        'A:5.1',
        'Dm-D:2',
        'Gm:t2 Dm:4',
        'A:t1',
        'Dm:3',
      ],
    },
  ],
})
