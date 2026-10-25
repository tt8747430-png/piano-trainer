import { definePiece } from '../../model/types'

export default definePiece({
  id: 'aura-lee',
  kind: 'song',
  title: 'Aura Lee',
  credits: [
    { role: 'words', names: 'W. W. Fosdick' },
    { role: 'music', names: 'George R. Poulton' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 76,
  pattern: 'ballad',
  note: {
    en: 'A song from 1861. Its tune later became Elvis Presley’s “Love Me Tender”.',
    ru: 'Песня 1861 года. Позже её мелодия стала песней Элвиса Пресли «Love Me Tender».',
  },
  sections: [
    { kind: 'verse', lines: ['C D7 G7 C', 'C D7 G7 C'] },
    { kind: 'chorus', lines: ['C E7 Am C7', 'C D7 G7 C'] },
  ],
  staves: [
    {
      notes:
        'G3/1 C4/1 B3/1 C4/1 | D4/1 A3/1 D4/2 | C4/1 B3/1 A3/1 B3/1 | C4/4 | G3/1 C4/1 B3/1 C4/1 | D4/1 A3/1 D4/2 | C4/1 B3/1 A3/1 B3/1 | C4/4 | E4/1.5 E4/.5 E4/2 | E4/1.5 E4/.5 E4/2 | E4/1 D4/1 C4/1 D4/1 | E4/4 | E4/1 E4/1 F4/1 E4/1 | D4/1 A3/1 D4/1.5 C4/.5 | C4/1 B3/1 E4/1.5 D4/.5 | C4/4',
    },
  ],
})
