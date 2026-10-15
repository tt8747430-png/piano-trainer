import { definePiece } from '../../model/types'

export default definePiece({
  id: 'oh-susanna',
  kind: 'song',
  title: 'Oh! Susanna',
  titleRu: 'О, Сюзанна',
  credits: [{ role: 'words-and-music', names: 'Stephen Foster' }],
  key: 'C',
  meter: '4/4',
  tempo: 120,
  pattern: 'country',
  sections: [
    { kind: 'verse', lines: ['C@1 C C C G7', 'C C C-G7 C'] },
    { kind: 'chorus', lines: ['F F C G7', 'C C C-G7 C'] },
  ],
  melody:
    'C4/.5 D4/.5 | E4/1 G4/1 G4/1.5 A4/.5 | G4/1 E4/1 C4/1.5 D4/.5 | E4/1 E4/1 D4/1 C4/1 | D4/3 C4/.5 D4/.5 | E4/1 G4/1 G4/1.5 A4/.5 | G4/1 E4/1 C4/1.5 D4/.5 | E4/1 E4/1 D4/1 D4/1 | C4/3 r/1 | F4/2 F4/2 | A4/1 A4/2 A4/1 | G4/1 G4/1 E4/1 C4/1 | D4/3 C4/.5 D4/.5 | E4/1 G4/1 G4/1.5 A4/.5 | G4/1 E4/1 C4/1.5 D4/.5 | E4/1 E4/1 D4/1 D4/1 | C4/3',
})
