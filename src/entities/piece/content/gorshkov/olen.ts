import { definePiece } from '../../model/types'

export default definePiece({
  id: 'olen',
  kind: 'song',
  title: 'Как олень спешит к воде',
  titleEn: 'As the Deer',
  source: { book: 'gorshkov' },
  key: 'D',
  meter: '4/4',
  tempo: 70,
  pattern: 'ballad',
  note: {
    en: 'From Vasily Gorshkov’s course. Where a phrase holds a long note, his sheet adds a ii–V–I, and so does this chart. Bar 12 is printed C♯7♭5 but plays as C♯m7♭5: the ii of B minor, as his sheet names it.',
    ru: 'Из курса Василия Горшкова. Там, где фраза тянет долгую ноту, его лист добавляет оборот 2-5-1; здесь он тоже есть. В 12-м такте напечатан C♯7♭5, а звучит C♯m7♭5: это II ступень си минора, как она названа в его листе.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'D@2-D/C#@2 Bm@2-Bm/A@2 G@2-Asus4@2 D@2-Em9@1-A7b9@1',
        'Dmaj7@2-F#7#9@2 Bm9@2-C/D@2 Gmaj7@2-Asus4@2 D@2-C#m7b5@1-F#7#9@1',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Bm9@2-Bm/A@2 G@2-D/F#@2 G@2-G/F#@2 Em@1-C#m7b5@1 F#sus4@3-A13b9@1',
        'Dmaj7@2-A/C#@2 Bm@2-D/F#@2 Em@2-Asus4@2 D',
      ],
    },
  ],
  staves: [
    {
      notes:
        'F#4/1 A4/1 A4/1 F#4/.5 E4/.5 | D4/1.5 E4/.5 G4/.5 F#4/.5 E4/.5 D4/.5 | B4/1.5 B4/.5 A4/1.5 G4/.5 | A4/3 r/1 | F#4/1 A4/1 A4/1 F#4/.5 E4/.5 | D4/1.5 E4/.5 G4/.5 F#4/.5 E4/.5 D4/.5 | D4/1.5 F#4/.5 E4/1.5 D4/.5 | E4/3 r/1 | D5/1 D5/1 D5/1 D5/.5 C#5/.5 | B4/1 B4/1 A4/1 r/.5 D4/.5 | B4/1 B4/1 B4/1 B4/.5 A4/.5 | G4/1 G4/1 | G4/3 r/1 | F#4/1 A4/1 A4/1 F#4/.5 E4/.5 | D4/1.5 E4/.5 G4/.5 F#4/.5 E4/.5 D4/.5 | D4/1.5 F#4/.5 E4/1.5 D4/.5 | E4/3 r/1',
    },
  ],
})
