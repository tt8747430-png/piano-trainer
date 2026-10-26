import { definePiece } from '../../model/types'

export default definePiece({
  id: 'posylaet',
  kind: 'song',
  title: 'Бог посылает всё для нас',
  titleEn: 'God sends everything for us',
  source: { book: 'called-to-play-2', page: 35 },
  key: 'Em',
  meter: '4/4',
  tempo: 92,
  pattern: 'r5',
  note: {
    en: 'One of the three songs of lesson 9. The right hand plays the tune from the notes, and the left hand plays one of its ways over the chords. The chorus repeats and is written out with both endings.',
    ru: 'Одна из трёх песен урока 9. Правая рука играет мелодию по нотам, а левая — один из своих видов по аккордам. Припев повторяется и выписан с обеими вольтами.',
  },
  sections: [
    { kind: 'verse', lines: ['Em@2 Em B B Em'] },
    { kind: 'chorus', lines: ['Am-D G-Em Am-B Em', 'Am-D G-Em Am-B Em@2'] },
  ],
  staves: [
    {
      notes:
        'r/.5 E4/.5 E4/.5 F#4/.5 | G4/.5 G4/.5 G4/.5 F#4/.5 E4/1 D#4/.5 E4/.5 | F#4/1 F#4/1.5 F#4/.5 F#4/.5 G4/.5 | A4/.5 A4/.5 A4/.5 G4/.5 F#4/1 B4/.5 A4/.5 | B4/1 E4/1 r/.5 B4/.5 A4/.5 B4/.5 | C5/.5 C5/.5 C5/.5 B4/.5 A4/.5 A4/.5 G4/.5 A4/.5 | B4/.5 B4/.5 B4/.5 A4/.5 G4/.5 G4/.5 F#4/.5 G4/.5 | A4/.5 A4/.5 A4/.5 G4/.5 F#4/1 B4/.5 A4/.5 | B4/1 B4/1 r/.5 B4/.5 A4/.5 B4/.5 | C5/.5 C5/.5 C5/.5 B4/.5 A4/.5 A4/.5 G4/.5 A4/.5 | B4/.5 B4/.5 B4/.5 A4/.5 G4/.5 G4/.5 F#4/.5 G4/.5 | A4/.5 A4/.5 A4/.5 G4/.5 F#4/1 B4/.5 A4/.5 | B4/1 E4/1',
    },
  ],
})
