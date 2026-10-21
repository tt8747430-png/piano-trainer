import { definePiece } from '../../model/types'

export default definePiece({
  id: 'otche',
  kind: 'song',
  title: 'О наш Отец на небесах',
  titleEn: 'Our Father in Heaven',
  source: { book: 'seven-types' },
  key: 'Fm',
  meter: '4/4',
  tempo: 72,
  pattern: 'r1',
  note: {
    en: 'Боброва uses this hymn to show all seven accompaniment types. Try them in order. Then mix them, as the practicum suggests: figuration in the verse, chord pulse in the chorus.',
    ru: 'На этом гимне Боброва показывает все семь видов аккомпанемента. Попробуйте их по порядку. Затем смешивайте их, как советует практикум: фигурация в куплете, аккордовая пульсация в припеве.',
  },
  sections: [
    { kind: 'hymn', lines: ['Fm@1 Fm Gdim', 'C7 Fm-Eb', 'Ab Eb-C7', 'Fm@2-Bbm@1-C7@1 Fm@3-Eb@1'] },
  ],
  melody:
    'C4/1 | F4/1.5 F4/.5 Ab4/.5 Ab4/.5 G4/.5 F4/.5 | G4/3 C4/1 | G4/1.5 Ab4/.5 Bb4/.5 Bb4/.5 Ab4/.5 G4/.5 | Ab4/1 F4/1 r/1 Ab4/.5 Bb4/.5 | C5/1.5 C5/.5 Db5/.5 Db5/.5 C5/.5 C5/.5 | Bb4/3 C5/.5 Bb4/.5 | Ab4/1.5 Ab4/.5 Bb4/.5 Bb4/.5 Ab4/.5 G4/.5 | F4/3 r/1',
})
