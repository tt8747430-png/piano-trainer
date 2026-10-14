import { definePiece } from '../../model/types'

export default definePiece({
  id: 'dveri',
  kind: 'song',
  title: 'В двери закрытые',
  titleEn: 'At the closed door',
  source: { book: 'called-to-play-2', page: 13 },
  key: 'Dm',
  meter: '6/8',
  tempo: 56,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Dm:3 Gm:5', 'A:4 Dm:4', 'Dm:1 Gm:2', 'A:3 Dm:4'] },
    { kind: 'chorus', lines: ['F:5 Gm:4', 'C:5 F:1-A', 'Dm:3 Gm:2', 'A:4 Dm:3'] },
  ],
})
