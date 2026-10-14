import { definePiece } from '../../model/types'

export default definePiece({
  id: 'angely',
  kind: 'song',
  title: 'Ангелы в небе Господа славят',
  titleEn: 'Angels in heaven praise the Lord',
  source: { book: 'called-to-play-2', page: 14 },
  key: 'Em',
  meter: '12/8',
  tempo: 56,
  pattern: 'M1',
  note: {
    en: 'The workbook writes 3↑ where way 3 goes an octave higher; it plays here as 3.',
    ru: 'Тетрадь пишет 3↑ там, где вид 3 играют октавой выше; здесь он звучит как 3.',
  },
  sections: [
    { kind: 'verse', lines: ['Em:3 B:4-B:3', 'Am:5-B:4 Em:2 E:4'] },
    {
      kind: 'chorus',
      lines: ['Am:5-D:5 G:5-C:4', 'Am:2-B:3 Em:1 E:4', 'Am:5-D:5 G:5-C:4', 'Am:2-B:1 Em:3'],
    },
  ],
})
