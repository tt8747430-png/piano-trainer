import { definePiece } from '../../model/types'

export default definePiece({
  id: 'auld-lang-syne',
  kind: 'song',
  title: 'Auld Lang Syne',
  titleRu: 'Старая дружба',
  credits: [
    { role: 'words', names: 'Robert Burns' },
    { role: 'music', names: 'Traditional' },
  ],
  key: 'C',
  meter: '4/4',
  tempo: 80,
  pattern: 'ballad',
  sections: [
    { kind: 'verse', lines: ['C@1 C G7 C F', 'C G7 F C'] },
    { kind: 'chorus', lines: ['C G7 C F', 'C G7 F C'] },
  ],
  staves: [
    {
      notes:
        'G3/1 | C4/1.5 C4/.5 C4/1 E4/1 | D4/1.5 C4/.5 D4/1 E4/1 | C4/1.5 C4/.5 E4/1 G4/1 | A4/3 A4/1 | G4/1.5 E4/.5 E4/1 C4/1 | D4/1.5 C4/.5 D4/1 E4/1 | C4/1.5 A3/.5 A3/1 G3/1 | C4/3 A4/1 | G4/1.5 E4/.5 E4/1 C4/1 | D4/1.5 C4/.5 D4/1 A4/1 | G4/1.5 E4/.5 E4/1 G4/1 | A4/3 C5/1 | G4/1.5 E4/.5 E4/1 C4/1 | D4/1.5 C4/.5 D4/1 E4/1 | C4/1.5 A3/.5 A3/1 G3/1 | C4/3',
    },
  ],
})
