import { definePiece } from '../../model/types'

export default definePiece({
  id: 'prosti',
  kind: 'song',
  title: 'Прости меня, Боже',
  titleEn: 'Forgive me, God',
  source: { book: 'called-to-play-2', page: 21 },
  key: 'Dm',
  meter: '6/8',
  tempo: 54,
  pattern: 'M1',
  note: {
    en: 'The last two lines of each verse repeat. The D printed in brackets after Dm leads back into them.',
    ru: 'Две последние строки каждого куплета повторяются. D в скобках после Dm ведёт обратно к их началу.',
  },
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Dm:t1 Gm:3 A:5.1 Dm:4',
        'Dm:inv Gm:4 C:t5 F:4',
        'Gm:5.1 C:t2 F:4 Dm:t3',
        'Gm:2 A:2 Dm:5-D',
      ],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'Dm:3 Gm:4 A:t1 Dm:t3',
        'Dm:inv Gm:t5 C:inv F:inv',
        'Gm:t2 C:4 F:3 Dm:t4',
        'Gm:3 A:5 Dm:5-D',
      ],
    },
  ],
})
