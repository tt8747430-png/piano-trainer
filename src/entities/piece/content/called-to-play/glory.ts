import { definePiece } from '../../model/types'

export default definePiece({
  id: 'glory',
  kind: 'song',
  title: 'All Glory to God in This World',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Am:3 Dm:t1', 'E:1 Am:4', 'F:t1 C:t2', 'Dm:3 E:4'] },
    {
      kind: 'chorus',
      lines: [
        'Am:2 Am:4',
        'Am:5 E:t2',
        'Dm:4 E:t1',
        'E:5 Am:t2',
        'Am:3 Am:2',
        'A:t2 Dm:3',
        'Dm:t1 Am:4',
        'Dm-E:1 Am:3',
      ],
    },
  ],
})
