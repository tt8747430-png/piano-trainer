import { definePiece } from '../../model/types'

export default definePiece({
  id: 'soon',
  kind: 'song',
  title: 'Soon, Soon Our Savior Will Come',
  source: { book: 'called-to-play' },
  key: 'Em',
  meter: '4/4',
  tempo: 84,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Em:4 Am:t1', 'B:3 Em:6u', 'Em:5.2 Am:5.3', 'B:inv Em:t2'] },
    {
      kind: 'chorus',
      lines: [
        'Em:4 Am:t3 D:5.1 G:6d',
        'C:3 Am:t1 B:2 Em:t4',
        'Em:3ch Am:inv D:t5 G:6u',
        'C:t4 Am:6d B:t1 Em:1',
      ],
    },
  ],
})
