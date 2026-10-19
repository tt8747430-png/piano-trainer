import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wonderful',
  kind: 'song',
  title: 'Wonderful Grace of Jesus',
  credits: [
    { role: 'words-and-music', names: 'Haldor Lillenas' },
    { role: 'harmony', names: 'Natalie R. Blanton' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 84,
  pattern: 'r2',
  note: {
    en: 'Natalie R. Blanton’s arrangement, every note of it: three verses with their refrains, the third a half step higher.',
    ru: 'Обработка Натали Р. Блантон, нота в ноту: три куплета с припевами, третий на полтона выше.',
  },
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'C C°7-C C@1-C/E@1-C/G@1-G7@1 C-E7/B',
        'Am Am G-D7 G@1-C/G@1-G7@2',
        'C C°7-C C-C7 F',
        'F#°7 C/G-Ab7 C/G-G7 C',
      ],
    },
    {
      kind: 'chorus',
      lines: ['C G7 C G7', 'G7 C G-D7 G7', 'C G7 C@3-C7@1 F', 'F#°7 C/G-C7/Bb-F/A-Fm6/Ab C/G-G7 C'],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'C C°7-C/G C@2-Em/G@1-G7@1 C-E7',
        'Am Am G-D7 G@1-G7/F@1-C/E@1-G7/D@1',
        'C C°7-C/G C-C7 F',
        'F#°7 C/G-Ab7 C/G-G7 C',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'C G C@3-Am@1 G7',
        'G7 C G-D7 G7',
        'C G@3-G7@1 C@3-C7@1 F',
        'Eb°7-F#°7-D7/A-D7/C C/E-C/G-F/A-Fm6 C/G-G7 C@1-C/Bb@1-Ab@1-Ab7@1',
      ],
    },
    {
      kind: 'verse',
      n: 3,
      key: 'Db',
      lines: [
        'Db Db°7-Db/Ab Db@2-Fm/Ab@1-Ab7@1 Db-F',
        'Bbm Bbm Ab-Eb7 Ab@1-Ab7/Gb@1-Db/F@1-Ab7/Eb@1',
        'Db Db°7-Db/Ab Db-Db7 Gb',
        'G°7 Db/Ab-A7 Db/Ab-Ab7 Db',
      ],
    },
    {
      kind: 'chorus',
      last: true,
      key: 'Db',
      lines: [
        'Db Ab Db@3-Ab/C@1 Ab7',
        'Ab7 Db Ab-Eb7 Ab-Ab7',
        'Db Ab@3-Ab7@1 Db@3-Db7@1 Gb',
        'G°7@2-Eb7/Bb@1-Eb7/Db@1 Db/Ab@2-Ebm7/Bb@1-Gb@1 Db/Ab-Ab7 Db',
      ],
    },
  ],
  hands: {
    rh:
      'G4+E4+C4/1 G4+E4+C4/.75 G4+E4+C4/.25 G4+E4+C4/1 G4+E4+C4/1 | F#4+Eb4+C4+A4/2 G4+E4+C4/2 | G4+E4+C5/1 E4+C4/.75 F4+D4/.25 G4+E4+C4/1 G3+F4+D4/1 | G3+E4+C4/2 G#3+D4+B3/2 | ' +
      'E4+C4+A3/1 E4+C4+A3/.75 E4+C4+A3/.25 E4+C4+A3/1 E4+C4+A3/1 | E4+C4+A4/2 E4+C5+A4/2 | G4+D4+B4/1 G4+D4+B4/.75 G4+D4+B3/.25 F#4+C4+A4/1 F#4+C4+A4/1 | D4+B3/1 G4/4@1 E4+C4/1@2 F4+D4/2 | ' +
      'G4+E4+C4/1 G4+E4+C4/.75 G4+E4+C4/.25 G4+E4+C4/1 G4+E4+C4/1 | F#4+Eb4+C4+A4/2 G4+E4+C4/2 | G4+E4+C5/1 G4+E4+C5/.75 G4+E4+C5/.25 G4+E4+D5+Bb4/1 G4+E4+C5+Bb4/1 | F4+C5+A4/2 F4+C4+A4/1 F4+C4+A4/.75 F4+C4+A4/.25 | ' +
      'F#4+Eb4+C5+A4/1 F#4+Eb4+B4/.75 F#4+Eb4+A4/.25 F#4+Eb4+C5+A4/1 F#4+Eb4+A4/1 | G4+E4+C4/2 F#4+Eb4+C4/2 | G4+E4+C4/2 G4+F4+D5+B4/2 | G4+E4+C5/1 G4/1 E4/1 D4/1 | ' +
      'E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 | F4+D4+B3/.75 F4+D4+B3/.25 F4+D4+B3/.75 F4+D4+B3/.25 F4+D4+B3/.75 F4+D4+B3/.25 F4+D4+B3/.75 F4+D4+B3/.25 | E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 E4+C4/.75 E4+C4/.25 | F4+D4+B3/.75 F4+D4+B3/.25 F4+D4+B3/.75 F4+D4+B3/.25 F4/1:3 D4/1:3 E4/1:3 F4/1:3 G4/1:3 A4/1:3 | ' +
      'D4+B4/1 D4+B4/.75 E4+C5/.25 F4+D5/.75 E4+C5/.25 D4+B4/1 | E4+C5/1 E4+C5/.75 F4+D5/.25 G4+E5/.75 F4+D5/.25 E4+C5/1 | D4+B4/1 G4+D4+B4/1 F#4+C4+A4/1 D4+C4/1 | G4+D4+B3/.75 C4+A4/.25 D4+B4/.75 C4+A4/.25 G4+B3/.75 F4/.25 E4/.75 D4/.25 | ' +
      'C4/.75 D4+B3/.25 E4+C4/.75 F4+D4+C4/.25 G4+E4+C4/.75 F4+C4+A4/.25 G4+E4+C4/.75 E4+C4/.25 | D4+B3/1 G4/2@1 D4+B3/1@2 D4+B3/1 D4+B3/1 | C4/.75 D4+C4/.25 E4+C4/.75 G4+E4+C4/.25 G4+E4+C5/.75 G4+E4+B4/.25 E4+D5+Bb4/.75 G4+E4+C5/.25 | F4+A4/1 C5/3@1 F4+A4/1@2 F4+A4/1 F4+C4+A4/1 | ' +
      'F#4+Eb4+C5+A4/.75 F#4+Eb4+C5+A4/.25 F#4+Eb4+C5+A4/.75 F#4+Eb4+C5+A4/.25 F#4+Eb4+D5/1 F#4+Eb4+C5/1 | G4+E5+E4+C5/1 G4+E4+C5+Bb4/1 F5+F4+C5+A4/1 F4+D5+C5+Ab4/1 | G5+G4+E5+C5/2 G4+F4+D4+B4/2 | G4+E4+C5/1 G5+G4/1 C6+C5/2 | ' +
      'G4+E4+C4/1 G4+E4+C5/.75 G4+E5+E4+C5/.25 G5+G4+E5+C5/1 G5+G4+E5+C5/1 | F#5+Eb5+A5+A4/1 A4/1:3 F#5/1:3 A5/1:3 G5+G4+E5+C5/1 G5+G4/1:3 A5+A4/1:3 B5+B4/1:3 | G5+E5+C6+C5/1 G4+E5+E4+C5/.75 F5+F4+D5+A4/.25 G5+G4+E5+B4/1 F4+B4/1:3 D5/1:3 F5/1:3 | G4+E4+C5/1 E5/2@1 G4+E4+C5/1@2 G#4+E4+B4/1 E5/2@3 G#4+E4+B4/1@4 | ' +
      'E5+E4+C5+A4/1 E5+E4+C5+A4/.75 E5+E4+C5+A4/.25 E5+E4+C5+A4/1 E5+E4+C5+A4/1 | E5+C5+A5+A4/.75 G#5+G#4/.25 E5+C5+A5+A4/.75 B5+B4/.25 E5+C6+C5+A5/1:3 C6+C5/1:3 B5+B4/1:3 A5+A4/1:3 B5+B4/1:3 C6+C5/1:3 | G5+D5+B5+B4/1 G5+D5+B5+B4/.75 G5+D5+B4/.25 F#5+C5+A5+A4/1 F#5+D5+A5+A4/1 | G5+G4+D5+B4/1 F4/1:3 D5/1:3 F5/1:3 G4+E5+E4+C5/1 F4+B4/1:3 D5/1:3 F5/1:3 | ' +
      'G5+G4+E5+C5/1 G4/1:3 C5/1:3 E5/1:3 G5/1:3 C6/1:3 E6/1:3 G6+G5+E6+C6/1 | A6/.25 F#6/.25 Eb6/.25 C6/.25 A5/.25 F#5/.25 Eb5/.25 C5/.25 G5+G4+E5+C5/1 G5+G4+E5+C5/1:3 A5+A4/1:3 B5+B4/1:3 | G5+E5+C6+C5/1 G5+E5+C6+C5/.75 G5+E5+C6+C5/.25 F5+D6+D5+Bb5/1 G5+E5+C6+C5+Bb5/1 | F5+C6+C5+A5/1 C4/.125 F4/.125 G4/.125 A4/.125 C5/.125 F5/.125 G5/.125 A5/.125 F5+C5+A5+A4/1 F5+C5+A5+A4/.75 F5+C5+A5+A4/.25 | ' +
      'F#5+Eb5+C6+C5+A5/1 F#5+Eb5+B5+B4/.75 A5+A4/.25 F#5+Eb5+C6+C5+A5/1 Eb5+C5+A5+A4/1 | G5+E5+C5/1:3 G4/1:3 C5/1:3 E5/1:3 C5/1:3 G5/1:3 F#5+Eb5+C5/1:3 F#4/1:3 C5/1:3 Eb5/1:3 C5/1:3 F#5/1:3 | G5+E5/1:3 G4/1:3 C5/1:3 E5/1:3 G5/1:3 C6/1:3 F5+D6+D5+B5/1:3 B5/1:3 G5/1:3 F5/1:3 D5/1:3 B4/1:3 | G4+E4+C5+C4/1 G4+G3/1 E4+E3/1 D4+D3/1 | ' +
      'C4+C3/.75 D4+D3/.25 E4+E3/.75 F4+F3/.25 G4+G3/.75 A4+A3/.25 G4+G3/.75 E4+E3/.25 | G3/1:3 B3/1:3 D4/1:3 G4/1:3 B4/1:3 D5/1:3 G5/1:3 B5/1:3 D6/1:3 G6+G5/1 | G5+E5+C6+C5/.75 D5+D4/.25 E5+E4/.75 G5+G4/.25 C6+C5/.75 B5+B4/.25 D6+D5/.75 C6+C5/.25 | F5+D5+B4/.75 B5/3@1 F5+D5+B4/.25@1.75 F5+D5+B4/.75 F5+D5+B4/.25 G5+D5+B4/1 F5+F4/1:3 G5+G4/1:3 A5+A4/1:3 | ' +
      'G5+F5+D5+B5+B4/1 G5+F5+D5+B5+B4/.75 C6+C5/.25 F5+D6+D5+B5/.75 C6+C5/.25 G5+F5+D5+B5+B4/1 | C4/1:3 E4/1:3 G4/1:3 C5/1:3 E5/1:3 G5/1:3 C6/1:3 E6/1:3 G6/1:3 E6+C7/1 | D5+B5+B4/1 G5+D5+B5+B4/1 F#5+C5+A5+A4/1 F#4+D5+C4+A4/1 | G5+G4+D5+B4/.75 A5+A4/.25 G5+F5+D5+B5+B4/.75 A5+A4/.25 G5+G4/1:3 A5+A4/1:3 G5+G4/1:3 F5+F4/1:3 E5+E4/1:3 D5+D4/1:3 | ' +
      'G4+E4+C5+C4/.75 D5+D4/.25 G4+E5+E4+C5/.75 F5+F4/.25 G5+G4+E5+C5/.75 A5+A4/.25 G5+G4+E5+C5/.75 E5+E4/.25 | G5+G4+D5+B4/1 G5+G4+D5+B4/1 G4+D5+D4+B4/1 F5+F4/1:3 E5+E4/1:3 D5+D4/1:3 | G4+E4+C5+C4/.75 D5+D4/.25 G4+E5+E4+C5/.75 G5+G4+E5+C5/.25 G5+E5+C6+C5/.75 B5+B4/.25 F5+D6+D5+Bb5/.75 C6+C5/.25 | F5+C6+C5+A5/1 A5/1:3 F5/1:3 C5/1:3 A4/1:3 C5/1:3 F5/1:3 F5+C5+A5+A4/.75 B5+B4/.25 | ' +
      'F#5+Eb5+C6+C5+A5/.75 C6+C5/.25 F#5+Eb5+C6+C5+A5/.75 C6+C5/.25 F#5+D6+D5/1 F#5+C6+C5/1 | G5+E6+E5+C6/.75 D6+D5/.25 C6+C5/1:3 D6+D5/1:3 E6+E5/1:3 F6+F5+D6+C6+A5/.75 E6+E5/.25 F5+D6+D5+Ab5/1:3 E6+E5/1:3 F6+F5/1:3 | G6/.125 E6/.125 D6/.125 C6/.125 G5/.125 E5/.125 D5/.125 C5/.125 G4/.125 E4/.125 D4/.125 C4/.125 G3/.125 C4/.125 D4/.125 E4/.125 G5+F5+D5+B5+B4/1 G4+F4+D4+B4+B3/1 | G4+E4+C5+C4/.5 D5+D4/.5 E5+E4/.5 G5+G4/.5 Eb5+C5+Ab5+Ab4/2 | ' +
      'F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/.75 F5+F4+Db5+Ab4/.25 F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1 | G5+E5+Bb5+Bb4/1 Bb4/1:3 G5/1:3 Bb5/1:3 F5+Db5+Ab5+Ab4/1 Ab5+Ab4/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | F5+Db6+Db5+Ab5/1 F5+F4+Db5+Ab4/.75 Gb5+Gb4+Eb5+Bb4/.25 F5+C5+Ab5+Ab4/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | F4+Db5+Ab4/1 F5/2@1 F4+Db5+Ab4/1@2 F4+C5+A4/1 F5/2@3 F4+C5+A4/1@4 | ' +
      'F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/.75 F5+F4+Db5+Bb4/.25 F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/1 | F5+Db5+Bb5+Bb4/.75 A5+A4/.25 F5+Db5+Bb5+Bb4/.75 C6+C5/.25 F5+Db6+Db5+Bb5/1:3 Db6+Db5/1:3 C6+C5/1:3 Bb5+Bb4/1:3 C6+C5/1:3 Db6+Db5/1:3 | Eb5+C6+C5+Ab5/1 Eb5+C6+C5+Ab5/.75 Eb5+C5+Ab5/.25 G5+Db5+Bb5+Bb4/1 G5+Eb5+Bb5+Bb4/1 | Eb5+C5+Ab5+Ab4/1 Gb4/1:3 Eb5/1:3 Gb5/1:3 F5+F4+Db5+Ab4/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | ' +
      'F5+Db5+Ab5+Ab4/1 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 F6+Db6+Ab6+Ab5/1 | Bb6/.25 G6/.25 E6/.25 Db6/.25 Bb5/.25 G5/.25 E5/.25 Db5/.25 F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | F5+Db6+Db5+Ab5/1 F5+Db6+Db5+Ab5/.75 F5+Db6+Db5+Ab5/.25 Gb5+Eb6+Eb5+Cb6/1 F5+Db6+Db5+Cb6+Ab5/1 | Gb5+Db6+Db5+Bb5/1 Db4/.125 Gb4/.125 Ab4/.125 Bb4/.125 Db5/.125 Gb5/.125 Ab5/.125 Bb5/.125 Gb5+Db5+Bb5+Bb4/1 Gb5+Db5+Bb5+Bb4/.75 Gb5+Db5+Bb5+Bb4/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/1 G5+E5+C6+C5/.75 Bb5+Bb4/.25 G5+E5+Db6+Db5+Bb5/1 E5+Db5+Bb5+Bb4/1 | F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1 G5+G4+E5+Db5/1 G5+G4+E5+Db5/1 | F5+Ab5/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 Gb5+Eb6+Eb5+C6/1:3 C6/1:3 Ab5/1:3 Gb5/1:3 Eb5/1:3 C5/1:3 | F4+Db5+Db4+Ab4/1 Ab4+Ab3/1 F4+F3/1 Eb4+Eb3/1 | ' +
      'Db4+Db3/.75 Eb4+Eb3/.25 F4+F3/.75 Gb4+Gb3/.25 Ab4+Ab3/.75 Bb4+Bb3/.25 Ab4+Ab3/.75 F4+F3/.25 | Ab3/1:3 C4/1:3 Eb4/1:3 Ab4/1:3 C5/1:3 Eb5/1:3 Ab5/1:3 C6/1:3 Eb6/1:3 Ab6+Ab5/1:3 F6+F5/1:3 Eb6+Eb5/1:3 | F5+Db6+Db5+Ab5/.75 Eb5+Eb4/.25 F5+F4/.75 Ab5+Ab4/.25 Db6+Db5/.75 C6+C5/.25 Eb6+Eb5/.75 Db6+Db5/.25 | Gb5+Eb5+C5/.75 C6/3@1 Gb5+Eb5+C5/.25@1.75 Gb5+Eb5+C5/.75 Gb5+Eb5+C5/.25 Eb5+C5+Ab5/1 Gb5+Gb4/1:3 Ab5+Ab4/1:3 Bb5+Bb4/1:3 | ' +
      'Gb5+Eb5+C6+C5+Ab5/1 Gb5+Eb5+C6+C5+Ab5/.75 Db6+Db5/.25 Gb5+Eb6+Eb5+C6/.75 Db6+Db5/.25 Gb5+Eb5+C6+C5+Ab5/1 | Db4/1:3 F4/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 Ab6/1:3 F6+Db7/1 | Eb5+C6+C5/1 Eb5+C6+C5/1 G5+Db5+Bb5+Bb4/1 G4+Eb5+Eb4+Bb4/1 | Eb5+C5+Ab5+Ab4/.75 Bb5+Bb4/.25 Gb5+Eb5+C6+C5+Ab5/.75 Bb5+Bb4/.25 Ab5+Ab4/1:3 Bb5+Bb4/1:3 Ab5+Ab4/1:3 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | ' +
      'F4+Db5+Db4+Ab4/.75 Eb5+Eb4/.25 F5+F4+Db5+Ab4/.75 Gb5+Gb4/.25 F5+Db5+Ab5+Ab4/.75 Bb5+Bb4/.25 F5+Db5+Ab5+Ab4/.75 F5+F4/.25 | Eb5+C5+Ab5+Ab4/1 Eb5+C5+Ab5+Ab4/1 Eb5+Eb4+C5+Ab4/1 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | F4+Db5+Db4+Ab4/.75 Eb5+Eb4/.25 F5+F4+Db5+Ab4/.75 F5+Db5+Ab5+Ab4/.25 F5+Db6+Db5+Ab5/.75 C6+C5/.25 Gb5+Eb6+Eb5+Cb6/.75 Db6+Db5/.25 | Gb5+Db6+Db5+Bb5/1 Bb5/1:3 Gb5/1:3 Db5/1:3 Bb4/1:3 Db5/1:3 Gb5/1:3 Gb5+Db5+Bb5+Bb4/.75 C6+C5/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+Eb6+E5/1 G5+Db6+Db5/1 | F6+F5+Db6+Ab5/.75 Eb6+Eb5/.25 Db6+Db5/1:3 Eb6+Eb5/1:3 F6+F5/1:3 Gb6+Gb5+Eb6+Db6+Bb5/.75 F6+F5/.25 Eb6+Eb5/1:3 F6+F5/1:3 Gb6+Gb5/1:3 | Ab6/.125 F6/.125 Eb6/.125 Db6/.125 Ab5/.125 F5/.125 Eb5/.125 Db5/.125 Ab4/.125 F4/.125 Eb4/.125 Db4/.125 Ab3/.125 Db4/.125 Eb4/.125 F4/.125 Gb5+Eb5+C6+C5+Ab5/1 Gb4+Eb4+C5+C4+Ab4/1 | F4+Db5+Db4+Ab4/1 F5+Db5+Ab5+Ab4/1 F5+Db6+Db5+Ab5/2',
    lh:
      'C3+C2/1 G2+G1/1 C3+C2/1 G2+G1/1 | C3+C2/1 G2+G1/1 C3+C2/1 G2+G1/1 | C3+C2/1 E2+E1/.75 F2+F1/.25 G2+G1/1 G2+G1/1 | C3+C2/1 C3+C2/1 B2+B1/1 B2+B1/1 | ' +
      'A2+A1/1 E2+E1/1 A2+A1/1 E2+E1/1 | A3+A2/1 E3+E2/1 A3+A2/1 E3+E2/1 | G3+G2/1 G3+G2/1 D3+D2/1 D3+D2/1 | G3+G2/1 G3+G2/1 D3+D2/1 G3+G2/1 | ' +
      'C3+C2/1 G2+G1/1 C3+C2/1 G2+G1/1 | C3+C2/1 G2+G1/1 C3+C2/1 E3+E2/.5 G3+G2/.5 | C3+C2/1 E3+E2/.75 D3+D2/.25 C3+C2/.5 Bb2+Bb1/.5 A2+A1/.5 G2+G1/.5 | F2+F1/1 A2+A1/.5 C3+C2/.5 F3+F2/1 F3+F2/1 | ' +
      'F#3+F#2/1 F#2+F#1/1 F#3+F#2/1 F#3+F#2/1 | G3+G2/1 G3+G2/1 G#3+G#2/1 G#2+G#1/1 | G3+G2/1 G2+G1/1 G3+G2/.75 F3+F2/.25 E3+E2/.75 D3+D2/.25 | C3+C2/1 G3+G2/1 E3+E2/1 D3+D2/1 | ' +
      'C3+C2/.75 D3+D2/.25 E3+E2/.75 F3+F2/.25 G3+G2/.75 A3+A2/.25 G3+G2/.75 E3+E2/.25 | G3+G2/2 D3+D2/2 | C2/.75 D2/.25 E2/.75 G2/.25 C3/.75 B2/.25 D3/.75 C3/.25 | B2/1 A2/1 G3+G2/1 D3+D2/1 | ' +
      'D3+D2/.75 E3+E2/.25 F3+F2/.75 G3+G2/.25 B3+B2/1 G3+G2/1 | C3+C2/.75 D3+D2/.25 E3+E2/.75 G3+G2/.25 C4+C3/1 G3+G2/1 | F#3+F#2/.75 E3+E2/.25 D3+D2/.75 E3+E2/.25 F#3+F#2/.75 C4+C3/.25 B3+B2/.75 A3+A2/.25 | G3+G2/.75 A3+A2/.25 B3+B2/.75 A3+A2/.25 G3+G2/1 G2+G1/1 | ' +
      'C3+C2/1 G3+E3+C3/1 E3+E2/1 C3+C2/1 | G3+G2/1 F3+F2/1 E3+E2/1 D3+D2/1 | C3+C2/1 D3+D2/.75 D#3+D#2/.25 E3+E2/1 C3+C2/1 | F3+F2/1 C3+C2/1 A2+A1/1 C3+C2/1 | ' +
      'F#3+F#2/.75 F#3+F#2/.25 F#3+F#2/1 F#3+F#2/1 F#3+F#2/1 | G3+G2/1 Bb3+Bb2/1 A3+A2/1 Ab3+Ab2/1 | G3+G2/1 G2+G1/1 G3+G2/1 G2+G1/1 | C3+C2/1 G3+E3+C4/1 C3+C2/2 | ' +
      'G2+E3+C2/1 G3+E3+C4/1 G3+G2+E3/1 G3+E4+C4/1 | C3+C2/1 F#3+F#2/1 G3+G2/1 G2+G1/1 | C3+C2/1 G3+E3+C4/1 G2+G1/1 G3+F3+D3+B3/1 | C3+C2/1 C3+C2/.75 D3+D2/.25 E3+E2/1 E2+E1/1 | ' +
      'A2+A1/1 E3+C4+A3/1 E3+E2/1 E3+C4+A3/1 | A2+A1/1 E3+C4+A3/1 A2+A1/1 C3+C2/1 | D3+D2/1 G3+D3+B3/1 D3+D2/.75 C3+C2/.25 B2+B1/.75 A2+A1/.25 | G2+G1/1 F2+F1/1 E2+E1/1 D2+D1/1 | ' +
      'C2+C1/1 G3+E3+C4/1 G3+E4+C4/1 G4+E4+C4/1 | C2+C1/1 F#4+Eb4+A4+A3/1 G2+G1/1 G3+E4+C4/1 | C3+C2/1 E3+E2/.75 D3+D2/.25 C3+C2/.75 Bb2+Bb1/.25 A2+A1/.75 G2+G1/.25 | F2+F1/1 F3+C3+A3/1 F3+C4+A3/1 F4+C4+A3/1 | ' +
      'F#4+Eb4+C4+A3/1 F#4+Eb4+C4+A3/1 F#4+Eb4+C4+A3/1 F#4+Eb4+C4+A3/1 | G3+E4+C4/1 G3+G2/1 Ab3+Ab2/1 Ab3+Ab2/1 | G3+G2/1 G3+E4+C4/1 G3+G2/1 G3+D4+B3/1 | C3+C2/1 G2+G1/1 E2+E1/1 D2+D1/1 | ' +
      'C2+C1/1 G2+G1/1 C2+C1/1 E2+E1/1 | G2+G1/1 G3+D3+B3/1 G3+D4+B3/1 G3+G2/1 | C4+C3/1 G3+G2/1 C3+C2/1 A2+A1/1 | G2+G1/1 G3+D3+B2/1 G3+D3+B3/1 D3+D2/1 | ' +
      'G2+G1/1 G4+G3+D4+B3/.75 A4+A3/.25 G4+D4+B4+B3/.75 A4+A3/.25 G3+F4+D4+B3/1 | C3+C2/1 G3+E3+C3/1 G3+E3+C4/1 G3+E4+C4/1 | F#3+F#2/.75 E3+E2/.25 D3+D2/.75 E3+E2/.25 F#3+F#2/.75 C4+C3/.25 B3+B2/.75 A3+A2/.25 | G3+G2/1 D3+D2/1 G2+G1/1:3 A2+A1/1:3 G2+G1/1:3 F2+F1/1:3 E2+E1/1:3 D2+D1/1:3 | ' +
      'C2+C1/1 G3+E3+C3/1 G3+E3+C4/1 G3+E4+C4/1 | G2+G1/1 G3+D3+B2/1 G3+D3+B3/1 G2+G1/1 | C3+C2/1 G3+E3+C3/1 G3+E3+C4/1 G3+E4+C4+Bb3/1 | F3+F2/1 F4+C4+A3/1 F3+C4+A3/1 F3+C3+A3/1 | ' +
      'Eb3+Eb2/1 F#3+F#2/1 A3+A2/1 C4+C3/1 | E3+E2/1 G3+G2/1 A3+A2/.75 G3+G2/.25 F3+F2/1:3 G3+G2/1:3 A3+A2/1:3 | G3+G2/1 G2+G1/1 G3+G2/1 G2+G1/1 | C3+C2/1 Bb2+Bb1/1 Ab2+Ab1/1 Gb4+Eb4+C4+Ab3/1 | ' +
      'F3+Db2+Ab2/1 F3+Db4+Ab3/1 F3+Ab3+Ab2/1 F4+Db4+Ab3/1 | Db3+Db2/1 G3+G2/1 Ab3+Ab2/1 Ab2+Ab1/1:3 Bb2+Bb1/1:3 C3+C2/1:3 | Db3+Db2/1 F3+Db4+Ab3/1 Ab2+Ab1/1 Gb3+Eb3+C4+Ab3/1 | Db3+Db2/1 Db3+Db2/.75 Eb3+Eb2/.25 F3+F2/1:3 C3+C2/1:3 A2+A1/1:3 F2+F1/1 | ' +
      'Bb2+Bb1/1 F3+Db4+Bb3/1 F3+F2/1 F3+Db4+Bb3/1 | Bb2+Bb1/1 F3+Db4+Bb3/1 Bb2+Bb1/1 Db3+Db2/1 | Eb3+Eb2/1 Eb3+C4+Ab3/1 Eb3+Eb2/.75 Db3+Db2/.25 C3+C2/.75 Bb2+Bb1/.25 | Ab2+Ab1/1 Gb2+Gb1/1 F2+F1/1 Eb2+Eb1/1 | ' +
      'Db2+Db1/1 F3+Db4+Ab3/1 F4+Db4+Ab3/1 F4+Db4+Ab4/1 | Db2+Db1/1 G4+E4+Bb4+Bb3/1 F4+Db4+Ab3/1 Ab3+Ab2/1 | Db3+Db2/1 F3+F2/.75 Eb3+Eb2/.25 Db3+Db2/.75 Cb3+Cb2/.25 Bb2+Bb1/.75 Ab2+Ab1/.25 | Gb2+Gb1/1 Gb3+Db3+Bb3/1 Gb3+Db4+Bb3/1 Gb4+Db4+Bb3/1 | ' +
      'G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 | F4+Db4+Ab3/1 Ab3+Ab2/1 A3+A2/1 A3+A2/1 | Ab3+Ab2/1 F4+Db4+Ab3/1 Ab3+Ab2/1 Eb4+C4+Ab3/1 | Db3+Db2/1 Ab2+Ab1/1 F2+F1/1 Eb2+Eb1/1 | ' +
      'Db2+Db1/.75 Eb2+Eb1/.25 F2+F1/.75 Gb2+Gb1/.25 Ab2+Ab1/.75 Bb2+Bb1/.25 Ab2+Ab1/.75 F2+F1/.25 | Ab2+Ab1/1 Eb3+C4+Ab3/1 Eb4+C4+Ab3/1 Ab4+Ab3/1:3 F4+F3/1:3 Eb4+Eb3/1:3 | Db4+Db3/.75 Ab3+Ab2/.25 F3+F2/.75 Eb3+Eb2/.25 Db3+Db2/.75 Db3+Db2/.25 C3+C2/.75 Bb2+Bb1/.25 | Ab2+Ab1/1 Eb3+C3+Ab3/1 Eb3+C4+Ab3/1 Eb3+Eb2/1 | ' +
      'Ab2+Ab1/1 Eb4+C4+Ab4+Ab3/.75 Bb4+Bb3/.25 Eb4+C5+C4+Ab4/.75 Bb4+Bb3/.25 Gb4+Eb4+C4+Ab3/1 | Db3+Db2/1 F3+Db3+Ab3/1 F3+Db4+Ab3/1 F4+Db4+Ab3/1 | G3+G2/.75 F3+F2/.25 Eb3+Eb2/.75 F3+F2/.25 G3+G2/.75 Db4+Db3/.25 C4+C3/.75 Bb3+Bb2/.25 | Ab3+Ab2/1 Eb3+Eb2/1 Ab2+Ab1/1:3 Bb2+Bb1/1:3 Ab2+Ab1/1:3 Gb2+Gb1/1:3 F2+F1/1:3 Eb2+Eb1/1:3 | ' +
      'Db2+Db1/1 F3+Db3+Ab3/1 F3+Db4+Ab3/1 F4+Db4+Ab3/1 | Ab2+Ab1/1 Eb3+C3+Ab3/1 Eb3+C4+Ab3/1 Ab2+Ab1/1 | Db3+Db2/1 F3+Db3+Ab3/1 F3+Db4+Ab3/1 F4+Db4+Cb4+Ab3/1 | Gb3+Gb2/1 Gb4+Db4+Bb3/1 Gb3+Db4+Bb3/1 Gb3+Db3+Bb3/1 | ' +
      'G3+G2+E3/1 G3+G2+E3/1 G3+Bb3+Bb2/1 Db4+Db3/1 | Ab3+Ab2/1 B3+B2/1 Bb3+Bb2/.75 Ab3+Ab2/.25 Gb3+Gb2/1:3 Ab3+Ab2/1:3 Bb3+Bb2/1:3 | Ab3+Ab2/1 Ab2+Ab1/1 Ab3+Ab2/1 Ab2+Ab1/1 | Db3+Db2/1 Ab2+Ab1/1 Db2+Db1/2',
  },
})
