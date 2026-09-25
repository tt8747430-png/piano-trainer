import { definePiece } from '../../model/types'

export default definePiece({
  id: 'silent',
  kind: 'song',
  title: 'Silent Night',
  credits: [{ role: 'music', names: 'Gruber' }],
  key: 'C',
  meter: '3/4',
  tempo: 84,
  pattern: 'r4',
  note: {
    en: 'In 3/4 the figuration becomes 1–5–8 in the left hand and 1–3–2 in the right: one smooth wave per bar.',
    ru: 'На 3/4 фигурация становится 1–5–8 в левой руке и 1–3–2 в правой: одна плавная волна на такт.',
  },
  sections: [
    {
      kind: 'verse',
      lines: ['C C C C', 'G7 G7 C C', 'F F C C', 'F F C C', 'G7 G7 C C', 'C G7 C C'],
    },
  ],
  melody:
    'G4/1.5 A4/.5 G4/1 | E4/3 | G4/1.5 A4/.5 G4/1 | E4/3 | D5/2 D5/1 | B4/3 | C5/2 C5/1 | G4/3 | A4/2 A4/1 | C5/1.5 B4/.5 A4/1 | G4/1.5 A4/.5 G4/1 | E4/3 | A4/2 A4/1 | C5/1.5 B4/.5 A4/1 | G4/1.5 A4/.5 G4/1 | E4/3 | D5/2 D5/1 | F5/1.5 D5/.5 B4/1 | C5/3 | E5/3 | C5/1.5 G4/.5 E4/1 | G4/1.5 F4/.5 D4/1 | C4/3 | r/3',
})
