import { definePiece } from '../../model/types'

export default definePiece({
  id: 'brat',
  kind: 'song',
  title: 'Брат, напомни мне опять',
  titleEn: 'Brother, remind me again',
  source: { book: 'called-to-play-2', page: 20 },
  key: 'F',
  meter: '6/8',
  tempo: 58,
  pattern: 'M1',
  sections: [
    {
      kind: 'verse',
      lines: ['F:3 C:inv', 'C:4 F:t1', 'F:t5 C:4', 'C:3 F:t4', 'F:4 Bb:2-F', 'F:t1 Bb:1-F'],
    },
    { kind: 'chorus', lines: ['C:t2 F:t3', 'C:inv F:t5', 'C:4 F:inv', 'C:t2 F:3'] },
  ],
})
