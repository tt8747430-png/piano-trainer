import { definePiece } from '../../model/types'

export default definePiece({
  id: 'skala',
  kind: 'song',
  title: 'Один построил свой дом на скале',
  titleEn: 'The Wise Man Built His House upon the Rock',
  source: { book: 'called-to-play-2', page: 37 },
  key: 'F',
  meter: '4/4',
  tempo: 100,
  pattern: 'r5',
  note: {
    en: 'One of the three songs of lesson 9, with the tune in the right hand.',
    ru: 'Одна из трёх песен урока 9, мелодия в правой руке.',
  },
  sections: [{ kind: 'verse', lines: ['F@1 F C C F', 'Bb F C F', 'F C C F', 'Bb F C F@3'] }],
  staves: [
    {
      notes:
        'C4/1 | F4/1 F4/1 F4/1 E4/.5 F4/.5 | G4/1 G4/.5 F4/.5 E4/1 C4/1 | G4/1 G4/1 G4/1 F4/.5 G4/.5 | A4/1 A4/.5 G4/.5 F4/1 F4/1 | Bb4/1 Bb4/1 Bb4/1 A4/.5 G4/.5 | A4/1 A4/.5 G4/.5 F4/1 A4/1 | G4/2 E4/2 | F4/3 r/1 | F4/1 F4/1 F4/1 E4/.5 F4/.5 | G4/1 G4/.5 F4/.5 E4/2 | G4/1 G4/1 G4/1 F4/.5 G4/.5 | A4/1 A4/.5 G4/.5 F4/2 | Bb4/1 Bb4/1 Bb4/1 A4/.5 G4/.5 | A4/1 A4/.5 G4/.5 F4/1 A4/1 | G4/2 E4/1 E4/1 | F4/3',
    },
  ],
})
