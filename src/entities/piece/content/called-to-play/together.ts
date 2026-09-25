import { definePiece } from '../../model/types'

export default definePiece({
  id: 'together',
  kind: 'song',
  title: 'Together We Believed',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Am:4 E:inv',
        'E:5.1 Am:t2',
        'Dm:t1 Am:6u',
        'E:4 Am:t4',
        'Dm:5.2 Am:5.3',
        'E:3 Am:3ch',
      ],
    },
    { kind: 'verse', n: 2, lines: ['Am:6u E:4', 'E:t5 Am:t3', 'Dm:2 Am:inv', 'E:t1 Am:6d'] },
  ],
})
