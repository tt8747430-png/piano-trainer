import { definePiece } from '../../model/types'

export default definePiece({
  id: 'amazing',
  kind: 'song',
  title: 'Amazing Grace',
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['G G7 C G', 'G G D D7', 'G G7 C G', 'Em D G G'] }],
})
