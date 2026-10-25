import { definePiece } from '../../model/types'

export default definePiece({
  id: 'brahms-lullaby',
  kind: 'song',
  title: 'Wiegenlied',
  titleEn: 'Lullaby',
  titleRu: 'Колыбельная',
  credits: [{ role: 'music', names: 'Johannes Brahms' }],
  key: 'F',
  meter: '3/4',
  tempo: 76,
  pattern: 'ballad',
  note: { en: 'Op. 49 No. 4, 1868.', ru: 'Соч. 49 № 4, 1868.' },
  sections: [
    { kind: 'verse', lines: ['F@1 F F F C7', 'C7 C7 C7 F@2-F7@1', 'Bb F Bb F', 'Bb F C7 F'] },
  ],
  staves: [
    {
      notes:
        'A4/.5 A4/.5 | C5/1.5 A4/.5 A4/1 | C5/1 r/1 A4/.5 C5/.5 | F5/1 E5/1.5 D5/.5 | D5/1 C5/1 G4/.5 A4/.5 | Bb4/1 G4/1 G4/.5 A4/.5 | Bb4/1 r/1 G4/.5 Bb4/.5 | E5/.5 D5/.5 C5/1 E5/1 | F5/1 r/1 F4/.5 F4/.5 | F5/2 D5/.5 Bb4/.5 | C5/2 A4/.5 F4/.5 | Bb4/1 C5/1 D5/1 | C5/2 F4/.5 F4/.5 | F5/2 D5/.5 Bb4/.5 | C5/2 A4/.5 F4/.5 | Bb4/1 A4/1 G4/1 | F4/2',
    },
  ],
})
