import { definePiece } from '../../model/types'

export default definePiece({
  id: 'jingle-bells',
  kind: 'song',
  title: 'Jingle Bells',
  titleRu: 'Бубенцы',
  credits: [{ role: 'words-and-music', names: 'James Lord Pierpont' }],
  key: 'C',
  meter: '4/4',
  tempo: 120,
  pattern: 'popSync',
  sections: [{ kind: 'chorus', lines: ['C C C C', 'F C D7 G7', 'C C C C', 'F C G7 C'] }],
  staves: [
    {
      notes:
        'E4/1 E4/1 E4/2 | E4/1 E4/1 E4/2 | E4/1 G4/1 C4/1.5 D4/.5 | E4/4 | F4/1 F4/1 F4/1.5 F4/.5 | F4/1 E4/1 E4/1 E4/.5 E4/.5 | E4/1 D4/1 D4/1 E4/1 | D4/2 G4/2 | E4/1 E4/1 E4/2 | E4/1 E4/1 E4/2 | E4/1 G4/1 C4/1.5 D4/.5 | E4/4 | F4/1 F4/1 F4/1.5 F4/.5 | F4/1 E4/1 E4/1 E4/.5 E4/.5 | G4/1 G4/1 F4/1 D4/1 | C4/4',
    },
  ],
})
