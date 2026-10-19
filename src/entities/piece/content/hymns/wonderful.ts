import { definePiece } from '../../model/types'

export default definePiece({
  id: 'wonderful',
  kind: 'song',
  title: 'Wonderful Grace of Jesus',
  credits: [
    { role: 'words-and-music', names: 'Haldor Lillenas' },
    { role: 'harmony', names: 'Natalie R. Blanton' },
  ],
  key: 'Db',
  meter: '4/4',
  tempo: 84,
  pattern: 'r2',
  note: {
    en: 'Natalie R. Blanton’s arrangement, every note of it, in D♭ throughout as the hymnals print it: three verses with their refrains.',
    ru: 'Обработка Натали Р. Блантон, нота в ноту, вся в ре-бемоль мажоре, как в сборниках: три куплета с припевами.',
  },
  sections: [
    {
      kind: 'verse',
      n: 1,
      lines: [
        'Db E°7/Db-Db Db@1-Db/F@1-Db/Ab@1-Ab7@1 Db-F7/C',
        'Bbm Bbm Ab-Eb7 Ab@1-Db/Ab@1-Ab7@2',
        'Db E°7/Db-Db Db-Db7 Gb',
        'G°7 Db/Ab-A7 Db/Ab-Ab7 Db',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Db Ab7 Db Ab7',
        'Ab7 Db Ab-Eb7 Ab7',
        'Db Ab7 Db@3-Db7@1 Gb',
        'G°7 Db/Ab-Db7/Cb-Gb/Bb-Gbm6/A Db/Ab-Ab7 Db',
      ],
    },
    {
      kind: 'verse',
      n: 2,
      lines: [
        'Db E°7/Db-Db/Ab Db@2-Fm/Ab@1-Ab7@1 Db-F7',
        'Bbm Bbm Ab-Eb7 Ab@1-Ab7/Gb@1-Db/F@1-Ab7/Eb@1',
        'Db E°7/Db-Db/Ab Db-Db7 Gb',
        'G°7 Db/Ab-A7 Db/Ab-Ab7 Db',
      ],
    },
    {
      kind: 'chorus',
      lines: [
        'Db Ab Db@3-Bbm@1 Ab7',
        'Ab7 Db Ab-Eb7 Ab7',
        'Db Ab@3-Ab7@1 Db@3-Db7@1 Gb',
        'G°7/E-G°7-Eb7/Bb-Eb7/Db Db/F-Db/Ab-Gb/Bb-Gbm6 Db/Ab-Ab7 Db@1-Db/Cb@1-Ab@1-Ab7@1',
      ],
    },
    {
      kind: 'verse',
      n: 3,
      lines: [
        'Db E°7/Db-Db/Ab Db@2-Fm/Ab@1-Ab7@1 Db-F',
        'Bbm Bbm Ab-Eb7 Ab@1-Ab7/Gb@1-Db/F@1-Ab7/Eb@1',
        'Db E°7/Db-Db/Ab Db-Db7 Gb',
        'G°7 Db/Ab-A7 Db/Ab-Ab7 Db',
      ],
    },
    {
      kind: 'chorus',
      last: true,
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
      'Ab4+F4+Db4/1 Ab4+F4+Db4/.75 Ab4+F4+Db4/.25 Ab4+F4+Db4/1 Ab4+F4+Db4/1 | G4+E4+Db4+Bb4/2 Ab4+F4+Db4/2 | Ab4+F4+Db5/1 F4+Db4/.75 Gb4+Eb4/.25 Ab4+F4+Db4/1 Ab3+Gb4+Eb4/1 | Ab3+F4+Db4/2 A3+Eb4+C4/2 | ' +
      'F4+Db4+Bb3/1 F4+Db4+Bb3/.75 F4+Db4+Bb3/.25 F4+Db4+Bb3/1 F4+Db4+Bb3/1 | F4+Db4+Bb4/2 F4+Db5+Bb4/2 | Ab4+Eb4+C5/1 Ab4+Eb4+C5/.75 Ab4+Eb4+C4/.25 G4+Db4+Bb4/1 G4+Db4+Bb4/1 | Eb4+C4/1 Ab4/4@1 F4+Db4/1@2 Gb4+Eb4/2 | ' +
      'Ab4+F4+Db4/1 Ab4+F4+Db4/.75 Ab4+F4+Db4/.25 Ab4+F4+Db4/1 Ab4+F4+Db4/1 | G4+E4+Db4+Bb4/2 Ab4+F4+Db4/2 | Ab4+F4+Db5/1 Ab4+F4+Db5/.75 Ab4+F4+Db5/.25 Ab4+F4+Eb5+Cb5/1 Ab4+F4+Db5+Cb5/1 | Gb4+Db5+Bb4/2 Gb4+Db4+Bb4/1 Gb4+Db4+Bb4/.75 Gb4+Db4+Bb4/.25 | ' +
      'G4+E4+Db5+Bb4/1 G4+E4+C5/.75 G4+E4+Bb4/.25 G4+E4+Db5+Bb4/1 G4+E4+Bb4/1 | Ab4+F4+Db4/2 G4+E4+Db4/2 | Ab4+F4+Db4/2 Ab4+Gb4+Eb5+C5/2 | Ab4+F4+Db5/1 Ab4/1 F4/1 Eb4/1 | ' +
      'F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 | Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 | F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 F4+Db4/.75 F4+Db4/.25 | Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 Gb4+Eb4+C4/.75 Gb4+Eb4+C4/.25 Gb4/1:3 Eb4/1:3 F4/1:3 Gb4/1:3 Ab4/1:3 Bb4/1:3 | ' +
      'Eb4+C5/1 Eb4+C5/.75 F4+Db5/.25 Gb4+Eb5/.75 F4+Db5/.25 Eb4+C5/1 | F4+Db5/1 F4+Db5/.75 Gb4+Eb5/.25 Ab4+F5/.75 Gb4+Eb5/.25 F4+Db5/1 | Eb4+C5/1 Ab4+Eb4+C5/1 G4+Db4+Bb4/1 Eb4+Db4/1 | Ab4+Eb4+C4/.75 Db4+Bb4/.25 Eb4+C5/.75 Db4+Bb4/.25 Ab4+C4/.75 Gb4/.25 F4/.75 Eb4/.25 | ' +
      'Db4/.75 Eb4+C4/.25 F4+Db4/.75 Gb4+Eb4+Db4/.25 Ab4+F4+Db4/.75 Gb4+Db4+Bb4/.25 Ab4+F4+Db4/.75 F4+Db4/.25 | Eb4+C4/1 Ab4/2@1 Eb4+C4/1@2 Eb4+C4/1 Eb4+C4/1 | Db4/.75 Eb4+Db4/.25 F4+Db4/.75 Ab4+F4+Db4/.25 Ab4+F4+Db5/.75 Ab4+F4+C5/.25 F4+Eb5+Cb5/.75 Ab4+F4+Db5/.25 | Gb4+Bb4/1 Db5/3@1 Gb4+Bb4/1@2 Gb4+Bb4/1 Gb4+Db4+Bb4/1 | ' +
      'G4+E4+Db5+Bb4/.75 G4+E4+Db5+Bb4/.25 G4+E4+Db5+Bb4/.75 G4+E4+Db5+Bb4/.25 G4+E4+Eb5/1 G4+E4+Db5/1 | Ab4+F5+F4+Db5/1 Ab4+F4+Db5+Cb5/1 Gb5+Gb4+Db5+Bb4/1 Gb4+Eb5+Db5+A4/1 | Ab5+Ab4+F5+Db5/2 Ab4+Gb4+Eb4+C5/2 | Ab4+F4+Db5/1 Ab5+Ab4/1 Db6+Db5/2 | ' +
      'Ab4+F4+Db4/1 Ab4+F4+Db5/.75 Ab4+F5+F4+Db5/.25 Ab5+Ab4+F5+Db5/1 Ab5+Ab4+F5+Db5/1 | G5+E5+Bb5+Bb4/1 Bb4/1:3 G5/1:3 Bb5/1:3 Ab5+Ab4+F5+Db5/1 Ab5+Ab4/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | Ab5+F5+Db6+Db5/1 Ab4+F5+F4+Db5/.75 Gb5+Gb4+Eb5+Bb4/.25 Ab5+Ab4+F5+C5/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | Ab4+F4+Db5/1 F5/2@1 Ab4+F4+Db5/1@2 A4+F4+C5/1 F5/2@3 A4+F4+C5/1@4 | ' +
      'F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/.75 F5+F4+Db5+Bb4/.25 F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/1 | F5+Db5+Bb5+Bb4/.75 A5+A4/.25 F5+Db5+Bb5+Bb4/.75 C6+C5/.25 F5+Db6+Db5+Bb5/1:3 Db6+Db5/1:3 C6+C5/1:3 Bb5+Bb4/1:3 C6+C5/1:3 Db6+Db5/1:3 | Ab5+Eb5+C6+C5/1 Ab5+Eb5+C6+C5/.75 Ab5+Eb5+C5/.25 G5+Db5+Bb5+Bb4/1 G5+Eb5+Bb5+Bb4/1 | Ab5+Ab4+Eb5+C5/1 Gb4/1:3 Eb5/1:3 Gb5/1:3 Ab4+F5+F4+Db5/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | ' +
      'Ab5+Ab4+F5+Db5/1 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 Ab6+Ab5+F6+Db6/1 | Bb6/.25 G6/.25 E6/.25 Db6/.25 Bb5/.25 G5/.25 E5/.25 Db5/.25 Ab5+Ab4+F5+Db5/1 Ab5+Ab4+F5+Db5/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | Ab5+F5+Db6+Db5/1 Ab5+F5+Db6+Db5/.75 Ab5+F5+Db6+Db5/.25 Gb5+Eb6+Eb5+Cb6/1 Ab5+F5+Db6+Db5+Cb6/1 | Gb5+Db6+Db5+Bb5/1 Db4/.125 Gb4/.125 Ab4/.125 Bb4/.125 Db5/.125 Gb5/.125 Ab5/.125 Bb5/.125 Gb5+Db5+Bb5+Bb4/1 Gb5+Db5+Bb5+Bb4/.75 Gb5+Db5+Bb5+Bb4/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/1 G5+E5+C6+C5/.75 Bb5+Bb4/.25 G5+E5+Db6+Db5+Bb5/1 E5+Db5+Bb5+Bb4/1 | Ab5+F5+Db5/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Db5/1:3 Ab5/1:3 G5+E5+Db5/1:3 G4/1:3 Db5/1:3 E5/1:3 Db5/1:3 G5/1:3 | Ab5+F5/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 Gb5+Eb6+Eb5+C6/1:3 C6/1:3 Ab5/1:3 Gb5/1:3 Eb5/1:3 C5/1:3 | Ab4+F4+Db5+Db4/1 Ab4+Ab3/1 F4+F3/1 Eb4+Eb3/1 | ' +
      'Db4+Db3/.75 Eb4+Eb3/.25 F4+F3/.75 Gb4+Gb3/.25 Ab4+Ab3/.75 Bb4+Bb3/.25 Ab4+Ab3/.75 F4+F3/.25 | Ab3/1:3 C4/1:3 Eb4/1:3 Ab4/1:3 C5/1:3 Eb5/1:3 Ab5/1:3 C6/1:3 Eb6/1:3 Ab6+Ab5/1 | Ab5+F5+Db6+Db5/.75 Eb5+Eb4/.25 F5+F4/.75 Ab5+Ab4/.25 Db6+Db5/.75 C6+C5/.25 Eb6+Eb5/.75 Db6+Db5/.25 | Gb5+Eb5+C5/.75 C6/3@1 Gb5+Eb5+C5/.25@1.75 Gb5+Eb5+C5/.75 Gb5+Eb5+C5/.25 Ab5+Eb5+C5/1 Gb5+Gb4/1:3 Ab5+Ab4/1:3 Bb5+Bb4/1:3 | ' +
      'Ab5+Gb5+Eb5+C6+C5/1 Ab5+Gb5+Eb5+C6+C5/.75 Db6+Db5/.25 Gb5+Eb6+Eb5+C6/.75 Db6+Db5/.25 Ab5+Gb5+Eb5+C6+C5/1 | Db4/1:3 F4/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 Ab6/1:3 F6+Db7/1 | Eb5+C6+C5/1 Ab5+Eb5+C6+C5/1 G5+Db5+Bb5+Bb4/1 G4+Eb5+Db4+Bb4/1 | Ab5+Ab4+Eb5+C5/.75 Bb5+Bb4/.25 Ab5+Gb5+Eb5+C6+C5/.75 Bb5+Bb4/.25 Ab5+Ab4/1:3 Bb5+Bb4/1:3 Ab5+Ab4/1:3 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | ' +
      'Ab4+F4+Db5+Db4/.75 Eb5+Eb4/.25 Ab4+F5+F4+Db5/.75 Gb5+Gb4/.25 Ab5+Ab4+F5+Db5/.75 Bb5+Bb4/.25 Ab5+Ab4+F5+Db5/.75 F5+F4/.25 | Ab5+Ab4+Eb5+C5/1 Ab5+Ab4+Eb5+C5/1 Ab4+Eb5+Eb4+C5/1 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | Ab4+F4+Db5+Db4/.75 Eb5+Eb4/.25 Ab4+F5+F4+Db5/.75 Ab5+Ab4+F5+Db5/.25 Ab5+F5+Db6+Db5/.75 C6+C5/.25 Gb5+Eb6+Eb5+Cb6/.75 Db6+Db5/.25 | Gb5+Db6+Db5+Bb5/1 Bb5/1:3 Gb5/1:3 Db5/1:3 Bb4/1:3 Db5/1:3 Gb5/1:3 Gb5+Db5+Bb5+Bb4/.75 C6+C5/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+Eb6+Eb5/1 G5+Db6+Db5/1 | Ab5+F6+F5+Db6/.75 Eb6+Eb5/.25 Db6+Db5/1:3 Eb6+Eb5/1:3 F6+F5/1:3 Gb6+Gb5+Eb6+Db6+Bb5/.75 F6+F5/.25 Gb5+Eb6+Eb5+A5/1:3 F6+F5/1:3 Gb6+Gb5/1:3 | Ab6/.125 F6/.125 Eb6/.125 Db6/.125 Ab5/.125 F5/.125 Eb5/.125 Db5/.125 Ab4/.125 F4/.125 Eb4/.125 Db4/.125 Ab3/.125 Db4/.125 Eb4/.125 F4/.125 Ab5+Gb5+Eb5+C6+C5/1 Ab4+Gb4+Eb4+C5+C4/1 | Ab4+F4+Db5+Db4/.5 Eb5+Eb4/.5 F5+F4/.5 Ab5+Ab4/.5 Eb5+C5+Ab5+Ab4/2 | ' +
      'F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/.75 F5+F4+Db5+Ab4/.25 F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1 | G5+E5+Bb5+Bb4/1 Bb4/1:3 G5/1:3 Bb5/1:3 F5+Db5+Ab5+Ab4/1 Ab5+Ab4/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | F5+Db6+Db5+Ab5/1 F5+F4+Db5+Ab4/.75 Gb5+Gb4+Eb5+Bb4/.25 F5+C5+Ab5+Ab4/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | F4+Db5+Ab4/1 F5/2@1 F4+Db5+Ab4/1@2 F4+C5+A4/1 F5/2@3 F4+C5+A4/1@4 | ' +
      'F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/.75 F5+F4+Db5+Bb4/.25 F5+F4+Db5+Bb4/1 F5+F4+Db5+Bb4/1 | F5+Db5+Bb5+Bb4/.75 A5+A4/.25 F5+Db5+Bb5+Bb4/.75 C6+C5/.25 F5+Db6+Db5+Bb5/1:3 Db6+Db5/1:3 C6+C5/1:3 Bb5+Bb4/1:3 C6+C5/1:3 Db6+Db5/1:3 | Eb5+C6+C5+Ab5/1 Eb5+C6+C5+Ab5/.75 Eb5+C5+Ab5/.25 G5+Db5+Bb5+Bb4/1 G5+Eb5+Bb5+Bb4/1 | Eb5+C5+Ab5+Ab4/1 Gb4/1:3 Eb5/1:3 Gb5/1:3 F5+F4+Db5+Ab4/1 Gb4+C5/1:3 Eb5/1:3 Gb5/1:3 | ' +
      'F5+Db5+Ab5+Ab4/1 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 F6+Db6+Ab6+Ab5/1 | Bb6/.25 G6/.25 E6/.25 Db6/.25 Bb5/.25 G5/.25 E5/.25 Db5/.25 F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1:3 Bb5+Bb4/1:3 C6+C5/1:3 | F5+Db6+Db5+Ab5/1 F5+Db6+Db5+Ab5/.75 F5+Db6+Db5+Ab5/.25 Gb5+Eb6+Eb5+Cb6/1 F5+Db6+Db5+Cb6+Ab5/1 | Gb5+Db6+Db5+Bb5/1 Db4/.125 Gb4/.125 Ab4/.125 Bb4/.125 Db5/.125 Gb5/.125 Ab5/.125 Bb5/.125 Gb5+Db5+Bb5+Bb4/1 Gb5+Db5+Bb5+Bb4/.75 Gb5+Db5+Bb5+Bb4/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/1 G5+E5+C6+C5/.75 Bb5+Bb4/.25 G5+E5+Db6+Db5+Bb5/1 E5+Db5+Bb5+Bb4/1 | F5+Db5+Ab5+Ab4/1 F5+Db5+Ab5+Ab4/1 G5+G4+E5+Db5/1 G5+G4+E5+Db5/1 | F5+Ab5/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 Gb5+Eb6+Eb5+C6/1:3 C6/1:3 Ab5/1:3 Gb5/1:3 Eb5/1:3 C5/1:3 | F4+Db5+Db4+Ab4/1 Ab4+Ab3/1 F4+F3/1 Eb4+Eb3/1 | ' +
      'Db4+Db3/.75 Eb4+Eb3/.25 F4+F3/.75 Gb4+Gb3/.25 Ab4+Ab3/.75 Bb4+Bb3/.25 Ab4+Ab3/.75 F4+F3/.25 | Ab3/1:3 C4/1:3 Eb4/1:3 Ab4/1:3 C5/1:3 Eb5/1:3 Ab5/1:3 C6/1:3 Eb6/1:3 Ab6+Ab5/1:3 F6+F5/1:3 Eb6+Eb5/1:3 | F5+Db6+Db5+Ab5/.75 Eb5+Eb4/.25 F5+F4/.75 Ab5+Ab4/.25 Db6+Db5/.75 C6+C5/.25 Eb6+Eb5/.75 Db6+Db5/.25 | Gb5+Eb5+C5/.75 C6/3@1 Gb5+Eb5+C5/.25@1.75 Gb5+Eb5+C5/.75 Gb5+Eb5+C5/.25 Eb5+C5+Ab5/1 Gb5+Gb4/1:3 Ab5+Ab4/1:3 Bb5+Bb4/1:3 | ' +
      'Gb5+Eb5+C6+C5+Ab5/1 Gb5+Eb5+C6+C5+Ab5/.75 Db6+Db5/.25 Gb5+Eb6+Eb5+C6/.75 Db6+Db5/.25 Gb5+Eb5+C6+C5+Ab5/1 | Db4/1:3 F4/1:3 Ab4/1:3 Db5/1:3 F5/1:3 Ab5/1:3 Db6/1:3 F6/1:3 Ab6/1:3 F6+Db7/1 | Eb5+C6+C5/1 Eb5+C6+C5/1 G5+Db5+Bb5+Bb4/1 G4+Eb5+Eb4+Bb4/1 | Eb5+C5+Ab5+Ab4/.75 Bb5+Bb4/.25 Gb5+Eb5+C6+C5+Ab5/.75 Bb5+Bb4/.25 Ab5+Ab4/1:3 Bb5+Bb4/1:3 Ab5+Ab4/1:3 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | ' +
      'F4+Db5+Db4+Ab4/.75 Eb5+Eb4/.25 F5+F4+Db5+Ab4/.75 Gb5+Gb4/.25 F5+Db5+Ab5+Ab4/.75 Bb5+Bb4/.25 F5+Db5+Ab5+Ab4/.75 F5+F4/.25 | Eb5+C5+Ab5+Ab4/1 Eb5+C5+Ab5+Ab4/1 Eb5+Eb4+C5+Ab4/1 Gb5+Gb4/1:3 F5+F4/1:3 Eb5+Eb4/1:3 | F4+Db5+Db4+Ab4/.75 Eb5+Eb4/.25 F5+F4+Db5+Ab4/.75 F5+Db5+Ab5+Ab4/.25 F5+Db6+Db5+Ab5/.75 C6+C5/.25 Gb5+Eb6+Eb5+Cb6/.75 Db6+Db5/.25 | Gb5+Db6+Db5+Bb5/1 Bb5/1:3 Gb5/1:3 Db5/1:3 Bb4/1:3 Db5/1:3 Gb5/1:3 Gb5+Db5+Bb5+Bb4/.75 C6+C5/.25 | ' +
      'G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+E5+Db6+Db5+Bb5/.75 Db6+Db5/.25 G5+Eb6+E5/1 G5+Db6+Db5/1 | F6+F5+Db6+Ab5/.75 Eb6+Eb5/.25 Db6+Db5/1:3 Eb6+Eb5/1:3 F6+F5/1:3 Gb6+Gb5+Eb6+Db6+Bb5/.75 F6+F5/.25 Eb6+Eb5/1:3 F6+F5/1:3 Gb6+Gb5/1:3 | Ab6/.125 F6/.125 Eb6/.125 Db6/.125 Ab5/.125 F5/.125 Eb5/.125 Db5/.125 Ab4/.125 F4/.125 Eb4/.125 Db4/.125 Ab3/.125 Db4/.125 Eb4/.125 F4/.125 Gb5+Eb5+C6+C5+Ab5/1 Gb4+Eb4+C5+C4+Ab4/1 | F4+Db5+Db4+Ab4/1 F5+Db5+Ab5+Ab4/1 F5+Db6+Db5+Ab5/2',
    lh:
      'Db3+Db2/1 Ab2+Ab1/1 Db3+Db2/1 Ab2+Ab1/1 | Db3+Db2/1 Ab2+Ab1/1 Db3+Db2/1 Ab2+Ab1/1 | Db3+Db2/1 F2+F1/.75 Gb2+Gb1/.25 Ab2+Ab1/1 Ab2+Ab1/1 | Db3+Db2/1 Db3+Db2/1 C3+C2/1 C3+C2/1 | ' +
      'Bb2+Bb1/1 F2+F1/1 Bb2+Bb1/1 F2+F1/1 | Bb3+Bb2/1 F3+F2/1 Bb3+Bb2/1 F3+F2/1 | Ab3+Ab2/1 Ab3+Ab2/1 Eb3+Eb2/1 Eb3+Eb2/1 | Ab3+Ab2/1 Ab3+Ab2/1 Eb3+Eb2/1 Ab3+Ab2/1 | ' +
      'Db3+Db2/1 Ab2+Ab1/1 Db3+Db2/1 Ab2+Ab1/1 | Db3+Db2/1 Ab2+Ab1/1 Db3+Db2/1 F3+F2/.5 Ab3+Ab2/.5 | Db3+Db2/1 F3+F2/.75 Eb3+Eb2/.25 Db3+Db2/.5 Cb3+Cb2/.5 Bb2+Bb1/.5 Ab2+Ab1/.5 | Gb2+Gb1/1 Bb2+Bb1/.5 Db3+Db2/.5 Gb3+Gb2/1 Gb3+Gb2/1 | ' +
      'G3+G2/1 G2+G1/1 G3+G2/1 G3+G2/1 | Ab3+Ab2/1 Ab3+Ab2/1 A3+A2/1 A2+A1/1 | Ab3+Ab2/1 Ab2+Ab1/1 Ab3+Ab2/.75 Gb3+Gb2/.25 F3+F2/.75 Eb3+Eb2/.25 | Db3+Db2/1 Ab3+Ab2/1 F3+F2/1 Eb3+Eb2/1 | ' +
      'Db3+Db2/.75 Eb3+Eb2/.25 F3+F2/.75 Gb3+Gb2/.25 Ab3+Ab2/.75 Bb3+Bb2/.25 Ab3+Ab2/.75 F3+F2/.25 | Ab3+Ab2/2 Eb3+Eb2/2 | Db2/.75 Eb2/.25 F2/.75 Ab2/.25 Db3/.75 C3/.25 Eb3/.75 Db3/.25 | C3/1 Bb2/1 Ab3+Ab2/1 Eb3+Eb2/1 | ' +
      'Eb3+Eb2/.75 F3+F2/.25 Gb3+Gb2/.75 Ab3+Ab2/.25 C4+C3/1 Ab3+Ab2/1 | Db3+Db2/.75 Eb3+Eb2/.25 F3+F2/.75 Ab3+Ab2/.25 Db4+Db3/1 Ab3+Ab2/1 | G3+G2/.75 F3+F2/.25 Eb3+Eb2/.75 F3+F2/.25 G3+G2/.75 Db4+Db3/.25 C4+C3/.75 Bb3+Bb2/.25 | Ab3+Ab2/.75 Bb3+Bb2/.25 C4+C3/.75 Bb3+Bb2/.25 Ab3+Ab2/1 Ab2+Ab1/1 | ' +
      'Db3+Db2/1 Ab3+F3+Db3/1 F3+F2/1 Db3+Db2/1 | Ab3+Ab2/1 Gb3+Gb2/1 F3+F2/1 Eb3+Eb2/1 | Db3+Db2/1 Eb3+Eb2/.75 E3+E2/.25 F3+F2/1 Db3+Db2/1 | Gb3+Gb2/1 Db3+Db2/1 Bb2+Bb1/1 Db3+Db2/1 | ' +
      'G3+G2/.75 G3+G2/.25 G3+G2/1 G3+G2/1 G3+G2/1 | Ab3+Ab2/1 Cb4+Cb3/1 Bb3+Bb2/1 A3+A2/1 | Ab3+Ab2/1 Ab2+Ab1/1 Ab3+Ab2/1 Ab2+Ab1/1 | Db3+Db2/1 Ab3+F3+Db4/1 Db3+Db2/2 | ' +
      'Ab2+F3+Db2/1 Ab3+F3+Db4/1 Ab3+Ab2+F3/1 Ab3+F4+Db4/1 | Db3+Db2/1 G3+G2/1 Ab3+Ab2/1 Ab2+Ab1/1 | Db3+Db2/1 Ab3+F3+Db4/1 Ab2+Ab1/1 Ab3+Gb3+Eb3+C4/1 | Db3+Db2/1 Db3+Db2/.75 Eb3+Eb2/.25 F3+F2/1 F2+F1/1 | ' +
      'Bb2+Bb1/1 F3+Db4+Bb3/1 F3+F2/1 F3+Db4+Bb3/1 | Bb2+Bb1/1 F3+Db4+Bb3/1 Bb2+Bb1/1 Db3+Db2/1 | Eb3+Eb2/1 Ab3+Eb3+C4/1 Eb3+Eb2/.75 Db3+Db2/.25 C3+C2/.75 Bb2+Bb1/.25 | Ab2+Ab1/1 Gb2+Gb1/1 F2+F1/1 Eb2+Eb1/1 | ' +
      'Db2+Db1/1 Ab3+F3+Db4/1 Ab3+F4+Db4/1 Ab4+F4+Db4/1 | Db2+Db1/1 G4+E4+Bb4+Bb3/1 Ab2+Ab1/1 Ab3+F4+Db4/1 | Db3+Db2/1 F3+F2/.75 Eb3+Eb2/.25 Db3+Db2/.75 Cb3+Cb2/.25 Bb2+Bb1/.75 Ab2+Ab1/.25 | Gb2+Gb1/1 Gb3+Db3+Bb3/1 Gb3+Db4+Bb3/1 Gb4+Db4+Bb3/1 | ' +
      'G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 G4+E4+Db4+Bb3/1 | Ab3+F4+Db4/1 Ab3+Ab2/1 A3+A2/1 A3+A2/1 | Ab3+Ab2/1 Ab3+F4+Db4/1 Ab3+Ab2/1 Ab3+Eb4+C4/1 | Db3+Db2/1 Ab2+Ab1/1 F2+F1/1 Eb2+Eb1/1 | ' +
      'Db2+Db1/1 Ab2+Ab1/1 Db2+Db1/1 F2+F1/1 | Ab2+Ab1/1 Ab3+Eb3+C4/1 Ab3+Eb4+C4/1 Ab3+Ab2/1 | Db4+Db3/1 Ab3+Ab2/1 Db3+Db2/1 Bb2+Bb1/1 | Ab2+Ab1/1 Ab3+Eb3+C3/1 Ab3+Eb3+C4/1 Eb3+Eb2/1 | ' +
      'Ab2+Ab1/1 Ab4+Ab3+Eb4+C4/.75 Bb4+Bb3/.25 Ab4+Eb4+C5+C4/.75 Bb4+Bb3/.25 Ab3+Gb4+Eb4+C4/1 | Db3+Db2/1 Ab3+F3+Db3/1 Ab3+F3+Db4/1 Ab3+F4+Db4/1 | G3+G2/.75 F3+F2/.25 Eb3+Eb2/.75 F3+F2/.25 G3+G2/.75 Db4+Db3/.25 C4+C3/.75 Bb3+Bb2/.25 | Ab3+Ab2/1 Eb3+Eb2/1 Ab2+Ab1/1:3 Bb2+Bb1/1:3 Ab2+Ab1/1:3 Gb2+Gb1/1:3 F2+F1/1:3 Eb2+Eb1/1:3 | ' +
      'Db2+Db1/1 Ab3+F3+Db3/1 Ab3+F3+Db4/1 Ab3+F4+Db4/1 | Ab2+Ab1/1 Ab3+Eb3+C3/1 Ab3+Eb3+C4/1 Ab2+Ab1/1 | Db3+Db2/1 Ab3+F3+Db3/1 Ab3+F3+Db4/1 Ab3+F4+Db4+Cb4/1 | Gb3+Gb2/1 Gb4+Db4+Bb3/1 Gb3+Db4+Bb3/1 Gb3+Db3+Bb3/1 | ' +
      'E3+E2/1 G3+G2/1 Bb3+Bb2/1 Db4+Db3/1 | F3+F2/1 Ab3+Ab2/1 Bb3+Bb2/.75 Ab3+Ab2/.25 Gb3+Gb2/1:3 Ab3+Ab2/1:3 Bb3+Bb2/1:3 | Ab3+Ab2/1 Ab2+Ab1/1 Ab3+Ab2/1 Ab2+Ab1/1 | Db3+Db2/1 Cb3+Cb2/1 Ab2+Ab1/1 Gb4+Eb4+C4+Ab3/1 | ' +
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
