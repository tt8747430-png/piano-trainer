import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wafriend',
  kind: 'song',
  title: 'What a Friend',
  source: { book: 'gorshkov' },
  key: 'C',
  meter: '4/4',
  tempo: 80,
  pattern: 'g2',
  note: {
    en: 'From Vasily Gorshkov’s lesson on chord pulse. Over the G of bars 4 and 12 he marks II and V: the held note takes a whole ii–V into C.',
    ru: 'Из урока Василия Горшкова об аккордовой пульсации. Над G в 4-м и 12-м тактах он отмечает II и V: долгая нота вмещает весь оборот 2-5 в C.',
  },
  sections: [
    { kind: 'verse', lines: ['C F C G', 'C@2-C7@2 F@2-Dm@2 C/G@2-G7@2 C'] },
    {
      kind: 'chorus',
      lines: ['Dm@2-G7@2 C@2-C7@2 F@2-C/E@2 G', 'C@2-C7@2 F@2-Dm@2 C/G@2-G7@2 C'],
    },
  ],
  melody:
    'G4/1.5 G4/.5 A4/.5 G4/.5 E4/.5 C4/.5 | C4/2 A3/2 | G3/1.5 C4/.5 E4/.5 C4/.5 G4/.5 E4/.5 | D4/4 | G4/1.5 G4/.5 A4/.5 G4/.5 E4/.5 C4/.5 | C4/2 A3/2 | G3/1.5 C4/.5 E4/.5 D4/.5 C4/.5 B3/.5 | C4/2 r/2 | D4/1.5 C#4/.5 D4/.5 E4/.5 F4/.5 D4/.5 | E4/2 G4/2 | A4/1.5 A4/.5 G4/.5 E4/.5 F4/.5 E4/.5 | D4/4 | G4/1.5 G4/.5 A4/.5 G4/.5 E4/.5 C4/.5 | C4/2 A3/2 | G3/1.5 C4/.5 E4/.5 D4/.5 C4/.5 B3/.5 | C4/4',
})
