import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wonder',
  kind: 'song',
  title: 'How Wonderful Is All That’s Yours',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    {
      kind: 'verse',
      lines: [
        'Am:3 Am:6u',
        'Dm:3 Dm:t4',
        'G:3 G:6d',
        'C:t1 E',
        'Am:5.2 Am:5.2',
        'Dm:inv Dm:t2',
        'F:3 F:t3',
        'E:t5 E:t2',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Am:4 Am:6d',
        'Am:4 Dm:t4',
        'G:3 G:t3',
        'C:3 E:3ch',
        'Am:5.3 Am:5.3',
        'Am:2 Dm:6u',
        'E:3 E:3',
        'F-E:1 Am:3ch',
      ],
    },
  ],
})
