import { definePiece } from '../../model/types'

export default definePiece({
  id: 'nojs',
  kind: 'song',
  title: 'The Name of Jesus Is So Sweet',
  source: { book: 'called-to-play' },
  key: 'C',
  meter: '4/4',
  tempo: 80,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['C:3 Dm:4', 'G:1 C:4', 'C:2 F:3', 'C-G:1 C:4'] },
    { kind: 'chorus', lines: ['C:5 Dm:4', 'G:5 C:4', 'C:2 F:3', 'C-G:1 C:3'] },
  ],
})
