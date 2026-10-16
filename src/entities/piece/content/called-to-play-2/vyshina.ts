import { definePiece } from '../../model/types'

export default definePiece({
  id: 'vyshina',
  kind: 'song',
  title: 'Там, в вышине бесконечной',
  titleEn: 'There, in the endless heights',
  source: { book: 'called-to-play-2', page: 23 },
  key: 'Am',
  meter: '12/8',
  tempo: 56,
  pattern: 'M1',
  note: {
    en: 'Where way 3 goes an octave higher, the workbook writes 3↑. Here it plays as plain way 3.',
    ru: 'Там, где вид 3 играют октавой выше, тетрадь пишет 3↑. Здесь он звучит как обычный вид 3.',
  },
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Am:3 Dm:3-Dm:t1',
        'Dm/B:5-E:t2 Am:3ch',
        'Am:4-Am:3 Dm:t3-Dm/B:5',
        'Am:3-Dm:4 E:t5-Am:3 Am@2:t3',
      ],
    },
    {
      kind: 'verse',
      n: 2,
      lines: ['Am:5.2 Dm:5.3', 'Dm/B:5-E:3 Am:t4', 'Am:5.2 Dm:3-F:oct', 'Am:inv-Dm E:3-Am:oct'],
    },
  ],
})
