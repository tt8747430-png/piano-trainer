import { definePiece } from '../../model/types'

export default definePiece({
  id: 'legenda',
  kind: 'song',
  title: 'Христос, для многих Ты людей – легенда',
  titleEn: 'Christ, to many You are a legend',
  source: { book: 'called-to-play-2', page: 24 },
  key: 'F',
  meter: '12/8',
  tempo: 56,
  pattern: 'M1',
  note: {
    en: 'Where way 3 goes an octave higher, the workbook writes 3↑. Here it plays as plain way 3.',
    ru: 'Там, где вид 3 играют октавой выше, тетрадь пишет 3↑. Здесь он звучит как обычный вид 3.',
  },
  sections: [
    { kind: 'verse', lines: ['F:4 Gm:5.2', 'C:3 F:inv-C:t1', 'F:t4 Gm:4', 'C:5.1 F:oct'] },
    { kind: 'chorus', lines: ['F:t5-D:inv Gm:4-Gm:t3', 'C:3ch F:t2', 'D:5.1 G:4', 'C:t1 F:t4'] },
  ],
})
