import { definePiece } from '../../model/types'

export default definePiece({
  id: 'metel',
  kind: 'song',
  title: 'Опять метель',
  titleEn: 'A blizzard again',
  source: { book: 'gorshkov' },
  key: 'Gm',
  meter: '4/4',
  tempo: 72,
  pattern: 'pop8',
  note: {
    en: 'From Vasily Gorshkov’s course: the song of his lesson on melodic figuration. Its chorus holds long notes, and a line in the accompaniment can answer them.',
    ru: 'Из курса Василия Горшкова, песня к его уроку о мелодической фигурации. В припеве есть долгие ноты, и на них может ответить линия в аккомпанементе.',
  },
  sections: [
    {
      kind: 'verse',
      lines: [
        'Cm7@2-Dsus4@1-D7@1 Gm9 Cm7@2-Dsus4@1-D7@1 Gm(add9)',
        'Cm7@2-Dsus4@1-D@1 Ebmaj7 Cm7@2-Dsus4@1-D7@1 Gm6',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Cm7 Dsus4@2-D@2 Gm9@2-Gm/F@2 Ebmaj7',
        'Cm7 Dsus4@2-D@2 Gm9@2-Gm/F@2 Ebmaj7@2-D7b9@2 Gm6',
      ],
    },
  ],
  melody:
    'r/1 C4/.25 C4/.25 C4/.25 C4/.25 D4/.75 D4/.25 C4/.5 A3/.5 | Bb3/2 r/2 | r/1 C4/.25 C4/.25 C4/.25 C4/.25 D4/.75 D4/.25 C4/.5 A3/.5 | Bb3/2 r/2 | r/1 C4/.25 C4/.25 C4/.25 C4/.25 D4/.75 D4/.25 F#4/.5 A4/.5 | A4/.75 G4/.25 r/.5 F4/.25 Eb4/.25 D4/2 | r/1 C4/.25 C4/.25 C4/.25 C4/.25 D4/.75 D4/.25 F#4/.5 G4/.5 | G4/2 r/1 r/.5 Eb4/.25 Bb4/3.25 | r/.5 D4/.25 A4/3.25 | r/.5 D4/.5 | A4/.5 G4/.5 F#4/.25 G4/.25 A4/1 G4/.5 F4/.25 G4/.25 Bb4/3.5 | r/.5 Eb4/.25 Bb4/3.25 | r/.5 D4/.25 A4/3.25 | r/.5 D4/.5 | A4/.5 G4/.5 F#4/.25 G4/.25 A4/1 G4/.5 F4/.25 G4/.25 Bb4/2.5 | A4/2 | G4/2 r/2',
})
