import { definePiece } from '../../model/types'

export default definePiece({
  id: 'hot-cross-buns',
  kind: 'song',
  title: 'Hot Cross Buns',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 92,
  pattern: 'block',
  sections: [{ kind: 'verse', lines: ['C C', 'C-G C'] }],
  staves: [
    {
      notes:
        'E4/1 D4/1 C4/2 | E4/1 D4/1 C4/2 | C4/.5 C4/.5 C4/.5 C4/.5 D4/.5 D4/.5 D4/.5 D4/.5 | E4/1 D4/1 C4/2',
    },
  ],
})
