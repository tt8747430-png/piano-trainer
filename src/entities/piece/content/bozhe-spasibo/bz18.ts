import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz18',
  kind: 'song',
  title: 'Что же ты стоишь',
  titleEn: 'Why are you standing still?',
  credits: [
    { role: 'words-and-music', names: 'Евгений Гудухин' },
    { role: 'harmony', names: 'Яков Винс' },
  ],
  source: { book: 'bozhe-spasibo', number: 18, page: 54 },
  key: 'Gm',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  note: {
    en: 'Bar 7 of the verse is printed “C♯/A” in the score: C♯–E–G over A, which is A7. Gm/H = Gm/B.',
    ru: 'Седьмой такт куплета напечатан в нотах как «C♯/A»: C♯–E–G над A, то есть A7. Gm/H = Gm/B.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'Gm Cm6/G D7/F# Gm-Gm/F',
        'Eb-Bb/D Cm-Cm6 A7/C#-A7 Dsus4-D7',
        'Gm Cm6/A D7 Gm-Gm/F',
        'Eb-Gm/Bb Cm A7/C#-A7 Dsus4-D7',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Gm-Gm/Bb Cm-Cm/B Cm/Bb-Cm/A D7@2-Eb/C@1-D7@1',
        'Gm-Cm6/A D7/F#-Gm G7@1-G7/B@1-Cm@1-Cm/A@1 D7',
        'Gm-Gm/Bb Gm-Gm/B Cm/Bb-Cm/A D7@2-Cm/Eb@1-D7@1',
        'Gm@2-Cm@1-Cm/A@1 D7-Gm G7@2-Cm@1-Cm6/A@1 D7',
        'Gm Gm',
      ],
    },
    { kind: 'ending', lines: ['Gm Cm/A F#dim7 Gm'] },
  ],
})
