import { definePiece } from '../../model/types'

export default definePiece({
  id: 'heaven',
  kind: 'song',
  title: 'Heaven Awaits Me',
  source: { book: 'called-to-play' },
  key: 'Dm',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  sections: [
    { kind: 'verse', n: 1, lines: ['Dm:3 Gm:t1', 'A:inv Dm:t4', 'Dm:4 Gm:2', 'A:1 Dm:t2'] },
    { kind: 'chorus', lines: ['D:5.1 Gm:5.2', 'C:3 F:t3', 'Bb:5.1 Gm:5.3', 'A:t1 Dm:3ch'] },
    { kind: 'verse', n: 2, lines: ['Dm:4 Gm:t5', 'A:5.1 Dm:t4', 'Dm:5.2 Gm:5.3', 'A:2 Dm:inv'] },
    { kind: 'chorus', lines: ['D:5.1 Gm:5.2', 'C:3 F:t3', 'Bb:5.1 Gm:5.3', 'A:t1 Dm:3ch'] },
  ],
})
