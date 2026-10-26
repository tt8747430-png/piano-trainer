import { definePiece } from '../../model/types'

export default definePiece({
  id: 'swing-low',
  kind: 'song',
  title: 'Swing Low, Sweet Chariot',
  credits: [{ role: 'music', names: 'Traditional' }],
  key: 'C',
  meter: '4/4',
  tempo: 72,
  pattern: 'gospel',
  sections: [
    { kind: 'chorus', lines: ['C F@2-C@2 C G7', 'C F@2-C@2 C@2-G7@2 C'] },
    { kind: 'verse', lines: ['C F@2-C@2 C G7', 'C F@2-C@2 C@2-G7@2 C'] },
  ],
  staves: [
    {
      notes:
        'E4/1 C4/2 E4/1 | C4/1.5 C4/.5 A3/.5 G3/1.5 | C4/.5 C4/.5 C4/.5 C4/.5 E4/.5 E4/.5 G4/1 | G4/4 | A4/.5 G4/.5 E4/2 G4/1 | C4/1.5 C4/.5 A3/.5 G3/1.5 | C4/.5 C4/.5 C4/.5 C4/.5 E4/.5 E4/.5 D4/1 | C4/3 E4/1 | G4/1 C4/.5 G3/.5 C4/1 C4/.5 C4/.5 | C4/.5 C4/.5 C4/1 A3/.5 G3/1.5 | C4/.5 C4/.5 C4/.5 C4/.5 E4/.5 E4/.5 G4/1 | G4/3 G4/1 | A4/.5 G4/.5 E4/1 E4/1 C4/1 | C4/.5 C4/.5 C4/.5 C4/.5 A3/.5 G3/1.5 | C4/.5 C4/.5 C4/.5 C4/.5 E4/.5 E4/.5 D4/1 | C4/4',
    },
  ],
})
