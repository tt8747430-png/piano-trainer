import { definePiece } from '../../model/types'

export default definePiece({
  id: 'vselennaya',
  kind: 'song',
  title: 'Господи, вселенную премудро Ты создал!',
  titleEn: 'Lord, You made the universe in wisdom!',
  source: { book: 'called-to-play-2', page: 43 },
  key: 'Am',
  meter: '4/4',
  tempo: 84,
  pattern: 'M1',
  sections: [
    { kind: 'verse', n: 1, lines: ['Am:t1 Dm:t4', 'E:3 Am:t2', 'G:t5 C:t3', 'Dm:5-Dm/B E:ch'] },
    {
      kind: 'chorus',
      lines: ['Am:3ch E:4', 'E:5.1 Am:inv F7:1-E7', 'Am:oct A:5-Dm:3', 'Am:5-E Am:2'],
    },
    { kind: 'verse', n: 2, lines: ['Am:5.2 Dm:5.3', 'E:3 Am:t3', 'G:6u C:6u', 'Dm:2-Dm/B E:oct'] },
  ],
})
