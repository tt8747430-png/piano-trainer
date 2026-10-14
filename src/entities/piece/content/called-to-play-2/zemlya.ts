import { definePiece } from '../../model/types'

export default definePiece({
  id: 'zemlya',
  kind: 'song',
  title: 'Пусть земля вся утверждает',
  titleEn: 'Let all the earth declare',
  source: { book: 'called-to-play-2', page: 8 },
  key: 'Am',
  meter: '4/4',
  tempo: 84,
  pattern: 'M1',
  sections: [
    { kind: 'verse', lines: ['Am:3 Dm:t2', 'E:t1 Am:inv', 'Am:oct Dm:4', 'F:3 E:octs'] },
    {
      kind: 'chorus',
      lines: [
        'Am:4 Am:6u Dm:3ch Dm:6u',
        'G:t5 G:ch C:4 E:octs',
        'Am:4 Am:5.2 Dm:inv Dm:t3',
        'E:t1 Am:ch',
        'E:oct Am:3',
      ],
    },
  ],
})
