import { definePiece } from '../../model/types'

export default definePiece({
  id: 'hgta',
  kind: 'song',
  title: 'How Great Thou Art',
  source: { book: 'called-to-play' },
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['C:1 F:1', 'C-G:1 C:1', 'C:2 F:2', 'C-G:2 C:4'] },
    { kind: 'chorus', lines: ['C-F:5 C:5', 'G:5 C:4', 'C-F:5 C:4', 'G:3 C:3'] },
  ],
})
