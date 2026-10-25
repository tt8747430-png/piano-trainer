import { definePiece } from '../../model/types'

export default definePiece({
  id: 'house-rising-sun',
  kind: 'song',
  title: 'The House of the Rising Sun',
  titleRu: 'Дом восходящего солнца',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'Am',
  meter: '3/4',
  tempo: 120,
  pattern: 'block',
  note: {
    en: 'The folk tune in 3/4, as American songbooks print it. The Animals’ 1964 recording plays it in 6/8, over Am, C, D and F.',
    ru: 'Народная мелодия на 3/4, как её печатают американские песенники. В записи The Animals 1964 года она звучит на 6/8, на аккордах Am, C, D и F.',
  },
  sections: [
    { kind: 'verse', lines: ['Am@1 Am Am E7 Am', 'Am C C E7', 'Am C Am Am', 'Am E7 Am Am'] },
  ],
  staves: [
    {
      notes:
        'E4/1 | A4/2 B4/.5 A4/.5 | C5/2 D5/.5 D#5/.5 | E5/2 C5/.5 B4/.5 | A4/2 E5/1 | A5/2 E5/1 | G5/2 E5/.5 D5/.5 | E5/4 r/1 E5/.5 E5/.5 | A5/2 A4/1 | C5/2 D5/1 | E5/.5 E5/1.5 C5/.5 B4/.5 | A4/2 E5/1 | E5/2 E5/1 | E5/.5 E4/1.5 C5/.5 B4/.5 | A4/5',
    },
  ],
})
