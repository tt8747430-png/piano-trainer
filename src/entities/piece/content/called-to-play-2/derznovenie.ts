import { definePiece } from '../../model/types'

export default definePiece({
  id: 'derznovenie',
  kind: 'song',
  title: 'Дерзновение, упование',
  titleEn: 'Boldness and hope',
  source: { book: 'called-to-play-2', page: 36 },
  key: 'F',
  meter: '4/4',
  tempo: 92,
  pattern: 'r5',
  note: {
    en: 'One of lesson 9’s three songs, the tune in the right hand. The chorus is printed in two voices a 3rd apart; this is the upper.',
    ru: 'Одна из трёх песен урока 9, мелодия в правой руке. Припев напечатан в два голоса в терцию; здесь верхний.',
  },
  sections: [
    { kind: 'verse', lines: ['F@1 F Gm C F', 'F Gm C F'] },
    { kind: 'chorus', lines: ['C F C F', 'F Gm C F@3'] },
  ],
  melody:
    'A4/.5 G4/.5 | A4/1 F4/1 C4/1 Bb4/.5 A4/.5 | Bb4/1 G4/1 D4/1 E4/.5 F4/.5 | G4/1 C4/1 F4/1 G4/1 | A4/3 A4/.5 G4/.5 | A4/1 F4/1 C4/1 Bb4/.5 A4/.5 | Bb4/1 G4/1 D4/2 | C4/.5 F4/.5 F4/.5 E4/.5 A4/1 G4/1 | F4/3 A4/.5 C5/.5 | C5/1 Bb4/1 G4/1 Bb4/.5 D5/.5 | D5/1 C5/1 A4/1 A4/.5 C5/.5 | C5/1 Bb4/1 G4/1 D5/1 | C5/3 A4/.5 G4/.5 | A4/1 F4/1 C4/1 Bb4/.5 A4/.5 | Bb4/1 G4/1 D4/2 | C4/.5 F4/.5 F4/.5 E4/.5 A4/1 G4/1 | F4/3',
})
