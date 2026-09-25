import { definePiece } from '../../model/types'

export default definePiece({
  id: 'bz16',
  kind: 'song',
  title: 'Благодать со креста',
  titleEn: 'Grace from the cross',
  credits: [
    { role: 'words-and-music', names: 'Павел Пысларь' },
    { role: 'accompaniment', names: 'Яков Винс' },
  ],
  source: { book: 'bozhe-spasibo', number: 16, page: 46 },
  key: 'G#m',
  meter: '4/4',
  tempo: 72,
  pattern: 'r4',
  note: {
    en: 'The last chorus moves up a half step, from G♯ minor to A minor. The score writes D♯/F𝄪 as D♯/G, and Bdim7 as Hdim7.',
    ru: 'Последний припев поднимается на полтона, из соль-диез минора в ля минор. В нотах D♯/F𝄪 записан как D♯/G, а Bdim7 — как Hdim7.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'G#m C#m/G# D#/G G#m-G#m/F#',
        'E-G#m/D# C#m-C#m/A# D#sus4-D# G#m',
        'G#m C#m/A# D#/G G#m-G#m/F#',
        'E-G#m/D# C#m-C#m/A# D#sus4-D#7 G#m-D#7',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'G#m-G#m/F# C#m/E@2-C#m@1-C#m/A#@1 D#sus4-D# G#m-G#m/F#',
        'E-G#m/D# C#m-C#m/A# D#sus4-D#7 G#m-A#dim7',
        'D#sus4-D#7',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      detail: { en: 'in A minor', ru: 'в ля миноре' },
      lines: [
        'G#m-E Am-Am/G Dm-Dm/F Bdim7-E/G#',
        'E Am-Am/G Dm/F-Bdim7 Esus4-E7',
        'Am-Am/G F-Am/E Dm-Dm/B Esus4-E7',
        'Am',
      ],
    },
  ],
})
