import { definePiece } from '../../model/types'

export default definePiece({
  id: 'fellow',
  kind: 'song',
  title: 'What a Fellowship',
  source: { book: 'called-to-play' },
  key: 'G',
  meter: '4/4',
  tempo: 84,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['G:3 C:t1', 'G:5 D:t4', 'G:4 C:t3', 'G:1 D-G:5'] },
    { kind: 'chorus', lines: ['G:5 C:t2', 'G:2 D:t4', 'G:t1 C:4', 'G:t3 D:5 G:3'] },
  ],
})
