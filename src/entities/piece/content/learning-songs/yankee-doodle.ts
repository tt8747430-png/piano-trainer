import { definePiece } from '../../model/types'

export default definePiece({
  id: 'yankee-doodle',
  kind: 'song',
  title: 'Yankee Doodle',
  titleRu: 'Янки Дудл',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 112,
  pattern: 'country',
  sections: [
    { kind: 'verse', lines: ['C C-G7 C C-G7', 'C F-C G7 C'] },
    { kind: 'chorus', lines: ['F F C C-C7', 'F F C-G7 C'] },
  ],
  staves: [
    {
      notes:
        'C5/1 C5/1 D5/1 E5/1 | C5/1 E5/1 D5/1 G4/1 | C5/1 C5/1 D5/1 E5/1 | C5/2 B4/2 | C5/1 C5/1 D5/1 E5/1 | F5/1 E5/1 D5/1 C5/1 | B4/1 G4/1 A4/1 B4/1 | C5/2 C5/2 | A4/1.5 B4/.5 A4/1 G4/1 | A4/1 B4/1 C5/2 | G4/1.5 A4/.5 G4/1 F4/1 | E4/2 G4/2 | A4/1.5 B4/.5 A4/1 G4/1 | A4/1 B4/1 C5/1 A4/1 | G4/1 C5/1 B4/1 D5/1 | C5/2 C5/2',
    },
  ],
})
