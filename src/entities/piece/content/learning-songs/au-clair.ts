import { definePiece } from '../../model/types'

export default definePiece({
  id: 'au-clair',
  kind: 'song',
  title: 'Au clair de la lune',
  titleEn: 'By the Light of the Moon',
  titleRu: 'При свете луны',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 92,
  pattern: 'block',
  sections: [
    { kind: 'part', label: 'A', lines: ['C C-G C-G C', 'C C-G C-G C'] },
    { kind: 'part', label: 'B', lines: ['G7 Dm G G7'] },
    { kind: 'part', label: 'A', lines: ['C C-G C-G C'] },
  ],
  staves: [
    {
      notes:
        'C4/1 C4/1 C4/1 D4/1 | E4/2 D4/2 | C4/1 E4/1 D4/1 D4/1 | C4/4 | C4/1 C4/1 C4/1 D4/1 | E4/2 D4/2 | C4/1 E4/1 D4/1 D4/1 | C4/4 | D4/1 D4/1 D4/1 D4/1 | A3/2 A3/2 | D4/1 C4/1 B3/1 A3/1 | G3/4 | C4/1 C4/1 C4/1 D4/1 | E4/2 D4/2 | C4/1 E4/1 D4/1 D4/1 | C4/4',
    },
  ],
})
