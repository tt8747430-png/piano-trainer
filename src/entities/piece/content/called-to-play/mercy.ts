import { definePiece } from '../../model/types'

export default definePiece({
  id: 'mercy',
  kind: 'song',
  title: 'For Love, For Mercy, For Salvation',
  source: { book: 'called-to-play' },
  key: 'Am',
  meter: '4/4',
  tempo: 76,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Am:inv Dm:t4', 'E:t5 Am-E:5', 'Am:3 Dm:4', 'E:3ch Am-E:5'] },
    { kind: 'chorus', lines: ['Am:t5 Dm:t2', 'G:inv C-E:5', 'Am:3ch Dm:t3', 'E:t1 Am:3'] },
  ],
})
