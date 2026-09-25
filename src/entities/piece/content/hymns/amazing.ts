import { definePiece } from '../../model/types'

export default definePiece({
  id: 'amazing',
  kind: 'song',
  title: 'Amazing Grace',
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  note: {
    en: 'A waltz-like bass–chord alternation: the bass on beat 1, the chord on beats 2 and 3.',
    ru: 'Вальсовое чередование бас-аккорд: бас на первую долю, аккорд на вторую и третью.',
  },
  sections: [{ kind: 'verse', lines: ['G G7 C G', 'G G D D7', 'G G7 C G', 'Em D G G'] }],
})
